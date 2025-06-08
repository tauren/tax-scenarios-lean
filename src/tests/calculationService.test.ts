import { calculateScenarioResults, calculateCapitalGainsForYear, calculateTaxesForYear } from '../services/calculationService';
import type { Scenario, Asset, IncomeSource } from '../types';

describe('calculationService', () => {    
  const mockScenario: Scenario = {
    id: 'test-scenario',
    name: 'Test Scenario',
    location: {
      country: 'Test Country'
    },
    residencyStartDate: new Date('2024-01-01'),
    projectionPeriod: 10,
    tax: {
      capitalGains: {
        shortTermRate: 0,
        longTermRate: 10,
      },
      incomeRate: 20,
    },
    incomeSources: [
      {
        id: 'income-1',
        name: 'Salary',
        type: 'EMPLOYMENT',
        annualAmount: 100000,
        startYear: 2024,
      },
    ],
    annualExpenses: [
      {
        id: 'expense-1',
        name: 'Rent',
        amount: 10000,
        startYear: 2024,
      },
    ],
    oneTimeExpenses: [
      {
        id: 'expense-2',
        name: 'Moving Costs',
        amount: 20000,
        year: 2024,
      },
    ],
    plannedAssetSales: [
      {
        id: 'sale-1',
        assetId: 'asset-1',
        year: 2024,
        quantity: 3,
        salePricePerUnit: 150000,
      },
    ],
    scenarioSpecificAttributes: []
  };

  const mockAssets: Asset[] = [
    {
      id: 'asset-1',
      name: 'Test Asset',
      costBasisPerUnit: 1000,
      quantity: 5,
      acquisitionDate: new Date('2020-01-01'),
    },
  ];

  describe('calculateScenarioResults', () => {
    it('should calculate correct net outcome with income tax and capital gains tax', () => {
      const results = calculateScenarioResults(mockScenario, mockAssets);

      // Verify yearly projections
      expect(results.yearlyProjections).toHaveLength(10);

      // Check first year (2024) calculations
      const firstYear = results.yearlyProjections[0];
      expect(firstYear.year).toBe(2024);
      expect(firstYear.income).toBe(100000);
      expect(firstYear.expenses).toBe(30000);
      expect(firstYear.capitalGainsData.totalGains).toBe(447000);
      expect(firstYear.taxBreakdown.incomeTax).toBe(20000); 
      expect(firstYear.taxBreakdown.capitalGainsTax).toBe(44700);
      expect(firstYear.taxBreakdown.totalTax).toBe(64700);
      expect(firstYear.netFinancialOutcome).toBe(452300); 

      // Check subsequent years (2025-2034)
      for (let i = 1; i < 10; i++) {
        const year = results.yearlyProjections[i];
        expect(year.income).toBe(100000);
        expect(year.expenses).toBe(10000);
        expect(year.capitalGainsData.totalGains).toBe(0);
        expect(year.taxBreakdown.incomeTax).toBe(20000); 
        expect(year.taxBreakdown.capitalGainsTax).toBe(0);
        expect(year.taxBreakdown.totalTax).toBe(20000);
        expect(year.netFinancialOutcome).toBe(70000); 
      }

      // Check total net outcome
      expect(results.totalNetFinancialOutcomeOverPeriod).toBe(1082300); 
    });
  });

  describe('calculateCapitalGainsForYear', () => {
    it('should calculate capital gains correctly', () => {
      const gains = calculateCapitalGainsForYear(2024, mockScenario, mockAssets);
      expect(gains.totalGains).toBe(447000);
      expect(gains.taxableGains).toBe(447000);
      expect(gains.longTermGains).toBe(447000);
      expect(gains.shortTermGains).toBe(0);
    });

    it('should return zero gains for years without sales', () => {
      const gains = calculateCapitalGainsForYear(2026, mockScenario, mockAssets);
      expect(gains.totalGains).toBe(0);
      expect(gains.taxableGains).toBe(0);
      expect(gains.longTermGains).toBe(0);
      expect(gains.shortTermGains).toBe(0);
    });
  });

  describe('calculateTaxesForYear', () => {
    it('should calculate taxes correctly for both income and capital gains', () => {
      const taxBreakdown = calculateTaxesForYear(
        {
          capitalGainsData: {
            shortTermGains: 0,
            longTermGains: 298000,
            totalGains: 298000,
            taxableGains: 298000,
          },
          income: 150000,
        },
        mockScenario
      );

      expect(taxBreakdown.incomeTax).toBe(30000); // 20% of 150000
      expect(taxBreakdown.capitalGainsTax).toBe(29800); // 10% of 298000
      expect(taxBreakdown.totalTax).toBe(59800); // 30000 + 29800
    });

    it('should use default tax rates when rates are missing', () => {
      const scenarioWithoutRates: Scenario = {
        id: 'test-scenario',
        name: 'Test Scenario',
        projectionPeriod: 10,
        residencyStartDate: new Date(),
        location: {
          country: 'Test Country'
        },
        tax: {
          capitalGains: {
            shortTermRate: 0,
            longTermRate: 0
          },
          incomeRate: 0
        },
        incomeSources: [],
        annualExpenses: [],
        oneTimeExpenses: [],
        plannedAssetSales: [],
        scenarioSpecificAttributes: []
      };

      const result = calculateTaxesForYear(
        {
          capitalGainsData: {
            shortTermGains: 0,
            longTermGains: 1000,
            totalGains: 1000,
            taxableGains: 1000
          },
          income: 50000
        },
        scenarioWithoutRates
      );

      expect(result).toEqual({
        capitalGainsTax: 0,
        incomeTax: 0,
        totalTax: 0
      });
    });
  });
}); 