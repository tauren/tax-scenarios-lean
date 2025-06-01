import { generateShareableString, parseShareableString } from '../planSharingService';
import type { UserAppState } from '@/types';

describe('planSharingService', () => {
  const mockPlanState: UserAppState = {
    activePlanInternalName: 'Test Plan',
    initialAssets: [
      {
        id: '1',
        name: 'Test Asset',
        quantity: 100,
        costBasisPerUnit: 10,
        acquisitionDate: new Date('2023-01-01'),
      },
    ],
    scenarios: [
      {
        id: '1',
        name: 'Test Scenario',
        projectionPeriod: 5,
        residencyStartDate: new Date('2023-01-01'),
        location: {
          country: 'US',
          state: 'CA',
        },
        tax: {
          capitalGains: {
            shortTermRate: 0.1,
            longTermRate: 0.2,
          },
        },
        incomeSources: [],
        annualExpenses: [],
        oneTimeExpenses: [],
      },
    ],
  };

  describe('generateShareableString', () => {
    it('should generate a compressed string from a valid plan state', () => {
      const result = generateShareableString(mockPlanState);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should return null for invalid plan state', () => {
      const result = generateShareableString({} as UserAppState);
      expect(result).toBeNull();
    });

    it('should return null for null input', () => {
      const result = generateShareableString(null as unknown as UserAppState);
      expect(result).toBeNull();
    });
  });

  describe('parseShareableString', () => {
    it('should parse a valid compressed string back into a plan state', () => {
      const compressed = generateShareableString(mockPlanState);
      expect(compressed).toBeTruthy();
      
      const result = parseShareableString(compressed!);
      expect(result).toBeTruthy();
      expect(result?.activePlanInternalName).toBe(mockPlanState.activePlanInternalName);
      expect(result?.initialAssets.length).toBe(mockPlanState.initialAssets.length);
      expect(result?.scenarios.length).toBe(mockPlanState.scenarios.length);
    });

    it('should handle missing arrays by initializing them as empty', () => {
      const planWithoutArrays = {
        activePlanInternalName: 'Test Plan',
      } as UserAppState;
      
      const compressed = generateShareableString(planWithoutArrays);
      expect(compressed).toBeTruthy();
      
      const result = parseShareableString(compressed!);
      expect(result).toBeTruthy();
      expect(Array.isArray(result?.initialAssets)).toBe(true);
      expect(result?.initialAssets.length).toBe(0);
      expect(Array.isArray(result?.scenarios)).toBe(true);
      expect(result?.scenarios.length).toBe(0);
    });

    it('should return null for invalid compressed string', () => {
      const result = parseShareableString('invalid-data');
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = parseShareableString('');
      expect(result).toBeNull();
    });

    it('should return null for null input', () => {
      const result = parseShareableString(null as unknown as string);
      expect(result).toBeNull();
    });
  });

  describe('round trip', () => {
    it('should maintain data integrity through compression and decompression', () => {
      const compressed = generateShareableString(mockPlanState);
      expect(compressed).toBeTruthy();
      
      const decompressed = parseShareableString(compressed!);
      expect(decompressed).toBeTruthy();
      
      // Compare key properties
      expect(decompressed?.activePlanInternalName).toBe(mockPlanState.activePlanInternalName);
      expect(decompressed?.initialAssets[0].name).toBe(mockPlanState.initialAssets[0].name);
      expect(decompressed?.initialAssets[0].quantity).toBe(mockPlanState.initialAssets[0].quantity);
      expect(decompressed?.scenarios[0].name).toBe(mockPlanState.scenarios[0].name);
      expect(decompressed?.scenarios[0].projectionPeriod).toBe(mockPlanState.scenarios[0].projectionPeriod);
    });
  });
}); 