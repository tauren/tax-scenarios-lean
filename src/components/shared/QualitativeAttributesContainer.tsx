import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QualitativeAttributeCard } from './QualitativeAttributeCard';
import { QualitativeAttributeDialog } from '@/components/dialogs/QualitativeAttributeDialog';
import { AttributeMappingDialog } from '@/components/shared/AttributeMappingDialog';
import { useUserAppState } from '@/store/userAppStateSlice';
import type { ScenarioQualitativeAttribute } from '@/types';
import type { WeightOption } from './WeightSelector';
import { QualitativeFitScoreDisplay } from './QualitativeFitScoreDisplay';
import type { QualitativeGoalAlignment } from '@/types/qualitative';

interface QualitativeAttributesContainerProps {
  scenarioId: string;
  disabled?: boolean;
}

// Utility functions for normalization
function getSentimentValue(sentiment: string): number {
  switch (sentiment) {
    case 'Positive': return 1;
    case 'Negative': return -1;
    case 'Neutral':
    default: return 0;
  }
}
function getSignificanceValue(significance: string): number {
  switch (significance) {
    case 'Critical': return 1;
    case 'High': return 0.75;
    case 'Medium': return 0.5;
    case 'Low':
    default: return 0.25;
  }
}
function getWeightValue(weight: string): number {
  switch (weight) {
    case 'Critical': return 1;
    case 'High': return 0.75;
    case 'Medium': return 0.5;
    case 'Low':
    default: return 0.25;
  }
}

export function QualitativeAttributesContainer({
  scenarioId,
  disabled = false,
}: QualitativeAttributesContainerProps) {
  const { scenarios, userQualitativeGoals = [], updateScenarioAttribute, deleteScenarioAttribute } = useUserAppState();
  const scenario = scenarios.find(s => s.id === scenarioId);
  const attributes = scenario?.scenarioSpecificAttributes || [];

  // console.log(JSON.stringify(attributes, null, 2));
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

  // Calculate goal alignments
  const calculateGoalAlignments = (): QualitativeGoalAlignment[] => {
    const alignments = userQualitativeGoals.map(goal => {
      const goalAttributes = attributes.filter(attr => attr.mappedGoalId === goal.id);
      if (!goalAttributes.length) return null;

      let totalScore = 0;
      let totalWeight = 0;
      const contributingAttributes = goalAttributes.map(attr => {
        const sentimentScore = attr.sentiment === 'Positive' ? 1 :
          attr.sentiment === 'Negative' ? -1 : 0;

        const significanceScore = attr.significance === 'Critical' ? 1 :
          attr.significance === 'High' ? 0.75 :
          attr.significance === 'Medium' ? 0.5 : 0.25;

        const goalWeight = goal.weight === 'Critical' ? 1 :
          goal.weight === 'High' ? 0.75 :
          goal.weight === 'Medium' ? 0.5 : 0.25;

        const attributeScore = sentimentScore * significanceScore * goalWeight;
        totalScore += attributeScore;
        totalWeight += goalWeight;

        // Calculate totalRaw for normalization (sum of absolute values)
        const totalRaw = goalAttributes.reduce((sum, attr) => {
          const sentimentValue = getSentimentValue(attr.sentiment);
          const significanceValue = getSignificanceValue(attr.significance);
          const goalWeight = getWeightValue(goal.weight);
          const attributeScore = sentimentValue * significanceValue * goalWeight;
          return sum + Math.abs(attributeScore);
        }, 0);

        // Calculate maxPossiblePercent for this attribute (signed)
        const maxPossiblePercent = goalWeight > 0 ? (attributeScore / (goalWeight * 1 * 1)) * 100 : 0;

        return {
          attributeId: attr.id,
          contribution: totalRaw > 0 ? (attributeScore / totalRaw) * 100 : 0,
          maxPossiblePercent
        };
      });

      const rawScore = totalWeight > 0 ? totalScore / totalWeight : 0;
      const alignmentScore = ((rawScore + 1) / 2) * 100;

      return {
        goalId: goal.id,
        goalName: goal.name,
        alignmentScore,
        isAligned: alignmentScore >= 60,
        contributingAttributes
      };
    }).filter((alignment): alignment is QualitativeGoalAlignment => alignment !== null);

    return alignments;
  };

  const goalAlignments = calculateGoalAlignments();

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

  const handleMapToGoal = (attribute: ScenarioQualitativeAttribute) => {
    handleOpenMappingDialog(attribute);
  };

  const handleSaveMapping = (goalId: string | undefined) => {
    if (!scenario || !mappingAttribute) return;
    updateScenarioAttribute(scenarioId, {
      ...mappingAttribute,
      mappedGoalId: goalId
    });
  };

  const getGoalNameById = (goalId: string): string | undefined => {
    const goal = userQualitativeGoals.find(g => g.id === goalId);
    return goal?.name;
  };

  return (
    <div className="space-y-4">
      {/* 1. Qualitative Fit Score Row */}
      <QualitativeFitScoreDisplay
        attributes={attributes}
        goals={userQualitativeGoals}
        score={fitScore}
        goalAlignments={goalAlignments}
      />

      {/* 2. Qualitative Attributes Row */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Qualitative Attributes</h2>
        <Button onClick={() => handleOpenDialog()} disabled={disabled}>
          Add Attribute
        </Button>
      </div>

      {/* 3. Attribute Cards Grouped by Mapping */}
      {/* Unmapped Attributes Section */}
      {attributes.filter(attr => !attr.mappedGoalId).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold mt-4 mb-2">Unmapped Attributes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {attributes.filter(attr => !attr.mappedGoalId).map((attribute) => (
              <QualitativeAttributeCard
                key={attribute.id}
                attribute={attribute}
                onEdit={handleOpenDialog}
                onDelete={handleDeleteAttribute}
                onUpdateName={handleUpdateName}
                onUpdateSentiment={handleUpdateSentiment}
                onUpdateSignificance={handleUpdateSignificance}
                onMapToGoal={handleMapToGoal}
                getGoalNameById={getGoalNameById}
                goalAlignments={goalAlignments}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mapped Attributes Section */}
      {attributes.filter(attr => attr.mappedGoalId).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold mt-6 mb-2">Mapped Attributes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {attributes.filter(attr => attr.mappedGoalId).map((attribute) => (
              <QualitativeAttributeCard
                key={attribute.id}
                attribute={attribute}
                onEdit={handleOpenDialog}
                onDelete={handleDeleteAttribute}
                onUpdateName={handleUpdateName}
                onUpdateSentiment={handleUpdateSentiment}
                onUpdateSignificance={handleUpdateSignificance}
                onMapToGoal={handleMapToGoal}
                getGoalNameById={getGoalNameById}
                goalAlignments={goalAlignments}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Attribute Dialog */}
      <QualitativeAttributeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveAttribute}
        attribute={editingAttribute || undefined}
        mode={editingAttribute ? 'edit' : 'add'}
      />

      {/* Mapping Dialog */}
      {mappingAttribute && (
        <AttributeMappingDialog
          open={isMappingDialogOpen}
          onClose={() => setIsMappingDialogOpen(false)}
          attribute={mappingAttribute}
          goals={userQualitativeGoals}
          onMap={(_, goalId) => handleSaveMapping(goalId)}
          initialGoalId={mappingAttribute.mappedGoalId}
        />
      )}
    </div>
  );
} 