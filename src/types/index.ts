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
    treaties?: {
      countries: string[];
      specialProvisions?: string;
    };
  };
  costOfLiving?: {
    housing?: {
      averageRent?: number;
      averagePurchase?: number;
      currency?: string;
      notes?: string;
    };
    transportation?: {
      publicTransit?: number;
      carOwnership?: number;
      fuel?: number;
      currency?: string;
      notes?: string;
    };
    utilities?: {
      electricity?: number;
      water?: number;
      internet?: number;
      currency?: string;
      notes?: string;
    };
    healthcare?: {
      insurance?: number;
      outOfPocket?: number;
      currency?: string;
      notes?: string;
    };
    groceries?: {
      monthlyAverage?: number;
      currency?: string;
      notes?: string;
    };
    dining?: {
      averageMeal?: number;
      currency?: string;
      notes?: string;
    };
  };
  qualityOfLife?: {
    safety?: {
      crimeRate?: number;
      politicalStability?: number;
      notes?: string;
    };
    healthcare?: {
      quality?: number;
      accessibility?: number;
      internationalStandards?: boolean;
      notes?: string;
    };
    climate?: {
      averageTemperature?: string;
      humidity?: string;
      seasons?: string[];
      notes?: string;
    };
    infrastructure?: {
      internet?: number;
      transportation?: number;
      utilities?: number;
      notes?: string;
    };
    culture?: {
      languageBarrier?: number;
      expatCommunity?: number;
      culturalDifferences?: string[];
      notes?: string;
    };
    lifestyle?: {
      entertainment?: number;
      outdoorActivities?: number;
      shopping?: number;
      notes?: string;
    };
  };
  practical?: {
    expatProfile?: {
      typicalAge?: string;
      commonProfessions?: string[];
      averageStayDuration?: string;
      communitySize?: string;
    };
    challenges?: {
      commonIssues?: string[];
      solutions?: string[];
    };
    advantages?: {
      keyBenefits?: string[];
      uniqueFeatures?: string[];
    };
    recommendations?: {
      bestFor?: string[];
      notRecommendedFor?: string[];
      tips?: string[];
    };
  };
  specialFeatures?: {
    taxOptimization?: {
      uniqueRules?: string[];
      opportunities?: string[];
      restrictions?: string[];
    };
    residency?: {
      programs?: string[];
      requirements?: string[];
      benefits?: string[];
    };
  };
  incomeSources: IncomeSource[];
  annualExpenses: AnnualExpense[];
  oneTimeExpenses: OneTimeExpense[];
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
  'Debt Payments',
  'Savings',
  'Investments',
  'Taxes',
  'Legal', 
  'Other'
] as const; 