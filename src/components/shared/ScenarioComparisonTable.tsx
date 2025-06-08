import { useUserAppState } from '@/store/userAppStateSlice';
import { useCalculationState } from '@/store/calculationStateSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowUpDown, ArrowUp, ArrowDown, Target, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { QualitativeGoalAlignment } from '@/types';

interface ScenarioComparisonTableProps {
  selectedScenarioIds: Set<string>;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

type SortDirection = 'asc' | 'desc' | null;
type SortKey = 'scenario' | 'totalGrossIncome' | 'totalExpenses' | 'estimatedCapitalGainsTax' | 'netFinancialOutcome' | 'qualitativeFitScore' | 'goalAlignment';

export function ScenarioComparisonTable({ selectedScenarioIds }: ScenarioComparisonTableProps) {
  const { scenarios } = useUserAppState();
  const { resultsByScenario } = useCalculationState();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: SortDirection }>({
    key: null,
    direction: null
  });

  const selectedScenariosData = scenarios.filter((scenario) => selectedScenarioIds.has(scenario.id));

  const getTotalCapitalGainsTax = (scenarioId: string) => {
    const results = resultsByScenario[scenarioId];
    if (!results) return 0;
    return results.yearlyProjections.reduce((sum, year) => sum + year.taxBreakdown.capitalGainsTax, 0);
  };

  const getTotalNetFinancialOutcome = (scenarioId: string) => {
    const results = resultsByScenario[scenarioId];
    if (!results) return 0;
    return results.totalNetFinancialOutcomeOverPeriod;
  };

  const getTotalIncome = (scenarioId: string) => {
    const results = resultsByScenario[scenarioId];
    if (!results) return 0;
    return results.yearlyProjections.reduce((sum, year) => sum + year.income, 0);
  };

  const getTotalExpenses = (scenarioId: string) => {
    const results = resultsByScenario[scenarioId];
    if (!results) return 0;
    return results.yearlyProjections.reduce((sum, year) => sum + year.expenses, 0);
  };

  const getGoalAlignments = (scenarioId: string): QualitativeGoalAlignment[] => {
    const results = resultsByScenario[scenarioId];
    if (!results) return [];
    return results.goalAlignments;
  };

  const comparisonMetrics = [
    { key: 'totalGrossIncome' as SortKey, label: 'Total Gross Income', format: formatCurrency },
    { key: 'totalExpenses' as SortKey, label: 'Total Expenses', format: formatCurrency },
    { key: 'estimatedCapitalGainsTax' as SortKey, label: 'Est. Capital Gains Tax', format: formatCurrency, highlight: true },
    { key: 'netFinancialOutcome' as SortKey, label: 'Net Financial Outcome', format: formatCurrency },
    { key: 'qualitativeFitScore' as SortKey, label: 'Qualitative Fit Score', format: (val: number) => `${val}/100` },
  ];

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    setSortConfig({ key: direction ? key : null, direction });
  };

  const getSortedScenarios = () => {
    if (!sortConfig.key || !sortConfig.direction) {
      return selectedScenariosData;
    }
    return [...selectedScenariosData].sort((a, b) => {
      if (sortConfig.key === 'scenario') {
        const comparison = a.name.localeCompare(b.name);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }
      let aValue = 0;
      let bValue = 0;
      switch (sortConfig.key) {
        case 'totalGrossIncome':
          aValue = getTotalIncome(a.id);
          bValue = getTotalIncome(b.id);
          break;
        case 'totalExpenses':
          aValue = getTotalExpenses(a.id);
          bValue = getTotalExpenses(b.id);
          break;
        case 'estimatedCapitalGainsTax':
          aValue = getTotalCapitalGainsTax(a.id);
          bValue = getTotalCapitalGainsTax(b.id);
          break;
        case 'netFinancialOutcome':
          aValue = getTotalNetFinancialOutcome(a.id);
          bValue = getTotalNetFinancialOutcome(b.id);
          break;
        case 'qualitativeFitScore':
          aValue = resultsByScenario[a.id]?.qualitativeFitScore || 0;
          bValue = resultsByScenario[b.id]?.qualitativeFitScore || 0;
          break;
        case 'goalAlignment':
          const aAlignments = getGoalAlignments(a.id);
          const bAlignments = getGoalAlignments(b.id);
          aValue = aAlignments.filter(g => g.isAligned).length;
          bValue = bAlignments.filter(g => g.isAligned).length;
          break;
      }
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="h-4 w-4 ml-1" />;
    }
    if (sortConfig.direction === 'desc') {
      return <ArrowDown className="h-4 w-4 ml-1" />;
    }
    return <ArrowUpDown className="h-4 w-4 ml-1" />;
  };

  if (!selectedScenarioIds || selectedScenarioIds.size === 0) return null;

  const allGoalAlignments = selectedScenariosData.flatMap(scenario => 
    getGoalAlignments(scenario.id).map(alignment => alignment.goalId)
  );
  const uniqueGoalIds = [...new Set(allGoalAlignments)];

  return (
    <div className="space-y-6">
      <div className="border rounded-lg">
        <Table style={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] max-w-[150px] break-words">
                <button
                  onClick={() => handleSort('scenario')}
                  className="flex items-center hover:text-primary transition-colors text-left w-full"
                >
                  <span className="whitespace-normal break-words">
                    Scenario
                  </span>
                  <span className="flex-shrink-0 ml-1">
                    {getSortIcon('scenario')}
                  </span>
                </button>
              </TableHead>
              {comparisonMetrics.map((metric) => (
                <TableHead key={metric.key} className="w-auto">
                  <button
                    onClick={() => handleSort(metric.key)}
                    className="flex items-center hover:text-primary transition-colors text-left w-full"
                  >
                    <span className="whitespace-normal break-words">
                      {metric.label}
                    </span>
                    <span className="flex-shrink-0 ml-1">
                      {getSortIcon(metric.key)}
                    </span>
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSortedScenarios().map((scenario) => (
              <TableRow key={scenario.id}>
                <TableCell className="font-medium w-[150px] max-w-[150px] break-words">
                  <div className="flex items-center gap-2">
                    <span className="line-clamp-2 break-words">{scenario.name}</span>
                    {scenario.id === scenarios[0]?.id && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="flex items-center gap-1 text-xs">
                              <Target className="h-3 w-3 mr-1 text-primary" />
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>Baseline scenario</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                {comparisonMetrics.map((metric) => {
                  let value = 0;
                  switch (metric.key) {
                    case 'estimatedCapitalGainsTax':
                      value = getTotalCapitalGainsTax(scenario.id);
                      break;
                    case 'netFinancialOutcome':
                      value = getTotalNetFinancialOutcome(scenario.id);
                      break;
                    case 'qualitativeFitScore':
                      value = resultsByScenario[scenario.id]?.qualitativeFitScore || 0;
                      break;
                    case 'totalGrossIncome':
                      value = getTotalIncome(scenario.id);
                      break;
                    case 'totalExpenses':
                      value = getTotalExpenses(scenario.id);
                      break;
                  }
                  return (
                    <TableCell
                      key={metric.key}
                      className={`${metric.highlight ? 'bg-muted/50 font-medium' : ''} text-right w-auto`}
                    >
                      {metric.format(value)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="border rounded-lg">
        <Table style={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] max-w-[150px] break-words">Goal</TableHead>
              {selectedScenariosData.map((scenario) => (
                <TableHead key={scenario.id} className="w-auto">
                  <div className="flex items-center gap-2">
                    <span className="line-clamp-2 break-words">{scenario.name}</span>
                    {scenario.id === scenarios[0]?.id && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="flex items-center gap-1 text-xs">
                              <Target className="h-3 w-3 mr-1 text-primary" />
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>Baseline scenario</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {uniqueGoalIds.map((goalId) => {
              const firstScenario = selectedScenariosData[0];
              const firstAlignment = getGoalAlignments(firstScenario.id).find(g => g.goalId === goalId);
              if (!firstAlignment) return null;

              return (
                <TableRow key={goalId}>
                  <TableCell className="font-medium w-[150px] max-w-[150px] break-words">
                    {firstAlignment.goalName}
                  </TableCell>
                  {selectedScenariosData.map((scenario) => {
                    const alignment = getGoalAlignments(scenario.id).find(g => g.goalId === goalId);
                    if (!alignment) return <TableCell key={scenario.id} />;

                    return (
                      <TableCell key={scenario.id} className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {alignment.isAligned ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm">
                            {alignment.alignmentScore}/100
                          </span>
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 