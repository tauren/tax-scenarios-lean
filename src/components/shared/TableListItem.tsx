import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Copy, Trash2 } from 'lucide-react';

interface TableListItemProps {
  data: Record<string, any>;
  columns: { key: string; label: string }[];
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export function TableListItem({ data, columns, onEdit, onDelete, onDuplicate }: TableListItemProps) {
  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      {columns.map((col) => (
        <td key={col.key} className="px-4 py-2 align-middle">
          {data[col.key]}
        </td>
      ))}
      <td className="px-2 py-2 align-middle whitespace-nowrap text-center">
        {onEdit && (
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        {onDuplicate && (
          <Button variant="ghost" size="icon" onClick={onDuplicate} aria-label="Duplicate">
            <Copy className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </td>
    </tr>
  );
} 