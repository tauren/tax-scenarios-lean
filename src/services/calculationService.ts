import type { 
  Scenario, 
  Asset, 
  ScenarioResults, 
  CapitalGainsData, 
  TaxBreakdown, 
  CalculationError,
  UserQualitativeGoal,
  QualitativeGoalAlignment
} from '../types';
import type { ScenarioQualitativeAttribute } from '../types/qualitative';
import { dateService } from './dateService';

/**
 * Calculates the complete results for a given scenario
 * @param scenario The scenario to calculate results for
 * @param globalAssets The global assets to consider in calculations
 * @param userGoals The user's qualitative goals
 * @returns The calculated scenario results
 * @throws {CalculationError} If calculation fails
 */
export const calculateScenarioResults = (
  scenario: Scenario,
  globalAssets: Asset[],
  userGoals: UserQualitativeGoal[] = []
): ScenarioResults => {
  // Validate required data
  if (!scenario.projectionPeriod || !scenario.residencyStartDate) {
    throw createCalculationError(
      'INVALID_SCENARIO',
      'Scenario must have valid projection period and residency start date',
      { scenarioId: scenario.id }
    );
  }

  const startYear = dateService.getCurrentYear();
  const endYear = startYear + scenario.projectionPeriod - 1;
  const yearlyProjections = [];
  let totalNetFinancialOutcomeOverPeriod = 0;

  // Calculate for each year in the scenario
  for (let year = startYear; year <= endYear; year++) {
    // Calculate capital gains for the year
    const capitalGainsData = calculateCapitalGainsForYear(year, scenario, globalAssets);
    
    // Calculate income for the year
    const incomeForYear = calculateIncomeForYear(year, scenario);

    // Calculate expenses for the year
    const expensesForYear = calculateExpensesForYear(year, scenario);

    // Calculate taxes based on gains and income
    const taxBreakdown = calculateTaxesForYear({
      capitalGainsData,
      income: incomeForYear
    }, scenario);

    // Create yearly projection
    const yearlyProjection = {
      year,
      taxBreakdown,
      capitalGainsData,
      income: incomeForYear,
      expenses: expensesForYear,
      netFinancialOutcome: incomeForYear + capitalGainsData.totalGains - taxBreakdown.totalTax - expensesForYear
    };

    yearlyProjections.push(yearlyProjection);
    totalNetFinancialOutcomeOverPeriod += yearlyProjection.netFinancialOutcome;
  }

  // Calculate qualitative fit score with detailed breakdown
  const { score, details, goalAlignments } = calculateQualitativeFitScore(scenario, userGoals);

  return {
    yearlyProjections,
    totalNetFinancialOutcomeOverPeriod,
    qualitativeFitScore: score,
    qualitativeScoreDetails: details,
    goalAlignments
  };
};

/**
 * Calculates capital gains for a specific year
 * @param currentYear The year to calculate gains for
 * @param scenario The scenario containing the calculation context
 * @param globalAssets The global assets to consider
 * @returns The capital gains data for the year
 * @throws {CalculationError} If calculation fails
 */
export const calculateCapitalGainsForYear = (
  currentYear: number,
  scenario: Scenario,
  globalAssets: Asset[]
): CapitalGainsData => {
  // Initialize gains tracking
  let longTermGains = 0;

  // Get planned sales for the current year
  const salesForYear = (scenario.plannedAssetSales ?? []).filter(sale => sale.year === currentYear);

  // Process each sale
  for (const sale of salesForYear) {
    // Find the corresponding global asset
    const asset = globalAssets.find(a => a.id === sale.assetId);
    
    if (!asset) {
      throw createCalculationError(
        'MISSING_ASSET',
        `Asset not found for sale: ${sale.assetId}`,
        { saleId: sale.id, assetId: sale.assetId }
      );
    }

    // Calculate gain/loss
    const saleAmount = sale.salePricePerUnit * sale.quantity;
    const costBasis = asset.costBasisPerUnit * sale.quantity;
    const gain = saleAmount - costBasis;

    // All gains are treated as long-term
    longTermGains += gain;
  }

  const totalGains = longTermGains;
  const taxableGains = Math.max(0, totalGains); // Only positive gains are taxable

  return {
    shortTermGains: 0, // Always 0 as we treat everything as long-term
    longTermGains,
    totalGains,
    taxableGains
  };
};

/**
 * Calculates taxes for a specific year based on capital gains data and income
 * @param data The capital gains data and income for the year
 * @param scenario The scenario containing tax rates and rules
 * @returns The tax breakdown for the year
 * @throws {CalculationError} If calculation fails
 */
export const calculateTaxesForYear = (
  data: { capitalGainsData: CapitalGainsData; income: number },
  scenario: Scenario
): TaxBreakdown => {
  // Use default values if tax rates are missing
  const longTermGainsRate = (scenario.tax?.capitalGains?.longTermRate ?? 0) / 100;
  const incomeRate = (scenario.tax?.incomeRate ?? 0) / 100;

  // Calculate capital gains tax (long-term only)
  const capitalGainsTax = (data.capitalGainsData?.taxableGains ?? 0) * longTermGainsRate;

  // Calculate income tax
  const incomeTax = data.income * incomeRate;

  // Total tax is sum of both
  const totalTax = capitalGainsTax + incomeTax;

  return {
    capitalGainsTax,
    incomeTax,
    totalTax
  };
};

/**
 * Calculates total income for a specific year
 * @param currentYear The year to calculate income for
 * @param scenario The scenario containing income sources
 * @returns The total income for the year
 */
const calculateIncomeForYear = (currentYear: number, scenario: Scenario): number => {
  return (scenario.incomeSources ?? []).reduce((total, source) => {
    // Check if the income source is active in the current year
    if (currentYear >= source.startYear && (!source.endYear || currentYear <= source.endYear)) {
      return total + source.annualAmount;
    }
    return total;
  }, 0);
};

/**
 * Calculates total expenses for a specific year
 * @param currentYear The year to calculate expenses for
 * @param scenario The scenario containing expenses
 * @returns The total expenses for the year
 */
const calculateExpensesForYear = (currentYear: number, scenario: Scenario): number => {
  let totalExpenses = 0;

  // Add annual expenses
  totalExpenses += (scenario.annualExpenses ?? []).reduce((total, expense) => {
    // Check if the expense is active in the current year
    if (currentYear >= (expense.startYear || 0) && (!expense.endYear || currentYear <= expense.endYear)) {
      return total + expense.amount;
    }
    return total;
  }, 0);

  // Add one-time expenses
  totalExpenses += (scenario.oneTimeExpenses ?? []).reduce((total, expense) => {
    if (expense.year === currentYear) {
      return total + expense.amount;
    }
    return total;
  }, 0);

  return totalExpenses;
};

/**
 * Calculates a qualitative fit score for a scenario based on mapped attributes and goals
 * @param scenario The scenario to calculate the score for
 * @param userGoals The user's qualitative goals
 * @returns An object containing the score, detailed breakdown, and goal alignments
 */
export const calculateQualitativeFitScore = (
  scenario: Scenario,
  userGoals: UserQualitativeGoal[]
): { 
  score: number; 
  details: NonNullable<ScenarioResults['qualitativeScoreDetails']>;
  goalAlignments: QualitativeGoalAlignment[];
} => {
  // Initialize tracking variables
  let totalWeightedScoreContribution = 0;
  let sumOfMaxPossibleGoalContributions = 0;
  const goalContributions: { goalId: string; contribution: number }[] = [];
  let mappedAttributesCount = 0;
  let unmappedAttributesCount = 0;
  const goalAlignments: QualitativeGoalAlignment[] = [];

  // Process each goal
  for (const goal of userGoals) {
    // Convert weight to numeric value
    const goalWeight = getWeightValue(goal.weight);
    if (goalWeight === 0) continue;

    // Find mapped attributes for this goal
    const mappedAttributes = scenario.scenarioSpecificAttributes?.filter(
      attr => attr.mappedGoalId === goal.id
    ) || [];

    // Track attribute counts
    if (mappedAttributes.length > 0) {
      mappedAttributesCount += mappedAttributes.length;
    }

    // Calculate contribution for this goal
    let goalContribution = 0;
    const contributingAttributes = [];

    for (const attr of mappedAttributes) {
      // Skip neutral or insignificant attributes
      if (attr.sentiment === "Neutral" || attr.significance === "Low") continue;

      // Convert sentiment and significance to numeric values
      const sentimentValue = getSentimentValue(attr.sentiment);
      const significanceValue = getSignificanceValue(attr.significance);

      // Calculate attribute's contribution
      const attributeContribution = sentimentValue * significanceValue * goalWeight;
      goalContribution += attributeContribution;

      // Track contributing attributes
      contributingAttributes.push({
        attributeId: attr.id,
        conceptName: attr.text, // Use the attribute text as the concept name
        contribution: attributeContribution
      });
    }

    // Calculate alignment score (0-100)
    const alignmentScore = (goalContribution / (goalWeight * 1 * 1)) * 100;
    const isAligned = alignmentScore >= 50;

    // Add to total contributions
    totalWeightedScoreContribution += goalContribution;
    sumOfMaxPossibleGoalContributions += goalWeight * 1 * 1; // Max possible contribution (positive sentiment * high significance)

    // Track goal contribution
    goalContributions.push({
      goalId: goal.id,
      contribution: goalContribution
    });

    // Add goal alignment
    goalAlignments.push({
      goalId: goal.id,
      goalName: goal.name,
      isAligned,
      alignmentScore: Math.max(0, Math.min(100, alignmentScore)),
      contributingAttributes
    });
  }

  // Count unmapped attributes
  unmappedAttributesCount = (scenario.scenarioSpecificAttributes?.filter(
    attr => !attr.mappedGoalId
  ) || []).length;

  // Calculate final score
  let score = 50; // Default neutral score
  if (sumOfMaxPossibleGoalContributions > 0) {
    score = ((totalWeightedScoreContribution + sumOfMaxPossibleGoalContributions) / 
             (2 * sumOfMaxPossibleGoalContributions)) * 100;
  }

  // Ensure score stays within 0-100 range
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    details: {
      mappedAttributesCount,
      unmappedAttributesCount,
      goalContributions
    },
    goalAlignments
  };
};

/**
 * Converts a weight string to a numeric value
 */
const getWeightValue = (weight: UserQualitativeGoal['weight']): number => {
  switch (weight) {
    case "Critical": return 1.0;
    case "High": return 0.75;
    case "Medium": return 0.5;
    case "Low": return 0.25;
    default: return 0;
  }
};

/**
 * Converts a sentiment string to a numeric value
 */
const getSentimentValue = (sentiment: ScenarioQualitativeAttribute['sentiment']): number => {
  switch (sentiment) {
    case 'Positive':
      return 1;
    case 'Negative':
      return -1;
    case 'Neutral':
    default:
      return 0;
  }
};

/**
 * Converts a significance string to a numeric value
 */
const getSignificanceValue = (significance: ScenarioQualitativeAttribute['significance']): number => {
  switch (significance) {
    case 'Critical':
      return 1;
    case 'High':
      return 0.75;
    case 'Medium':
      return 0.5;
    case 'Low':
    default:
      return 0.25;
  }
};

/**
 * Creates a calculation error with the specified details
 * @param code Error code
 * @param message Error message
 * @param details Additional error details
 * @param source Error source
 * @returns A structured calculation error
 */
export const createCalculationError = (
  code: string,
  message: string,
  details?: Record<string, unknown>,
  source: 'VALIDATION' | 'CALCULATION' | 'SYSTEM' = 'CALCULATION'
): CalculationError => {
  const error = new Error(message) as CalculationError;
  error.code = code;
  error.details = details;
  error.source = source;
  return error;
}; 