import { useUserAppState } from '@/store/userAppStateSlice';
import { useCalculationState } from '@/store/calculationStateSlice';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CreateScenarioDialog } from '@/components/dialogs/CreateScenarioDialog';
import { ScenarioSummaryCard } from '@/components/shared/ScenarioSummaryCard';
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
import { ScenarioSummaryDashboard } from '@/components/shared/ScenarioSummaryDashboard';
import { ScenarioComparisonTable } from '@/components/shared/ScenarioComparisonTable';

export function ScenarioHubView() {
  const { scenarios, deleteScenario, setScenarioAsPrimary, initialAssets, selectedScenarioIds, setSelectedScenarioIds } = useUserAppState();
  const { resultsByScenario, setScenarioResults } = useCalculationState();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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
    let newSelected: string[] = [...selectedScenarioIds];
    if (checked) {
      if (!newSelected.includes(scenarioId)) newSelected.push(scenarioId);
    } else {
      newSelected = newSelected.filter(id => id !== scenarioId);
    }
    setSelectedScenarioIds(newSelected);
  };

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
  
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Scenarios & Comparison</h1>
        </div>
      </div>

      {/* Summary Stats */}
      <ScenarioSummaryDashboard />

      {/* Scenario Overview Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Scenario Overview</h2>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New Scenario
          </Button>
        </div>
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
                isSelectedForCompare={selectedScenarioIds.includes(scenario.id)}
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

      {/* Scenario Comparison Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Scenario Comparison</h2>
        {selectedScenarioIds.length > 0 && (
          <ScenarioComparisonTable selectedScenarioIds={new Set(selectedScenarioIds)} />
        )}
        {selectedScenarioIds.length === 0 && (
          <div className="text-muted-foreground text-center mt-4">
            No scenarios selected. Please select one or more scenarios above to view a side-by-side comparison.
          </div>
        )}
      </div>

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