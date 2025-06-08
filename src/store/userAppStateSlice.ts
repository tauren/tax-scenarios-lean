import { create } from 'zustand';
import type { UserAppStateSlice, Asset, Scenario, UserAppState, UserQualitativeGoal, ScenarioQualitativeAttribute } from '@/types';
import { v4 as uuid } from 'uuid';
import { loadActivePlanFromStorage, saveActivePlanToStorage, clearActivePlanFromStorage } from '../services/localStorageService';

// Create a debounced save function
let saveTimeout: NodeJS.Timeout;
const debouncedSave = (state: Partial<UserAppStateSlice>) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const success = saveActivePlanToStorage({
      activePlanInternalName: state.activePlanInternalName || '',
      initialAssets: state.initialAssets || [],
      scenarios: state.scenarios || [],
      selectedScenarioIds: state.selectedScenarioIds || [],
      userQualitativeGoals: state.userQualitativeGoals || [],
    });
    if (!success) {
      console.error('Failed to save state to localStorage');
      // TODO: Add UI notification when uiSlice is available
    }
    // Clear dirty state after successful save
    if (state.setDirty) {
      state.setDirty(false);
    }
  }, 1000);
};

// Simple function to ensure scenario data is valid
function ensureValidScenario(scenario: Scenario): Scenario {
  return {
    ...scenario,
    projectionPeriod: scenario.projectionPeriod || 10,
    residencyStartDate: scenario.residencyStartDate || new Date(),
    location: {
      country: scenario.location?.country || '',
      state: scenario.location?.state || '',
      city: scenario.location?.city || '',
    },
    tax: {
      capitalGains: {
        shortTermRate: scenario.tax?.capitalGains?.shortTermRate || 0,
        longTermRate: scenario.tax?.capitalGains?.longTermRate || 0,
      },
      incomeRate: scenario.tax?.incomeRate || 0,
    },
    incomeSources: scenario.incomeSources || [],
    annualExpenses: scenario.annualExpenses || [],
    oneTimeExpenses: scenario.oneTimeExpenses || [],
    plannedAssetSales: scenario.plannedAssetSales || [],
  };
}

// Simple function to ensure asset data is valid
function ensureValidAsset(asset: Asset): Asset {
  return {
    ...asset,
    name: asset.name || '',
    quantity: asset.quantity || 0,
    costBasisPerUnit: asset.costBasisPerUnit || 0,
    acquisitionDate: asset.acquisitionDate || new Date(),
    assetType: asset.assetType || '',
    fmvPerUnit: asset.fmvPerUnit || 0,
  };
}

// Simple function to ensure personal goal data is valid
function ensureValidPersonalGoal(goal: UserQualitativeGoal): UserQualitativeGoal {
  return {
    ...goal,
    name: goal.name || '',
    weight: goal.weight || 'Medium',
  };
}

// Initialize state from localStorage or use defaults
function buildInitialState() {
  const loaded = loadActivePlanFromStorage() || {
    activePlanInternalName: '',
    initialAssets: [],
    scenarios: [],
    userQualitativeGoals: [],
  };
  let selectedScenarioIds: string[] = [];
  if (loaded.scenarios && loaded.scenarios.length > 0) {
    selectedScenarioIds = [loaded.scenarios[0].id];
  }
  // If loaded state already has selectedScenarioIds, use it
  if (Array.isArray((loaded as any).selectedScenarioIds)) {
    selectedScenarioIds = (loaded as any).selectedScenarioIds;
  }
  return {
    ...loaded,
    scenarios: loaded.scenarios.map(ensureValidScenario),
    initialAssets: loaded.initialAssets.map(ensureValidAsset),
    userQualitativeGoals: loaded.userQualitativeGoals.map(ensureValidPersonalGoal),
    selectedScenarioIds,
  };
}

export const useUserAppState = create<UserAppStateSlice>((set) => ({
  ...buildInitialState(),
  isDirty: false,
  setDirty: (isDirty: boolean) => set({ isDirty }),
  setActivePlanInternalName: (name: string) => set({ activePlanInternalName: name, isDirty: true }),
  addAsset: (asset: Asset) => set((state) => ({
    initialAssets: [...state.initialAssets, { ...asset, id: uuid() }],
    isDirty: true
  })),
  updateAsset: (assetId: string, updatedAsset: Partial<Asset>) => set((state) => ({
    initialAssets: state.initialAssets.map((asset) =>
      asset.id === assetId ? { ...asset, ...updatedAsset } : asset
    ),
    isDirty: true
  })),
  deleteAsset: (assetId: string) => set((state) => ({
    initialAssets: state.initialAssets.filter((asset) => asset.id !== assetId),
    isDirty: true
  })),
  addScenario: (scenario: Scenario, options?: { isBaseline?: boolean }) => set((state) => {
    const newScenario = { ...scenario, id: uuid() };
    let selectedScenarioIds = state.selectedScenarioIds;
    if (!selectedScenarioIds || selectedScenarioIds.length === 0) {
      selectedScenarioIds = [newScenario.id];
    }
    return {
      scenarios: [...state.scenarios, newScenario],
      selectedScenarioIds,
      isDirty: true
    };
  }),
  updateScenario: (scenarioId: string, updatedScenario: Partial<Scenario>) => set((state) => ({
    scenarios: state.scenarios.map((scenario) =>
      scenario.id === scenarioId ? { ...scenario, ...updatedScenario } : scenario
    ),
    isDirty: true
  })),
  deleteScenario: (scenarioId: string) => set((state) => ({
    scenarios: state.scenarios.filter((scenario) => scenario.id !== scenarioId),
    selectedScenarioIds: state.selectedScenarioIds.filter(id => state.scenarios.some(s => s.id === id)),
    isDirty: true
  })),
  setScenarioAsPrimary: (scenarioId: string) => set((state) => {
    const scenarioToMakePrimary = state.scenarios.find(s => s.id === scenarioId);
    if (!scenarioToMakePrimary) return state;

    const newScenarios = [
      scenarioToMakePrimary,
      ...state.scenarios.filter(s => s.id !== scenarioId)
    ];

    return {
      scenarios: newScenarios,
      isDirty: true
    };
  }),
  addQualitativeGoal: (goal: UserQualitativeGoal) => set((state) => ({
    userQualitativeGoals: [...(state.userQualitativeGoals || []), goal],
    isDirty: true
  })),
  updateQualitativeGoal: (goalId: string, updatedGoal: Partial<UserQualitativeGoal>) => set((state) => ({
    userQualitativeGoals: (state.userQualitativeGoals || []).map((goal) =>
      goal.id === goalId ? { ...goal, ...updatedGoal } : goal
    ),
    isDirty: true
  })),
  deleteQualitativeGoal: (goalId: string) => set((state) => ({
    userQualitativeGoals: (state.userQualitativeGoals || []).filter((goal) => goal.id !== goalId),
    isDirty: true
  })),
  updateScenarioAttribute: (scenarioId: string, attribute: ScenarioQualitativeAttribute) => set((state) => {
    const scenario = state.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return state;

    const existingIndex = scenario.scenarioSpecificAttributes.findIndex(
      attr => attr.id === attribute.id
    );

    const updatedScenario = { ...scenario };
    if (existingIndex >= 0) {
      updatedScenario.scenarioSpecificAttributes[existingIndex] = attribute;
    } else {
      updatedScenario.scenarioSpecificAttributes.push(attribute);
    }

    return {
      scenarios: state.scenarios.map(s => s.id === scenarioId ? updatedScenario : s),
      isDirty: true
    };
  }),
  deleteScenarioAttribute: (scenarioId: string, attributeId: string) => set((state) => {
    const scenario = state.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return state;

    const updatedScenario = {
      ...scenario,
      scenarioSpecificAttributes: scenario.scenarioSpecificAttributes.filter(
        attr => attr.id !== attributeId
      )
    };

    const newState = {
      ...state,
      scenarios: state.scenarios.map(s => s.id === scenarioId ? updatedScenario : s),
      isDirty: true
    };

    // Save to localStorage
    debouncedSave(newState);
    
    return newState;
  }),
  clearStoredState: () => {
    clearActivePlanFromStorage();
    set({
      activePlanInternalName: '',
      initialAssets: [],
      scenarios: [],
      userQualitativeGoals: [],
      isDirty: false
    });
  },
  setAppState: (newState: UserAppState) => {
    const mergedState = {
      ...newState,
      isDirty: true,
    };
    debouncedSave(mergedState);
    set(mergedState);
  },
  setSelectedScenarioIds: (ids: string[]) => set({ selectedScenarioIds: ids, isDirty: true }),
})); 