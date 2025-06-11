export interface QualitativeConcept {
  id: string;
  text: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  significance: "Low" | "Medium" | "High" | "Critical";
  mappedGoalId?: string;
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
  name: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  significance: "Low" | "Medium" | "High" | "Critical";
  mappedGoalId?: string;
}

export interface QualitativeGoalAlignment {
  goalId: string;
  goalName: string;
  alignmentScore: number;
  isAligned: boolean;
  contributingAttributes: Array<{
    attributeId: string;
    name: string;
    contribution: number;
    maxPossiblePercent: number;
  }>;
}

export interface ScoreComponent {
  attributeId: string;
  goalId: string;
  baseScore: number;
  weight: number;
  finalContribution: number;
} 