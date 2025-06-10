import { QualitativeScoringService } from '../qualitativeScoringService';
import {
  createBasicScenario,
  createTestGoals,
  createTestAttributes
} from '@/test/scenarioBuilder';

describe('QualitativeScoringService', () => {
  let service: QualitativeScoringService;

  beforeEach(() => {
    service = new QualitativeScoringService();
  });

  describe('calculateScore', () => {
    it('should calculate correct score with mapped attributes', () => {
      const scenario = createBasicScenario({
        scenarioSpecificAttributes: createTestAttributes('test-scenario')
      });
      const goals = createTestGoals();
      
      const result = service.calculateScore(scenario, goals);

      expect(result.score).toBeDefined();
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.details.mappedAttributesCount).toBe(2);
      expect(result.details.unmappedAttributesCount).toBe(0);
      expect(result.goalAlignments).toHaveLength(2);
    });

    it('should handle scenario with no mapped attributes', () => {
      const scenario = createBasicScenario();
      const goals = createTestGoals();
      
      const result = service.calculateScore(scenario, goals);

      expect(result.score).toBe(50); // Default neutral score
      expect(result.details.mappedAttributesCount).toBe(0);
      expect(result.details.unmappedAttributesCount).toBe(0);
    });

    it('should handle scenario with no goals', () => {
      const scenario = createBasicScenario({
        scenarioSpecificAttributes: createTestAttributes('test-scenario')
      });
      
      const result = service.calculateScore(scenario, []);

      expect(result.score).toBe(50); // Default neutral score
      expect(result.details.mappedAttributesCount).toBe(0);
      expect(result.details.unmappedAttributesCount).toBe(2);
    });

    it('should calculate correct goal alignments', () => {
      const scenario = createBasicScenario({
        scenarioSpecificAttributes: createTestAttributes('test-scenario')
      });
      const goals = createTestGoals();
      
      const result = service.calculateScore(scenario, goals);

      expect(result.goalAlignments).toHaveLength(2);
      
      // Goal 1 should be aligned (positive sentiment * high significance)
      const goal1Alignment = result.goalAlignments.find(g => g.goalId === 'goal1');
      expect(goal1Alignment).toBeDefined();
      expect(goal1Alignment?.isAligned).toBe(true);
      expect(goal1Alignment?.alignmentScore).toBeGreaterThan(50);

      // Goal 2 should not be aligned (negative sentiment * medium significance)
      const goal2Alignment = result.goalAlignments.find(g => g.goalId === 'goal2');
      expect(goal2Alignment).toBeDefined();
      expect(goal2Alignment?.isAligned).toBe(false);
      expect(goal2Alignment?.alignmentScore).toBeLessThan(50);
    });

    it('should cache results and return cached value', () => {
      const scenario = createBasicScenario({
        scenarioSpecificAttributes: createTestAttributes('test-scenario')
      });
      const goals = createTestGoals();
      
      const result1 = service.calculateScore(scenario, goals);
      const result2 = service.calculateScore(scenario, goals);

      expect(result1).toBe(result2); // Should return same object reference
    });
  });

  describe('getScoreBreakdown', () => {
    it('should return empty array for unknown scenario', () => {
      const breakdown = service.getScoreBreakdown('unknown-scenario');
      expect(breakdown).toEqual([]);
    });

    it('should return components for known scenario', () => {
      const scenario = createBasicScenario({
        scenarioSpecificAttributes: createTestAttributes('test-scenario')
      });
      const goals = createTestGoals();
      
      service.calculateScore(scenario, goals);
      const breakdown = service.getScoreBreakdown(scenario.id);

      expect(breakdown).toHaveLength(2);
      expect(breakdown[0]).toHaveProperty('attributeId');
      expect(breakdown[0]).toHaveProperty('goalId');
      expect(breakdown[0]).toHaveProperty('baseScore');
      expect(breakdown[0]).toHaveProperty('weight');
      expect(breakdown[0]).toHaveProperty('finalContribution');
    });
  });

  describe('invalidateCache', () => {
    it('should invalidate cached results', () => {
      const scenario = createBasicScenario({
        scenarioSpecificAttributes: createTestAttributes('test-scenario')
      });
      const goals = createTestGoals();
      
      const result1 = service.calculateScore(scenario, goals);
      service.invalidateCache(scenario.id);
      const result2 = service.calculateScore(scenario, goals);

      expect(result1).not.toBe(result2); // Should return different object references
    });
  });
}); 