import { describe, it, expect } from 'vitest';
import {
  calculateScenarioResults,
  calculateCapitalGainsForYear,
  calculateTaxesForYear,
} from '../calculationService';
import type { Scenario, Asset } from '../../types';

describe('calculationService', () => {
  const mockScenario: Scenario = {
    id: 'test-scenario',
    name: 'Test Scenario',
    projectionPeriod: 5,
    residencyStartDate: new Date('2024-01-01'),
    location: {
      country: 'US',
      state: 'CA',
    },
    tax: {
      capitalGains: {
        shortTermRate: 37, // Not used but kept for type compatibility
        longTermRate: 20,
      },
      incomeRate: 30,
    },
    incomeSources: [],
    annualExpenses: [],
    oneTimeExpenses: [],
    plannedAssetSales: [],
  };

  const mockAssets: Asset[] = [
    {
      id: 'asset-1',
      name: 'Test Asset 1',
      quantity: 100,
      costBasisPerUnit: 10,
      acquisitionDate: new Date('2023-01-01'),
    },
    {
      id: 'asset-2',
      name: 'Test Asset 2',
      quantity: 50,
      costBasisPerUnit: 20,
      acquisitionDate: new Date('2022-01-01'),
    },
  ];

  describe('calculateCapitalGainsForYear', () => {
    it('should calculate gains as long-term', () => {
      const scenario: Scenario = {
        ...mockScenario,
        plannedAssetSales: [
          {
            id: 'sale-1',
            assetId: 'asset-1',
            year: 2024,
            quantity: 50,
            salePricePerUnit: 15,
          },
        ],
      };

      const gains = calculateCapitalGainsForYear(2024, scenario, mockAssets);
      expect(gains).toEqual({
        shortTermGains: 0, // Always 0 as we treat everything as long-term
        longTermGains: 250, // (15 - 10) * 50
        totalGains: 250,
        taxableGains: 250,
      });
    });

    it('should handle multiple sales in the same year', () => {
      const scenario: Scenario = {
        ...mockScenario,
        plannedAssetSales: [
          {
            id: 'sale-1',
            assetId: 'asset-1',
            year: 2024,
            quantity: 50,
            salePricePerUnit: 15,
          },
          {
            id: 'sale-2',
            assetId: 'asset-2',
            year: 2024,
            quantity: 25,
            salePricePerUnit: 30,
          },
        ],
      };

      const gains = calculateCapitalGainsForYear(2024, scenario, mockAssets);
      expect(gains).toEqual({
        shortTermGains: 0, // Always 0 as we treat everything as long-term
        longTermGains: 500, // (15 - 10) * 50 + (30 - 20) * 25
        totalGains: 500,
        taxableGains: 500,
      });
    });

    it('should handle losses correctly', () => {
      const scenario: Scenario = {
        ...mockScenario,
        plannedAssetSales: [
          {
            id: 'sale-1',
            assetId: 'asset-1',
            year: 2024,
            quantity: 50,
            salePricePerUnit: 5, // Loss of 5 per unit
          },
        ],
      };

      const gains = calculateCapitalGainsForYear(2024, scenario, mockAssets);
      expect(gains).toEqual({
        shortTermGains: 0, // Always 0 as we treat everything as long-term
        longTermGains: -250, // (5 - 10) * 50
        totalGains: -250,
        taxableGains: 0, // Only positive gains are taxable
      });
    });

    it('should throw error for missing asset', () => {
      const scenario: Scenario = {
        ...mockScenario,
        plannedAssetSales: [
          {
            id: 'sale-1',
            assetId: 'non-existent-asset',
            year: 2024,
            quantity: 50,
            salePricePerUnit: 15,
          },
        ],
      };

      expect(() => calculateCapitalGainsForYear(2024, scenario, mockAssets))
        .toThrow('Asset not found for sale: non-existent-asset');
    });
  });

  describe('calculateTaxesForYear', () => {
    it('should calculate taxes using long-term rate only', () => {
      const taxBreakdown = calculateTaxesForYear(
        {
          capitalGainsData: {
            shortTermGains: 0,
            longTermGains: 3000,
            totalGains: 3000,
            taxableGains: 3000,
          },
          income: 0,
        },
        mockScenario
      );
      expect(taxBreakdown).toEqual({
        capitalGainsTax: 600, // 3000 * 0.20
        incomeTax: 0,
        totalTax: 600,
      });
    });

    it('should handle zero gains correctly', () => {
      const taxBreakdown = calculateTaxesForYear(
        {
          capitalGainsData: {
            shortTermGains: 0,
            longTermGains: 0,
            totalGains: 0,
            taxableGains: 0,
          },
          income: 0,
        },
        mockScenario
      );
      expect(taxBreakdown).toEqual({
        capitalGainsTax: 0,
        incomeTax: 0,
        totalTax: 0,
      });
    });

    it('should use default tax rates when rates are missing', () => {
      const scenario: Scenario = {
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
        plannedAssetSales: []
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
        scenario
      );

      expect(result).toEqual({
        capitalGainsTax: 0,
        incomeTax: 0,
        totalTax: 0
      });
    });
  });

  describe('calculateScenarioResults', () => {
    it('should calculate results for a multi-year scenario', () => {
      const scenario: Scenario = {
        ...mockScenario,
        plannedAssetSales: [
          {
            id: 'sale-1',
            assetId: 'asset-1',
            year: 2024,
            quantity: 50,
            salePricePerUnit: 15,
          },
          {
            id: 'sale-2',
            assetId: 'asset-2',
            year: 2025,
            quantity: 25,
            salePricePerUnit: 30,
          },
        ],
      };

      const results = calculateScenarioResults(scenario, mockAssets);
      
      // Verify structure
      expect(results.yearlyProjections).toHaveLength(5); // 2024-2028
      expect(results.totalNetFinancialOutcomeOverPeriod).toBeDefined();

      // Verify 2024
      const year2024 = results.yearlyProjections[0];
      expect(year2024.year).toBe(2024);
      expect(year2024.capitalGainsData.shortTermGains).toBe(0);
      expect(year2024.capitalGainsData.longTermGains).toBe(250);
      expect(year2024.taxBreakdown.capitalGainsTax).toBe(50); // 250 * 0.20
      expect(year2024.netFinancialOutcome).toBe(200); // 250 - 50

      // Verify 2025
      const year2025 = results.yearlyProjections[1];
      expect(year2025.year).toBe(2025);
      expect(year2025.capitalGainsData.shortTermGains).toBe(0);
      expect(year2025.capitalGainsData.longTermGains).toBe(250);
      expect(year2025.taxBreakdown.capitalGainsTax).toBe(50); // 250 * 0.20
      expect(year2025.netFinancialOutcome).toBe(200); // 250 - 50

      // Verify remaining years have no activity
      for (let i = 2; i < 5; i++) {
        const year = results.yearlyProjections[i];
        expect(year.capitalGainsData.totalGains).toBe(0);
        expect(year.taxBreakdown.capitalGainsTax).toBe(0);
        expect(year.netFinancialOutcome).toBe(0);
      }
    });

    it('should throw error for invalid scenario', () => {
      const invalidScenario: Partial<Scenario> = {
        ...mockScenario,
        projectionPeriod: undefined,
        residencyStartDate: undefined,
      };

      expect(() => calculateScenarioResults(invalidScenario as Scenario, mockAssets))
        .toThrow('Scenario must have valid projection period and residency start date');
    });
  });
}); 