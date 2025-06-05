import type { CalculationError } from '../types';

export const ERROR_CODES = {
  INVALID_SCENARIO: 'INVALID_SCENARIO',
  INVALID_ASSET: 'INVALID_ASSET',
  CALCULATION_FAILED: 'CALCULATION_FAILED',
  INVALID_TAX_RATE: 'INVALID_TAX_RATE',
  INVALID_YEAR: 'INVALID_YEAR',
} as const;

export const createValidationError = (
  message: string,
  details?: Record<string, unknown>
): CalculationError => ({
  code: ERROR_CODES.INVALID_SCENARIO,
  message,
  details,
  source: 'VALIDATION',
});

export const createCalculationError = (
  message: string,
  details?: Record<string, unknown>
): CalculationError => ({
  code: ERROR_CODES.CALCULATION_FAILED,
  message,
  details,
  source: 'CALCULATION',
});

export const createSystemError = (
  message: string,
  details?: Record<string, unknown>
): CalculationError => ({
  code: ERROR_CODES.CALCULATION_FAILED,
  message,
  details,
  source: 'SYSTEM',
});

export const isCalculationError = (error: unknown): error is CalculationError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'source' in error
  );
}; 