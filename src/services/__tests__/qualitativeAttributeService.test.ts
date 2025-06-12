import { describe, it, expect } from 'vitest';
import { qualitativeAttributeService } from '../qualitativeAttributeService';
import type { ScenarioQualitativeAttribute, UserQualitativeGoal } from '@/types/qualitative';
import type { Scenario } from '@/types';

describe('qualitativeAttributeService', () => {
  const createTestScenario = (attributes: ScenarioQualitativeAttribute[]): Scenario => ({
    id: 'test-scenario',
    name: 'Test Scenario',
    projectionPeriod: 10,
    residencyStartDate: new Date(),
    location: { country: 'US' },
    tax: {
      capitalGains: { shortTermRate: 0, longTermRate: 0 },
      incomeRate: 0
    },
    incomeSources: [],
    annualExpenses: [],
    oneTimeExpenses: [],
    plannedAssetSales: [],
    scenarioSpecificAttributes: attributes
  });

  describe('calculateQualitativeFitScore', () => {
    it('should return neutral score when no attributes are mapped to goals', () => {
      const scenario = createTestScenario([]);
      const goals: UserQualitativeGoal[] = [];

      const { score } = qualitativeAttributeService.calculateQualitativeFitScore(scenario, goals);
      expect(score).toBe(50); // Neutral score when no attributes are mapped
    });

    it('should calculate correct score for positive sentiment with Critical significance and Critical goal weight', () => {
      const scenario = createTestScenario([{
        id: 'attr-1',
        name: 'Test Attribute',
        sentiment: 'Positive',
        significance: 'Critical',
        mappedGoalId: 'goal-1'
      }]);
      const goals: UserQualitativeGoal[] = [{
        id: 'goal-1',
        conceptId: 'concept-1',
        name: 'Test Goal',
        weight: 'Critical'
      }];

      const { score } = qualitativeAttributeService.calculateQualitativeFitScore(scenario, goals);
      expect(score).toBe(75); // Perfect alignment with Critical weight/significance
    });

    it('should calculate correct score for negative sentiment with High significance and High goal weight', () => {
      const scenario = createTestScenario([{
        id: 'attr-1',
        name: 'Test Attribute',
        sentiment: 'Negative',
        significance: 'High',
        mappedGoalId: 'goal-1'
      }]);
      const goals: UserQualitativeGoal[] = [{
        id: 'goal-1',
        conceptId: 'concept-1',
        name: 'Test Goal',
        weight: 'High'
      }];

      const { score } = qualitativeAttributeService.calculateQualitativeFitScore(scenario, goals);
      expect(score).toBe(31); // Strong negative alignment with High weight/significance
    });

    it('should calculate correct score for neutral sentiment with Medium significance and Medium goal weight', () => {
      const scenario = createTestScenario([{
        id: 'attr-1',
        name: 'Test Attribute',
        sentiment: 'Neutral',
        significance: 'Medium',
        mappedGoalId: 'goal-1'
      }]);
      const goals: UserQualitativeGoal[] = [{
        id: 'goal-1',
        conceptId: 'concept-1',
        name: 'Test Goal',
        weight: 'Medium'
      }];

      const { score } = qualitativeAttributeService.calculateQualitativeFitScore(scenario, goals);
      expect(score).toBe(50); // Neutral alignment with Medium weight/significance
    });

    it('should calculate correct score for neutral sentiment with Medium significance and Critical goal weight', () => {
      const scenario = createTestScenario([{
        id: 'attr-1',
        name: 'Test Attribute',
        sentiment: 'Neutral',
        significance: 'Medium',
        mappedGoalId: 'goal-1'
      }]);
      const goals: UserQualitativeGoal[] = [{
        id: 'goal-1',
        conceptId: 'concept-1',
        name: 'Test Goal',
        weight: 'Critical'
      }];

      const { score } = qualitativeAttributeService.calculateQualitativeFitScore(scenario, goals);
      expect(score).toBe(50); // Neutral sentiment always results in neutral score (50)
    });
  });
}); 