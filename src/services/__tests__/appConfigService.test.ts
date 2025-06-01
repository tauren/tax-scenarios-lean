import { getTemplateScenarios, getGlobalQualitativeConcepts, getSpecialTaxFeatures } from '../appConfigService';
import { templateScenarios } from '@/data/templateScenarios.data';
import { globalQualitativeConcepts } from '@/data/globalQualitativeConcepts.data';
import { specialTaxFeatures } from '@/data/specialTaxFeatures.data';

describe('App Config Service', () => {
  describe('getTemplateScenarios', () => {
    it('should return template scenarios', () => {
      const scenarios = getTemplateScenarios();
      expect(scenarios).toEqual(templateScenarios);
    });
  });

  describe('getGlobalQualitativeConcepts', () => {
    it('should return global qualitative concepts', () => {
      const concepts = getGlobalQualitativeConcepts();
      expect(concepts).toEqual(globalQualitativeConcepts);
    });
  });

  describe('getSpecialTaxFeatures', () => {
    it('should return special tax features', () => {
      const features = getSpecialTaxFeatures();
      expect(features).toEqual(specialTaxFeatures);
    });
  });
}); 