import { Button } from '@/components/ui/button';
import { LayoutGrid, Table as TableIcon, Plus } from 'lucide-react';

export function SectionHeaderWithToggle({
  view,
  setView,
  onAdd,
  addLabel,
}: {
  view: 'card' | 'table';
  setView: (v: 'card' | 'table') => void;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={`p-2 rounded ${view === 'card' ? 'bg-muted text-primary' : 'hover:bg-muted'}`}
        onClick={() => setView('card')}
        aria-label="Card view"
        tabIndex={0}
      >
        <LayoutGrid className="h-5 w-5" />
      </button>
      <button
        type="button"
        className={`p-2 rounded ${view === 'table' ? 'bg-muted text-primary' : 'hover:bg-muted'}`}
        onClick={() => setView('table')}
        aria-label="Table view"
        tabIndex={0}
      >
        <TableIcon className="h-5 w-5" />
      </button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="flex items-center gap-2 ml-2"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </Button>
    </div>
  );
} 