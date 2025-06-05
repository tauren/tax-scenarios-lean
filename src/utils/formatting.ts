export function formatAssetType(type: string | undefined): string {
  if (!type) return '-';
  
  const typeMap: Record<string, string> = {
    'stock': 'Stock',
    'crypto': 'Cryptocurrency',
    'real-estate': 'Real Estate',
    'other': 'Other'
  };
  
  return typeMap[type] || type;
}

export function formatDate(date: Date | string | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!(d instanceof Date) || isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
} 