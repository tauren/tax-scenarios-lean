import { v4 as uuidv4 } from 'uuid';
import type { ScenarioQualitativeAttribute, UserQualitativeGoal, QualitativeGoalAlignment } from '@/types/qualitative';
import type { Scenario } from '@/types';

export class QualitativeAttributeService {
  private attributes: Map<string, ScenarioQualitativeAttribute[]> = new Map();

  constructor(initialAttributes: ScenarioQualitativeAttribute[] = []) {
    // Group attributes by scenarioId
    initialAttributes.forEach(attr => {
      const scenarioId = attr.scenarioId;
      if (!this.attributes.has(scenarioId)) {
        this.attributes.set(scenarioId, []);
      }
      this.attributes.get(scenarioId)?.push(attr);
    });
  }

  addAttribute(scenarioId: string, attribute: Omit<ScenarioQualitativeAttribute, 'id'>): ScenarioQualitativeAttribute {
    const newAttribute: ScenarioQualitativeAttribute = {
      id: uuidv4(),
      ...attribute,
    };
    
    if (!this.attributes.has(scenarioId)) {
      this.attributes.set(scenarioId, []);
    }
    this.attributes.get(scenarioId)?.push(newAttribute);
    return newAttribute;
  }

  updateAttribute(scenarioId: string, attribute: ScenarioQualitativeAttribute): ScenarioQualitativeAttribute {
    const scenarioAttributes = this.attributes.get(scenarioId);
    if (!scenarioAttributes) {
      throw new Error(`No attributes found for scenario ${scenarioId}`);
    }
    
    const index = scenarioAttributes.findIndex(a => a.id === attribute.id);
    if (index === -1) {
      throw new Error(`Attribute with id ${attribute.id} not found in scenario ${scenarioId}`);
    }
    
    scenarioAttributes[index] = attribute;
    return attribute;
  }

  deleteAttribute(scenarioId: string, attributeId: string): void {
    const scenarioAttributes = this.attributes.get(scenarioId);
    if (!scenarioAttributes) return;
    
    this.attributes.set(
      scenarioId,
      scenarioAttributes.filter(attr => attr.id !== attributeId)
    );
  }

  mapAttributeToGoal(scenarioId: string, attributeId: string, goalId: string): void {
    const scenarioAttributes = this.attributes.get(scenarioId);
    if (!scenarioAttributes) return;
    
    const attribute = scenarioAttributes.find(attr => attr.id === attributeId);
    if (attribute) {
      attribute.mappedGoalId = goalId;
    }
  }

  unmapAttribute(scenarioId: string, attributeId: string): void {
    const scenarioAttributes = this.attributes.get(scenarioId);
    if (!scenarioAttributes) return;
    
    const attribute = scenarioAttributes.find(attr => attr.id === attributeId);
    if (attribute) {
      attribute.mappedGoalId = undefined;
    }
  }

  getAttributesByScenario(scenarioId: string): ScenarioQualitativeAttribute[] {
    return this.attributes.get(scenarioId) || [];
  }

  /**
   * Calculates a qualitative fit score for a scenario based on mapped attributes and goals
   * @param scenario The scenario to calculate the score for
   * @param userGoals The user's qualitative goals
   * @returns An object containing the score, detailed breakdown, and goal alignments
   */
  calculateQualitativeFitScore(
    scenario: Scenario,
    userGoals: UserQualitativeGoal[]
  ): { 
    score: number; 
    details: {
      mappedAttributesCount: number;
      unmappedAttributesCount: number;
      goalContributions: { goalId: string; contribution: number }[];
    };
    goalAlignments: QualitativeGoalAlignment[];
  } {
    // Initialize tracking variables
    let totalWeightedScoreContribution = 0;
    let sumOfMaxPossibleGoalContributions = 0;
    const goalContributions: { goalId: string; contribution: number }[] = [];
    let mappedAttributesCount = 0;
    let unmappedAttributesCount = 0;
    const goalAlignments: QualitativeGoalAlignment[] = [];

    // Process each goal
    for (const goal of userGoals) {
      // Convert weight to numeric value
      const goalWeight = this.getWeightValue(goal.weight);
      if (goalWeight === 0) continue;

      // Find mapped attributes for this goal
      const scenarioAttributes = this.attributes.get(scenario.id);
      const mappedAttributes = scenarioAttributes?.filter(
        attr => attr.mappedGoalId === goal.id
      ) || [];

      // Track attribute counts
      if (mappedAttributes.length > 0) {
        mappedAttributesCount += mappedAttributes.length;
      }

      // Calculate contribution for this goal
      let goalContribution = 0;
      const rawContributions = [];
      const contributingAttributes = [];

      for (const attr of mappedAttributes) {
        // Convert sentiment and significance to numeric values
        const sentimentValue = this.getSentimentValue(attr.sentiment);
        const significanceValue = this.getSignificanceValue(attr.significance);
        // Calculate attribute's contribution (always include, even if zero)
        const attributeContribution = sentimentValue * significanceValue * goalWeight;
        goalContribution += attributeContribution;
        // Track raw contributions for normalization (always include)
        rawContributions.push({
          attributeId: attr.id,
          name: attr.name,
          raw: Math.abs(attributeContribution),
          signed: attributeContribution,
          maxPossiblePercent: goalWeight > 0 ? (attributeContribution / (goalWeight * 1 * 1)) * 100 : 0
        });
      }

      // Normalize contributions to percentages (signed)
      const totalRaw = rawContributions.reduce((sum, c) => sum + Math.abs(c.signed), 0);
      for (const c of rawContributions) {
        contributingAttributes.push({
          attributeId: c.attributeId,
          name: c.name,
          contribution: totalRaw > 0 ? (c.signed / totalRaw) * 100 : 0,
          maxPossiblePercent: c.maxPossiblePercent
        });
      }

      // Calculate alignment score (0-100)
      const alignmentScore = (goalContribution / (goalWeight * 1 * 1)) * 100;
      const isAligned = alignmentScore >= 50;

      // Add to total contributions
      totalWeightedScoreContribution += goalContribution;
      sumOfMaxPossibleGoalContributions += goalWeight * 1 * 1; // Max possible contribution (positive sentiment * high significance)

      // Track goal contribution
      goalContributions.push({
        goalId: goal.id,
        contribution: Math.round(goalContribution)
      });

      // Add goal alignment
      goalAlignments.push({
        goalId: goal.id,
        goalName: goal.name,
        isAligned,
        alignmentScore: Math.round(Math.max(0, Math.min(100, alignmentScore))),
        contributingAttributes: contributingAttributes.map(attr => ({
          ...attr,
          contribution: Math.round(attr.contribution),
          maxPossiblePercent: Math.round(attr.maxPossiblePercent)
        }))
      });
    }

    // Count unmapped attributes
    unmappedAttributesCount = (scenario.scenarioSpecificAttributes?.filter(
      attr => !attr.mappedGoalId
    ) || []).length;

    // Calculate final score
    let score = 50; // Default neutral score
    if (sumOfMaxPossibleGoalContributions > 0) {
      score = ((totalWeightedScoreContribution + sumOfMaxPossibleGoalContributions) / 
               (2 * sumOfMaxPossibleGoalContributions)) * 100;
    }

    // Ensure score stays within 0-100 range and round to nearest integer
    score = Math.round(Math.max(0, Math.min(100, score)));

    return {
      score,
      details: {
        mappedAttributesCount,
        unmappedAttributesCount,
        goalContributions
      },
      goalAlignments
    };
  }

  /**
   * Converts a weight string to a numeric value
   */
  private getWeightValue(weight: UserQualitativeGoal['weight']): number {
    switch (weight) {
      case "Critical": return 1.0;
      case "High": return 0.75;
      case "Medium": return 0.5;
      case "Low": return 0.25;
      default: return 0;
    }
  }

  /**
   * Converts a sentiment string to a numeric value
   */
  private getSentimentValue(sentiment: ScenarioQualitativeAttribute['sentiment']): number {
    switch (sentiment) {
      case 'Positive':
        return 1;
      case 'Negative':
        return -1;
      case 'Neutral':
      default:
        return 0;
    }
  }

  /**
   * Converts a significance string to a numeric value
   */
  private getSignificanceValue(significance: ScenarioQualitativeAttribute['significance']): number {
    switch (significance) {
      case 'Critical':
        return 1;
      case 'High':
        return 0.75;
      case 'Medium':
        return 0.5;
      case 'Low':
      default:
        return 0.25;
    }
  }
} 