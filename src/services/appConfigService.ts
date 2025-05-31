import type { Asset, Scenario, CapitalGainsTaxRate, GlobalQualitativeConcept, SpecialTaxFeature } from '../models';
import { initialAssets } from '../data/initialAssets.data';
import { templateScenarios } from '../data/templateScenarios.data';
import { capitalGainsTaxRates } from '../data/capitalGainsTaxRates.data';
import { globalQualitativeConcepts } from '../data/globalQualitativeConcepts.data';
import { specialTaxFeatures } from '../data/specialTaxFeatures.data';
import type { AppConfig } from '@/types/appConfig';

// Service functions
export const getInitialAssets = (): Asset[] => initialAssets;
export const getTemplateScenarios = (): Scenario[] => templateScenarios;
export const getCapitalGainsTaxRates = (): CapitalGainsTaxRate[] => capitalGainsTaxRates;
export const getGlobalQualitativeConcepts = (): GlobalQualitativeConcept[] => globalQualitativeConcepts;
export const getSpecialTaxFeatures = (): SpecialTaxFeature[] => specialTaxFeatures;

// Service object
export const appConfigService = {
  getConfig(): AppConfig {
    return {
      templateScenarios: getTemplateScenarios(),
      globalSpecialTaxFeatures: getSpecialTaxFeatures(),
      globalQualitativeConcepts: getGlobalQualitativeConcepts(),
      projectionPeriodYears: 50, // Default projection duration
    };
  },
}; 