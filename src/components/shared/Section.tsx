import { cn } from '@/lib/utils';
import { LayoutGrid, TableIcon, Copy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SectionProps {
  title: string;
  children: ReactNode;
  error?: string;
  view?: 'card' | 'table';
  onViewChange?: (view: 'card' | 'table') => void;
  onCopy?: () => void;
  onAdd?: () => void;
  hasItems?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function Section({
  title,
  children,
  error,
  view,
  onViewChange,
  onCopy,
  onAdd,
  hasItems = true,
  emptyMessage,
  className
}: SectionProps) {
  const hasActions = onViewChange || onCopy || onAdd;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {error && (
            <p className="text-sm text-destructive mt-1">{error}</p>
          )}
        </div>
        {hasActions && (
          <div className="flex items-center gap-2">
            {onCopy && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCopy}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            )}
            {onAdd && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAdd}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            )}
            {onViewChange && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewChange(view === 'card' ? 'table' : 'card')}
                className="p-2"
              >
                {view === 'card' ? (
                  <TableIcon className="h-5 w-5" />
                ) : (
                  <LayoutGrid className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        )}
      </div>
      {!hasItems && emptyMessage ? (
        <div className="text-center py-8 text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        children
      )}
    </div>
  );
} 