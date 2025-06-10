import type { Scenario } from '@/types';
import type { 
  UserQualitativeGoal, 
  QualitativeGoalAlignment, 
  ScenarioQualitativeAttribute,
  ScoreComponent
} from '@/types/qualitative';

export interface QualitativeScore {
  score: number;
  details: {
    mappedAttributesCount: number;
    unmappedAttributesCount: number;
    goalContributions: { goalId: string; contribution: number }[];
  };
  goalAlignments: QualitativeGoalAlignment[];
  components: ScoreComponent[];
  lastUpdated: Date;
}

export class QualitativeScoringService {
  private scoreCache: WeakMap<Scenario, QualitativeScore> = new WeakMap();
  private lastUpdateTime: WeakMap<Scenario, number> = new WeakMap();
  private scenarioMap: Map<string, Scenario> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Calculates a qualitative fit score for a scenario based on mapped attributes and goals
   * @param scenario The scenario to calculate the score for
   * @param userGoals The user's qualitative goals
   * @returns An object containing the score, detailed breakdown, and goal alignments
   */
  calculateScore(
    scenario: Scenario,
    userGoals: UserQualitativeGoal[]
  ): QualitativeScore {
    // Store scenario in map for later retrieval
    this.scenarioMap.set(scenario.id, scenario);

    // Check cache first
    const cachedScore = this.getCachedScore(scenario);
    if (cachedScore) {
      return cachedScore;
    }

    // Initialize tracking variables
    let totalWeightedScoreContribution = 0;
    let sumOfMaxPossibleGoalContributions = 0;
    const goalContributions: { goalId: string; contribution: number }[] = [];
    let mappedAttributesCount = 0;
    let unmappedAttributesCount = 0;
    const goalAlignments: QualitativeGoalAlignment[] = [];
    const components: ScoreComponent[] = [];

    // Get all attributes
    const allAttributes = scenario.scenarioSpecificAttributes || [];

    // Count unmapped attributes (those without a mappedGoalId or with a mappedGoalId that doesn't exist in goals)
    const validGoalIds = new Set(userGoals.map(g => g.id));
    unmappedAttributesCount = allAttributes.filter(attr => 
      !attr.mappedGoalId || 
      attr.mappedGoalId.trim() === '' || 
      !validGoalIds.has(attr.mappedGoalId)
    ).length;

    // Process each goal
    for (const goal of userGoals) {
      // Convert weight to numeric value
      const goalWeight = this.getWeightValue(goal.weight);
      if (goalWeight === 0) continue;

      // Find mapped attributes for this goal
      const mappedAttributes = allAttributes.filter(
        attr => attr.mappedGoalId === goal.id
      );

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
        
        // Calculate attribute's contribution
        const attributeContribution = sentimentValue * significanceValue * goalWeight;
        goalContribution += attributeContribution;

        // Track component for detailed breakdown
        components.push({
          attributeId: attr.id,
          goalId: goal.id,
          baseScore: sentimentValue * significanceValue,
          weight: goalWeight,
          finalContribution: attributeContribution
        });

        // Track raw contributions for normalization
        rawContributions.push({
          attributeId: attr.id,
          conceptName: attr.text,
          raw: Math.abs(attributeContribution),
          signed: attributeContribution,
          maxPossiblePercent: goalWeight > 0 ? (attributeContribution / (goalWeight * 2 * 2)) * 100 : 0
        });
      }

      // Normalize contributions to percentages (signed)
      const totalRaw = rawContributions.reduce((sum, c) => sum + Math.abs(c.signed), 0);
      for (const c of rawContributions) {
        contributingAttributes.push({
          attributeId: c.attributeId,
          conceptName: c.conceptName,
          contribution: totalRaw > 0 ? (c.signed / totalRaw) * 100 : 0,
          maxPossiblePercent: c.maxPossiblePercent
        });
      }

      // Calculate alignment score (0-100)
      // For a positive sentiment * high significance * high weight, we expect:
      // 1 * 1.5 * 1.5 = 2.25 contribution
      // Max possible is 2 * 2 * 2 = 8
      // So alignment score would be (2.25 / 8) * 100 = 28.125
      // We need to adjust this to make it more intuitive
      const maxPossibleContribution = goalWeight * 2 * 2; // Max possible contribution
      const alignmentScore = mappedAttributes.length > 0 
        ? ((goalContribution + maxPossibleContribution) / (2 * maxPossibleContribution)) * 100
        : 50; // Default to neutral if no attributes

      const isAligned = alignmentScore >= 50;

      // Add to total contributions
      totalWeightedScoreContribution += goalContribution;
      sumOfMaxPossibleGoalContributions += maxPossibleContribution;

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

    // Calculate final score
    let score = 50; // Default neutral score
    if (sumOfMaxPossibleGoalContributions > 0) {
      score = ((totalWeightedScoreContribution + sumOfMaxPossibleGoalContributions) / 
               (2 * sumOfMaxPossibleGoalContributions)) * 100;
    }

    // Ensure score stays within 0-100 range and round to nearest integer
    score = Math.round(Math.max(0, Math.min(100, score)));

    const result: QualitativeScore = {
      score,
      details: {
        mappedAttributesCount,
        unmappedAttributesCount,
        goalContributions
      },
      goalAlignments,
      components,
      lastUpdated: new Date()
    };

    // Cache the result
    this.cacheScore(scenario, result);

    return result;
  }

  /**
   * Gets the score breakdown for a specific scenario
   * @param scenarioId The ID of the scenario
   * @returns Array of score components
   */
  getScoreBreakdown(scenarioId: string): ScoreComponent[] {
    const scenario = this.scenarioMap.get(scenarioId);
    if (!scenario) return [];
    const cachedScore = this.scoreCache.get(scenario);
    return cachedScore?.components || [];
  }

  /**
   * Invalidates the cache for a specific scenario
   * @param scenarioId The ID of the scenario
   */
  invalidateCache(scenarioId: string): void {
    const scenario = this.scenarioMap.get(scenarioId);
    if (scenario) {
      this.scoreCache.delete(scenario);
      this.lastUpdateTime.delete(scenario);
      this.scenarioMap.delete(scenarioId);
    }
  }

  private getCachedScore(scenario: Scenario): QualitativeScore | null {
    const cachedScore = this.scoreCache.get(scenario);
    const lastUpdate = this.lastUpdateTime.get(scenario);
    
    if (cachedScore && lastUpdate) {
      const now = Date.now();
      if (now - lastUpdate < this.CACHE_TTL) {
        return cachedScore;
      }
    }
    
    return null;
  }

  private cacheScore(scenario: Scenario, score: QualitativeScore): void {
    this.scoreCache.set(scenario, score);
    this.lastUpdateTime.set(scenario, Date.now());
  }

  /**
   * Converts a weight string to a numeric value (new scale)
   */
  private getWeightValue(weight: UserQualitativeGoal['weight']): number {
    switch (weight) {
      case "Critical": return 2.0;
      case "High": return 1.5;
      case "Medium": return 1.0;
      case "Low": return 0.5;
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
   * Converts a significance string to a numeric value (new scale)
   */
  private getSignificanceValue(significance: ScenarioQualitativeAttribute['significance']): number {
    switch (significance) {
      case 'Critical':
        return 2.0;
      case 'High':
        return 1.5;
      case 'Medium':
        return 1.0;
      case 'Low':
      default:
        return 0.5;
    }
  }
} 