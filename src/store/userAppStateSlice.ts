import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserAppStateSlice, Asset, Scenario, UserAppState, UserQualitativeGoal, ScenarioQualitativeAttribute, IncomeSource, AnnualExpense, OneTimeExpense, PlannedAssetSale } from '@/types';
import { v4 as uuid } from 'uuid';

// Simple function to ensure scenario data is valid
function ensureValidScenario(scenario: Scenario): Scenario {
  return {
    ...scenario,
    projectionPeriod: scenario.projectionPeriod || 10,
    residencyStartDate: scenario.residencyStartDate ? new Date(scenario.residencyStartDate) : new Date(),
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
    scenarioSpecificAttributes: scenario.scenarioSpecificAttributes || [],
  };
}

// Helper function to find and validate scenario
function findAndValidateScenario(state: UserAppState, scenarioId: string): Scenario | null {
  const scenario = state.scenarios.find(s => s.id === scenarioId);
  if (!scenario) return null;
  return ensureValidScenario(scenario);
}

// Simple function to ensure asset data is valid
function ensureValidAsset(asset: Asset): Asset {
  return {
    ...asset,
    name: asset.name || '',
    quantity: asset.quantity || 0,
    costBasisPerUnit: asset.costBasisPerUnit || 0,
    acquisitionDate: asset.acquisitionDate ? new Date(asset.acquisitionDate) : new Date(),
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

export const useUserAppState = create<UserAppStateSlice>()(
  persist(
    (set, get) => ({
      // Initial state
      activePlanInternalName: '',
      initialAssets: [],
      scenarios: [],
      selectedScenarioIds: [],
      userQualitativeGoals: [],

      // Actions
      setActivePlanInternalName: (name: string) => set({ activePlanInternalName: name }),
      
      addAsset: (asset: Asset) => set((state) => ({
        initialAssets: [...state.initialAssets, { ...asset, id: uuid() }]
      })),
      
      updateAsset: (assetId: string, updatedAsset: Partial<Asset>) => set((state) => ({
        initialAssets: state.initialAssets.map((asset) =>
          asset.id === assetId ? { ...asset, ...updatedAsset } : asset
        )
      })),
      
      deleteAsset: (assetId: string) => set((state) => ({
        initialAssets: state.initialAssets.filter((asset) => asset.id !== assetId)
      })),
      
      addScenario: (scenarioData: Omit<Scenario, 'id'>, options?: { isBaseline?: boolean }): Scenario => {
        const newId = uuid();
        const newScenario = ensureValidScenario({ ...scenarioData, id: newId });
        set((state) => {
          let selectedScenarioIds = state.selectedScenarioIds;
          if (!selectedScenarioIds || selectedScenarioIds.length === 0) {
            selectedScenarioIds = [newId];
          }
          return {
            scenarios: [...state.scenarios, newScenario],
            selectedScenarioIds
          };
        });
        return newScenario;
      },
      
      updateScenario: (scenarioId: string, updatedScenario: Partial<Scenario>) => set((state) => {
        const existingScenario = findAndValidateScenario(state, scenarioId);
        if (!existingScenario) return state;

        const mergedScenario = ensureValidScenario({
          ...existingScenario,
          ...updatedScenario
        });

        return {
          scenarios: state.scenarios.map((scenario) =>
            scenario.id === scenarioId ? mergedScenario : scenario
          )
        };
      }),
      
      deleteScenario: (scenarioId: string) => set((state) => ({
        scenarios: state.scenarios.filter((scenario) => scenario.id !== scenarioId),
        selectedScenarioIds: state.selectedScenarioIds.filter(id => state.scenarios.some(s => s.id === id))
      })),
      
      setScenarioAsPrimary: (scenarioId: string) => set((state) => {
        const scenarioToMakePrimary = state.scenarios.find(s => s.id === scenarioId);
        if (!scenarioToMakePrimary) return state;

        const newScenarios = [
          scenarioToMakePrimary,
          ...state.scenarios.filter(s => s.id !== scenarioId)
        ];

        return {
          scenarios: newScenarios
        };
      }),
      
      addQualitativeGoal: (goal: UserQualitativeGoal) => set((state) => ({
        userQualitativeGoals: [...(state.userQualitativeGoals || []), goal]
      })),
      
      updateQualitativeGoal: (goalId: string, updatedGoal: Partial<UserQualitativeGoal>) => set((state) => ({
        userQualitativeGoals: (state.userQualitativeGoals || []).map((goal) =>
          goal.id === goalId ? { ...goal, ...updatedGoal } : goal
        )
      })),
      
      deleteQualitativeGoal: (goalId: string) => set((state) => ({
        userQualitativeGoals: (state.userQualitativeGoals || []).filter((goal) => goal.id !== goalId)
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
          scenarios: state.scenarios.map(s => s.id === scenarioId ? updatedScenario : s)
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

        return {
          scenarios: state.scenarios.map(s => s.id === scenarioId ? updatedScenario : s)
        };
      }),
      
      clearStoredState: () => set({
        activePlanInternalName: '',
        initialAssets: [],
        scenarios: [],
        userQualitativeGoals: [],
        selectedScenarioIds: []
      }),
      
      setAppState: (newState: UserAppState) => set(newState),
      
      setSelectedScenarioIds: (ids: string[]) => set({ selectedScenarioIds: ids }),

      // Income Source Actions
      addIncomeSource: (scenarioId: string, incomeSource: Omit<IncomeSource, 'id'>): IncomeSource => {
        const newIncomeSource = { ...incomeSource, id: uuid() };
        set((state) => {
          const scenario = findAndValidateScenario(state, scenarioId);
          if (!scenario) return state;

          const updatedScenario = {
            ...scenario,
            incomeSources: [...scenario.incomeSources, newIncomeSource]
          };

          return {
            scenarios: state.scenarios.map(s => s.id === scenarioId ? updatedScenario : s)
          };
        });
        return newIncomeSource;
      },

      updateIncomeSource: (scenarioId: string, incomeSourceId: string, updatedIncomeSource: Partial<IncomeSource>) => set((state) => {
        const scenario = findAndValidateScenario(state, scenarioId);
        if (!scenario) return state;

        const updatedScenario = {
          ...scenario,
          incomeSources: scenario.incomeSources.map(source =>
            source.id === incomeSourceId
              ? { ...source, ...updatedIncomeSource }
              : source
          )
        };

        return {
          scenarios: state.scenarios.map(s => s.id === scenarioId ? updatedScenario : s)
        };
      }),

      removeIncomeSource: (scenarioId: string, incomeSourceId: string) => set((state) => {
        const scenario = findAndValidateScenario(state, scenarioId);
        if (!scenario) return state;

        const updatedScenario = {
          ...scenario,
          incomeSources: scenario.incomeSources.filter(source => source.id !== incomeSourceId)
        };

        return {
          scenarios: state.scenarios.map(s => s.id === scenarioId ? updatedScenario : s)
        };
      }),

      // Expense Actions
      addExpense: (scenarioId: string, expense: Omit<AnnualExpense, 'id'> | Omit<OneTimeExpense, 'id'>, type: 'annual' | 'oneTime'): AnnualExpense | OneTimeExpense => {
        const newExpense = { ...expense, id: uuid() };
        set((state) => {
          const scenario = findAndValidateScenario(state, scenarioId);
          if (!scenario) return state;

          const updatedScenario = { ...scenario };
          if (type === 'annual') {
            updatedScenario.annualExpenses = [...(scenario.annualExpenses || []), newExpense as AnnualExpense];
          } else {
            updatedScenario.oneTimeExpenses = [...(scenario.oneTimeExpenses || []), newExpense as OneTimeExpense];
          }

          return {
            scenarios: state.scenarios.map(s => s.id === scenarioId ? updatedScenario : s)
          };
        });
        return newExpense;
      },

      updateExpense: (scenarioId: string, expenseId: string, updatedExpense: Partial<AnnualExpense | OneTimeExpense>, type: 'annual' | 'oneTime') => set((state) => {
        const scenario = findAndValidateScenario(state, scenarioId);
        if (!scenario) return state;

        const updatedScenario = { ...scenario };
        if (type === 'annual') {
          updatedScenario.annualExpenses = (scenario.annualExpenses || []).map(e => 
            e.id === expenseId ? { ...e, ...updatedExpense } : e
          );
        } else {
          updatedScenario.oneTimeExpenses = (scenario.oneTimeExpenses || []).map(e => 
            e.id === expenseId ? { ...e, ...updatedExpense } : e
          );
        }

        return {
          scenarios: state.scenarios.map(s => s.id === scenarioId ? updatedScenario : s)
        };
      }),

      removeExpense: (scenarioId: string, expenseId: string, type: 'annual' | 'oneTime') => set((state) => {
        const scenario = state.scenarios.find(s => s.id === scenarioId);
        if (!scenario) return state;

        const updatedScenario = { ...scenario };
        if (type === 'annual') {
          updatedScenario.annualExpenses = scenario.annualExpenses.filter(expense => expense.id !== expenseId);
        } else {
          updatedScenario.oneTimeExpenses = scenario.oneTimeExpenses.filter(expense => expense.id !== expenseId);
        }

        return {
          scenarios: state.scenarios.map(s => s.id === scenarioId ? updatedScenario : s)
        };
      }),

      // Asset Sale Actions
      addPlannedAssetSale: (scenarioId: string, sale: Omit<PlannedAssetSale, 'id'>): PlannedAssetSale => {
        const newSale = { ...sale, id: uuid() };
        set((state) => {
          const scenario = findAndValidateScenario(state, scenarioId);
          if (!scenario) return state;

          const updatedScenario = {
            ...scenario,
            plannedAssetSales: [...(scenario.plannedAssetSales || []), newSale]
          };

          return {
            scenarios: state.scenarios.map(s => s.id === scenarioId ? updatedScenario : s)
          };
        });
        return newSale;
      },

      updatePlannedAssetSale: (scenarioId: string, saleId: string, updatedSale: Partial<PlannedAssetSale>) => set((state) => {
        const scenario = findAndValidateScenario(state, scenarioId);
        if (!scenario) return state;

        const updatedScenario = {
          ...scenario,
          plannedAssetSales: (scenario.plannedAssetSales || []).map(s => 
            s.id === saleId ? { ...s, ...updatedSale } : s
          )
        };

        return {
          scenarios: state.scenarios.map(s => s.id === scenarioId ? updatedScenario : s)
        };
      }),

      removePlannedAssetSale: (scenarioId: string, saleId: string) => set((state) => {
        const scenario = state.scenarios.find(s => s.id === scenarioId);
        if (!scenario) return state;

        const updatedScenario = {
          ...scenario,
          plannedAssetSales: scenario.plannedAssetSales.filter(sale => sale.id !== saleId)
        };

        return {
          scenarios: state.scenarios.map(s => s.id === scenarioId ? updatedScenario : s)
        };
      }),

      // Copy Items Action
      copyItems: (scenarioId: string, items: any[], type: 'incomeSource' | 'annualExpense' | 'oneTimeExpense' | 'plannedAssetSale') => set((state) => {
        const scenario = state.scenarios.find(s => s.id === scenarioId);
        if (!scenario) return state;

        const updatedScenario = { ...scenario };
        const itemsWithNewIds = items.map(item => ({ ...item, id: uuid() }));

        switch (type) {
          case 'incomeSource':
            updatedScenario.incomeSources = [...(scenario.incomeSources || []), ...itemsWithNewIds];
            break;
          case 'annualExpense':
            updatedScenario.annualExpenses = [...(scenario.annualExpenses || []), ...itemsWithNewIds];
            break;
          case 'oneTimeExpense':
            updatedScenario.oneTimeExpenses = [...(scenario.oneTimeExpenses || []), ...itemsWithNewIds];
            break;
          case 'plannedAssetSale':
            updatedScenario.plannedAssetSales = [...(scenario.plannedAssetSales || []), ...itemsWithNewIds];
            break;
        }

        return {
          scenarios: state.scenarios.map(s => s.id === scenarioId ? updatedScenario : s)
        };
      }),
    }),
    {
      name: 'tax-scenarios-app-state',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure data integrity after loading from localStorage
          state.scenarios = state.scenarios.map(ensureValidScenario);
          state.initialAssets = state.initialAssets.map(ensureValidAsset);
          state.userQualitativeGoals = state.userQualitativeGoals.map(ensureValidPersonalGoal);
          
          // Set initial selected scenarios if none
          if (!state.selectedScenarioIds || state.selectedScenarioIds.length === 0) {
            if (state.scenarios && state.scenarios.length > 0) {
              state.selectedScenarioIds = [state.scenarios[0].id];
            }
          }
        }
      },
    }
  )
); 