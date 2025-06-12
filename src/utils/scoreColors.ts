// Shared color and badge logic for lifestyle fit

export function getScoreColor(score: number): string {
  if (score < 0) return 'text-red-600';
  if (score === 0 || score === 25) return 'text-amber-600';
  if (score >= 50) return 'text-green-600';
  return 'text-amber-600';
}

export function getBadgeStyle(score: number): { label: string; className: string } {
  if (score < 0) return {
    label: 'Not Aligned',
    className: 'bg-red-100 text-red-800'
  };
  if (score === 0 || score === 25) return {
    label: 'Neutral',
    className: 'bg-amber-100 text-amber-800'
  };
  if (score >= 50) return {
    label: 'Aligned',
    className: 'bg-green-100 text-green-800'
  };
  return {
    label: 'Neutral',
    className: 'bg-amber-100 text-amber-800'
  };
} 