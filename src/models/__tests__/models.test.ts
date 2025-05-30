import { Asset, Scenario, ScenarioIncomeSource, AnnualExpense, CapitalGainsTaxRate } from '../index';

describe('Data Models', () => {
  describe('Asset', () => {
    it('should create a valid asset', () => {
      const asset: Asset = {
        id: 'test-asset',
        name: 'Test Asset',
        type: 'stock',
        value: 100000,
        growthRate: 0.05,
        incomeRate: 0.02,
        taxRate: 0.15
      };

      expect(asset).toBeDefined();
      expect(asset.id).toBe('test-asset');
      expect(asset.type).toBe('stock');
    });
  });

  describe('Scenario', () => {
    it('should create a valid scenario', () => {
      const scenario: Scenario = {
        id: 'test-scenario',
        name: 'Test Scenario',
        description: 'Test Description',
        incomeSources: [],
        expenses: [],
        assets: [],
        startYear: 2024,
        endYear: 2074
      };

      expect(scenario).toBeDefined();
      expect(scenario.id).toBe('test-scenario');
      expect(scenario.startYear).toBe(2024);
    });
  });

  describe('ScenarioIncomeSource', () => {
    it('should create a valid income source', () => {
      const incomeSource: ScenarioIncomeSource = {
        id: 'test-income',
        name: 'Test Income',
        amount: 50000,
        startYear: 2024,
        endYear: 2074,
        inflationAdjusted: true
      };

      expect(incomeSource).toBeDefined();
      expect(incomeSource.id).toBe('test-income');
      expect(incomeSource.inflationAdjusted).toBe(true);
    });
  });

  describe('AnnualExpense', () => {
    it('should create a valid expense', () => {
      const expense: AnnualExpense = {
        id: 'test-expense',
        name: 'Test Expense',
        amount: 30000,
        startYear: 2024,
        endYear: 2074,
        inflationAdjusted: true
      };

      expect(expense).toBeDefined();
      expect(expense.id).toBe('test-expense');
      expect(expense.inflationAdjusted).toBe(true);
    });
  });

  describe('CapitalGainsTaxRate', () => {
    it('should create a valid tax rate', () => {
      const taxRate: CapitalGainsTaxRate = {
        year: 2024,
        rate: 0.15
      };

      expect(taxRate).toBeDefined();
      expect(taxRate.year).toBe(2024);
      expect(taxRate.rate).toBe(0.15);
    });
  });
}); 