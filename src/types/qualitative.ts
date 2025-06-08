import type { ScenarioAttribute } from './index';

export interface QualitativeConcept {
  id: string;
  name: string;
  description: string;
}

export interface QualitativeStatement {
  id: string;
  conceptId: string;
  statementText: string;
  sentiment: "positive" | "neutral" | "negative";
}

export interface UserQualitativeGoal {
  id: string;
  conceptId: string;
  name: string;
  weight: "Low" | "Medium" | "High" | "Critical";
}

export interface ScenarioQualitativeAttribute {
  id: string;
  scenarioId: string;
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  significance: "Low" | "Medium" | "High" | "Critical";
  mappedGoalId?: string;
}

export function convertToQualitativeAttribute(
  attribute: ScenarioAttribute,
  scenarioId: string
): ScenarioQualitativeAttribute {
  return {
    id: attribute.id,
    scenarioId,
    text: attribute.notes || '',
    sentiment: attribute.userSentiment.toLowerCase() as "positive" | "negative" | "neutral",
    significance: attribute.significanceToUser === "None" ? "Low" : attribute.significanceToUser,
    mappedGoalId: attribute.mappedGoalId
  };
}

export function convertToScenarioAttribute(
  attribute: ScenarioQualitativeAttribute
): ScenarioAttribute {
  return {
    id: attribute.id,
    conceptId: '', // This will be set by the backend
    userSentiment: attribute.sentiment.charAt(0).toUpperCase() + attribute.sentiment.slice(1) as "Positive" | "Neutral" | "Negative",
    significanceToUser: attribute.significance,
    notes: attribute.text,
    mappedGoalId: attribute.mappedGoalId
  };
} 