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