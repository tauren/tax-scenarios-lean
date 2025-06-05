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
        shortTermRate: 0.37,
        longTermRate: 0.20,
      },
    },
    incomeSources: [],
    annualExpenses: [],
    oneTimeExpenses: [],
    plannedAssetSales: [],
  };

  const mockAssets: Asset[] = [
    {
      id: 'asset-1',
      name: 'Test Asset',
      quantity: 100,
      costBasisPerUnit: 10,
      acquisitionDate: new Date('2023-01-01'),
    },
  ];

  describe('calculateScenarioResults', () => {
    it('should return empty results for now', () => {
      const results = calculateScenarioResults(mockScenario, mockAssets);
      expect(results).toEqual({
        yearlyProjections: [],
        totalNetFinancialOutcomeOverPeriod: 0,
      });
    });
  });

  describe('calculateCapitalGainsForYear', () => {
    it('should return zero gains for now', () => {
      const gains = calculateCapitalGainsForYear(2024, mockScenario, mockAssets);
      expect(gains).toEqual({
        shortTermGains: 0,
        longTermGains: 0,
        totalGains: 0,
        taxableGains: 0,
      });
    });
  });

  describe('calculateTaxesForYear', () => {
    it('should return zero taxes for now', () => {
      const taxes = calculateTaxesForYear(
        {
          shortTermGains: 0,
          longTermGains: 0,
          totalGains: 0,
          taxableGains: 0,
        },
        mockScenario
      );
      expect(taxes).toEqual({
        capitalGainsTax: 0,
        totalTax: 0,
      });
    });
  });
}); 