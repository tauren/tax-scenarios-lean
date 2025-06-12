import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ScenarioSummaryHeaderProps {
  scenario: any;
  results: any;
}

const ScenarioSummaryHeader: React.FC<ScenarioSummaryHeaderProps> = ({ scenario, results }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 mb-2">
      <div>
        <h1 className="text-2xl font-bold mb-1">{scenario.name}</h1>
        <div className="text-muted-foreground text-sm mb-1">
          {scenario.location
            ? [scenario.location.city, scenario.location.state, scenario.location.country].filter(Boolean).join(', ')
            : ''}
        </div>
        <div className="text-xs text-gray-500">Projection: {results.yearlyProjections?.length || 0} years</div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Net Outcome:</span>
          <span className="text-lg font-bold">${results.totalNetFinancialOutcomeOverPeriod?.toLocaleString() || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Lifestyle Fit:</span>
          <Badge className="text-lg px-3 py-1">{results.qualitativeFitScore || 0}/100</Badge>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSummaryHeader; 