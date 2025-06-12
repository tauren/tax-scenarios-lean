import type { UserQualitativeGoal } from '@/types/qualitative';
import type { ScenarioQualitativeAttribute } from '@/types/qualitative';

/**
 * Converts a weight string to a numeric value
 */
export function getWeightValue(weight: UserQualitativeGoal['weight']): number {
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
export function getSentimentValue(sentiment: ScenarioQualitativeAttribute['sentiment']): number {
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
export function getSignificanceValue(significance: ScenarioQualitativeAttribute['significance']): number {
  switch (significance) {
    case 'Critical':
      return 2;
    case 'High':
      return 1.5;
    case 'Medium':
      return 1;
    case 'Low':
      return 0.5;
    default:
      return 0;
  }
} 