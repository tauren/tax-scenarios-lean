import React from 'react';
import type { ScenarioQualitativeAttribute } from '@/types/qualitative';
import { QualitativeAttributeCard } from './QualitativeAttributeCard';

interface QualitativeAttributeListProps {
  attributes: ScenarioQualitativeAttribute[];
  onDelete: (id: string) => void;
  onMapToGoal: (attribute: ScenarioQualitativeAttribute) => void;
  onEdit: (attribute: ScenarioQualitativeAttribute) => void;
  onUpdate: (attribute: ScenarioQualitativeAttribute) => void;
  onDuplicate: (attribute: ScenarioQualitativeAttribute) => void;
  disabled?: boolean;
}

export function QualitativeAttributeList({
  attributes,
  onDelete,
  onMapToGoal,
  onEdit,
  onUpdate,
  onDuplicate,
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
          onUpdate={onUpdate}
          onDuplicate={onDuplicate}
          disabled={disabled}
        />
      ))}
    </div>
  );
} 