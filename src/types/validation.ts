export interface BaseValidationErrors {
  [key: string]: string | undefined;
}

export interface AssetValidationErrors extends BaseValidationErrors {
  name?: string;
  assetType?: string;
  quantity?: string;
  costBasisPerUnit?: string;
  acquisitionDate?: string;
  fmvPerUnit?: string;
}

export interface IncomeSourceValidationErrors extends BaseValidationErrors {
  name?: string;
  annualAmount?: string;
  startYear?: string;
  endYear?: string;
}

export interface AnnualExpenseValidationErrors extends BaseValidationErrors {
  name?: string;
  amount?: string;
}

export interface OneTimeExpenseValidationErrors extends BaseValidationErrors {
  name?: string;
  amount?: string;
  year?: string;
}

export interface ScenarioValidationErrors extends BaseValidationErrors {
  name?: string;
  country?: string;
  state?: string;
  city?: string;
  projectionPeriod?: string;
  residencyStartDate?: string;
  shortTermRate?: string;
  longTermRate?: string;
}

export type ValidationField<T> = keyof T;

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
}

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule;
}; 