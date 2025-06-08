/**
 * Core application state representing the active plan.
 */
export interface UserAppState {
  activePlanInternalName: string;
  initialAssets: Asset[];
  scenarios: Scenario[];
  selectedScenarioIds: string[];
  userQualitativeGoals: UserQualitativeGoal[];
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
  setSelectedScenarioIds: (ids: string[]) => void;
  addQualitativeGoal: (goal: UserQualitativeGoal) => void;
  updateQualitativeGoal: (goalId: string, updatedGoal: Partial<UserQualitativeGoal>) => void;
  deleteQualitativeGoal: (goalId: string) => void;
}

/**
 * Represents an asset in the user's portfolio.
 * All dates are stored as native JavaScript Date objects.
 */
export interface Asset {
  id: string;
  name: string;
  quantity: number;
  costBasisPerUnit: number;
  acquisitionDate: Date; // Native JavaScript Date object
  assetType?: string;
  fmvPerUnit?: number;
}

/**
 * Represents a tax scenario with all its associated data.
 * All dates are stored as native JavaScript Date objects.
 */
export interface Scenario {
  id: string;
  name: string;
  projectionPeriod: number; // in years
  residencyStartDate: Date; // Native JavaScript Date object
  location: {
    country: string;
    state?: string;
    city?: string;
  };
  tax: {
    capitalGains: {
      shortTermRate: number;
      longTermRate: number;
    };
    incomeRate: number; // Effective tax rate for income
  };
  incomeSources: IncomeSource[];
  annualExpenses: AnnualExpense[];
  oneTimeExpenses: OneTimeExpense[];
  plannedAssetSales: PlannedAssetSale[];
  scenarioSpecificAttributes: ScenarioAttribute[];
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

export interface ScenarioYearlyProjection {
  year: number;
  taxBreakdown: TaxBreakdown;
  capitalGainsData: CapitalGainsData;
  income: number;
  expenses: number;
  netFinancialOutcome: number;
}

export interface ScenarioResults {
  yearlyProjections: ScenarioYearlyProjection[];
  totalNetFinancialOutcomeOverPeriod: number;
  qualitativeFitScore: number;
  goalAlignments: QualitativeGoalAlignment[];
  qualitativeScoreDetails?: {
    mappedAttributesCount: number;
    unmappedAttributesCount: number;
    goalContributions: {
      goalId: string;
      contribution: number;
    }[];
  };
}

export interface AppCalculatedState {
  resultsByScenario: { [scenarioId: string]: ScenarioResults };
}

export interface CapitalGainsData {
  shortTermGains: number;
  longTermGains: number;
  totalGains: number;
  taxableGains: number;
}

export interface TaxBreakdown {
  capitalGainsTax: number;
  incomeTax: number;
  totalTax: number;
}

export interface CalculationError extends Error {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  source: 'VALIDATION' | 'CALCULATION' | 'SYSTEM';
}

/**
 * Form-specific type that allows undefined values for numeric fields.
 * All dates are stored as native JavaScript Date objects.
 */
export interface FormScenario extends Omit<Scenario, 'projectionPeriod' | 'tax'> {
  projectionPeriod: number | undefined;
  tax: {
    capitalGains: {
      shortTermRate: number | undefined;
      longTermRate: number | undefined;
    };
    incomeRate: number | undefined;
  };
}

// Helper function to convert FormScenario to Scenario
export function convertFormScenarioToScenario(formScenario: FormScenario): Scenario {
  return {
    ...formScenario,
    projectionPeriod: formScenario.projectionPeriod ?? 0,
    tax: {
      capitalGains: {
        shortTermRate: formScenario.tax.capitalGains.shortTermRate ?? 0,
        longTermRate: formScenario.tax.capitalGains.longTermRate ?? 0
      },
      incomeRate: formScenario.tax.incomeRate ?? 0
    }
  };
}

export interface QualitativeConcept {
  id: string;
  name: string;
  description: string;
  category: string;
  statements: QualitativeStatement[];
}

export interface QualitativeStatement {
  id: string;
  conceptId: string;
  statementText: string;
  description?: string;
}

export interface UserQualitativeGoal {
  id: string;
  conceptId: string;
  statementId?: string;
  name: string;
  description?: string;
  weight: "Low" | "Medium" | "High" | "Critical";
  notes?: string;
}

export interface QualitativeGoalAlignment {
  goalId: string;
  goalName: string;
  isAligned: boolean;
  alignmentScore: number;
  contributingAttributes: {
    attributeId: string;
    conceptName: string;
    statementText?: string;
    contribution: number;
  }[];
}

export interface ScenarioAttribute {
  id: string;
  conceptId: string;
  statementId?: string;
  userSentiment: "Positive" | "Neutral" | "Negative";
  significanceToUser: "None" | "Low" | "Medium" | "High" | "Critical";
  notes?: string;
  mappedGoalId?: string;
}
