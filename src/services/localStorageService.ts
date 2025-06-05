import type { UserAppState } from '@/types';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

const STORAGE_KEY = 'tax-scenarios-active-plan';
const COMPRESSION_KEY = 'tax-scenarios-use-compression';

export function isCompressionEnabled(): boolean {
  return localStorage.getItem(COMPRESSION_KEY) === 'true';
}

export function setCompressionEnabled(enabled: boolean): void {
  // Get current state
  const currentData = localStorage.getItem(STORAGE_KEY);
  if (currentData) {
    try {
      // Load the current state in its current format
      const currentState = isCompressionEnabled()
        ? JSON.parse(decompressFromEncodedURIComponent(currentData))
        : JSON.parse(currentData);

      if (currentState) {
        // Save the state in the new format
        const newData = enabled
          ? compressToEncodedURIComponent(JSON.stringify(currentState))
          : JSON.stringify(currentState);
        
        localStorage.setItem(STORAGE_KEY, newData);
      }
    } catch (error) {
      console.error('Error converting state during compression change:', error);
    }
  }

  // Update compression setting
  localStorage.setItem(COMPRESSION_KEY, enabled ? 'true' : 'false');
}

/**
 * Saves the active plan state to localStorage
 * @param planState The state to save
 * @returns true if successful, false otherwise
 */
export function saveActivePlanToStorage(planState: UserAppState): boolean {
  try {
    const stateToSave = { ...planState };
    if ('selectedScenarioIds' in planState) {
      stateToSave.selectedScenarioIds = planState.selectedScenarioIds;
    }
    const data = isCompressionEnabled()
      ? compressToEncodedURIComponent(JSON.stringify(stateToSave))
      : JSON.stringify(stateToSave);
    localStorage.setItem(STORAGE_KEY, data);
    return true;
  } catch (error) {
    console.error('Error saving plan to localStorage:', error);
    return false;
  }
}

/**
 * Loads the active plan state from localStorage
 * @returns The loaded state, or null if not found or invalid
 */
export function loadActivePlanFromStorage(): UserAppState | null {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return null;

    if (isCompressionEnabled()) {
      const jsonString = decompressFromEncodedURIComponent(storedData);
      if (!jsonString) return null;
      const loaded: any = JSON.parse(jsonString);
      if (loaded && !('selectedScenarioIds' in loaded)) {
        loaded.selectedScenarioIds = loaded.scenarios && loaded.scenarios.length > 0 ? [loaded.scenarios[0].id] : [];
      }
      return loaded;
    } else {
      const loaded: any = JSON.parse(storedData);
      if (loaded && !('selectedScenarioIds' in loaded)) {
        loaded.selectedScenarioIds = loaded.scenarios && loaded.scenarios.length > 0 ? [loaded.scenarios[0].id] : [];
      }
      return loaded;
    }
  } catch (error) {
    console.error('Error loading plan from localStorage:', error);
    return null;
  }
}

/**
 * Clears the active plan from localStorage
 * @returns true if successful, false otherwise
 */
export function clearActivePlanFromStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
} 