import { qualitativeScoringService } from '../qualitativeScoringService';
import {
  createBasicScenario,
  createTestGoals,
  createTestAttributes
} from '@/test/scenarioBuilder';

describe('qualitativeScoringService', () => {
  describe('calculateQualitativeScore', () => {
    it('should calculate correct score with mapped attributes', () => {
      const scenario = createBasicScenario({
        scenarioSpecificAttributes: createTestAttributes('test-scenario')
      });
      const goals = createTestGoals();
      
      const result = qualitativeScoringService.calculateQualitativeScore(scenario, goals);

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
      
      const result = qualitativeScoringService.calculateQualitativeScore(scenario, goals);

      expect(result.score).toBe(50); // Default neutral score
      expect(result.details.mappedAttributesCount).toBe(0);
      expect(result.details.unmappedAttributesCount).toBe(0);
    });

    it('should handle scenario with no goals', () => {
      const scenario = createBasicScenario({
        scenarioSpecificAttributes: createTestAttributes('test-scenario')
      });
      
      const result = qualitativeScoringService.calculateQualitativeScore(scenario, []);

      expect(result.score).toBe(50); // Default neutral score
      expect(result.details.mappedAttributesCount).toBe(0);
      expect(result.details.unmappedAttributesCount).toBe(2);
    });

    it('should calculate correct goal alignments', () => {
      const scenario = createBasicScenario({
        scenarioSpecificAttributes: createTestAttributes('test-scenario')
      });
      const goals = createTestGoals();
      
      const result = qualitativeScoringService.calculateQualitativeScore(scenario, goals);

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

    it('should include components in the result', () => {
      const scenario = createBasicScenario({
        scenarioSpecificAttributes: createTestAttributes('test-scenario')
      });
      const goals = createTestGoals();
      
      const result = qualitativeScoringService.calculateQualitativeScore(scenario, goals);

      expect(result.components).toHaveLength(2);
      expect(result.components[0]).toHaveProperty('attributeId');
      expect(result.components[0]).toHaveProperty('goalId');
      expect(result.components[0]).toHaveProperty('baseScore');
      expect(result.components[0]).toHaveProperty('weight');
      expect(result.components[0]).toHaveProperty('finalContribution');
    });

    it('should include lastUpdated in the result', () => {
      const scenario = createBasicScenario({
        scenarioSpecificAttributes: createTestAttributes('test-scenario')
      });
      const goals = createTestGoals();
      
      const result = qualitativeScoringService.calculateQualitativeScore(scenario, goals);

      expect(result.lastUpdated).toBeInstanceOf(Date);
    });
  });
}); 