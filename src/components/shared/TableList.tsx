import React from 'react';

interface TableListProps {
  columns: { key: string; label: string }[];
  children: React.ReactNode;
}

export function TableList({ columns, children }: TableListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-border bg-background rounded-md">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 text-left font-semibold text-foreground border-b border-border bg-muted">
                {col.label}
              </th>
            ))}
            <th className="px-2 py-2 border-b border-border bg-muted text-center min-w-[72px] max-w-[96px] w-[80px]">Actions</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
} 