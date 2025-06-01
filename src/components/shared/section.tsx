import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Section({ title, action, children, className = '' }: SectionProps) {
  return (
    <div className={`space-y-4 mt-8 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
} 