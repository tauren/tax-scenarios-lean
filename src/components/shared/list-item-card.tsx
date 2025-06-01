import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CardActions } from './card-actions';

interface ListItemCardProps {
  title: string;
  subtitle: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function ListItemCard({
  title,
  subtitle,
  onEdit,
  onDelete,
  onDuplicate,
}: ListItemCardProps) {
  return (
    <Card 
      className="relative py-0 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={(e) => {
        // Only trigger edit if the click wasn't on the action buttons
        if (!(e.target as HTMLElement).closest('.card-actions')) {
          onEdit();
        }
      }}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-sm text-muted-foreground">
              {subtitle}
            </div>
          </div>
          <div className="card-actions">
            <CardActions
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 