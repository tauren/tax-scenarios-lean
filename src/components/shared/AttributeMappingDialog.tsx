import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ScenarioQualitativeAttribute, UserQualitativeGoal } from '@/types/qualitative';

interface AttributeMappingDialogProps {
  attribute: ScenarioQualitativeAttribute;
  goals: UserQualitativeGoal[];
  onMap: (attributeId: string, goalId: string) => void;
  onClose: () => void;
  open: boolean;
  initialGoalId?: string;
}

export const AttributeMappingDialog: React.FC<AttributeMappingDialogProps> = ({
  attribute,
  goals,
  onMap,
  onClose,
  open,
  initialGoalId,
}) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>(initialGoalId);

  useEffect(() => {
    setSelectedGoalId(initialGoalId);
  }, [initialGoalId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGoalId) {
      onMap(attribute.id, selectedGoalId);
      onClose();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg w-[480px] max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Map Attribute to Goal
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="goal" className="text-sm font-medium">
                Select a goal to map this attribute to
              </label>
              <select
                id="goal"
                value={selectedGoalId || ''}
                onChange={(e) => setSelectedGoalId(e.target.value || undefined)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              >
                <option value="">Select a goal...</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.name} ({goal.weight} Priority)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedGoalId}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-300 disabled:text-gray-500"
              >
                Map
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}; 