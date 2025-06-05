import type { Scenario, Asset, ScenarioResults, CapitalGainsData, TaxBreakdown, CalculationError } from '../types';

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

  const startYear = scenario.residencyStartDate.getFullYear();
  const endYear = startYear + scenario.projectionPeriod - 1;
  const yearlyProjections = [];
  let totalNetFinancialOutcomeOverPeriod = 0;

  // Calculate for each year in the scenario
  for (let year = startYear; year <= endYear; year++) {
    // Calculate capital gains for the year
    const capitalGainsData = calculateCapitalGainsForYear(year, scenario, globalAssets);
    
    // Calculate taxes based on gains
    const taxBreakdown = calculateTaxesForYear(capitalGainsData, scenario);

    // Create yearly projection
    const yearlyProjection = {
      year,
      taxBreakdown,
      capitalGainsData,
      netFinancialOutcome: capitalGainsData.totalGains - taxBreakdown.totalTax
    };

    yearlyProjections.push(yearlyProjection);
    totalNetFinancialOutcomeOverPeriod += yearlyProjection.netFinancialOutcome;
  }

  return {
    yearlyProjections,
    totalNetFinancialOutcomeOverPeriod
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
  const salesForYear = scenario.plannedAssetSales.filter(sale => sale.year === currentYear);

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
 * Calculates taxes for a specific year based on capital gains data
 * @param capitalGainsData The capital gains data for the year
 * @param scenario The scenario containing tax rates and rules
 * @returns The tax breakdown for the year
 * @throws {CalculationError} If calculation fails
 */
export const calculateTaxesForYear = (
  capitalGainsData: CapitalGainsData,
  scenario: Scenario
): TaxBreakdown => {
  // Validate required tax rates
  if (!scenario.tax?.capitalGains?.longTermRate) {
    throw createCalculationError(
      'MISSING_TAX_RATES',
      'Capital gains tax rates not defined in scenario',
      { scenarioId: scenario.id }
    );
  }

  // Calculate taxes using only long-term rate
  const capitalGainsTax = capitalGainsData.longTermGains * scenario.tax.capitalGains.longTermRate;

  // For MVP, total tax is just capital gains tax
  const totalTax = capitalGainsTax;

  return {
    capitalGainsTax,
    totalTax
  };
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