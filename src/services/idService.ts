import { nanoid } from 'nanoid';

/**
 * Service for generating unique IDs.
 * Uses nanoid for generating short, URL-friendly unique IDs.
 */
export const idService = {
  /**
   * Generates a unique ID.
   * @returns A unique ID string
   */
  generateId: (): string => {
    return nanoid();
  },

  /**
   * Generates a unique ID with a prefix.
   * @param prefix - The prefix to add to the ID
   * @returns A unique ID string with the specified prefix
   */
  generatePrefixedId: (prefix: string): string => {
    return `${prefix}_${nanoid()}`;
  }
}; 