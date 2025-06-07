import { getTemplateScenarios, getQualitativeConcepts, getQualitativeStatements, getSpecialTaxFeatures } from '../appConfigService';
import { templateScenarios } from '@/data/templateScenarios.data';
import { qualitativeConcepts } from '@/data/qualitativeConcepts.data';
import { qualitativeStatements } from '@/data/qualitativeStatements.data';
import { specialTaxFeatures } from '@/data/specialTaxFeatures.data';

describe('App Config Service', () => {
  describe('getTemplateScenarios', () => {
    it('should return template scenarios', () => {
      const scenarios = getTemplateScenarios();
      expect(scenarios).toEqual(templateScenarios);
    });
  });

  describe('getQualitativeConcepts', () => {
    it('should return qualitative concepts', () => {
      const concepts = getQualitativeConcepts();
      expect(concepts).toEqual(qualitativeConcepts);
    });
  });

  describe('getQualitativeStatements', () => {
    it('should return qualitative statements', () => {
      const statements = getQualitativeStatements();
      expect(statements).toEqual(qualitativeStatements);
    });
  });

  describe('getSpecialTaxFeatures', () => {
    it('should return special tax features', () => {
      const features = getSpecialTaxFeatures();
      expect(features).toEqual(specialTaxFeatures);
    });
  });
}); 