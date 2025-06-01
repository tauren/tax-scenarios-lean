import type { Scenario, SpecialTaxFeature, GlobalQualitativeConcept, CapitalGainsTaxRate } from '@/types';

export interface AppConfig {
  templateScenarios: Scenario[];
  globalSpecialTaxFeatures: SpecialTaxFeature[];
  globalQualitativeConcepts: GlobalQualitativeConcept[];
  projectionPeriodYears: number;
} 