import { v4 as uuidv4 } from 'uuid';
import type { ScenarioQualitativeAttribute, UserQualitativeGoal } from '@/types/qualitative';

export class QualitativeAttributeService {
  private attributes: ScenarioQualitativeAttribute[] = [];

  constructor(initialAttributes: ScenarioQualitativeAttribute[] = []) {
    this.attributes = initialAttributes;
  }

  addAttribute(scenarioId: string, attribute: Omit<ScenarioQualitativeAttribute, 'id' | 'scenarioId'>): ScenarioQualitativeAttribute {
    const newAttribute: ScenarioQualitativeAttribute = {
      id: uuidv4(),
      scenarioId,
      ...attribute,
    };
    this.attributes.push(newAttribute);
    return newAttribute;
  }

  updateAttribute(attribute: ScenarioQualitativeAttribute): ScenarioQualitativeAttribute {
    const index = this.attributes.findIndex(a => a.id === attribute.id);
    if (index === -1) {
      throw new Error(`Attribute with id ${attribute.id} not found`);
    }
    this.attributes[index] = attribute;
    return attribute;
  }

  deleteAttribute(id: string): void {
    this.attributes = this.attributes.filter((attr) => attr.id !== id);
  }

  mapAttributeToGoal(attributeId: string, goalId: string): void {
    const attribute = this.attributes.find((attr) => attr.id === attributeId);
    if (attribute) {
      attribute.mappedGoalId = goalId;
    }
  }

  unmapAttribute(attributeId: string): void {
    const attribute = this.attributes.find((attr) => attr.id === attributeId);
    if (attribute) {
      attribute.mappedGoalId = undefined;
    }
  }

  getAttributesByScenario(scenarioId: string): ScenarioQualitativeAttribute[] {
    return this.attributes.filter((attr) => attr.scenarioId === scenarioId);
  }

  calculateFitScore(scenarioId: string, goals: UserQualitativeGoal[]): number {
    const scenarioAttributes = this.getAttributesByScenario(scenarioId);
    const mappedAttributes = scenarioAttributes.filter((attr) => attr.mappedGoalId);

    if (mappedAttributes.length === 0) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    mappedAttributes.forEach((attribute) => {
      const goal = goals.find((g) => g.id === attribute.mappedGoalId);
      if (!goal) return;

      const sentimentScore = attribute.sentiment === 'Positive' ? 1 :
        attribute.sentiment === 'Negative' ? -1 : 0;

      const significanceScore = attribute.significance === 'Critical' ? 1 :
        attribute.significance === 'High' ? 0.75 :
        attribute.significance === 'Medium' ? 0.5 : 0.25;

      const goalWeight = goal.weight === 'Critical' ? 1 :
        goal.weight === 'High' ? 0.75 :
        goal.weight === 'Medium' ? 0.5 : 0.25;

      const attributeScore = sentimentScore * significanceScore * goalWeight;
      totalScore += attributeScore;
      totalWeight += goalWeight;
    });

    // Convert raw score (-1 to 1) to percentage (0 to 100)
    const rawScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    return Math.round(((rawScore + 1) / 2) * 100);
  }
} 