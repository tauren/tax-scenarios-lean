import { dateHydrationService } from '../dateHydrationService';

describe('dateHydrationService', () => {
  describe('reviver', () => {
    it('should convert ISO date strings to Date objects', () => {
      const json = JSON.stringify({
        date: '2024-01-01T00:00:00.000Z',
        nested: {
          date: '2024-01-02T00:00:00.000Z'
        }
      });

      const result = JSON.parse(json, dateHydrationService.reviver);
      expect(result.date).toBeInstanceOf(Date);
      expect(result.nested.date).toBeInstanceOf(Date);
      expect(result.date.toISOString()).toBe('2024-01-01T00:00:00.000Z');
      expect(result.nested.date.toISOString()).toBe('2024-01-02T00:00:00.000Z');
    });

    it('should not convert non-date strings', () => {
      const json = JSON.stringify({
        text: 'not a date',
        number: 123
      });

      const result = JSON.parse(json, dateHydrationService.reviver);
      expect(result.text).toBe('not a date');
      expect(result.number).toBe(123);
    });

    it('should handle invalid date strings gracefully', () => {
      const json = JSON.stringify({
        invalidDate: 'not-a-real-date'
      });

      const result = JSON.parse(json, dateHydrationService.reviver);
      expect(result.invalidDate).toBe('not-a-real-date');
    });
  });

  describe('replacer', () => {
    it('should convert Date objects to ISO strings', () => {
      const data = {
        date: new Date('2024-01-01T00:00:00.000Z'),
        nested: {
          date: new Date('2024-01-02T00:00:00.000Z')
        }
      };

      const result = JSON.parse(JSON.stringify(data, dateHydrationService.replacer));
      expect(result.date).toBe('2024-01-01T00:00:00.000Z');
      expect(result.nested.date).toBe('2024-01-02T00:00:00.000Z');
    });

    it('should not affect non-date values', () => {
      const data = {
        text: 'not a date',
        number: 123
      };

      const result = JSON.parse(JSON.stringify(data, dateHydrationService.replacer));
      expect(result.text).toBe('not a date');
      expect(result.number).toBe(123);
    });
  });
}); 