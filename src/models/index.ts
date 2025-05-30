export interface Asset {
  id: string;
  name: string;
  type: 'stock' | 'bond' | 'real-estate' | 'cash';
  value: number;
  growthRate: number;
  incomeRate: number;
  taxRate: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  incomeSources: ScenarioIncomeSource[];
  expenses: AnnualExpense[];
  assets: Asset[];
  startYear: number;
  endYear: number;
}

export interface ScenarioIncomeSource {
  id: string;
  name: string;
  amount: number;
  startYear: number;
  endYear: number;
  inflationAdjusted: boolean;
}

export interface AnnualExpense {
  id: string;
  name: string;
  amount: number;
  startYear: number;
  endYear: number;
  inflationAdjusted: boolean;
}

export interface CapitalGainsTaxRate {
  year: number;
  rate: number;
}

export interface QualitativeCategory {
  id: string;
  name: string;
  description: string;
  rationale: string;
  exampleConcepts: string[];
}

export interface GlobalQualitativeConcept {
  id: string;
  name: string;
  category: string;
  description: string;
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