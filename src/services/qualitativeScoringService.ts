import type { Scenario } from '@/types';
import type { 
  UserQualitativeGoal, 
  QualitativeGoalAlignment, 
  ScoreComponent
} from '@/types/qualitative';
import { getWeightValue, getSentimentValue, getSignificanceValue } from '@/utils/qualitativeConversions';

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

/**
 * Calculates a qualitative lifestyle fit for a scenario based on mapped attributes and goals
 * @param scenario The scenario to calculate the score for
 * @param userGoals The user's qualitative goals
 * @returns An object containing the score, detailed breakdown, and goal alignments
 */
export function calculateQualitativeScore(
  scenario: Scenario,
  userGoals: UserQualitativeGoal[]
): QualitativeScore {
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
    const goalWeight = getWeightValue(goal.weight);
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
      const sentimentValue = getSentimentValue(attr.sentiment);
      const significanceValue = getSignificanceValue(attr.significance);
      
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
        name: attr.name,
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
        name: c.name,
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

  return {
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
}

export const qualitativeScoringService = {
  calculateQualitativeScore
}; 