import { create } from 'zustand';
import type { UserAppStateSlice, Asset, Scenario, UserAppState } from '@/types';
import { v4 as uuid } from 'uuid';
import { loadActivePlanFromStorage, saveActivePlanToStorage, clearActivePlanFromStorage } from '../services/localStorageService';

// Create a debounced save function
let saveTimeout: NodeJS.Timeout;
const debouncedSave = (state: UserAppStateSlice) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const success = saveActivePlanToStorage({
      activePlanInternalName: state.activePlanInternalName,
      initialAssets: state.initialAssets,
      scenarios: state.scenarios,
    });
    if (!success) {
      console.error('Failed to save state to localStorage');
      // TODO: Add UI notification when uiSlice is available
    }
    // Clear dirty state after successful save
    state.setDirty(false);
  }, 1000);
};

// Initialize state from localStorage or use defaults
const initialState = loadActivePlanFromStorage() || {
  activePlanInternalName: '',
  initialAssets: [],
  scenarios: [],
};

export const useUserAppState = create<UserAppStateSlice>((set) => ({
  ...initialState,
  isDirty: false,

  setDirty: (isDirty: boolean) => {
    set((state) => ({ ...state, isDirty }));
  },

  setActivePlanInternalName: (name: string) => {
    set((state) => {
      const newState = { ...state, activePlanInternalName: name, isDirty: true };
      debouncedSave(newState);
      return newState;
    });
  },

  addAsset: (asset: Asset) => {
    set((state) => {
      const newAsset = { ...asset, id: uuid() };
      const newState = {
        ...state,
        initialAssets: [...state.initialAssets, newAsset],
        isDirty: true,
      };
      debouncedSave(newState);
      return newState;
    });
  },

  updateAsset: (assetId: string, updatedAsset: Partial<Asset>) => {
    set((state) => {
      const newState = {
        ...state,
        initialAssets: state.initialAssets.map((asset) =>
          asset.id === assetId ? { ...asset, ...updatedAsset } : asset
        ),
        isDirty: true,
      };
      debouncedSave(newState);
      return newState;
    });
  },

  deleteAsset: (assetId: string) => {
    set((state) => {
      const newState = {
        ...state,
        initialAssets: state.initialAssets.filter((asset) => asset.id !== assetId),
        isDirty: true,
      };
      debouncedSave(newState);
      return newState;
    });
  },

  addScenario: (scenario: Scenario) => {
    set((state) => {
      const newScenario = { ...scenario, id: uuid() };
      const newState = {
        ...state,
        scenarios: [...state.scenarios, newScenario],
        isDirty: true,
      };

      // Set the active plan name if it's not set
      if (!state.activePlanInternalName) {
        newState.activePlanInternalName = scenario.name;
      }

      debouncedSave(newState);
      return newState;
    });
  },

  updateScenario: (scenarioId: string, updatedScenario: Partial<Scenario>) => {
    set((state) => {
      const newState = {
        ...state,
        scenarios: state.scenarios.map((scenario) =>
          scenario.id === scenarioId ? { ...scenario, ...updatedScenario } : scenario
        ),
        isDirty: true,
      };
      debouncedSave(newState);
      return newState;
    });
  },

  deleteScenario: (scenarioId: string) => {
    set((state) => {
      const newState = {
        ...state,
        scenarios: state.scenarios.filter((scenario) => scenario.id !== scenarioId),
        isDirty: true,
      };
      debouncedSave(newState);
      return newState;
    });
  },

  setScenarioAsPrimary: (scenarioId: string) => {
    set((state) => {
      // Find the scenario to make primary
      const scenarioToMakePrimary = state.scenarios.find(s => s.id === scenarioId);
      if (!scenarioToMakePrimary) return state;

      // Create new array with the selected scenario first
      const newScenarios = [
        scenarioToMakePrimary,
        ...state.scenarios.filter(s => s.id !== scenarioId)
      ];

      const newState = {
        ...state,
        scenarios: newScenarios,
        isDirty: true,
      };
      debouncedSave(newState);
      return newState;
    });
  },

  clearStoredState: () => {
    clearActivePlanFromStorage();
    set({
      activePlanInternalName: '',
      initialAssets: [],
      scenarios: [],
      isDirty: false,
    });
  },

  setAppState: (newState: UserAppState) => {
    set((state) => {
      const mergedState = {
        ...state,
        ...newState,
        isDirty: false, // Reset dirty state when loading new plan
      };
      debouncedSave(mergedState);
      return mergedState;
    });
  },
})); 