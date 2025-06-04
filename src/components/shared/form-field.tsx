import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  error?: string;
}

export function FormField({ id, label, children, error }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      <div className="min-h-[1.25rem] text-sm text-destructive">
        {error}
      </div>
    </div>
  );
} 