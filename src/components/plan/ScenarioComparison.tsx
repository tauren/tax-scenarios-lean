import { ScenarioComparisonTable } from '@/components/shared/ScenarioComparisonTable';
import { LocationObjectivesComparisonTable } from '@/components/shared/LocationObjectivesComparisonTable';

interface ScenarioComparisonProps {
  selectedScenarioIds: string[];
}

export function ScenarioComparison({ selectedScenarioIds }: ScenarioComparisonProps) {
  if (!selectedScenarioIds || selectedScenarioIds.length === 0) {
    return (
      <div className="mb-8 space-y-6">
        <h2 className="text-xl font-semibold mb-4">Scenario Comparison</h2>
        <div className="text-muted-foreground text-center mt-4">
          No scenarios selected. Please select one or more scenarios above to view a side-by-side comparison.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Scenario Comparison</h2>
      <ScenarioComparisonTable selectedScenarioIds={new Set(selectedScenarioIds)} />
      <h3 className="text-lg font-semibold mt-8 mb-4">Location Objectives Comparison</h3>
      <LocationObjectivesComparisonTable selectedScenarioIds={new Set(selectedScenarioIds)} />
    </div>
  );
} 