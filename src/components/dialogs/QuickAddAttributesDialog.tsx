import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Add Attributes</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {goals.map(goal => (
            <div key={goal.id} className="space-y-2">
              <Label className="text-lg font-semibold">{goal.name}</Label>
              <Input
                placeholder="Type an attribute and press Enter"
                onKeyDown={(e) => handleKeyDown(goal.id, e)}
              />
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Attributes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 