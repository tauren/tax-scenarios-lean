import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  calculateScenarioResults,
  calculateCapitalGainsForYear,
  calculateTaxesForYear,
} from '@/services/calculationService';
import { QualitativeAttributeService } from '@/services/qualitativeAttributeService';
import type { Scenario, Asset, UserQualitativeGoal } from '@/types';

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
  beforeEach(() => {
    // Set system time to 2024-01-01 for consistent year calculations
    vi.setSystemTime(new Date('2024-01-01'));
  });

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
    it('should calculate comprehensive financial scenario with income, expenses, and asset sales', () => {
      // Create comprehensive scenario using the exact data from the hand-written test
      const comprehensiveAssets: Asset[] = [
        {
          id: 'comprehensive-asset-1',
          name: 'Test Asset',
          costBasisPerUnit: 1000,
          quantity: 5,
          acquisitionDate: new Date('2020-01-01'),
        },
      ];

      const scenario = new ScenarioBuilder()
        .withProjectionPeriod(10)
        .withTaxRates(0, 10, 20) // shortTerm: 0%, longTerm: 10%, income: 20%
        .withPlannedSales([
          {
            id: 'sale-1',
            assetId: 'comprehensive-asset-1',
            year: 2024,
            quantity: 3,
            salePricePerUnit: 150000,
          },
        ])
        .build();

      // Override with complex income and expense data that ScenarioBuilder doesn't support
      const complexScenario = {
        ...scenario,
        incomeSources: [
          {
            id: 'income-1',
            name: 'Salary',
            type: 'EMPLOYMENT' as const,
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
      };

      const results = calculateScenarioResults(complexScenario, comprehensiveAssets, mockGoals);

      // Verify yearly projections
      expect(results.yearlyProjections).toHaveLength(10);

      // Check first year (2024) calculations - hand-verified numbers
      const firstYear = results.yearlyProjections[0];
      expect(firstYear.year).toBe(2024);
      expect(firstYear.income).toBe(100000);
      expect(firstYear.expenses).toBe(30000); // 10,000 rent + 20,000 moving costs
      expect(firstYear.capitalGainsData.totalGains).toBe(447000); // (150,000 - 1,000) * 3
      expect(firstYear.taxBreakdown.incomeTax).toBe(20000); // 20% of 100,000
      expect(firstYear.taxBreakdown.capitalGainsTax).toBe(44700); // 10% of 447,000
      expect(firstYear.taxBreakdown.totalTax).toBe(64700); // 20,000 + 44,700
      expect(firstYear.netFinancialOutcome).toBe(452300); // 100,000 + 447,000 - 64,700 - 30,000

      // Check subsequent years (2025-2033) - no asset sales, no one-time expenses
      for (let i = 1; i < 10; i++) {
        const year = results.yearlyProjections[i];
        expect(year.income).toBe(100000);
        expect(year.expenses).toBe(10000); // Only rent, no moving costs
        expect(year.capitalGainsData.totalGains).toBe(0);
        expect(year.taxBreakdown.incomeTax).toBe(20000); // 20% of 100,000
        expect(year.taxBreakdown.capitalGainsTax).toBe(0);
        expect(year.taxBreakdown.totalTax).toBe(20000);
        expect(year.netFinancialOutcome).toBe(70000); // 100,000 - 20,000 - 10,000
      }

      // Check total net outcome over 10 years - hand-verified calculation
      expect(results.totalNetFinancialOutcomeOverPeriod).toBe(1082300); // 452,300 + (70,000 * 9)
    });

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
  });

  describe('calculateQualitativeFitScore', () => {
    it('should calculate score based on mapped attributes and goal weights', () => {
      const scenario = new ScenarioBuilder()
        .withQualitativeAttributes([
          {
            id: 'attr-1',
            scenarioId: 'test-scenario',
            text: 'Test attribute 1',
            sentiment: 'Positive',
            significance: 'High',
            mappedGoalId: 'goal-1'
          }
        ])
        .build();

      const mockGoals: UserQualitativeGoal[] = [
        {
          id: 'goal-1',
          conceptId: 'concept-1',
          name: 'Test Goal 1',
          weight: 'High'
        }
      ];

      const attributeService = new QualitativeAttributeService(scenario.scenarioSpecificAttributes);
      const { score, details, goalAlignments } = attributeService.calculateQualitativeFitScore(scenario, mockGoals);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(details.mappedAttributesCount).toBe(1);
      expect(details.unmappedAttributesCount).toBe(0);
      expect(goalAlignments).toHaveLength(1);
    });

    it('should handle scenarios with no attributes', () => {
      const scenario = createTestScenario();

      const mockGoals: UserQualitativeGoal[] = [
        {
          id: 'goal-1',
          conceptId: 'concept-1',
          name: 'Test Goal 1',
          weight: 'High'
        }
      ];

      const attributeService = new QualitativeAttributeService(scenario.scenarioSpecificAttributes);
      const { score, details, goalAlignments } = attributeService.calculateQualitativeFitScore(scenario, mockGoals);
      expect(score).toBe(50); // Default neutral score
      expect(details.mappedAttributesCount).toBe(0);
      expect(details.unmappedAttributesCount).toBe(0);
      expect(goalAlignments).toHaveLength(1);
    });

    it('should handle scenarios with unmapped attributes', () => {
      const scenario = new ScenarioBuilder()
        .withQualitativeAttributes([
          {
            id: 'attr-1',
            scenarioId: 'test-scenario',
            text: 'Test attribute 1',
            sentiment: 'Positive',
            significance: 'High'
          }
        ])
        .build();

      const mockGoals: UserQualitativeGoal[] = [
        {
          id: 'goal-1',
          conceptId: 'concept-1',
          name: 'Test Goal 1',
          weight: 'High'
        }
      ];

      const attributeService = new QualitativeAttributeService(scenario.scenarioSpecificAttributes);
      const { score, details, goalAlignments } = attributeService.calculateQualitativeFitScore(scenario, mockGoals);
      expect(score).toBe(50); // Default neutral score
      expect(details.mappedAttributesCount).toBe(0);
      expect(details.unmappedAttributesCount).toBe(1);
      expect(goalAlignments).toHaveLength(1);
    });

    it('should calculate goal alignments correctly', () => {
      const scenario = new ScenarioBuilder()
        .withQualitativeAttributes([
          {
            id: 'attr-1',
            scenarioId: 'test-scenario',
            text: 'Test attribute 1',
            sentiment: 'Positive',
            significance: 'High',
            mappedGoalId: 'goal-1'
          }
        ])
        .build();

      const mockGoals: UserQualitativeGoal[] = [
        {
          id: 'goal-1',
          conceptId: 'concept-1',
          name: 'Test Goal 1',
          weight: 'High'
        }
      ];

      const attributeService = new QualitativeAttributeService(scenario.scenarioSpecificAttributes);
      const { goalAlignments } = attributeService.calculateQualitativeFitScore(scenario, mockGoals);

      expect(goalAlignments[0].goalId).toBe('goal-1');
      expect(goalAlignments[0].goalName).toBe('Test Goal 1');
      expect(goalAlignments[0].isAligned).toBe(true);
      expect(goalAlignments[0].alignmentScore).toBeGreaterThan(50);
      expect(goalAlignments[0].contributingAttributes).toHaveLength(1);
    });
  });
}); 