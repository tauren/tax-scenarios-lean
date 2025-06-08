import React from 'react';
import { MapPin } from 'lucide-react';
import type { ScenarioQualitativeAttribute, UserQualitativeGoal } from '@/types/qualitative';

interface QualitativeFitScoreDisplayProps {
  attributes: ScenarioQualitativeAttribute[];
  goals: UserQualitativeGoal[];
  score: number;
}

export const QualitativeFitScoreDisplay: React.FC<QualitativeFitScoreDisplayProps> = ({
  attributes,
  goals,
  score,
}) => {
  const getMappedGoal = (attribute: ScenarioQualitativeAttribute) => {
    return goals.find((goal) => goal.id === attribute.mappedGoalId);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const mappedAttributes = attributes.filter((attr) => attr.mappedGoalId);
  const unmappedAttributes = attributes.filter((attr) => !attr.mappedGoalId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Qualitative Fit Score</h3>
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {score}%
        </span>
      </div>

      {mappedAttributes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Mapped Attributes</h4>
          <div className="space-y-2">
            {mappedAttributes.map((attribute) => {
              const goal = getMappedGoal(attribute);
              if (!goal) return null;

              return (
                <div
                  key={attribute.id}
                  className="flex items-start gap-2 rounded-md border border-gray-200 p-3"
                >
                  <MapPin className="mt-0.5 h-4 w-4 text-blue-600" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{attribute.text}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>
                        {attribute.sentiment.charAt(0).toUpperCase() + attribute.sentiment.slice(1)}
                      </span>
                      <span>•</span>
                      <span>{attribute.significance} Significance</span>
                      <span>•</span>
                      <span>Mapped to: {goal.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {unmappedAttributes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Unmapped Attributes</h4>
          <div className="space-y-2">
            {unmappedAttributes.map((attribute) => (
              <div
                key={attribute.id}
                className="rounded-md border border-gray-200 p-3"
              >
                <p className="text-sm">{attribute.text}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <span>
                    {attribute.sentiment.charAt(0).toUpperCase() + attribute.sentiment.slice(1)}
                  </span>
                  <span>•</span>
                  <span>{attribute.significance} Significance</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {attributes.length === 0 && (
        <p className="text-center text-sm text-gray-500">No attributes added yet</p>
      )}
    </div>
  );
}; 