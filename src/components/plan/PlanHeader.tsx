import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';

interface PlanHeaderProps {
  planName: string;
  onPlanNameChange: (newName: string) => void;
}

export function PlanHeader({ planName, onPlanNameChange }: PlanHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(planName);

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      onPlanNameChange(nameInput.trim());
    } else {
      setNameInput(planName);
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setNameInput(planName);
      setIsEditingName(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {isEditingName ? (
        <Input
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onBlur={handleNameSubmit}
          onKeyDown={handleKeyDown}
          className="text-2xl font-bold"
          autoFocus
        />
      ) : (
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{planName}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditingName(true)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 