import { describe, it, expect } from 'vitest';
import {
  calculateScenarioResults,
  calculateCapitalGainsForYear,
  calculateTaxesForYear,
  calculateQualitativeFitScore,
} from '../calculationService';
import type { Scenario, Asset, UserQualitativeGoal } from '../../types';

/**
 * ⚠️ DO NOT MODIFY THIS FACTORY FUNCTION ⚠️
 * 
 * This is the single source of truth for test scenario creation.
 * Instead of modifying this function:
 * 1. Use the overrides parameter to customize scenarios
 * 2. Use the ScenarioBuilder for complex scenarios
 * 3. Create new test-specific scenarios using createTestScenario()
 * 
 * Modifying this function can cause cascading test failures.
 */
const createTestScenario = (overrides: Partial<Scenario> = {}): Scenario => ({
  id: 'test-scenario',
  name: 'Test Scenario',
  projectionPeriod: 1,
  residencyStartDate: new Date('2024-01-01'),
  location: {
    country: 'US'
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
  scenarioSpecificAttributes: [],
  ...overrides
});

// Builder class for complex test scenarios
class ScenarioBuilder {
  private scenario: Scenario;

  constructor() {
    this.scenario = createTestScenario();
  }

  withTaxRates(shortTerm: number, longTerm: number, income: number) {
    this.scenario.tax = {
      capitalGains: { shortTermRate: shortTerm, longTermRate: longTerm },
      incomeRate: income
    };
    return this;
  }

  withProjectionPeriod(years: number) {
    this.scenario.projectionPeriod = years;
    return this;
  }

  withPlannedSales(sales: Scenario['plannedAssetSales']) {
    this.scenario.plannedAssetSales = sales;
    return this;
  }

  withQualitativeAttributes(attributes: Scenario['scenarioSpecificAttributes']) {
    this.scenario.scenarioSpecificAttributes = attributes;
    return this;
  }

  build(): Scenario {
    return { ...this.scenario };
  }
}

// Common test data
const mockAssets: Asset[] = [
  {
    id: 'asset-1',
    name: 'Test Asset 1',
    quantity: 100,
    costBasisPerUnit: 10,
    acquisitionDate: new Date('2024-01-01')
  },
  {
    id: 'asset-2',
    name: 'Test Asset 2',
    quantity: 50,
    costBasisPerUnit: 20,
    acquisitionDate: new Date('2022-01-01'),
  },
];

const mockGoals: UserQualitativeGoal[] = [
  {
    id: 'goal-1',
    conceptId: 'concept-1',
    name: 'Test Goal 1',
    weight: 'High' as const
  },
  {
    id: 'goal-2',
    conceptId: 'concept-2',
    name: 'Test Goal 2',
    weight: 'Medium' as const
  }
];

describe('calculationService', () => {
  describe('calculateCapitalGainsForYear', () => {
    it('should calculate gains as long-term', () => {
      const scenario = createTestScenario({
        plannedAssetSales: [
          {
            id: 'sale-1',
            assetId: 'asset-1',
            year: 2024,
            quantity: 50,
            salePricePerUnit: 15,
          },
        ],
      });

      const gains = calculateCapitalGainsForYear(2024, scenario, mockAssets);
      expect(gains).toEqual({
        shortTermGains: 0, // Always 0 as we treat everything as long-term
        longTermGains: 250, // (15 - 10) * 50
        totalGains: 250,
        taxableGains: 250,
      });
    });

    it('should handle multiple sales in the same year', () => {
      const scenario = createTestScenario({
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
      });

      const gains = calculateCapitalGainsForYear(2024, scenario, mockAssets);
      expect(gains).toEqual({
        shortTermGains: 0, // Always 0 as we treat everything as long-term
        longTermGains: 500, // (15 - 10) * 50 + (30 - 20) * 25
        totalGains: 500,
        taxableGains: 500,
      });
    });

    it('should handle losses correctly', () => {
      const scenario = createTestScenario({
        plannedAssetSales: [
          {
            id: 'sale-1',
            assetId: 'asset-1',
            year: 2024,
            quantity: 50,
            salePricePerUnit: 5, // Loss of 5 per unit
          },
        ],
      });

      const gains = calculateCapitalGainsForYear(2024, scenario, mockAssets);
      expect(gains).toEqual({
        shortTermGains: 0, // Always 0 as we treat everything as long-term
        longTermGains: -250, // (5 - 10) * 50
        totalGains: -250,
        taxableGains: 0, // Only positive gains are taxable
      });
    });

    it('should throw error for missing asset', () => {
      const scenario = createTestScenario({
        plannedAssetSales: [
          {
            id: 'sale-1',
            assetId: 'non-existent-asset',
            year: 2024,
            quantity: 50,
            salePricePerUnit: 15,
          },
        ],
      });

      expect(() => calculateCapitalGainsForYear(2024, scenario, mockAssets))
        .toThrow('Asset not found for sale: non-existent-asset');
    });
  });

  describe('calculateTaxesForYear', () => {
    it('should calculate taxes using long-term rate only', () => {
      const scenario = createTestScenario({
        tax: {
          capitalGains: {
            shortTermRate: 0,
            longTermRate: 20
          },
          incomeRate: 0
        }
      });

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
        scenario
      );
      expect(taxBreakdown).toEqual({
        capitalGainsTax: 600, // 3000 * 0.20
        incomeTax: 0,
        totalTax: 600,
      });
    });

    it('should handle zero gains correctly', () => {
      const scenario = createTestScenario();
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
        scenario
      );
      expect(taxBreakdown).toEqual({
        capitalGainsTax: 0,
        incomeTax: 0,
        totalTax: 0,
      });
    });

    it('should use default tax rates when rates are missing', () => {
      const scenario = createTestScenario();
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
      const scenario = new ScenarioBuilder()
        .withProjectionPeriod(5)
        .withTaxRates(0, 20, 0)
        .withPlannedSales([
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
        ])
        .build();

      const results = calculateScenarioResults(scenario, mockAssets, mockGoals);
      
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
      const invalidScenario = {
        ...createTestScenario(),
        projectionPeriod: undefined,
        residencyStartDate: undefined,
      } as unknown as Scenario;

      expect(() => calculateScenarioResults(invalidScenario, mockAssets, mockGoals))
        .toThrow('Scenario must have valid projection period and residency start date');
    });

    it('should include qualitative scoring in results', () => {
      const scenario = new ScenarioBuilder()
        .withQualitativeAttributes([
          {
            id: 'attr-1',
            conceptId: 'concept-1',
            userSentiment: 'Positive' as const,
            significanceToUser: 'High' as const,
            mappedGoalId: 'goal-1'
          },
          {
            id: 'attr-2',
            conceptId: 'concept-2',
            userSentiment: 'Negative' as const,
            significanceToUser: 'Medium' as const,
            mappedGoalId: 'goal-2'
          }
        ])
        .build();

      const results = calculateScenarioResults(scenario, mockAssets, mockGoals);
      expect(results.qualitativeFitScore).toBeDefined();
      expect(results.goalAlignments).toBeDefined();
      expect(results.goalAlignments.length).toBe(mockGoals.length);
      expect(results.qualitativeScoreDetails).toBeDefined();
      expect(results.qualitativeScoreDetails?.mappedAttributesCount).toBe(2);
      expect(results.qualitativeScoreDetails?.unmappedAttributesCount).toBe(0);
    });
  });

  describe('calculateQualitativeFitScore', () => {
    it('should calculate score based on mapped attributes and goal weights', () => {
      const scenario = new ScenarioBuilder()
        .withQualitativeAttributes([
          {
            id: 'attr-1',
            conceptId: 'concept-1',
            userSentiment: 'Positive' as const,
            significanceToUser: 'High' as const,
            mappedGoalId: 'goal-1'
          },
          {
            id: 'attr-2',
            conceptId: 'concept-2',
            userSentiment: 'Negative' as const,
            significanceToUser: 'Medium' as const,
            mappedGoalId: 'goal-2'
          }
        ])
        .build();

      const { score, details, goalAlignments } = calculateQualitativeFitScore(scenario, mockGoals);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(details.mappedAttributesCount).toBe(2);
      expect(details.unmappedAttributesCount).toBe(0);
      expect(goalAlignments).toHaveLength(2);
    });

    it('should handle scenarios with no attributes', () => {
      const scenario = createTestScenario();
      const { score, details, goalAlignments } = calculateQualitativeFitScore(scenario, mockGoals);
      expect(score).toBe(50); // Default neutral score
      expect(details.mappedAttributesCount).toBe(0);
      expect(details.unmappedAttributesCount).toBe(0);
      expect(goalAlignments).toHaveLength(2);
    });

    it('should handle scenarios with unmapped attributes', () => {
      const scenario = new ScenarioBuilder()
        .withQualitativeAttributes([
          {
            id: 'attr-3',
            conceptId: 'concept-3',
            userSentiment: 'Positive' as const,
            significanceToUser: 'High' as const
          }
        ])
        .build();

      const { score, details, goalAlignments } = calculateQualitativeFitScore(scenario, mockGoals);
      expect(score).toBe(50); // Default neutral score
      expect(details.mappedAttributesCount).toBe(0);
      expect(details.unmappedAttributesCount).toBe(1);
      expect(goalAlignments).toHaveLength(2);
    });

    it('should calculate goal alignments correctly', () => {
      const scenario = new ScenarioBuilder()
        .withQualitativeAttributes([
          {
            id: 'attr-1',
            conceptId: 'concept-1',
            userSentiment: 'Positive' as const,
            significanceToUser: 'High' as const,
            mappedGoalId: 'goal-1'
          },
          {
            id: 'attr-2',
            conceptId: 'concept-2',
            userSentiment: 'Negative' as const,
            significanceToUser: 'Medium' as const,
            mappedGoalId: 'goal-2'
          }
        ])
        .build();

      const { goalAlignments } = calculateQualitativeFitScore(scenario, mockGoals);

      expect(goalAlignments[0].goalId).toBe('goal-1');
      expect(goalAlignments[0].isAligned).toBe(true); // High weight + Positive sentiment + High significance
      expect(goalAlignments[1].goalId).toBe('goal-2');
      expect(goalAlignments[1].isAligned).toBe(false); // Medium weight + Negative sentiment + Medium significance
    });
  });
}); 