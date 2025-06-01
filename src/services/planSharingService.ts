import type { UserAppState } from '@/types';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

/**
 * Generates a shareable URL string from a UserAppState object
 * @param planState The UserAppState to share
 * @returns A URL-safe encoded string, or null if generation fails
 */
export function generateShareableString(planState: UserAppState): string | null {
  if (!planState || !planState.activePlanInternalName) {
    return null;
  }

  try {
    const jsonString = JSON.stringify(planState);
    return compressToEncodedURIComponent(jsonString);
  } catch (error) {
    console.error('Error generating shareable string:', error);
    return null;
  }
}

/**
 * Parses a shareable URL string back into a UserAppState object
 * @param encodedString The URL-safe encoded string to parse
 * @returns The parsed UserAppState, or null if parsing fails
 */
export function parseShareableString(encodedString: string): UserAppState | null {
  if (!encodedString) {
    return null;
  }

  try {
    const jsonString = decompressFromEncodedURIComponent(encodedString);
    if (!jsonString) return null;

    const parsedState = JSON.parse(jsonString) as UserAppState;
    
    // Basic structural validation
    if (!parsedState || typeof parsedState !== 'object') {
      throw new Error('Invalid state structure');
    }

    // Validate required fields
    if (!parsedState.activePlanInternalName) {
      throw new Error('Missing required field: activePlanInternalName');
    }

    // Ensure arrays exist
    if (!Array.isArray(parsedState.initialAssets)) {
      parsedState.initialAssets = [];
    }
    if (!Array.isArray(parsedState.scenarios)) {
      parsedState.scenarios = [];
    }

    return parsedState;
  } catch (error) {
    console.error('Error parsing shareable string:', error);
    return null;
  }
} 