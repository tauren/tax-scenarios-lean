import {
  createValidationError,
  createCalculationError,
  createSystemError,
  isCalculationError,
  ERROR_CODES,
} from '../calculationErrors';

describe('calculationErrors', () => {
  describe('createValidationError', () => {
    it('should create a validation error', () => {
      const error = createValidationError('Invalid scenario', { scenarioId: 'test' });
      expect(error).toEqual({
        code: ERROR_CODES.INVALID_SCENARIO,
        message: 'Invalid scenario',
        details: { scenarioId: 'test' },
        source: 'VALIDATION',
      });
    });
  });

  describe('createCalculationError', () => {
    it('should create a calculation error', () => {
      const error = createCalculationError('Calculation failed', { year: 2024 });
      expect(error).toEqual({
        code: ERROR_CODES.CALCULATION_FAILED,
        message: 'Calculation failed',
        details: { year: 2024 },
        source: 'CALCULATION',
      });
    });
  });

  describe('createSystemError', () => {
    it('should create a system error', () => {
      const error = createSystemError('System error', { error: 'test' });
      expect(error).toEqual({
        code: ERROR_CODES.CALCULATION_FAILED,
        message: 'System error',
        details: { error: 'test' },
        source: 'SYSTEM',
      });
    });
  });

  describe('isCalculationError', () => {
    it('should return true for calculation errors', () => {
      const error = createCalculationError('Test error');
      expect(isCalculationError(error)).toBe(true);
    });

    it('should return false for non-calculation errors', () => {
      expect(isCalculationError(new Error('Test error'))).toBe(false);
      expect(isCalculationError(null)).toBe(false);
      expect(isCalculationError(undefined)).toBe(false);
      expect(isCalculationError({})).toBe(false);
    });
  });
}); 