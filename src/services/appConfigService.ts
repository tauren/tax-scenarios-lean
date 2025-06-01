import { templateScenarios } from '@/data/templateScenarios.data';
import { globalQualitativeConcepts } from '@/data/globalQualitativeConcepts.data';
import { specialTaxFeatures } from '@/data/specialTaxFeatures.data';
import type { Scenario, SpecialTaxFeature, GlobalQualitativeConcept } from '@/types';

// Service functions
export const getTemplateScenarios = (): Scenario[] => templateScenarios;
export const getGlobalQualitativeConcepts = (): GlobalQualitativeConcept[] => globalQualitativeConcepts;
export const getSpecialTaxFeatures = (): SpecialTaxFeature[] => specialTaxFeatures;

export interface AppConfig {
  templateScenarios: Scenario[];
  globalSpecialTaxFeatures: SpecialTaxFeature[];
  globalQualitativeConcepts: GlobalQualitativeConcept[];
  projectionPeriodYears: number;
}

// Service object
export const appConfigService = {
  getConfig: (): AppConfig => ({
    templateScenarios: getTemplateScenarios(),
    globalSpecialTaxFeatures: getSpecialTaxFeatures(),
    globalQualitativeConcepts: getGlobalQualitativeConcepts(),
    projectionPeriodYears: 30
  })
}; 