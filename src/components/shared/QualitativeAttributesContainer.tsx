import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QualitativeAttributeCard } from './QualitativeAttributeCard';
import { QualitativeAttributeDialog } from '@/components/dialogs/QualitativeAttributeDialog';
import { AttributeMappingDialog } from '@/components/shared/AttributeMappingDialog';
import { useUserAppState } from '@/store/userAppStateSlice';
import type { ScenarioQualitativeAttribute } from '@/types';
import type { WeightOption } from './WeightSelector';
import { QualitativeFitScoreDisplay } from './QualitativeFitScoreDisplay';
import { QualitativeAttributeInput } from './QualitativeAttributeInput';

interface QualitativeAttributesContainerProps {
  scenarioId: string;
  disabled?: boolean;
}

export function QualitativeAttributesContainer({
  scenarioId,
  disabled = false,
}: QualitativeAttributesContainerProps) {
  const { scenarios, userQualitativeGoals = [], updateScenarioAttribute, deleteScenarioAttribute } = useUserAppState();
  const scenario = scenarios.find(s => s.id === scenarioId);
  const attributes = scenario?.scenarioSpecificAttributes || [];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMappingDialogOpen, setIsMappingDialogOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<ScenarioQualitativeAttribute | null>(null);
  const [mappingAttribute, setMappingAttribute] = useState<ScenarioQualitativeAttribute | null>(null);

  // Calculate fit score
  const calculateFitScore = () => {
    if (!attributes.length) return 0;
    
    const mappedAttributes = attributes.filter(attr => attr.mappedGoalId);
    if (!mappedAttributes.length) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    mappedAttributes.forEach(attribute => {
      const goal = userQualitativeGoals.find(g => g.id === attribute.mappedGoalId);
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

    const rawScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    return Math.round(((rawScore + 1) / 2) * 100);
  };

  const fitScore = calculateFitScore();

  const handleOpenDialog = (attribute?: ScenarioQualitativeAttribute) => {
    setEditingAttribute(attribute || null);
    setIsDialogOpen(true);
  };

  const handleOpenMappingDialog = (attribute: ScenarioQualitativeAttribute) => {
    setMappingAttribute(attribute);
    setIsMappingDialogOpen(true);
  };

  const handleSaveAttribute = (attribute: ScenarioQualitativeAttribute) => {
    if (!scenario) return;

    const updatedAttribute = {
      ...attribute,
      scenarioId,
      sentiment: attribute.sentiment.charAt(0).toUpperCase() + attribute.sentiment.slice(1).toLowerCase() as "Positive" | "Negative" | "Neutral"
    };

    if (!editingAttribute) {
      // Adding new attribute
      updateScenarioAttribute(scenarioId, { ...updatedAttribute, id: crypto.randomUUID() });
    } else {
      // Updating existing attribute
      updateScenarioAttribute(scenarioId, updatedAttribute);
    }
  };

  const handleUpdateName = (attributeId: string, newName: string) => {
    if (!scenario || !newName.trim()) return;
    const attribute = attributes.find(attr => attr.id === attributeId);
    if (!attribute) return;

    updateScenarioAttribute(scenarioId, {
      ...attribute,
      text: newName.trim()
    });
  };

  const handleUpdateSentiment = (attributeId: string, sentiment: string) => {
    if (!scenario) return;
    const attribute = attributes.find(attr => attr.id === attributeId);
    if (!attribute) return;

    const formattedSentiment = sentiment.charAt(0).toUpperCase() + sentiment.slice(1).toLowerCase() as "Positive" | "Negative" | "Neutral";
    updateScenarioAttribute(scenarioId, {
      ...attribute,
      sentiment: formattedSentiment
    });
  };

  const handleUpdateSignificance = (attributeId: string, significance: WeightOption) => {
    if (!scenario) return;
    const attribute = attributes.find(attr => attr.id === attributeId);
    if (!attribute) return;

    updateScenarioAttribute(scenarioId, {
      ...attribute,
      significance
    });
  };

  const handleDeleteAttribute = (attributeId: string) => {
    if (!scenario) return;
    deleteScenarioAttribute(scenarioId, attributeId);
  };

  const handleDuplicateAttribute = (attribute: ScenarioQualitativeAttribute) => {
    const duplicatedAttribute = {
      ...attribute,
      id: crypto.randomUUID()
    };
    setEditingAttribute(duplicatedAttribute);
    setIsDialogOpen(true);
  };

  const handleMapToGoal = (attribute: ScenarioQualitativeAttribute) => {
    handleOpenMappingDialog(attribute);
  };

  const handleSaveMapping = (goalId: string) => {
    if (!scenario || !mappingAttribute) return;
    updateScenarioAttribute(scenarioId, {
      ...mappingAttribute,
      mappedGoalId: goalId
    });
  };

  const handleAddAttribute = (attribute: Omit<ScenarioQualitativeAttribute, 'id' | 'scenarioId'>) => {
    if (!scenario) return;
    updateScenarioAttribute(scenarioId, {
      ...attribute,
      id: crypto.randomUUID(),
      scenarioId
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Qualitative Attributes</h2>
        <Button onClick={() => handleOpenDialog()} disabled={disabled}>
          Add Attribute
        </Button>
      </div>

      <QualitativeFitScoreDisplay
        attributes={attributes}
        goals={userQualitativeGoals}
        score={fitScore}
      />

      <QualitativeAttributeInput
        onAdd={handleAddAttribute}
        disabled={disabled}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attributes.map((attribute) => (
          <QualitativeAttributeCard
            key={attribute.id}
            attribute={attribute}
            onEdit={handleOpenDialog}
            onDelete={handleDeleteAttribute}
            onUpdateName={handleUpdateName}
            onUpdateSentiment={handleUpdateSentiment}
            onUpdateSignificance={handleUpdateSignificance}
            onMapToGoal={handleMapToGoal}
            onDuplicate={handleDuplicateAttribute}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Add/Edit Attribute Dialog */}
      <QualitativeAttributeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        attribute={editingAttribute || undefined}
        onSave={handleSaveAttribute}
      />

      {/* Goal Mapping Dialog */}
      {mappingAttribute && (
        <AttributeMappingDialog
          open={isMappingDialogOpen}
          onClose={() => setIsMappingDialogOpen(false)}
          attribute={mappingAttribute}
          goals={userQualitativeGoals}
          onMap={(attributeId, goalId) => handleSaveMapping(goalId)}
          initialGoalId={mappingAttribute.mappedGoalId}
        />
      )}
    </div>
  );
} 