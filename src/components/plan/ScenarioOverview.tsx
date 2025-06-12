import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScenarioSummaryCard } from '@/components/shared/ScenarioSummaryCard';
import { CreateScenarioDialog } from '@/components/dialogs/CreateScenarioDialog';
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
import type { Scenario } from '@/types';

interface ScenarioOverviewProps {
  scenarios: Scenario[];
  resultsByScenario: Record<string, any>;
  selectedScenarioIds: string[];
  onScenarioSelection: (scenarioId: string, checked: boolean) => void;
  onDeleteScenario: (scenario: Scenario) => void;
  onDuplicateScenario: (scenario: Scenario) => void;
  onSetAsBaseline: (scenario: Scenario) => void;
  onAddScenario: (scenarioData: Partial<Scenario>) => Scenario;
}

export function ScenarioOverview({
  scenarios,
  resultsByScenario,
  selectedScenarioIds,
  onScenarioSelection,
  onDeleteScenario,
  onDuplicateScenario,
  onSetAsBaseline,
  onAddScenario
}: ScenarioOverviewProps) {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [scenarioToDelete, setScenarioToDelete] = useState<Scenario | null>(null);

  const handleDeleteClick = (scenario: Scenario) => {
    setScenarioToDelete(scenario);
  };

  const handleDeleteConfirm = () => {
    if (scenarioToDelete) {
      onDeleteScenario(scenarioToDelete);
      setScenarioToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setScenarioToDelete(null);
  };

  // Get the total capital gains tax for a scenario
  const getTotalCapitalGainsTax = (scenarioId: string) => {
    const results = resultsByScenario[scenarioId];
    if (!results) return 0;
    return results.yearlyProjections.reduce((sum: number, year: { taxBreakdown: { capitalGainsTax: number } }) => 
      sum + year.taxBreakdown.capitalGainsTax, 0);
  };

  // Get the total net financial outcome for a scenario
  const getTotalNetFinancialOutcome = (scenarioId: string) => {
    const results = resultsByScenario[scenarioId];
    if (!results) return 0;
    return results.totalNetFinancialOutcomeOverPeriod;
  };

  return (
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
                goalAlignments: results?.goalAlignments || []
              }}
              isSelectedForCompare={selectedScenarioIds.includes(scenario.id)}
              onToggleSelection={onScenarioSelection}
              onViewDetails={(id) => navigate(`/scenarios/${id}/view`)}
              onEdit={(id) => navigate(`/scenarios/${id}/edit`)}
              onDuplicate={onDuplicateScenario}
              onDelete={handleDeleteClick}
              onSetAsBaseline={onSetAsBaseline}
              isBaseline={index === 0}
            />
          );
        })}
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