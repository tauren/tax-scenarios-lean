import type { ReactNode } from 'react';

interface CardListProps {
  children: ReactNode;
  className?: string;
}

export function CardList({ children, className = '' }: CardListProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 ${className}`}>
      {children}
    </div>
  );
} 