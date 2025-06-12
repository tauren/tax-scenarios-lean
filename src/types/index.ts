import type { QualitativeGoalAlignment, ScenarioQualitativeAttribute } from '@/types/qualitative';

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
  // App State Actions
  setActivePlanInternalName: (name: string) => void;
  clearStoredState: () => void;
  setAppState: (newState: UserAppState) => void;
  setSelectedScenarioIds: (ids: string[]) => void;

  // Asset Actions
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  updateAsset: (assetId: string, updatedAsset: Partial<Asset>) => void;
  deleteAsset: (assetId: string) => void;

  // Qualitative Goal Actions
  addQualitativeGoal: (goal: Omit<UserQualitativeGoal, 'id'>) => void;
  updateQualitativeGoal: (goalId: string, updatedGoal: Partial<UserQualitativeGoal>) => void;
  deleteQualitativeGoal: (goalId: string) => void;

  // Scenario Actions
  addScenario: (scenarioData: Omit<Scenario, 'id'>, options?: { isBaseline?: boolean }) => Scenario;
  updateScenario: (scenarioId: string, updatedScenario: Partial<Scenario>) => void;
  deleteScenario: (scenarioId: string) => void;
  setScenarioAsPrimary: (scenarioId: string) => void;

  // Scenario Qualitative Attribute Actions
  updateScenarioAttribute: (scenarioId: string, attribute: ScenarioQualitativeAttribute) => void;
  deleteScenarioAttribute: (scenarioId: string, attributeId: string) => void;

  // Scenario Income Source Actions
  addIncomeSource: (scenarioId: string, incomeSource: Omit<IncomeSource, 'id'>) => IncomeSource;
  updateIncomeSource: (scenarioId: string, incomeSourceId: string, updatedIncomeSource: Partial<IncomeSource>) => void;
  removeIncomeSource: (scenarioId: string, incomeSourceId: string) => void;

  // Scenario Expense Actions
  addExpense: (scenarioId: string, expense: Omit<AnnualExpense, 'id'> | Omit<OneTimeExpense, 'id'>, type: 'annual' | 'oneTime') => AnnualExpense | OneTimeExpense;
  updateExpense: (scenarioId: string, expenseId: string, updatedExpense: Partial<AnnualExpense | OneTimeExpense>, type: 'annual' | 'oneTime') => void;
  removeExpense: (scenarioId: string, expenseId: string, type: 'annual' | 'oneTime') => void;

  // Scenario Asset Sale Actions
  addPlannedAssetSale: (scenarioId: string, sale: Omit<PlannedAssetSale, 'id'>) => PlannedAssetSale;
  updatePlannedAssetSale: (scenarioId: string, saleId: string, updatedSale: Partial<PlannedAssetSale>) => void;
  removePlannedAssetSale: (scenarioId: string, saleId: string) => void;

  // Scenario Copy Items Action
  copyItems: (scenarioId: string, items: any[], type: 'incomeSource' | 'annualExpense' | 'oneTimeExpense' | 'plannedAssetSale') => void;

  // New actions
  addScenarioAttribute: (scenarioId: string, attribute: Omit<ScenarioQualitativeAttribute, 'id'>) => void;
  addMultipleScenarioAttributes: (scenarioId: string, attributes: Omit<ScenarioQualitativeAttribute, 'id'>[]) => void;
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
  scenarioSpecificAttributes: ScenarioQualitativeAttribute[];
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
  aspects?: string[];
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
  name: string;
  weight: "Low" | "Medium" | "High" | "Critical";
}
