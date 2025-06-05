import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SectionProps {
  title: string;
  action?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  error?: string;
  emptyMessage?: string;
  children: ReactNode;
  hasItems?: boolean;
}

export function Section({
  title,
  action,
  actionLabel,
  onAction,
  error,
  emptyMessage,
  children,
  hasItems = true,
}: SectionProps) {
  const actionContent = action || (actionLabel && onAction ? (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onAction}
      className="flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      {actionLabel}
    </Button>
  ) : undefined);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {actionContent}
      </div>

      {error && (
        <div className="text-sm text-destructive mb-2">
          {error}
        </div>
      )}

      {!hasItems ? (
        <div className="text-center py-2 text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        children
      )}
    </div>
  );
} 