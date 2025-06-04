import { Button } from '@/components/ui/button';
import { Pencil, Copy, Trash2 } from 'lucide-react';

interface CardActionsProps {
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  className?: string;
}

export function CardActions({ onEdit, onDuplicate, onDelete, className = '' }: CardActionsProps) {
  const handleClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button variant="ghost" size="icon" onClick={(e) => handleClick(e, onEdit)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={(e) => handleClick(e, onDuplicate)}>
        <Copy className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={(e) => handleClick(e, onDelete)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
} 