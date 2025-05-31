import { templateScenarios } from '@/data/templateScenarios.data';
import { specialTaxFeatures } from '@/data/specialTaxFeatures.data';
import { globalQualitativeConcepts } from '@/data/globalQualitativeConcepts.data';
import type { AppConfig } from '@/types/appConfig';

export function useAppConfig(): { data: AppConfig } {
  return {
    data: {
      templateScenarios,
      globalSpecialTaxFeatures: specialTaxFeatures,
      globalQualitativeConcepts,
      projectionPeriodYears: 50, // Default projection duration
    },
  };
} 