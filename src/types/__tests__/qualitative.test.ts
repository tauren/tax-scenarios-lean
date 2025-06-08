import type { 
  UserQualitativeGoal, 
  QualitativeGoalAlignment
} from '../index';
import type { ScenarioQualitativeAttribute } from '../qualitative';

describe('Qualitative Types', () => {
  describe('UserQualitativeGoal', () => {
    it('should have all required properties', () => {
      const goal: UserQualitativeGoal = {
        id: 'goal-1',
        conceptId: 'concept-1',
        name: 'Test Goal',
        weight: 'High'
      };

      expect(goal).toHaveProperty('id');
      expect(goal).toHaveProperty('conceptId');
      expect(goal).toHaveProperty('name');
      expect(goal).toHaveProperty('weight');
    });

    it('should allow optional properties', () => {
      const goal: UserQualitativeGoal = {
        id: 'goal-1',
        conceptId: 'concept-1',
        name: 'Test Goal',
        weight: 'High',
        statementId: 'statement-1',
        description: 'Test description',
        notes: 'Test notes'
      };

      expect(goal.statementId).toBe('statement-1');
      expect(goal.description).toBe('Test description');
      expect(goal.notes).toBe('Test notes');
    });

    it('should enforce weight enum values', () => {
      const goal: UserQualitativeGoal = {
        id: 'goal-1',
        conceptId: 'concept-1',
        name: 'Test Goal',
        weight: 'High'
      };

      // @ts-expect-error - Invalid weight value
      goal.weight = 'Invalid';
    });
  });

  describe('QualitativeGoalAlignment', () => {
    it('should have all required properties', () => {
      const alignment: QualitativeGoalAlignment = {
        goalId: 'goal-1',
        goalName: 'Test Goal',
        isAligned: true,
        alignmentScore: 75,
        contributingAttributes: []
      };

      expect(alignment).toHaveProperty('goalId');
      expect(alignment).toHaveProperty('goalName');
      expect(alignment).toHaveProperty('isAligned');
      expect(alignment).toHaveProperty('alignmentScore');
      expect(alignment).toHaveProperty('contributingAttributes');
    });

    it('should allow contributing attributes', () => {
      const alignment: QualitativeGoalAlignment = {
        goalId: 'goal-1',
        goalName: 'Test Goal',
        isAligned: true,
        alignmentScore: 75,
        contributingAttributes: [
          {
            attributeId: 'attr-1',
            conceptName: 'Test Concept',
            statementText: 'Test Statement',
            contribution: 0.5
          }
        ]
      };

      expect(alignment.contributingAttributes).toHaveLength(1);
      expect(alignment.contributingAttributes[0]).toHaveProperty('attributeId');
      expect(alignment.contributingAttributes[0]).toHaveProperty('conceptName');
      expect(alignment.contributingAttributes[0]).toHaveProperty('contribution');
    });
  });

  describe('ScenarioQualitativeAttribute', () => {
    it('should have all required properties', () => {
      const attribute: ScenarioQualitativeAttribute = {
        id: 'attr-1',
        scenarioId: 'scenario-1',
        text: 'Test text',
        sentiment: 'positive',
        significance: 'High'
      };

      expect(attribute).toHaveProperty('id');
      expect(attribute).toHaveProperty('scenarioId');
      expect(attribute).toHaveProperty('text');
      expect(attribute).toHaveProperty('sentiment');
      expect(attribute).toHaveProperty('significance');
    });

    it('should allow optional properties', () => {
      const attribute: ScenarioQualitativeAttribute = {
        id: 'attr-1',
        scenarioId: 'scenario-1',
        text: 'Test text',
        sentiment: 'positive',
        significance: 'High',
        mappedGoalId: 'goal-1'
      };

      expect(attribute.mappedGoalId).toBe('goal-1');
    });

    it('should enforce sentiment enum values', () => {
      const attribute: ScenarioQualitativeAttribute = {
        id: 'attr-1',
        scenarioId: 'scenario-1',
        text: 'Test text',
        sentiment: 'positive',
        significance: 'High'
      };

      // @ts-expect-error - Invalid sentiment value
      attribute.sentiment = 'Invalid';
    });

    it('should enforce significance enum values', () => {
      const attribute: ScenarioQualitativeAttribute = {
        id: 'attr-1',
        scenarioId: 'scenario-1',
        text: 'Test text',
        sentiment: 'positive',
        significance: 'High'
      };

      // @ts-expect-error - Invalid significance value
      attribute.significance = 'Invalid';
    });
  });
}); 