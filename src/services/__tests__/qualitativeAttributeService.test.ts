import { describe, it, expect, beforeEach } from 'vitest';
import { QualitativeAttributeService } from '../qualitativeAttributeService';
import type { ScenarioQualitativeAttribute, UserQualitativeGoal, Scenario } from '@/types';

describe('QualitativeAttributeService', () => {
  const mockScenarioId = 'test-scenario';
  let service: QualitativeAttributeService;

  beforeEach(() => {
    service = new QualitativeAttributeService();
  });

  describe('addAttribute', () => {
    it('should add a new attribute with generated id', () => {
      const attribute: Omit<ScenarioQualitativeAttribute, 'id' | 'scenarioId'> = {
        text: 'Test attribute',
        sentiment: 'Positive',
        significance: 'High',
      };

      const result = service.addAttribute(mockScenarioId, attribute);

      expect(result.id).toBeDefined();
      expect(result.scenarioId).toBe(mockScenarioId);
      expect(result.text).toBe(attribute.text);
      expect(result.sentiment).toBe(attribute.sentiment);
      expect(result.significance).toBe(attribute.significance);
    });
  });

  describe('deleteAttribute', () => {
    it('should remove the attribute with the specified id', () => {
      const attribute = service.addAttribute(mockScenarioId, {
        text: 'Test attribute',
        sentiment: 'Positive',
        significance: 'High',
      });

      service.deleteAttribute(attribute.id);

      const attributes = service.getAttributesByScenario(mockScenarioId);
      expect(attributes).toHaveLength(0);
    });
  });

  describe('mapAttributeToGoal', () => {
    it('should map an attribute to a goal', () => {
      const attribute = service.addAttribute(mockScenarioId, {
        text: 'Test attribute',
        sentiment: 'Positive',
        significance: 'High',
      });

      const goalId = 'goal-1';
      service.mapAttributeToGoal(attribute.id, goalId);

      const attributes = service.getAttributesByScenario(mockScenarioId);
      expect(attributes[0].mappedGoalId).toBe(goalId);
    });
  });

  describe('unmapAttribute', () => {
    it('should remove the goal mapping from an attribute', () => {
      const attribute = service.addAttribute(mockScenarioId, {
        text: 'Test attribute',
        sentiment: 'Positive',
        significance: 'High',
      });

      service.mapAttributeToGoal(attribute.id, 'goal-1');
      service.unmapAttribute(attribute.id);

      const attributes = service.getAttributesByScenario(mockScenarioId);
      expect(attributes[0].mappedGoalId).toBeUndefined();
    });
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
        id: mockScenarioId,
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

      const attribute = service.addAttribute(mockScenarioId, {
        text: 'Test attribute',
        sentiment: 'Positive',
        significance: 'Critical'
      });
      service.mapAttributeToGoal(attribute.id, goals[0].id);

      const scenario: Scenario = {
        id: mockScenarioId,
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

      const attribute = service.addAttribute(mockScenarioId, {
        text: 'Test attribute',
        sentiment: 'Negative',
        significance: 'High'
      });
      service.mapAttributeToGoal(attribute.id, goals[0].id);

      const scenario: Scenario = {
        id: mockScenarioId,
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

      const attribute = service.addAttribute(mockScenarioId, {
        text: 'Test attribute',
        sentiment: 'Neutral',
        significance: 'Medium'
      });
      service.mapAttributeToGoal(attribute.id, goals[0].id);

      const scenario: Scenario = {
        id: mockScenarioId,
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