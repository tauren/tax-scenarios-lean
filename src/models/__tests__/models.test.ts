import type { Asset, Scenario, IncomeSource, AnnualExpense, CapitalGainsTaxRate } from '@/types';

describe('Types', () => {
  describe('Asset', () => {
    it('should have required properties', () => {
      const asset: Asset = {
        id: 'test-asset',
        name: 'Test Asset',
        quantity: 100,
        costBasisPerUnit: 10,
        acquisitionDate: new Date('2023-01-01')
      };

      expect(asset).toHaveProperty('id');
      expect(asset).toHaveProperty('name');
      expect(asset).toHaveProperty('quantity');
      expect(asset).toHaveProperty('costBasisPerUnit');
      expect(asset).toHaveProperty('acquisitionDate');
    });
  });

  describe('Scenario', () => {
    it('should have required properties', () => {
      const scenario: Scenario = {
        id: 'test-scenario',
        name: 'Test Scenario',
        projectionPeriod: 10,
        residencyStartDate: new Date('2023-01-01'),
        location: {
          country: 'Test Country'
        },
        tax: {
          capitalGains: {
            shortTermRate: 0.15,
            longTermRate: 0.10
          }
        },
        incomeSources: [],
        annualExpenses: [],
        oneTimeExpenses: []
      };

      expect(scenario).toHaveProperty('id');
      expect(scenario).toHaveProperty('name');
      expect(scenario).toHaveProperty('projectionPeriod');
      expect(scenario).toHaveProperty('residencyStartDate');
      expect(scenario).toHaveProperty('location');
      expect(scenario).toHaveProperty('tax');
      expect(scenario).toHaveProperty('incomeSources');
      expect(scenario).toHaveProperty('annualExpenses');
      expect(scenario).toHaveProperty('oneTimeExpenses');
    });
  });

  describe('IncomeSource', () => {
    it('should have required properties', () => {
      const incomeSource: IncomeSource = {
        id: 'test-income',
        name: 'Test Income',
        type: 'EMPLOYMENT',
        annualAmount: 100000,
        startYear: 2023
      };

      expect(incomeSource).toHaveProperty('id');
      expect(incomeSource).toHaveProperty('name');
      expect(incomeSource).toHaveProperty('type');
      expect(incomeSource).toHaveProperty('annualAmount');
      expect(incomeSource).toHaveProperty('startYear');
    });
  });

  describe('AnnualExpense', () => {
    it('should have required properties', () => {
      const expense: AnnualExpense = {
        id: 'test-expense',
        name: 'Test Expense',
        amount: 10000
      };

      expect(expense).toHaveProperty('id');
      expect(expense).toHaveProperty('name');
      expect(expense).toHaveProperty('amount');
    });
  });

  describe('CapitalGainsTaxRate', () => {
    it('should have required properties', () => {
      const taxRate: CapitalGainsTaxRate = {
        shortTermRate: 0.15,
        longTermRate: 0.10
      };

      expect(taxRate).toHaveProperty('shortTermRate');
      expect(taxRate).toHaveProperty('longTermRate');
    });
  });
}); 