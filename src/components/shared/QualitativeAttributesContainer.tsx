import { useState } from 'react';
import type { ScenarioQualitativeAttribute, UserQualitativeGoal } from '@/types/qualitative';
import { useUserAppState } from '@/store/userAppStateSlice';
import { Section } from '@/components/shared/Section';
import { QualitativeAttributeList } from './QualitativeAttributeList';
import { QualitativeFitScoreDisplay } from './QualitativeFitScoreDisplay';
import { AttributeMappingDialog } from './AttributeMappingDialog';
import { QualitativeAttributeDialog } from '@/components/dialogs/QualitativeAttributeDialog';
import { QualitativeAttributeService } from '@/services/qualitativeAttributeService';
import { convertToQualitativeAttribute, convertToScenarioAttribute } from '@/types/qualitative';
import { v4 as uuidv4 } from 'uuid';

interface QualitativeAttributesContainerProps {
  scenarioId: string;
  disabled?: boolean;
}

export function QualitativeAttributesContainer({
  scenarioId,
  disabled = false,
}: QualitativeAttributesContainerProps) {
  const { scenarios, userQualitativeGoals = [], updateScenario } = useUserAppState();
  const scenario = scenarios.find(s => s.id === scenarioId);
  const attributes = (scenario?.scenarioSpecificAttributes || []).map(attr => 
    convertToQualitativeAttribute(attr, scenarioId)
  );
  const [isMappingDialogOpen, setIsMappingDialogOpen] = useState(false);
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<ScenarioQualitativeAttribute | undefined>();
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'duplicate'>('add');

  const handleAddAttribute = () => {
    setSelectedAttribute(undefined);
    setDialogMode('add');
    setIsAttributeDialogOpen(true);
  };

  const handleEditAttribute = (attribute: ScenarioQualitativeAttribute) => {
    setSelectedAttribute(attribute);
    setDialogMode('edit');
    setIsAttributeDialogOpen(true);
  };

  const handleDuplicateAttribute = (attribute: ScenarioQualitativeAttribute) => {
    setSelectedAttribute(attribute);
    setDialogMode('duplicate');
    setIsAttributeDialogOpen(true);
  };

  const handleDeleteAttribute = (attributeId: string) => {
    if (!scenario) return;
    const updatedAttributes = scenario.scenarioSpecificAttributes.filter(attr => attr.id !== attributeId);
    updateScenario(scenarioId, { scenarioSpecificAttributes: updatedAttributes });
  };

  const handleMapToGoal = (attribute: ScenarioQualitativeAttribute) => {
    setSelectedAttribute(attribute);
    setIsMappingDialogOpen(true);
  };

  const handleSaveAttribute = (attribute: ScenarioQualitativeAttribute) => {
    if (!scenario) return;
    
    let updatedAttributes;
    if (dialogMode === 'add' || dialogMode === 'duplicate') {
      const newAttribute = {
        ...attribute,
        scenarioId,
        id: dialogMode === 'duplicate' ? uuidv4() : attribute.id,
      };
      updatedAttributes = [...(scenario.scenarioSpecificAttributes || []), convertToScenarioAttribute(newAttribute)];
    } else {
      updatedAttributes = (scenario.scenarioSpecificAttributes || []).map(attr => 
        attr.id === attribute.id ? convertToScenarioAttribute({ ...attribute, scenarioId }) : attr
      );
    }
    
    updateScenario(scenarioId, { scenarioSpecificAttributes: updatedAttributes });
    setIsAttributeDialogOpen(false);
  };

  const handleMapGoal = (goalId: string) => {
    if (!scenario || !selectedAttribute) return;
    
    const updatedAttributes = scenario.scenarioSpecificAttributes.map(attr => 
      attr.id === selectedAttribute.id ? convertToScenarioAttribute({ ...selectedAttribute, mappedGoalId: goalId }) : attr
    );
    
    updateScenario(scenarioId, { scenarioSpecificAttributes: updatedAttributes });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsAttributeDialogOpen(open);
    if (!open) {
      setSelectedAttribute(undefined);
    }
  };

  const service = new QualitativeAttributeService(attributes);
  const fitScore = service.calculateFitScore(scenarioId, userQualitativeGoals);

  return (
    <div className="space-y-4">
      <Section
        title="Qualitative Attributes"
        onAdd={handleAddAttribute}
        hasItems={attributes.length > 0}
        emptyMessage="No attributes added yet"
      >
        <QualitativeAttributeList
          attributes={attributes}
          onEdit={handleEditAttribute}
          onDelete={handleDeleteAttribute}
          onMapToGoal={handleMapToGoal}
          onDuplicate={handleDuplicateAttribute}
          disabled={disabled}
        />

        <QualitativeFitScoreDisplay
          attributes={attributes}
          goals={userQualitativeGoals}
          score={fitScore}
        />
      </Section>

      {selectedAttribute && (
        <AttributeMappingDialog
          open={isMappingDialogOpen}
          onClose={() => setIsMappingDialogOpen(false)}
          attribute={selectedAttribute}
          goals={userQualitativeGoals}
          onMap={(attributeId, goalId) => handleMapGoal(goalId)}
          initialGoalId={selectedAttribute.mappedGoalId}
        />
      )}

      <QualitativeAttributeDialog
        open={isAttributeDialogOpen}
        onOpenChange={handleDialogOpenChange}
        attribute={selectedAttribute}
        mode={dialogMode}
        onSave={handleSaveAttribute}
      />
    </div>
  );
} 