import { create } from 'zustand';
import type { UserAppStateSlice, Asset, Scenario } from '@/types';
import { v4 as uuid } from 'uuid';
import { loadActivePlanFromStorage, saveActivePlanToStorage, clearActivePlanFromStorage } from '../services/localStorageService';

// Create a debounced save function
let saveTimeout: NodeJS.Timeout;
const debouncedSave = (state: UserAppStateSlice) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveActivePlanToStorage({
      activePlanInternalName: state.activePlanInternalName,
      initialAssets: state.initialAssets,
      scenarios: state.scenarios,
    });
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

  setActivePlanInternalName: (name: string) => {
    set((state) => {
      const newState = { ...state, activePlanInternalName: name };
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
      };
      debouncedSave(newState);
      return newState;
    });
  },

  addScenario: (scenario: Scenario, options?: { isBaseline?: boolean }) => {
    set((state) => {
      const newScenario = { ...scenario, id: uuid() };
      const newState = {
        ...state,
        scenarios: [...state.scenarios, newScenario],
      };
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
    });
  },
})); 