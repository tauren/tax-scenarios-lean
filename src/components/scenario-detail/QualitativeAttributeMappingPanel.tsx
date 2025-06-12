import React, { useState } from 'react';
import { X, LayoutGrid, Table, ThumbsUp, ThumbsDown, CircleDashed } from 'lucide-react';
import type { UserQualitativeGoal, ScenarioQualitativeAttribute } from '@/types/qualitative';
import type { Scenario } from '@/types';
import { getImportanceIcon } from '@/components/icons/ImportanceLevelIcons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface QualitativeAttributeMappingPanelProps {
  scenario: Scenario;
  goals: UserQualitativeGoal[];
}

// Card View Component
const CardView: React.FC<{
  attributes: ScenarioQualitativeAttribute[];
  goals: UserQualitativeGoal[];
}> = ({ attributes, goals }) => {
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

    const getBackgroundColor = () => {
      return attribute.sentiment === 'Positive' 
        ? 'bg-green-50'
        : attribute.sentiment === 'Negative'
          ? 'bg-red-50'
          : 'bg-blue-50';
    };

    const getBorderColor = () => {
      if (!mappedGoal) {
        return 'border-t-2 border-b-2 border-red-300';
      }
      return 'border border-gray-200';
    };

    const ImportanceIcon = getImportanceIcon(attribute.significance);

    return (
      <div 
        key={attribute.id} 
        className={`p-4 rounded-lg ${getBackgroundColor()} ${getBorderColor()} relative min-h-[80px] flex items-center`}
      >
        <div className="absolute left-3">
          <ImportanceIcon 
            className={`h-5 w-5 ${getSignificanceColor(attribute.significance)}`} 
            size={20}
          />
        </div>

        <div className="pl-8 pr-8 w-full">
          <div className="font-semibold text-sm text-left">
            {attribute.name}
          </div>
        </div>

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
                <h4 className="font-medium text-sm">Unlinked</h4>
                <p className="text-sm text-muted-foreground">
                  Link this impression to one of your priorities to see how it affects your Lifestyle Fit.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        )}

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
                <h4 className="font-medium text-sm">Linked:</h4>
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

  // Group and sort attributes
  const pros = attributes.filter(attr => attr.sentiment === 'Positive');
  const cons = attributes.filter(attr => attr.sentiment === 'Negative');
  const neutral = attributes.filter(attr => attr.sentiment === 'Neutral');

  const sortAttributes = (a: ScenarioQualitativeAttribute, b: ScenarioQualitativeAttribute) => {
    const significanceOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    const significanceDiff = significanceOrder[b.significance] - significanceOrder[a.significance];
    
    if (significanceDiff !== 0) {
      return significanceDiff;
    }
    
    if (a.mappedGoalId && !b.mappedGoalId) return -1;
    if (!a.mappedGoalId && b.mappedGoalId) return 1;
    
    return 0;
  };

  const sortedPros = [...pros].sort(sortAttributes);
  const sortedCons = [...cons].sort(sortAttributes);
  const sortedNeutral = [...neutral].sort(sortAttributes);

  return (
    <div className="space-y-6">
      {renderSection('Pros', sortedPros, 'text-green-600')}
      {renderSection('Cons', sortedCons, 'text-red-600')}
      {renderSection('Neutral', sortedNeutral, 'text-blue-600')}
    </div>
  );
};

// Table View Component
const TableView: React.FC<{
  attributes: ScenarioQualitativeAttribute[];
  goals: UserQualitativeGoal[];
}> = ({ attributes, goals }) => {
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

  // Sort all attributes by sentiment, significance, and mapping status
  const sortedAttributes = [...attributes].sort((a, b) => {
    // First by sentiment (Positive > Negative > Neutral)
    const sentimentOrder = { 'Positive': 0, 'Negative': 1, 'Neutral': 2 };
    const sentimentDiff = sentimentOrder[a.sentiment] - sentimentOrder[b.sentiment];
    if (sentimentDiff !== 0) return sentimentDiff;

    // Then by significance
    const significanceOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
    const significanceDiff = significanceOrder[a.significance] - significanceOrder[b.significance];
    if (significanceDiff !== 0) return significanceDiff;

    // Finally by mapping status
    if (a.mappedGoalId && !b.mappedGoalId) return -1;
    if (!a.mappedGoalId && b.mappedGoalId) return 1;

    return 0;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left py-2 px-4">Type</th>
            <th className="text-left py-2 px-4">Importance</th>
            <th className="text-left py-2 px-4">Impression</th>
            <th className="text-center py-2 px-4">Linked</th>
          </tr>
        </thead>
        <tbody>
          {sortedAttributes.map((attribute) => {
            const ImportanceIcon = getImportanceIcon(attribute.significance);
            const mappedGoal = attribute.mappedGoalId 
              ? goals.find(g => g.id === attribute.mappedGoalId)
              : null;

            const getBackgroundColor = () => {
              return attribute.sentiment === 'Positive' 
                ? 'bg-green-50'
                : attribute.sentiment === 'Negative'
                  ? 'bg-red-50'
                  : 'bg-blue-50';
            };

            const getBorderColor = () => {
              if (!mappedGoal) {
                return 'border-l-4 border-r-4 border-l-red-400 border-r-red-400';
              }
              return '';
            };

            const getSentimentColor = () => {
              return attribute.sentiment === 'Positive' 
                ? 'text-green-700'
                : attribute.sentiment === 'Negative'
                  ? 'text-red-700'
                  : 'text-blue-700';
            };

            const getSentimentIcon = () => {
              switch (attribute.sentiment) {
                case 'Positive':
                  return <ThumbsUp className="h-4 w-4" />;
                case 'Negative':
                  return <ThumbsDown className="h-4 w-4" />;
                case 'Neutral':
                  return <CircleDashed className="h-4 w-4" />;
              }
            };

            return (
              <tr 
                key={attribute.id} 
                className={`${getBackgroundColor()} ${getBorderColor()}`}
              >
                <td className="py-2 px-4">
                  <div className={`flex items-center ${getSentimentColor()}`}>
                    {getSentimentIcon()}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className="flex items-center">
                    <ImportanceIcon 
                      className={`h-5 w-5 ${getSignificanceColor(attribute.significance)}`} 
                      size={20}
                    />
                  </div>
                </td>
                <td className="py-2 px-4 font-medium">
                  {attribute.name}
                </td>
                <td className="py-2 px-4 text-center">
                  {mappedGoal ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="inline-flex cursor-help">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-xs text-green-600">✓</span>
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Linked to:</h4>
                          <p className="text-sm text-muted-foreground">{mappedGoal.name}</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="inline-flex cursor-help">
                          <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                            <X className="h-3 w-3 text-red-600" />
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Unlinked</h4>
                          <p className="text-sm text-muted-foreground">
                            Link this impression to one of your priorities to see how it affects your Lifestyle Fit.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const QualitativeAttributeMappingPanel: React.FC<QualitativeAttributeMappingPanelProps> = ({ 
  scenario, 
  goals 
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const attributes = scenario.scenarioSpecificAttributes || [];

  return (
    <div className="border rounded-lg p-4 mb-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">My Impressions of this Location</h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('cards')}
            title="Card View"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            <Table className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {attributes.length === 0 ? (
        <div className="text-muted-foreground">No impressions recorded yet. Add one to get started!</div>
      ) : viewMode === 'cards' ? (
        <CardView attributes={attributes} goals={goals} />
      ) : (
        <TableView attributes={attributes} goals={goals} />
      )}
    </div>
  );
};

export default QualitativeAttributeMappingPanel; 