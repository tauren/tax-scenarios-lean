import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

const ImportanceIconBase: React.FC<IconProps & { activeLevels: number }> = ({ 
  className = '', 
  size = 24,
  activeLevels 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Level 1 (Top) */}
    <path 
      d="M4 5L12 2L20 5" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      strokeOpacity={activeLevels >= 4 ? 1 : 0.2}
    />
    {/* Level 2 */}
    <path 
      d="M4 10L12 7L20 10" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      strokeOpacity={activeLevels >= 3 ? 1 : 0.2}
    />
    {/* Level 3 */}
    <path 
      d="M4 15L12 12L20 15" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      strokeOpacity={activeLevels >= 2 ? 1 : 0.2}
    />
    {/* Level 4 (Bottom) */}
    <path 
      d="M4 20L12 17L20 20" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      strokeOpacity={activeLevels >= 1 ? 1 : 0.2}
    />
  </svg>
);

export const LowImportanceIcon: React.FC<IconProps> = (props) => (
  <ImportanceIconBase {...props} activeLevels={1} />
);

export const MediumImportanceIcon: React.FC<IconProps> = (props) => (
  <ImportanceIconBase {...props} activeLevels={2} />
);

export const HighImportanceIcon: React.FC<IconProps> = (props) => (
  <ImportanceIconBase {...props} activeLevels={3} />
);

export const CriticalImportanceIcon: React.FC<IconProps> = (props) => (
  <ImportanceIconBase {...props} activeLevels={4} />
);

// Helper function to get the appropriate icon based on significance level
export const getImportanceIcon = (significance: 'Low' | 'Medium' | 'High' | 'Critical') => {
  switch (significance) {
    case 'Critical':
      return CriticalImportanceIcon;
    case 'High':
      return HighImportanceIcon;
    case 'Medium':
      return MediumImportanceIcon;
    case 'Low':
      return LowImportanceIcon;
  }
}; 