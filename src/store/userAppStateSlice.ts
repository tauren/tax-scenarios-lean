import { create } from 'zustand';
import type { UserAppStateSlice, Asset, Scenario } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const useUserAppState = create<UserAppStateSlice>((set) => ({
  activePlanInternalName: 'Untitled Plan',
  initialAssets: [],
  scenarios: [],

  setActivePlanInternalName: (name: string) =>
    set((state) => ({ ...state, activePlanInternalName: name })),

  addAsset: (asset: Asset) =>
    set((state) => ({ ...state, initialAssets: [...state.initialAssets, asset] })),

  updateAsset: (assetId: string, updatedAsset: Partial<Asset>) =>
    set((state) => ({
      ...state,
      initialAssets: state.initialAssets.map((asset) =>
        asset.id === assetId ? { ...asset, ...updatedAsset } : asset
      ),
    })),

  deleteAsset: (assetId: string) =>
    set((state) => ({
      ...state,
      initialAssets: state.initialAssets.filter((asset) => asset.id !== assetId),
    })),

  addScenario: (scenario: Scenario, options?: { isBaseline?: boolean }) =>
    set((state) => {
      const newScenario = {
        ...scenario,
        id: uuidv4(),
      };

      if (options?.isBaseline) {
        // If it's a baseline scenario, make it the first scenario
        return {
          ...state,
          scenarios: [newScenario, ...state.scenarios],
        };
      }

      return {
        ...state,
        scenarios: [...state.scenarios, newScenario],
      };
    }),

  updateScenario: (scenarioId: string, updatedScenario: Partial<Scenario>) =>
    set((state) => ({
      ...state,
      scenarios: state.scenarios.map((scenario) =>
        scenario.id === scenarioId ? { ...scenario, ...updatedScenario } : scenario
      ),
    })),

  deleteScenario: (scenarioId: string) =>
    set((state) => ({
      ...state,
      scenarios: state.scenarios.filter((scenario) => scenario.id !== scenarioId),
    })),
})); 