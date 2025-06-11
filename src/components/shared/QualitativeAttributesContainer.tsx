import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QualitativeAttributeCard } from './QualitativeAttributeCard';
import { QualitativeAttributeDialog } from '@/components/dialogs/QualitativeAttributeDialog';
import { AttributeMappingDialog } from '@/components/shared/AttributeMappingDialog';
import { useUserAppState } from '@/store/userAppStateSlice';
import type { ScenarioQualitativeAttribute } from '@/types/qualitative';
import type { WeightOption } from './WeightSelector';
import { QualitativeFitScoreDisplay } from './QualitativeFitScoreDisplay';
import { QualitativeAttributeService } from '@/services/qualitativeAttributeService';

interface QualitativeAttributesContainerProps {
  scenarioId: string;
  disabled?: boolean;
  onQuickAdd?: () => void;
}

export function QualitativeAttributesContainer({
  scenarioId,
  disabled = false,
  onQuickAdd,
}: QualitativeAttributesContainerProps) {
  const { scenarios, userQualitativeGoals = [], updateScenarioAttribute, deleteScenarioAttribute } = useUserAppState();
  const scenario = scenarios.find(s => s.id === scenarioId);
  const attributes = scenario?.scenarioSpecificAttributes || [];

  // console.log(JSON.stringify(attributes, null, 2));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMappingDialogOpen, setIsMappingDialogOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<ScenarioQualitativeAttribute | null>(null);
  const [mappingAttribute, setMappingAttribute] = useState<ScenarioQualitativeAttribute | null>(null);

  // Create service instance with current attributes
  const attributeService = new QualitativeAttributeService(attributes);

  // Use service for fit score and alignments
  const { score: fitScore, goalAlignments } = scenario && userQualitativeGoals.length > 0
    ? attributeService.calculateQualitativeFitScore(scenario, userQualitativeGoals)
    : { score: 0, goalAlignments: [] };

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
      name: newName.trim()
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
        <h2 className="text-lg font-semibold">Location Considerations</h2>
        <div className="flex gap-2">
          {onQuickAdd && (
            <Button onClick={onQuickAdd} variant="outline" disabled={disabled}>
              Quick Add
            </Button>
          )}
          <Button onClick={() => handleOpenDialog()} disabled={disabled}>
            Add Consideration
          </Button>
        </div>
      </div>

      {/* 3. Attribute Cards Grouped by Sentiment */}
      {/* Pros Section */}
      {attributes.filter(attr => attr.sentiment === 'Positive').length > 0 && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold mt-4 mb-2">Pros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {attributes
              .filter(attr => attr.sentiment === 'Positive')
              .sort((a, b) => {
                // First sort by significance (Critical > High > Medium > Low)
                const significanceOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
                const significanceDiff = significanceOrder[a.significance] - significanceOrder[b.significance];
                if (significanceDiff !== 0) return significanceDiff;
                
                // Then sort by mapping status (mapped first)
                if (a.mappedGoalId && !b.mappedGoalId) return -1;
                if (!a.mappedGoalId && b.mappedGoalId) return 1;
                
                return 0;
              })
              .map((attribute) => (
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

      {/* Cons Section */}
      {attributes.filter(attr => attr.sentiment === 'Negative').length > 0 && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold mt-6 mb-2">Cons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {attributes
              .filter(attr => attr.sentiment === 'Negative')
              .sort((a, b) => {
                // First sort by significance (Critical > High > Medium > Low)
                const significanceOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
                const significanceDiff = significanceOrder[a.significance] - significanceOrder[b.significance];
                if (significanceDiff !== 0) return significanceDiff;
                
                // Then sort by mapping status (mapped first)
                if (a.mappedGoalId && !b.mappedGoalId) return -1;
                if (!a.mappedGoalId && b.mappedGoalId) return 1;
                
                return 0;
              })
              .map((attribute) => (
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

      {/* Neutral Section */}
      {attributes.filter(attr => attr.sentiment === 'Neutral').length > 0 && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold mt-6 mb-2">Neutral</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {attributes
              .filter(attr => attr.sentiment === 'Neutral')
              .sort((a, b) => {
                // First sort by significance (Critical > High > Medium > Low)
                const significanceOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
                const significanceDiff = significanceOrder[a.significance] - significanceOrder[b.significance];
                if (significanceDiff !== 0) return significanceDiff;
                
                // Then sort by mapping status (mapped first)
                if (a.mappedGoalId && !b.mappedGoalId) return -1;
                if (!a.mappedGoalId && b.mappedGoalId) return 1;
                
                return 0;
              })
              .map((attribute) => (
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

      {/* Dialogs */}
      <QualitativeAttributeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        attribute={editingAttribute || undefined}
        onSave={handleSaveAttribute}
      />

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