import type { Scenario } from '@/types';
import type { UserQualitativeGoal, ScenarioQualitativeAttribute } from '@/types/qualitative';

/**
 * Creates a basic scenario with default values
 */
export const createBasicScenario = (overrides: Partial<Scenario> = {}): Scenario => ({
  id: 'test-scenario',
  name: 'Test Scenario',
  scenarioSpecificAttributes: [],
  projectionPeriod: 10,
  residencyStartDate: new Date(),
  location: {
    country: 'US',
    state: 'CA',
    city: 'San Francisco'
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
  ...overrides
});

/**
 * Creates a basic qualitative goal with default values
 */
export const createQualitativeGoal = (overrides: Partial<UserQualitativeGoal> = {}): UserQualitativeGoal => ({
  id: 'test-goal',
  conceptId: 'test-concept',
  name: 'Test Goal',
  weight: 'Medium',
  ...overrides
});

/**
 * Creates a basic qualitative attribute with default values
 */
export const createQualitativeAttribute = (overrides: Partial<ScenarioQualitativeAttribute> = {}): ScenarioQualitativeAttribute => ({
  id: 'test-attribute',
  scenarioId: 'test-scenario',
  text: 'Test Attribute',
  sentiment: 'Neutral',
  significance: 'Medium',
  ...overrides
});

/**
 * Creates a set of test goals with different weights
 */
export const createTestGoals = (): UserQualitativeGoal[] => [
  createQualitativeGoal({
    id: 'goal1',
    conceptId: 'concept1',
    name: 'Test Goal 1',
    weight: 'High'
  }),
  createQualitativeGoal({
    id: 'goal2',
    conceptId: 'concept2',
    name: 'Test Goal 2',
    weight: 'Critical'
  })
];

/**
 * Creates a set of test attributes with different sentiments and significances
 */
export const createTestAttributes = (scenarioId: string): ScenarioQualitativeAttribute[] => [
  createQualitativeAttribute({
    id: 'attr1',
    scenarioId,
    text: 'Positive attribute',
    sentiment: 'Positive',
    significance: 'High',
    mappedGoalId: 'goal1'
  }),
  createQualitativeAttribute({
    id: 'attr2',
    scenarioId,
    text: 'Negative attribute',
    sentiment: 'Negative',
    significance: 'Medium',
    mappedGoalId: 'goal2'
  })
]; 