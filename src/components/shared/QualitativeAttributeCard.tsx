import { useState } from 'react';
import { Pencil, Trash2, MapPin, Copy } from 'lucide-react';
import type { ScenarioQualitativeAttribute } from '@/types/qualitative';
import { Textarea } from '@/components/ui/textarea';
import { SentimentSelector, type SentimentOption } from './SentimentSelector';
import { WeightSelector, type WeightOption } from './WeightSelector';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface QualitativeAttributeCardProps {
  attribute: ScenarioQualitativeAttribute;
  onDelete: (id: string) => void;
  onMapToGoal: (attribute: ScenarioQualitativeAttribute) => void;
  onEdit: (attribute: ScenarioQualitativeAttribute) => void;
  onUpdate: (attribute: ScenarioQualitativeAttribute) => void;
  onDuplicate: (attribute: ScenarioQualitativeAttribute) => void;
  disabled?: boolean;
}

export function QualitativeAttributeCard({
  attribute,
  onDelete,
  onMapToGoal,
  onEdit,
  onUpdate,
  onDuplicate,
  disabled = false,
}: QualitativeAttributeCardProps) {
  const [editingName, setEditingName] = useState(attribute.text);

  const handleUpdateName = (newName: string) => {
    setEditingName(newName);
  };

  const handleSaveName = () => {
    if (editingName.trim()) {
      onUpdate({
        ...attribute,
        text: editingName.trim(),
      });
    }
  };

  const handleUpdateSentiment = (sentiment: SentimentOption) => {
    onUpdate({
      ...attribute,
      sentiment,
    });
  };

  const handleUpdateSignificance = (significance: WeightOption) => {
    onUpdate({
      ...attribute,
      significance,
    });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(attribute);
  };

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate(attribute);
  };

  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMapToGoal(attribute);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(attribute.id);
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col h-full">
      {/* Name + pencil + actions at the top */}
      <div className="flex items-start justify-between gap-4">
        <div className="cursor-pointer group/name flex-1 min-w-0">
          <Popover>
            <PopoverTrigger asChild>
              <span>
                <h3 className="font-semibold break-words">
                  {attribute.text}
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover/name:opacity-100 transition-opacity inline-block align-text-bottom ml-1 whitespace-nowrap" />
                </h3>
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-[500px]" align="start">
              <div className="space-y-4">
                <h4 className="font-medium">Edit Attribute Name</h4>
                <Textarea
                  value={editingName}
                  onChange={(e) => handleUpdateName(e.target.value)}
                  className="w-full min-h-[100px] resize-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Tab') {
                      e.preventDefault();
                      handleSaveName();
                      const popoverTrigger = document.querySelector('[data-state="open"]');
                      if (popoverTrigger) {
                        (popoverTrigger as HTMLElement).click();
                      }
                    }
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleEditClick}
            disabled={disabled}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDuplicateClick}
            disabled={disabled}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleMapClick}
            disabled={disabled}
          >
            <MapPin className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={handleDeleteClick}
            disabled={disabled}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Flexible spacer */}
      <div className="flex-1" />

      {/* Bottom group: sentiment + significance selectors */}
      <div>
        <div className="mb-2 mt-2">
          <SentimentSelector
            value={attribute.sentiment}
            onChange={handleUpdateSentiment}
            className="mt-0"
          />
        </div>
        <div className="mb-2">
          <WeightSelector
            value={attribute.significance}
            onChange={handleUpdateSignificance}
            className="mt-0"
          />
        </div>
        {attribute.mappedGoalId && (
          <div className="mt-2">
            <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              Mapped to Goal
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 