import type { Scenario, SpecialTaxFeature, GlobalQualitativeConcept } from '@/models';

export interface CapitalGainsTaxRate {
  shortTermRate: number;
  longTermRate: number;
}

export interface AppConfig {
  templateScenarios: Scenario[];
  globalSpecialTaxFeatures: SpecialTaxFeature[];
  globalQualitativeConcepts: GlobalQualitativeConcept[];
  projectionPeriodYears: number;
} 