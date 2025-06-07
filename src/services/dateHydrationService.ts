import { dateService } from './dateService';

/**
 * Service for handling date hydration during JSON serialization/deserialization.
 * This service ensures dates are properly converted between Date objects and strings
 * at the application boundaries (localStorage, URL sharing, etc.).
 */
export const dateHydrationService = {
  /**
   * Reviver function for JSON.parse() to convert date strings to Date objects.
   * @param _key - The current key being processed (unused)
   * @param value - The value to process
   * @returns The processed value
   */
  reviver: (_key: string, value: unknown): unknown => {
    // Check if the value is a string that looks like a date
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      try {
        return dateService.fromString(value);
      } catch (error) {
        console.warn(`Failed to parse date string: ${value}`, error);
        return value;
      }
    }
    return value;
  },

  /**
   * Replacer function for JSON.stringify() to convert Date objects to ISO strings.
   * @param _key - The current key being processed (unused)
   * @param value - The value to process
   * @returns The processed value
   */
  replacer: (_key: string, value: unknown): unknown => {
    if (dateService.isValidDate(value)) {
      return dateService.toString(value);
    }
    return value;
  }
}; 