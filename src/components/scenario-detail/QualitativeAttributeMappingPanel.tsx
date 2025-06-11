import React from 'react';
import { X } from 'lucide-react';
import type { UserQualitativeGoal, ScenarioQualitativeAttribute } from '@/types/qualitative';
import type { Scenario } from '@/types';
import { getImportanceIcon } from '@/components/icons/ImportanceLevelIcons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface QualitativeAttributeMappingPanelProps {
  scenario: Scenario;
  goals: UserQualitativeGoal[];
}

const QualitativeAttributeMappingPanel: React.FC<QualitativeAttributeMappingPanelProps> = ({ 
  scenario, 
  goals 
}) => {
  const attributes = scenario.scenarioSpecificAttributes || [];
  
  // Group attributes by sentiment and mapping status
  const pros = attributes.filter(attr => attr.sentiment === 'Positive');
  const cons = attributes.filter(attr => attr.sentiment === 'Negative');
  const neutral = attributes.filter(attr => attr.sentiment === 'Neutral');

  // Sort by significance first, then by mapping status within each significance level
  const sortAttributes = (a: ScenarioQualitativeAttribute, b: ScenarioQualitativeAttribute) => {
    // First sort by significance
    const significanceOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    const significanceDiff = significanceOrder[b.significance] - significanceOrder[a.significance];
    
    if (significanceDiff !== 0) {
      return significanceDiff;
    }
    
    // Then sort by mapping status within the same significance level
    if (a.mappedGoalId && !b.mappedGoalId) return -1;
    if (!a.mappedGoalId && b.mappedGoalId) return 1;
    
    return 0;
  };

  const sortedPros = [...pros].sort(sortAttributes);
  const sortedCons = [...cons].sort(sortAttributes);
  const sortedNeutral = [...neutral].sort(sortAttributes);

  const getSignificanceColor = (significance: ScenarioQualitativeAttribute['significance']) => {
    switch (significance) {
      case 'Critical':
        return 'text-red-600';
      case 'High':
        return 'text-green-600';
      case 'Medium':
        return 'text-blue-600';
      case 'Low':
        return 'text-gray-600';
    }
  };

  const renderAttributeCard = (attribute: ScenarioQualitativeAttribute) => {
    const mappedGoal = attribute.mappedGoalId 
      ? goals.find(g => g.id === attribute.mappedGoalId)
      : null;

    // Determine background color based on sentiment and mapping status
    const getBackgroundColor = () => {
      if (!mappedGoal) {
        return 'bg-gray-50';
      }
      return attribute.sentiment === 'Positive' 
        ? 'bg-green-50'
        : attribute.sentiment === 'Negative'
          ? 'bg-red-50'
          : 'bg-blue-50';
    };

    // Determine border color based on sentiment and mapping status
    const getBorderColor = () => {
      if (!mappedGoal) {
        return 'border-gray-200';
      }
      return attribute.sentiment === 'Positive' 
        ? 'border-green-200'
        : attribute.sentiment === 'Negative'
          ? 'border-red-200'
          : 'border-blue-200';
    };

    const ImportanceIcon = getImportanceIcon(attribute.significance);

    return (
      <div 
        key={attribute.id} 
        className={`p-4 rounded-lg border ${getBackgroundColor()} ${getBorderColor()} relative min-h-[80px] flex items-center`}
      >
        {/* Fixed position importance icon */}
        <div className="absolute left-3">
          <ImportanceIcon 
            className={`h-5 w-5 ${getSignificanceColor(attribute.significance)}`} 
            size={20}
          />
        </div>

        {/* Title with padding for the icon */}
        <div className="pl-8 pr-8 w-full">
          <div className="font-semibold text-sm text-left">
            {attribute.text}
          </div>
        </div>

        {/* Unlink icon for unmapped items */}
        {!mappedGoal && (
          <Popover>
            <PopoverTrigger asChild>
              <div className="absolute right-3 cursor-help">
                <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="h-3 w-3 text-red-600" />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Not Linked to Goal</h4>
                <p className="text-sm text-muted-foreground">
                  This pro/con isn't linked to any of your goals yet. Link it to a goal to track its impact on your priorities.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Popover for mapped goals */}
        {mappedGoal && (
          <Popover>
            <PopoverTrigger asChild>
              <div className="absolute right-3 cursor-help">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xs text-green-600">✓</span>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Linked to Goal</h4>
                <p className="text-sm text-muted-foreground">{mappedGoal.name}</p>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  };

  const renderSection = (title: string, attributes: ScenarioQualitativeAttribute[], color: string) => {
    if (attributes.length === 0) return null;

    return (
      <div>
        <h3 className={`text-sm font-medium ${color} mb-3`}>{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attributes.map(renderAttributeCard)}
        </div>
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-4 mb-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Pros & Cons</h2>
      </div>
      
      {attributes.length === 0 ? (
        <div className="text-muted-foreground">No pros or cons defined for this scenario.</div>
      ) : (
        <div className="space-y-6">
          {renderSection('Pros', sortedPros, 'text-green-600')}
          {renderSection('Cons', sortedCons, 'text-red-600')}
          {renderSection('Neutral', sortedNeutral, 'text-blue-600')}
        </div>
      )}
    </div>
  );
};

export default QualitativeAttributeMappingPanel; 