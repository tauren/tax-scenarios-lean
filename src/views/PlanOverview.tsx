import { useUserAppState } from '@/store/userAppStateSlice';
import { useCalculationState } from '@/store/calculationStateSlice';
import { useEffect } from 'react';
import { calculateScenarioResults } from '@/services/calculationService';
import { PlanHeader } from '@/components/plan/PlanHeader';
import { PlanNavigationCards } from '@/components/plan/PlanNavigationCards';
import { ScenarioOverview } from '@/components/plan/ScenarioOverview';
import { ScenarioComparison } from '@/components/plan/ScenarioComparison';
import { ScenarioSummaryDashboard } from '@/components/shared/ScenarioSummaryDashboard';
import type { Scenario } from '@/types';

export function PlanOverview() {
  const { 
    activePlanInternalName, 
    setActivePlanInternalName, 
    initialAssets, 
    scenarios, 
    userQualitativeGoals = [],
    deleteScenario,
    setScenarioAsPrimary,
    selectedScenarioIds,
    setSelectedScenarioIds,
    addScenario
  } = useUserAppState();
  const { resultsByScenario, setScenarioResults } = useCalculationState();

  // Calculate results for scenarios when they change
  useEffect(() => {
    scenarios.forEach(scenario => {
      try {
        const results = calculateScenarioResults(scenario, initialAssets, userQualitativeGoals);
        setScenarioResults(scenario.id, results);
      } catch (error) {
        console.error(`Failed to calculate results for scenario ${scenario.id}:`, error);
      }
    });
  }, [scenarios, initialAssets, userQualitativeGoals, setScenarioResults]);

  const handleScenarioSelection = (scenarioId: string, checked: boolean) => {
    let newSelected: string[] = [...selectedScenarioIds];
    if (checked) {
      if (!newSelected.includes(scenarioId)) newSelected.push(scenarioId);
    } else {
      newSelected = newSelected.filter(id => id !== scenarioId);
    }
    setSelectedScenarioIds(newSelected);
  };

  const handleDuplicateScenario = (scenario: Scenario) => {
    const newScenarioData = { ...scenario, name: `${scenario.name} (Copy)` };
    addScenario(newScenarioData);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Plan Header */}
      <PlanHeader
        planName={activePlanInternalName || 'Untitled Plan'}
        onPlanNameChange={setActivePlanInternalName}
      />

      {/* Summary Cards */}
      <div className="space-y-6">
        <ScenarioSummaryDashboard />
        <PlanNavigationCards
          assetsCount={initialAssets.length}
          objectivesCount={userQualitativeGoals.length}
          scenariosCount={scenarios.length}
        />
      </div>

      {/* Scenario Overview */}
      <ScenarioOverview
        scenarios={scenarios}
        resultsByScenario={resultsByScenario}
        selectedScenarioIds={selectedScenarioIds}
        onScenarioSelection={handleScenarioSelection}
        onDeleteScenario={(scenario) => deleteScenario(scenario.id)}
        onDuplicateScenario={handleDuplicateScenario}
        onSetAsBaseline={(scenario) => setScenarioAsPrimary(scenario.id)}
        onAddScenario={(scenarioData) => addScenario(scenarioData as Omit<Scenario, 'id'>)}
      />

      {/* Scenario Comparison */}
      <ScenarioComparison selectedScenarioIds={selectedScenarioIds} />
    </div>
  );
} 