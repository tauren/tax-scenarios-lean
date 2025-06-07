import { dateService } from '../dateService';

describe('dateService', () => {
  describe('fromString', () => {
    it('should convert valid ISO string to Date', () => {
      const dateStr = '2024-01-01T00:00:00.000Z';
      const date = dateService.fromString(dateStr);
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toBe(dateStr);
    });

    it('should throw error for invalid date string', () => {
      expect(() => dateService.fromString('invalid-date')).toThrow();
    });
  });

  describe('toString', () => {
    it('should convert Date to ISO string', () => {
      const date = new Date('2024-01-01T00:00:00.000Z');
      const str = dateService.toString(date);
      expect(str).toBe('2024-01-01T00:00:00.000Z');
    });
  });

  describe('formatForDisplay', () => {
    it('should format date for display', () => {
      const date = new Date('2024-01-01T00:00:00.000Z');
      const formatted = dateService.formatForDisplay(date);
      expect(typeof formatted).toBe('string');
      expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });
  });

  describe('formatForInput', () => {
    it('should format date for input', () => {
      const date = new Date('2024-01-01T00:00:00.000Z');
      const formatted = dateService.formatForInput(date);
      expect(formatted).toBe('2024-01-01');
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid Date', () => {
      expect(dateService.isValidDate(new Date())).toBe(true);
    });

    it('should return false for invalid Date', () => {
      expect(dateService.isValidDate(new Date('invalid'))).toBe(false);
    });

    it('should return false for non-Date values', () => {
      expect(dateService.isValidDate('2024-01-01')).toBe(false);
      expect(dateService.isValidDate(null)).toBe(false);
      expect(dateService.isValidDate(undefined)).toBe(false);
    });
  });
}); 