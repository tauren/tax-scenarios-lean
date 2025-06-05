import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ListItemCardProps {
  title: string;
  lines: ReactNode[]; // Each line is a separate element
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function ListItemCard({
  title,
  lines,
  onEdit,
  onDelete,
  onDuplicate,
}: ListItemCardProps) {
  return (
    <Card
      className="relative py-0 cursor-pointer hover:ring-2 hover:ring-primary/40 transition-shadow"
      onClick={onEdit}
      tabIndex={0}
      role="button"
      aria-label={`Edit ${title}`}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-medium mb-1">{title}</div>
            {lines.map((line, idx) => (
              <div key={idx} className={idx === 0 ? 'text-sm text-foreground' : 'text-sm text-muted-foreground'}>
                {line}
              </div>
            ))}
          </div>
          <div className="ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1 rounded-full hover:bg-muted focus:outline-none"
                  onClick={e => e.stopPropagation()}
                  aria-label="More actions"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                <DropdownMenuItem onClick={onDuplicate}>Duplicate</DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 