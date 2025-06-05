export interface UserAppState {
  activePlanInternalName: string;
  initialAssets: Asset[];
  scenarios: Scenario[];
}

export interface UserAppStateSlice extends UserAppState {
  isDirty: boolean;
  setDirty: (isDirty: boolean) => void;
  setActivePlanInternalName: (name: string) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (assetId: string, updatedAsset: Partial<Asset>) => void;
  deleteAsset: (assetId: string) => void;
  addScenario: (scenario: Scenario, options?: { isBaseline?: boolean }) => void;
  updateScenario: (scenarioId: string, updatedScenario: Partial<Scenario>) => void;
  deleteScenario: (scenarioId: string) => void;
  setScenarioAsPrimary: (scenarioId: string) => void;
  setAppState: (newState: UserAppState) => void;
  clearStoredState: () => void;
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
    residencyRequirements?: {
      minimumStayDays: number;
      visaOptions: string[];
      specialPrograms?: string[];
    };
  };
  incomeSources: IncomeSource[];
  annualExpenses: AnnualExpense[];
  oneTimeExpenses: OneTimeExpense[];
  plannedAssetSales: PlannedAssetSale[];
}

export interface IncomeSource {
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
  startYear?: number;
  endYear?: number;
}

export interface OneTimeExpense {
  id: string;
  name: string;
  amount: number;
  year: number;
}

export interface CapitalGainsTaxRate {
  shortTermRate: number;
  longTermRate: number;
}

export interface QualitativeCategory {
  id: string;
  name: string;
  description: string;
  rationale: string;
  exampleConcepts: string[];
}

export interface SpecialTaxFeature {
  id: string;
  name: string;
  description: string;
  appliesTo: "INCOME" | "CAPITAL_GAINS" | "OTHER";
  inputs?: {
    key: string;
    type: "NUMBER" | "DATE" | "STRING" | "BOOLEAN";
    label: string;
    placeholder?: string;
  }[];
  requiresGainBifurcation?: boolean;
}

export interface GlobalQualitativeConcept {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface ExamplePlan {
  id: string;
  name: string;
  description: string;
  planDataParam: string;
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
  'Legal', 
  'Other'
] as const; 

export const INCOME_SOURCE_TYPE_LABELS: Record<IncomeSource['type'], string> = {
  EMPLOYMENT: 'Employment',
  RENTAL_PROPERTY: 'Rental Property',
  OTHER: 'Other'
};

export interface PlannedAssetSale {
  id: string;
  assetId: string;
  year: number;
  quantity: number;
  salePricePerUnit: number;
}
