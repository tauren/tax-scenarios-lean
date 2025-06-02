import type { Scenario, SpecialTaxFeature, GlobalQualitativeConcept } from '@/types';

export interface AppConfig {
  templateScenarios: Scenario[];
  globalSpecialTaxFeatures: SpecialTaxFeature[];
  globalQualitativeConcepts: GlobalQualitativeConcept[];
  projectionPeriodYears: number;
} 