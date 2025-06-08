/**
 * Service for handling date operations throughout the application.
 * This service provides consistent date handling and formatting.
 */
export const dateService = {
  /**
   * Converts a string to a Date object.
   * @param dateStr - The date string to convert (ISO format)
   * @returns A Date object
   * @throws Error if the date string is invalid
   */
  fromString: (dateStr: string): Date => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: ${dateStr}`);
    }
    return date;
  },

  /**
   * Converts a Date object to an ISO string.
   * @param date - The Date object to convert
   * @returns An ISO string representation of the date
   */
  toString: (date: Date): string => date.toISOString(),

  /**
   * Formats a date for display in the UI.
   * @param date - The Date object to format
   * @returns A localized date string in MM/DD/YYYY format
   */
  formatForDisplay: (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  },

  /**
   * Formats a date for use in HTML date inputs.
   * @param date - The Date object to format
   * @returns A YYYY-MM-DD string
   */
  formatForInput: (date: Date): string => date.toISOString().split('T')[0],

  /**
   * Validates if a value is a valid Date object.
   * @param value - The value to validate
   * @returns True if the value is a valid Date object
   */
  isValidDate: (value: unknown): value is Date => {
    if (!(value instanceof Date)) {
      return false;
    }
    return !isNaN(value.getTime());
  },

  /**
   * Gets the current year.
   * @returns The current year as a number
   */
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}; 