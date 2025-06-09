import React from 'react';
import { MapPin } from 'lucide-react';
import { ScoreBreakdownDialog } from './ScoreBreakdownDialog';
import type { ScenarioQualitativeAttribute, UserQualitativeGoal, QualitativeGoalAlignment } from '@/types/qualitative';
import { getScoreColor } from '@/utils/scoreColors';

interface QualitativeFitScoreDisplayProps {
  attributes: ScenarioQualitativeAttribute[];
  goals: UserQualitativeGoal[];
  score: number;
  goalAlignments: QualitativeGoalAlignment[];
}

export const QualitativeFitScoreDisplay: React.FC<QualitativeFitScoreDisplayProps> = ({
  attributes,
  goals,
  score,
  goalAlignments,
}) => {
  const getMappedGoal = (attribute: ScenarioQualitativeAttribute) => {
    return goals.find((goal) => goal.id === attribute.mappedGoalId);
  };

  const mappedAttributes = attributes.filter((attr) => attr.mappedGoalId);
  const unmappedAttributes = attributes.filter((attr) => !attr.mappedGoalId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Qualitative Fit Score</h3>
        <div className="flex items-center gap-4">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </span>
          <ScoreBreakdownDialog
            score={score}
            attributes={attributes}
            goals={goals}
            goalAlignments={goalAlignments}
          />
        </div>
      </div>
    </div>
  );
}; 