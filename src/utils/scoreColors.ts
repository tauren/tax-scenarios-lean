// Shared color and badge logic for qualitative fit scores

export function getScoreColor(score: number): string {
  if (score >= 70) return 'text-green-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-red-600';
}

export function getBadgeStyle(score: number): { label: string; className: string } {
  if (score >= 70) return {
    label: 'Aligned',
    className: 'bg-green-100 text-green-800 whitespace-nowrap px-3'
  };
  if (score >= 40) return {
    label: 'Neutral',
    className: 'bg-amber-100 text-amber-800 whitespace-nowrap px-3'
  };
  return {
    label: 'Not Aligned',
    className: 'bg-red-100 text-red-800 whitespace-nowrap px-3'
  };
} 