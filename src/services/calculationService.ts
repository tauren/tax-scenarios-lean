import type { Scenario, Asset, ScenarioResults, CapitalGainsData, TaxBreakdown, CalculationError } from '../types';
import { dateService } from './dateService';

/**
 * Calculates the complete results for a given scenario
 * @param scenario The scenario to calculate results for
 * @param globalAssets The global assets to consider in calculations
 * @returns The calculated scenario results
 * @throws {CalculationError} If calculation fails
 */
export const calculateScenarioResults = (
  scenario: Scenario,
  globalAssets: Asset[]
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

  // Calculate qualitative fit score based on tax rates and residency requirements
  const qualitativeFitScore = calculateQualitativeFitScore(scenario);

  return {
    yearlyProjections,
    totalNetFinancialOutcomeOverPeriod,
    qualitativeFitScore
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
  // Validate required capital gains tax rate
  if (scenario.tax?.capitalGains?.longTermRate === undefined || scenario.tax.capitalGains.longTermRate === 0) {
    throw createCalculationError(
      'MISSING_TAX_RATES',
      'Required tax rates not defined in scenario',
      { scenarioId: scenario.id }
    );
  }

  // Convert tax rates from percentage to decimal
  const longTermGainsRate = scenario.tax.capitalGains.longTermRate / 100;
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
 * Calculates a qualitative fit score for a scenario based on tax rates and residency requirements
 * @param scenario The scenario to calculate the score for
 * @returns A score from 0-100 indicating how well the scenario fits the user's needs
 */
const calculateQualitativeFitScore = (scenario: Scenario): number => {
  let score = 50; // Start with a neutral score

  // Adjust score based on tax rates
  if (scenario.tax?.capitalGains?.longTermRate) {
    const longTermRate = scenario.tax.capitalGains.longTermRate;
    if (longTermRate <= 15) {
      score += 20; // Very favorable tax rate
    } else if (longTermRate <= 20) {
      score += 10; // Moderately favorable tax rate
    } else if (longTermRate <= 25) {
      score += 5; // Neutral tax rate
    } else {
      score -= 10; // Unfavorable tax rate
    }
  }

  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score));
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