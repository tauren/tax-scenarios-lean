import { templateScenarios } from '@/data/templateScenarios.data';
import { qualitativeConcepts } from '@/data/qualitativeConcepts.data';
import { qualitativeStatements } from '@/data/qualitativeStatements.data';
import { specialTaxFeatures } from '@/data/specialTaxFeatures.data';
import { examplePlans } from '@/data/examplePlans.data';
import type { Scenario, SpecialTaxFeature, QualitativeConcept, QualitativeStatement, ExamplePlan } from '@/types';

// Service functions
export const getTemplateScenarios = (): Scenario[] => templateScenarios;
export const getQualitativeConcepts = (): QualitativeConcept[] => qualitativeConcepts;
export const getQualitativeStatements = (): QualitativeStatement[] => qualitativeStatements;
export const getSpecialTaxFeatures = (): SpecialTaxFeature[] => specialTaxFeatures;
export const getExamplePlans = (): ExamplePlan[] => examplePlans;

export interface AppConfig {
  templateScenarios: Scenario[];
  globalSpecialTaxFeatures: SpecialTaxFeature[];
  qualitativeConcepts: QualitativeConcept[];
  qualitativeStatements: QualitativeStatement[];
  projectionPeriodYears: number;
  examplePlans: ExamplePlan[];
}

// Service object
export const appConfigService = {
  getConfig: (): AppConfig => ({
    templateScenarios: getTemplateScenarios(),
    globalSpecialTaxFeatures: getSpecialTaxFeatures(),
    qualitativeConcepts: getQualitativeConcepts(),
    qualitativeStatements: getQualitativeStatements(),
    projectionPeriodYears: 30,
    examplePlans: getExamplePlans()
  })
}; 