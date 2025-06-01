import type { UserAppState } from '@/types';
import { compressObject, decompressObject } from '@/lib/utils/lzString';

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
        ? decompressObject<UserAppState>(currentData)
        : JSON.parse(currentData);

      if (currentState) {
        // Save the state in the new format
        const newData = enabled
          ? compressObject(currentState)
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
export function saveActivePlanToStorage(state: UserAppState): boolean {
  if (!state || !state.activePlanInternalName) {
    return false;
  }

  try {
    const data = isCompressionEnabled()
      ? compressObject(state)
      : JSON.stringify(state);
    
    localStorage.setItem(STORAGE_KEY, data);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Loads the active plan state from localStorage
 * @returns The loaded state, or null if not found or invalid
 */
export function loadActivePlanFromStorage(): UserAppState | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    return isCompressionEnabled()
      ? decompressObject<UserAppState>(data)
      : JSON.parse(data);
  } catch (error) {
    return null;
  }
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
    return false;
  }
} 