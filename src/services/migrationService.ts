import { idService } from './idService';
import type { 
  UserAppState, 
  Scenario, 
  IncomeSource, 
  AnnualExpense, 
  OneTimeExpense, 
  PlannedAssetSale,
  UserQualitativeGoal,
  Asset
} from '@/types';
import type { ScenarioQualitativeAttribute } from '@/types/qualitative';

// Store the ID mapping in localStorage to ensure consistency across app reloads
const ID_MAPPING_KEY = 'uuid_to_nanoid_mapping';

/**
 * Migration service for converting UUIDs to nano-IDs.
 * This is a temporary migration script for development use only.
 */
export const migrationService = {
  /**
   * Gets or creates a new nano-ID for a UUID
   * @param oldId The UUID to convert
   * @returns The corresponding nano-ID
   */
  getNewId: (oldId: string): string => {
    // Load existing mapping or create new one
    const storedMapping = localStorage.getItem(ID_MAPPING_KEY);
    const idMapping = new Map<string, string>(
      storedMapping ? JSON.parse(storedMapping) : []
    );

    if (!idMapping.has(oldId)) {
      const newId = idService.generateId();
      console.log(`Mapping UUID ${oldId} to nano-ID ${newId}`);
      idMapping.set(oldId, newId);
      // Save mapping after each new ID is created
      localStorage.setItem(ID_MAPPING_KEY, JSON.stringify(Array.from(idMapping.entries())));
    }
    return idMapping.get(oldId)!;
  },

  /**
   * Cleans up nested state objects from the state
   * @param state The state to clean
   * @returns The cleaned state
   */
  cleanupNestedState: (state: any): any => {
    // If state is undefined or null, return empty state
    if (!state) {
      console.log('State is undefined or null, returning empty state');
      return {
        activePlanInternalName: '',
        initialAssets: [],
        scenarios: [],
        selectedScenarioIds: [],
        userQualitativeGoals: []
      };
    }

    // If state has a nested state property, use that instead
    if (typeof state === 'object' && 'state' in state) {
      console.log('Found nested state, cleaning up...');
      return migrationService.cleanupNestedState(state.state);
    }

    // If state has a version property, it's the new flat structure
    if (typeof state === 'object' && 'version' in state) {
      console.log('Found version property, removing it...');
      const { version, ...stateWithoutVersion } = state;
      return stateWithoutVersion;
    }

    return state;
  },

  /**
   * Migrates UUIDs to nano-IDs in the app state.
   * Maintains referential integrity by using a consistent mapping stored in localStorage.
   * Processes entities in dependency order to ensure all references are maintained.
   * Preserves concept IDs in qualitative goals as they are fixed identifiers.
   * @param state The current app state
   * @returns The migrated app state
   */
  migrateUuidsToNanoids: (state: UserAppState): UserAppState => {
    console.log('Starting migration of state:', state);
    
    // Clean up any nested state objects
    const cleanedState = migrationService.cleanupNestedState(state);
    console.log('Cleaned state:', cleanedState);
    
    // Create a deep copy of the state to avoid mutating the original
    const migratedState = JSON.parse(JSON.stringify(cleanedState)) as UserAppState;

    // Step 1: Migrate qualitative goals first (no dependencies)
    if (migratedState.userQualitativeGoals?.length) {
      console.log('Migrating qualitative goals...');
      migratedState.userQualitativeGoals = migratedState.userQualitativeGoals.map((goal: UserQualitativeGoal) => ({
        ...goal,
        id: migrationService.getNewId(goal.id),
        // Preserve conceptId as is - it's a fixed identifier
        conceptId: goal.conceptId
      }));
    }

    // Step 2: Migrate initial assets (no dependencies)
    if (migratedState.initialAssets?.length) {
      console.log('Migrating initial assets...');
      migratedState.initialAssets = migratedState.initialAssets.map((asset: Asset) => ({
        ...asset,
        id: migrationService.getNewId(asset.id)
      }));
    }

    // Step 3: Migrate scenarios and their dependent entities
    if (migratedState.activePlanInternalName && migratedState.scenarios?.length) {
      console.log('Migrating scenarios and their entities...');
      migratedState.scenarios = migratedState.scenarios.map((scenario: Scenario) => {
        const newScenario = { ...scenario };
        newScenario.id = migrationService.getNewId(scenario.id);

        // Step 3.1: Migrate scenario-specific attributes (depends on goals)
        if (newScenario.scenarioSpecificAttributes?.length) {
          newScenario.scenarioSpecificAttributes = newScenario.scenarioSpecificAttributes.map((attr: ScenarioQualitativeAttribute) => {
            // Look up the mapped goal's new ID from our mapping
            const newMappedGoalId = attr.mappedGoalId ? migrationService.getNewId(attr.mappedGoalId) : undefined;
            
            // Remove any legacy properties that are no longer needed
            const { scenarioId: _, ...attrWithoutLegacyProps } = attr as any;
            
            return {
              ...attrWithoutLegacyProps,
              id: migrationService.getNewId(attr.id),
              mappedGoalId: newMappedGoalId
            };
          });
        }

        // Step 3.2: Migrate income sources
        if (newScenario.incomeSources?.length) {
          newScenario.incomeSources = newScenario.incomeSources.map((source: IncomeSource) => ({
            ...source,
            id: migrationService.getNewId(source.id)
          }));
        }

        // Step 3.3: Migrate annual expenses
        if (newScenario.annualExpenses?.length) {
          newScenario.annualExpenses = newScenario.annualExpenses.map((expense: AnnualExpense) => ({
            ...expense,
            id: migrationService.getNewId(expense.id)
          }));
        }

        // Step 3.4: Migrate one-time expenses
        if (newScenario.oneTimeExpenses?.length) {
          newScenario.oneTimeExpenses = newScenario.oneTimeExpenses.map((expense: OneTimeExpense) => ({
            ...expense,
            id: migrationService.getNewId(expense.id)
          }));
        }

        // Step 3.5: Migrate planned asset sales (depends on initial assets)
        if (newScenario.plannedAssetSales?.length) {
          newScenario.plannedAssetSales = newScenario.plannedAssetSales.map((sale: PlannedAssetSale) => {
            // Look up the asset's new ID from our mapping
            const newAssetId = migrationService.getNewId(sale.assetId);
            
            return {
              ...sale,
              id: migrationService.getNewId(sale.id),
              assetId: newAssetId || sale.assetId // Fallback to old ID if mapping not found
            };
          });
        }

        return newScenario;
      });
    }

    // Validate the migrated state using the store's validation functions
    console.log('Validating migrated state...');
    
    // Ensure all scenarios are valid
    if (migratedState.scenarios?.length) {
      migratedState.scenarios = migratedState.scenarios.map(scenario => ({
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
      }));
    }

    // Ensure all assets are valid
    if (migratedState.initialAssets?.length) {
      migratedState.initialAssets = migratedState.initialAssets.map(asset => ({
        ...asset,
        name: asset.name || '',
        quantity: asset.quantity || 0,
        costBasisPerUnit: asset.costBasisPerUnit || 0,
        acquisitionDate: asset.acquisitionDate ? new Date(asset.acquisitionDate) : new Date(),
        assetType: asset.assetType || '',
        fmvPerUnit: asset.fmvPerUnit || 0,
      }));
    }

    // Ensure all goals are valid
    if (migratedState.userQualitativeGoals?.length) {
      migratedState.userQualitativeGoals = migratedState.userQualitativeGoals.map(goal => ({
        ...goal,
        name: goal.name || '',
        weight: goal.weight || 'Medium',
      }));
    }

    console.log('Migration complete. New state:', migratedState);
    return migratedState;
  },

  /**
   * Cleans up the migration data after confirming successful migration.
   * Call this after verifying the migration worked correctly.
   */
  cleanupMigration: () => {
    localStorage.removeItem(ID_MAPPING_KEY);
  }
}; 