export interface QualitativeConcept {
  id: string;
  name: string;
  description: string;
}

export interface QualitativeStatement {
  id: string;
  conceptId: string;
  statementText: string;
  sentiment: "Positive" | "Neutral" | "Negative";
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
  sentiment: "Positive" | "Negative" | "Neutral";
  significance: "Low" | "Medium" | "High" | "Critical";
  mappedGoalId?: string;
} 