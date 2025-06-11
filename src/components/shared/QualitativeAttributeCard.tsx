import { Pencil, Trash2, ArrowRight } from 'lucide-react';
import type { ScenarioQualitativeAttribute } from '@/types/qualitative';
import { SentimentSelector, type SentimentOption } from './SentimentSelector';
import { WeightSelector, type WeightOption } from './WeightSelector';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import React from 'react';
import { getScoreColor, getBadgeStyle } from '@/utils/scoreColors';
import type { QualitativeGoalAlignment } from '@/types/qualitative';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface QualitativeAttributeCardProps {
  attribute: ScenarioQualitativeAttribute;
  onEdit: (attribute: ScenarioQualitativeAttribute) => void;
  onDelete: (id: string) => void;
  onUpdateName: (attributeId: string, newName: string) => void;
  onUpdateSentiment: (attributeId: string, sentiment: SentimentOption) => void;
  onUpdateSignificance: (attributeId: string, significance: WeightOption) => void;
  onMapToGoal: (attribute: ScenarioQualitativeAttribute) => void;
  getGoalNameById: (goalId: string) => string | undefined;
  goalAlignments: QualitativeGoalAlignment[];
  disabled?: boolean;
}

export function QualitativeAttributeCard({
  attribute,
  onEdit,
  onDelete,
  onUpdateName,
  onUpdateSentiment,
  onUpdateSignificance,
  onMapToGoal,
  getGoalNameById,
  goalAlignments,
  disabled = false,
}: QualitativeAttributeCardProps) {
  const [editValue, setEditValue] = useState(attribute.name);
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    setEditValue(attribute.name);
  }, [attribute.name]);

  const commitEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed !== attribute.name) {
      onUpdateName(attribute.id, trimmed);
    }
    setEditValue(trimmed);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
  };

  // Compute contribution, color, badge
  let contribution: number | undefined = undefined;
  let contributionColor: string | undefined = undefined;
  let contributionBadge: { label: string; className: string } | undefined = undefined;
  let maxPossiblePercent: number | undefined = undefined;
  if (attribute.mappedGoalId) {
    const alignment = goalAlignments.find(a => a.goalId === attribute.mappedGoalId);
    const contrib = alignment?.contributingAttributes.find(ca => ca.attributeId === attribute.id);
    if (contrib) {
      contribution = contrib.contribution;
      contributionColor = getScoreColor(contribution);
      contributionBadge = getBadgeStyle(contribution);
      maxPossiblePercent = contrib.maxPossiblePercent;
    }
  }

  return (
    <div className="flex flex-col">
      {/* Main card with border, all corners rounded */}
      <div className={`border border-gray-300 rounded-lg p-4 flex flex-col ${
        !attribute.mappedGoalId ? 'bg-gray-50' :
        attribute.sentiment === 'Positive' ? 'bg-green-50' :
        attribute.sentiment === 'Negative' ? 'bg-red-50' :
        'bg-blue-50'
      }`}>
        {/* First row: title + buttons, fixed min height for alignment */}
        <div className="flex items-start justify-between gap-4 min-h-[3.5rem]">
          <div
            className={`flex items-center justify-between w-full rounded px-3 py-1 cursor-pointer transition-colors duration-150 group/title ${
              isEditing
                ? 'border border-gray-300 bg-white'
                : 'border border-transparent bg-transparent hover:border-gray-300 hover:bg-white focus:border-gray-300 focus:bg-white'
            }`}
            style={{ minHeight: '3.5rem' }}
            tabIndex={0}
            onClick={() => !isEditing && setIsEditing(true)}
          >
            {isEditing ? (
              <input
                type="text"
                className="font-semibold break-words overflow-hidden text-ellipsis line-clamp-2 mb-0.5 w-full bg-transparent border-none outline-none"
                value={editValue}
                autoFocus
                onChange={handleInputChange}
                onBlur={() => {
                  commitEdit();
                  setIsEditing(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    commitEdit();
                    setIsEditing(false);
                  }
                }}
                maxLength={100}
              />
            ) : (
              <span className="font-semibold break-words overflow-hidden text-ellipsis line-clamp-2 mb-0.5">
                {attribute.name}
              </span>
            )}
            <Pencil className={`h-4 w-4 text-muted-foreground ml-2 transition-opacity ${isEditing ? 'opacity-100' : 'opacity-0 group-hover/title:opacity-100 group-focus/title:opacity-100'}`} />
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(attribute)}
              disabled={disabled}
              title="Edit attribute"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(attribute.id)}
              disabled={disabled}
              title="Delete attribute"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Selectors */}
        <div className="mt-2">
          <div className="mb-2">
            <SentimentSelector
              value={attribute.sentiment}
              onChange={(sentiment) => onUpdateSentiment(attribute.id, sentiment)}
              className="mt-0"
              labels={{
                Positive: 'Pro',
                Negative: 'Con',
                Neutral: 'Neutral'
              }}
            />
          </div>
          <div className="mb-2">
            <WeightSelector
              value={attribute.significance}
              onChange={(significance) => onUpdateSignificance(attribute.id, significance)}
              className="mt-0"
            />
          </div>
        </div>
      </div>
      {/* Flag area: sibling, no border, only bottom radius, visually attached to card, indented to match card padding */}
      <div
        className={`relative -mt-px mx-4 rounded-b-lg px-3 py-2 cursor-pointer flex flex-col items-start transition-colors
          ${attribute.mappedGoalId && contributionBadge
            ? contributionBadge.className.replace('text-', 'bg-').replace('bg-red-800', 'bg-red-100').replace('bg-green-800', 'bg-green-100').replace('bg-amber-800', 'bg-amber-100') + ' hover:bg-opacity-90'
            : 'bg-red-700 text-red-100 font-semibold'}
        `}
        onClick={() => onMapToGoal(attribute)}
        data-testid="goal-flag"
        style={{ minHeight: '2.5rem', maxWidth: '100%' }}
        tabIndex={0}
      >
        {attribute.mappedGoalId ? (
          <>
            <span className="block w-full break-words whitespace-normal font-medium">
              {(() => {
                const goalName = getGoalNameById(attribute.mappedGoalId);
                return goalName ? `Goal: ${goalName}` : 'Mapped to Goal';
              })()}
            </span>
            <div className="flex flex-row items-center gap-2 mt-1 w-full">
              {/* TODO: This value is not very useful and should remove it, but need to remove business logic also. */}
              {/* {typeof contribution === 'number' && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={`font-semibold ${contributionColor ?? ''} cursor-help`}>
                        <div className="text-sm text-muted-foreground">
                          {contribution > 0 ? '+' : ''}{contribution}%
                        </div>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm text-muted-foreground">
                        This attribute contributed {contribution > 0 ? '+' : ''}{contribution}% of the total contribution for this goal.
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )} */}
              {typeof maxPossiblePercent === 'number' && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={`font-semibold text-blue-700 cursor-help`}>
                        <div className="text-sm text-muted-foreground">
                          {maxPossiblePercent > 0 ? '+' : ''}{maxPossiblePercent}%
                        </div>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm text-muted-foreground">
                        This attribute contributed {maxPossiblePercent > 0 ? '+' : ''}{maxPossiblePercent}% of the maximum possible alignment for this goal.
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {/* Spacer to push badge right */}
              <span className="flex-1" />
              {contributionBadge && (
                <span className={`absolute right-3 bottom-2 rounded-full py-0.5 px-2 text-xs font-medium border border-white/30 bg-white/30`}>{contributionBadge.label}</span>
              )}
            </div>
          </>
        ) : (
          <span className="block w-full break-words font-semibold relative">
            Map a goal now
            <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80 dark:text-white/80 opacity-80" />
          </span>
        )}
      </div>
    </div>
  );
} 