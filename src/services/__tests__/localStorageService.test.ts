/**
 * @jest-environment jsdom
 */
import { saveActivePlanToStorage, loadActivePlanFromStorage, clearActivePlanFromStorage } from '../localStorageService';
import type { UserAppState } from '@/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('localStorageService', () => {
  const mockState: UserAppState = {
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

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('saveActivePlanToStorage', () => {
    it('should save state to localStorage', () => {
      const result = saveActivePlanToStorage(mockState);
      expect(result).toBe(true);
      expect(localStorage.getItem('tax-scenarios-active-plan')).toBeTruthy();
    });

    it('should handle invalid state', () => {
      const invalidState = { ...mockState, activePlanInternalName: undefined };
      const result = saveActivePlanToStorage(invalidState as any);
      expect(result).toBe(false);
    });
  });

  describe('loadActivePlanFromStorage', () => {
    it('should load state from localStorage', () => {
      saveActivePlanToStorage(mockState);
      const loadedState = loadActivePlanFromStorage();
      expect(loadedState).toEqual(mockState);
    });

    it('should return null if no state exists', () => {
      const loadedState = loadActivePlanFromStorage();
      expect(loadedState).toBeNull();
    });

    it('should return null if state is invalid', () => {
      localStorage.setItem('tax-scenarios-active-plan', 'invalid-data');
      const loadedState = loadActivePlanFromStorage();
      expect(loadedState).toBeNull();
    });
  });

  describe('clearActivePlanFromStorage', () => {
    it('should clear state from localStorage', () => {
      saveActivePlanToStorage(mockState);
      const result = clearActivePlanFromStorage();
      expect(result).toBe(true);
      expect(localStorage.getItem('tax-scenarios-active-plan')).toBeNull();
    });
  });
}); 