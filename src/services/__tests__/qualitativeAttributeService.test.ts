import { describe, it, expect, beforeEach } from 'vitest';
import { QualitativeAttributeService } from '../qualitativeAttributeService';
import type { ScenarioQualitativeAttribute } from '@/types/qualitative';
import type { UserQualitativeGoal, Scenario } from '@/types';

describe('QualitativeAttributeService', () => {
  const scenarioId = 'test-scenario';
  let service: QualitativeAttributeService;

  beforeEach(() => {
    service = new QualitativeAttributeService();
  });

  it('should add an attribute', () => {
    const attribute: Omit<ScenarioQualitativeAttribute, 'id'> = {
      name: 'Test Attribute',
      sentiment: 'Positive',
      significance: 'High'
    };

    const result = service.addAttribute(scenarioId, attribute);
    expect(result).toMatchObject({
      ...attribute,
      id: expect.any(String)
    });
    expect(service.getAttributesByScenario(scenarioId)).toHaveLength(1);
  });

  it('should update an attribute', () => {
    const attribute = service.addAttribute(scenarioId, {
      name: 'Test Attribute',
      sentiment: 'Positive',
      significance: 'High'
    });

    const updatedAttribute = {
      ...attribute,
      name: 'Updated Attribute'
    };

    const result = service.updateAttribute(scenarioId, updatedAttribute);
    expect(result).toEqual(updatedAttribute);
    expect(service.getAttributesByScenario(scenarioId)[0]).toEqual(updatedAttribute);
  });

  it('should delete an attribute', () => {
    const attribute = service.addAttribute(scenarioId, {
      name: 'Test Attribute',
      sentiment: 'Positive',
      significance: 'High'
    });

    service.deleteAttribute(scenarioId, attribute.id);
    expect(service.getAttributesByScenario(scenarioId)).toHaveLength(0);
  });

  it('should map and unmap attributes to goals', () => {
    const attribute = service.addAttribute(scenarioId, {
      name: 'Test Attribute',
      sentiment: 'Positive',
      significance: 'High'
    });

    const goalId = 'test-goal';
    service.mapAttributeToGoal(scenarioId, attribute.id, goalId);
    expect(service.getAttributesByScenario(scenarioId)[0].mappedGoalId).toBe(goalId);

    service.unmapAttribute(scenarioId, attribute.id);
    expect(service.getAttributesByScenario(scenarioId)[0].mappedGoalId).toBeUndefined();
  });

  describe('calculateFitScore', () => {
    it('should return 0 when no attributes are mapped to goals', () => {
      const goals: UserQualitativeGoal[] = [{
        id: 'goal-1',
        conceptId: 'concept-1',
        name: 'Test Goal 1',
        weight: 'High'
      }];

      const scenario: Scenario = {
        id: scenarioId,
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
        scenarioSpecificAttributes: []
      };

      const { score } = service.calculateQualitativeFitScore(scenario, goals);
      expect(score).toBe(50); // Default neutral score
    });

    it('should calculate correct score for positive sentiment with Critical significance and Critical goal weight', () => {
      const goals: UserQualitativeGoal[] = [{
        id: 'goal-1',
        conceptId: 'concept-1',
        name: 'Test Goal 1',
        weight: 'Critical'
      }];

      const attribute = service.addAttribute(scenarioId, {
        name: 'Test Attribute',
        sentiment: 'Positive',
        significance: 'Critical'
      });
      service.mapAttributeToGoal(scenarioId, attribute.id, goals[0].id);

      const scenario: Scenario = {
        id: scenarioId,
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
        scenarioSpecificAttributes: [attribute]
      };

      const { score } = service.calculateQualitativeFitScore(scenario, goals);
      // Positive (1) * Critical significance (1) * Critical weight (1) = 1
      // Converted to 0-100 scale: ((1 + 1) / 2) * 100 = 100
      expect(score).toBe(100);
    });

    it('should calculate correct score for negative sentiment with High significance and High goal weight', () => {
      const goals: UserQualitativeGoal[] = [{
        id: 'goal-1',
        conceptId: 'concept-1',
        name: 'Test Goal 1',
        weight: 'High'
      }];

      const attribute = service.addAttribute(scenarioId, {
        name: 'Test Attribute',
        sentiment: 'Negative',
        significance: 'High'
      });
      service.mapAttributeToGoal(scenarioId, attribute.id, goals[0].id);

      const scenario: Scenario = {
        id: scenarioId,
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
        scenarioSpecificAttributes: [attribute]
      };

      const { score } = service.calculateQualitativeFitScore(scenario, goals);
      // Negative (-1) * High significance (0.75) * High weight (0.75) = -0.5625
      // Converted to 0-100 scale: ((-0.5625 + 1) / 2) * 100 = 13.125 ≈ 13
      expect(score).toBe(13);
    });

    it('should calculate correct score for neutral sentiment with Medium significance and Medium goal weight', () => {
      const goals: UserQualitativeGoal[] = [{
        id: 'goal-1',
        conceptId: 'concept-1',
        name: 'Test Goal 1',
        weight: 'Medium'
      }];

      const attribute = service.addAttribute(scenarioId, {
        name: 'Test Attribute',
        sentiment: 'Neutral',
        significance: 'Medium'
      });
      service.mapAttributeToGoal(scenarioId, attribute.id, goals[0].id);

      const scenario: Scenario = {
        id: scenarioId,
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
        scenarioSpecificAttributes: [attribute]
      };

      const { score } = service.calculateQualitativeFitScore(scenario, goals);
      // Neutral (0) * Medium significance (0.5) * Medium weight (0.5) = 0
      // Converted to 0-100 scale: ((0 + 1) / 2) * 100 = 50
      expect(score).toBe(50);
    });
  });
}); 