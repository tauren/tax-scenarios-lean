import { create } from 'zustand';
import type { AppCalculatedState, ScenarioResults } from '../types';

interface CalculationStateSlice extends AppCalculatedState {
  setScenarioResults: (scenarioId: string, results: ScenarioResults) => void;
  clearScenarioResults: (scenarioId: string) => void;
  clearAllResults: () => void;
}

export const useCalculationState = create<CalculationStateSlice>((set) => ({
  resultsByScenario: {},

  setScenarioResults: (scenarioId: string, results: ScenarioResults) => {
    set((state) => ({
      resultsByScenario: {
        ...state.resultsByScenario,
        [scenarioId]: results,
      },
    }));
  },

  clearScenarioResults: (scenarioId: string) => {
    set((state) => {
      const { [scenarioId]: _, ...remainingResults } = state.resultsByScenario;
      return {
        resultsByScenario: remainingResults,
      };
    });
  },

  clearAllResults: () => {
    set({
      resultsByScenario: {},
    });
  },
})); 