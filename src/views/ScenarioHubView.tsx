import { useUserAppState } from '@/store/userAppStateSlice';
import { useCalculationState } from '@/store/calculationStateSlice';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CreateScenarioDialog } from '@/components/dialogs/CreateScenarioDialog';
import { ScenarioSummaryCard } from '@/components/shared/ScenarioSummaryCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { calculateScenarioResults } from '@/services/calculationService';
import type { Scenario } from '@/types';

export function ScenarioHubView() {
  const { scenarios, deleteScenario, setScenarioAsPrimary, initialAssets } = useUserAppState();
  const { resultsByScenario, setScenarioResults } = useCalculationState();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<Set<string>>(new Set());
  const [scenarioToDelete, setScenarioToDelete] = useState<Scenario | null>(null);

  // Calculate results for scenarios when they change
  useEffect(() => {
    scenarios.forEach(scenario => {
      try {
        console.log('Calculating results for scenario:', {
          id: scenario.id,
          name: scenario.name,
          plannedSales: scenario.plannedAssetSales,
          assets: initialAssets
        });
        const results = calculateScenarioResults(scenario, initialAssets);
        console.log('Calculation results:', results);
        setScenarioResults(scenario.id, results);
      } catch (error) {
        console.error(`Failed to calculate results for scenario ${scenario.id}:`, error);
      }
    });
  }, [scenarios, initialAssets, setScenarioResults]);

  const handleScenarioSelection = (scenarioId: string, checked: boolean) => {
    const newSelected = new Set(selectedScenarios);
    if (checked) {
      newSelected.add(scenarioId);
    } else {
      newSelected.delete(scenarioId);
    }
    setSelectedScenarios(newSelected);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const selectedScenariosData = scenarios.filter((scenario) => selectedScenarios.has(scenario.id));

  const comparisonMetrics = [
    { key: 'totalGrossIncome', label: 'Total Gross Income', format: formatCurrency },
    { key: 'totalExpenses', label: 'Total Expenses', format: formatCurrency },
    { key: 'estimatedCapitalGainsTax', label: 'Est. Capital Gains Tax', format: formatCurrency, highlight: true },
    { key: 'netFinancialOutcome', label: 'Net Financial Outcome', format: formatCurrency },
    { key: 'qualitativeFitScore', label: 'Qualitative Fit Score', format: (val: number) => `${val}/100` },
  ];

  const handleDeleteClick = (scenario: Scenario) => {
    setScenarioToDelete(scenario);
  };

  const handleDeleteConfirm = () => {
    if (scenarioToDelete) {
      deleteScenario(scenarioToDelete.id);
      setScenarioToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setScenarioToDelete(null);
  };

  const handleDuplicateScenario = (scenario: Scenario) => {
    navigate('/scenarios/new', { 
      state: { template: scenario }
    });
  };

  const handleSetAsBaseline = (scenario: Scenario) => {
    setScenarioAsPrimary(scenario.id);
  };

  // Get the total capital gains tax for a scenario
  const getTotalCapitalGainsTax = (scenarioId: string) => {
    const results = resultsByScenario[scenarioId];
    if (!results) return 0;
    return results.yearlyProjections.reduce((sum, year) => sum + year.taxBreakdown.capitalGainsTax, 0);
  };

  // Get the total net financial outcome for a scenario
  const getTotalNetFinancialOutcome = (scenarioId: string) => {
    const results = resultsByScenario[scenarioId];
    if (!results) return 0;
    return results.totalNetFinancialOutcomeOverPeriod;
  };

  // Get the total income for a scenario
  const getTotalIncome = (scenarioId: string) => {
    const results = resultsByScenario[scenarioId];
    if (!results) return 0;
    return results.yearlyProjections.reduce((sum, year) => sum + year.income, 0);
  };

  // Get the total expenses for a scenario
  const getTotalExpenses = (scenarioId: string) => {
    const results = resultsByScenario[scenarioId];
    if (!results) return 0;
    return results.yearlyProjections.reduce((sum, year) => sum + year.expenses, 0);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Scenarios & Comparison</h1>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Scenario
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="mb-8 p-4 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total Scenarios: </span>
            <span className="font-medium">{scenarios.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Best Qualitative Fit: </span>
            <span className="font-medium">
              {Math.max(...scenarios.map((s) => resultsByScenario[s.id]?.qualitativeFitScore || 0))}/100
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Best Net Outcome: </span>
            <span className="font-medium">
              {formatCurrency(Math.max(...scenarios.map((s) => getTotalNetFinancialOutcome(s.id))))}
            </span>
          </div>
        </div>
      </div>

      {/* Scenario Summary Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Scenario Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {scenarios.map((scenario, index) => {
            const results = resultsByScenario[scenario.id];
            return (
              <ScenarioSummaryCard
                key={scenario.id}
                scenario={scenario}
                results={{
                  estimatedCapitalGainsTax: getTotalCapitalGainsTax(scenario.id),
                  netFinancialOutcome: getTotalNetFinancialOutcome(scenario.id),
                  qualitativeFitScore: results?.qualitativeFitScore || 0,
                }}
                isSelectedForCompare={selectedScenarios.has(scenario.id)}
                onToggleSelection={handleScenarioSelection}
                onViewDetails={(id) => navigate(`/scenarios/${id}`)}
                onEdit={(id) => navigate(`/scenarios/${id}/edit`)}
                onDuplicate={handleDuplicateScenario}
                onDelete={handleDeleteClick}
                onSetAsBaseline={handleSetAsBaseline}
                isBaseline={index === 0}
              />
            );
          })}
        </div>
      </div>

      {/* Overview Comparison Table */}
      {selectedScenarios.size > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Comparison Table</h2>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  {selectedScenariosData.map((scenario) => (
                    <TableHead key={scenario.id}>{scenario.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonMetrics.map((metric) => (
                  <TableRow key={metric.key}>
                    <TableCell className="font-medium">{metric.label}</TableCell>
                    {selectedScenariosData.map((scenario) => {
                      const results = resultsByScenario[scenario.id];
                      let value = 0;
                      switch (metric.key) {
                        case 'estimatedCapitalGainsTax':
                          value = getTotalCapitalGainsTax(scenario.id);
                          break;
                        case 'netFinancialOutcome':
                          value = getTotalNetFinancialOutcome(scenario.id);
                          break;
                        case 'qualitativeFitScore':
                          value = results?.qualitativeFitScore || 0;
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
                          key={scenario.id}
                          className={metric.highlight ? 'bg-muted/50 font-medium' : ''}
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
        </div>
      )}

      <CreateScenarioDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      <AlertDialog open={!!scenarioToDelete} onOpenChange={() => setScenarioToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scenario</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{scenarioToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 