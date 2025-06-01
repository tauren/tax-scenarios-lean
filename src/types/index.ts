export interface UserAppState {
  activePlanInternalName: string;
  initialAssets: Asset[];
  scenarios: Scenario[];
}

export interface UserAppStateSlice extends UserAppState {
  setActivePlanInternalName: (name: string) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (assetId: string, updatedAsset: Partial<Asset>) => void;
  deleteAsset: (assetId: string) => void;
  addScenario: (scenario: Scenario, options?: { isBaseline?: boolean }) => void;
  updateScenario: (scenarioId: string, updatedScenario: Partial<Scenario>) => void;
  deleteScenario: (scenarioId: string) => void;
}

export interface Asset {
  id: string;
  name: string;
  quantity: number;
  costBasisPerUnit: number;
  acquisitionDate: Date;
  assetType?: string;
  fmvPerUnit?: number;
}

export interface Scenario {
  id: string;
  name: string;
  projectionPeriod: number; // in years
  residencyStartDate: Date;
  location: {
    country: string;
    state?: string;
    city?: string;
  };
  tax: {
    capitalGains: {
      shortTermRate: number;
      longTermRate: number;
      specialConditions?: string;
    };
  };
  incomeSources: ScenarioIncomeSource[];
  annualExpenses: AnnualExpense[];
  oneTimeExpenses: OneTimeExpense[];
}

export interface ScenarioIncomeSource {
  id: string;
  name: string;
  type: 'EMPLOYMENT' | 'RENTAL_PROPERTY' | 'OTHER';
  annualAmount: number;
  startYear: number;
  endYear?: number;
}

export interface AnnualExpense {
  id: string;
  name: string;
  amount: number;
}

export interface OneTimeExpense {
  id: string;
  name: string;
  amount: number;
  year: number;
}

export const EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Healthcare',
  'Insurance',
  'Entertainment',
  'Education',
  'Personal Care',
  'Debt Payments',
  'Savings',
  'Investments',
  'Taxes',
  'Legal', 
  'Other'
] as const; 