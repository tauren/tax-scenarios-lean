// Utility to safely convert a string or Date to YYYY-MM-DD for input[type=date]
export function toDateInputValue(date: string | Date | undefined): string {
  if (!date) return '';
  if (typeof date === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const d = new Date(date);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    return '';
  }
  return date.toISOString().split('T')[0];
} 