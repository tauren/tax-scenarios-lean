import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FormField } from '@/components/shared/FormField';
import type { UserQualitativeGoal } from '@/types';

interface QuickAddAttributesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (attributes: { goalId: string; description: string }[]) => void;
  goals: UserQualitativeGoal[];
}

export function QuickAddAttributesDialog({
  open,
  onOpenChange,
  onSave,
  goals
}: QuickAddAttributesDialogProps) {
  const [goalAttributes, setGoalAttributes] = useState<{ [key: string]: string[] }>({});

  const handleKeyDown = (goalId: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newAttribute = e.currentTarget.value.trim();
      setGoalAttributes(prev => ({
        ...prev,
        [goalId]: [...(prev[goalId] || []), newAttribute]
      }));
      e.currentTarget.value = '';
    }
  };

  const removeAttribute = (goalId: string, index: number) => {
    setGoalAttributes(prev => ({
      ...prev,
      [goalId]: prev[goalId].filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    const attributes = Object.entries(goalAttributes).flatMap(([goalId, descriptions]) =>
      descriptions.map(description => ({ goalId, description }))
    );
    onSave(attributes);
    setGoalAttributes({});
    onOpenChange(false);
  };

  const hasAttributes = Object.values(goalAttributes).some(descriptions => descriptions.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Impressions for this Location</DialogTitle>
          <DialogDescription>
            For each priority listed, describe something notable about this location and how it affects your decision. Press enter to add multiple impressions for each priority. For example: "Low cost of living", "Great healthcare system", or "Limited English proficiency".
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(80vh-8rem)] -mx-6">
          <div className="space-y-6 px-6">
            {goals.map(goal => (
              <div key={goal.id} className="space-y-2">
                <FormField
                  id={`goal-${goal.id}`}
                  label={goal.name}
                  hideError
                >
                  <Input
                    placeholder="Type an impression and press Enter"
                    onKeyDown={(e) => handleKeyDown(goal.id, e)}
                  />
                </FormField>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(goalAttributes[goal.id] || []).map((attribute, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {attribute}
                      <button
                        onClick={() => removeAttribute(goal.id, index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasAttributes}>
            Save Impressions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 