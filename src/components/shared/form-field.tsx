import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children?: ReactNode;
  className?: string;
}

export function FormField({ id, label, error, children, className = '' }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 