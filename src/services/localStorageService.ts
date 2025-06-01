import type { UserAppState } from '../types';
import { compressObject, decompressObject } from '@/lib/utils/lzString';

const STORAGE_KEY = 'tax-scenarios-active-plan';

/**
 * Saves the active plan state to localStorage
 * @param planState The state to save
 * @returns true if successful, false otherwise
 */
export function saveActivePlanToStorage(state: UserAppState): boolean {
  if (!state || !state.activePlanInternalName) {
    return false;
  }
  const compressed = compressObject(state);
  if (!compressed) return false;
  localStorage.setItem(STORAGE_KEY, compressed);
  return true;
}

/**
 * Loads the active plan state from localStorage
 * @returns The loaded state, or null if not found or invalid
 */
export function loadActivePlanFromStorage(): UserAppState | null {
  try {
    const compressed = localStorage.getItem(STORAGE_KEY);
    if (!compressed) return null;

    const state = decompressObject<UserAppState>(compressed);
    if (!state || !isValidUserAppState(state)) return null;

    return state;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

/**
 * Validates that the loaded data matches the expected structure
 */
function isValidUserAppState(data: any): data is UserAppState {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.activePlanInternalName === 'string' &&
    Array.isArray(data.initialAssets) &&
    Array.isArray(data.scenarios)
  );
}

/**
 * Clears the active plan from localStorage
 * @returns true if successful, false otherwise
 */
export function clearActivePlanFromStorage(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
} 