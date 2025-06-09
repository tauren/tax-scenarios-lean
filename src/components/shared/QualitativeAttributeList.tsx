import React from 'react';
import type { ScenarioQualitativeAttribute } from '@/types/qualitative';
import { QualitativeAttributeCard } from './QualitativeAttributeCard';
import type { SentimentOption } from './SentimentSelector';
import type { WeightOption } from './WeightSelector';

interface QualitativeAttributeListProps {
  attributes: ScenarioQualitativeAttribute[];
  onDelete: (id: string) => void;
  onMapToGoal: (attribute: ScenarioQualitativeAttribute) => void;
  onEdit: (attribute: ScenarioQualitativeAttribute) => void;
  onUpdateName: (attributeId: string, newName: string) => void;
  onUpdateSentiment: (attributeId: string, sentiment: SentimentOption) => void;
  onUpdateSignificance: (attributeId: string, significance: WeightOption) => void;
  getGoalNameById: (goalId: string) => string | undefined;
  disabled?: boolean;
}

export function QualitativeAttributeList({
  attributes,
  onDelete,
  onMapToGoal,
  onEdit,
  onUpdateName,
  onUpdateSentiment,
  onUpdateSignificance,
  getGoalNameById,
  disabled = false,
}: QualitativeAttributeListProps) {
  if (!attributes.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {attributes.map((attribute) => (
        <QualitativeAttributeCard
          key={attribute.id}
          attribute={attribute}
          onDelete={onDelete}
          onMapToGoal={onMapToGoal}
          onEdit={onEdit}
          onUpdateName={onUpdateName}
          onUpdateSentiment={onUpdateSentiment}
          onUpdateSignificance={onUpdateSignificance}
          getGoalNameById={getGoalNameById}
          disabled={disabled}
        />
      ))}
    </div>
  );
} 