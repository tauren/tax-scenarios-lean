import { getInitialAssets, getTemplateScenarios, getCapitalGainsTaxRates, getGlobalQualitativeConcepts, getSpecialTaxFeatures } from '../appConfigService';

describe('App Config Service', () => {
  describe('getInitialAssets', () => {
    it('should return initial assets', () => {
      const assets = getInitialAssets();
      expect(assets).toBeDefined();
      expect(assets.length).toBeGreaterThan(0);
      expect(assets[0].id).toBe('stock-portfolio');
    });
  });

  describe('getTemplateScenarios', () => {
    it('should return template scenarios', () => {
      const scenarios = getTemplateScenarios();
      expect(scenarios).toBeDefined();
      expect(scenarios.length).toBeGreaterThan(0);
      expect(scenarios[0].id).toBe('conservative');
    });
  });

  describe('getCapitalGainsTaxRates', () => {
    it('should return capital gains tax rates', () => {
      const taxRates = getCapitalGainsTaxRates();
      expect(taxRates).toBeDefined();
      expect(taxRates.length).toBeGreaterThan(0);
      expect(taxRates[0].year).toBe(2024);
    });
  });

  describe('getGlobalQualitativeConcepts', () => {
    it('should return an array of qualitative concepts', () => {
      const concepts = getGlobalQualitativeConcepts();
      expect(concepts).toBeDefined();
      expect(concepts.length).toBeGreaterThan(0);
    });

    it('should return concepts with required properties', () => {
      const concepts = getGlobalQualitativeConcepts();
      const firstConcept = concepts[0];
      
      expect(firstConcept).toHaveProperty('id');
      expect(firstConcept).toHaveProperty('name');
      expect(firstConcept).toHaveProperty('category');
      expect(firstConcept).toHaveProperty('description');
    });

    it('should have at least 10 concepts as per story requirements', () => {
      const concepts = getGlobalQualitativeConcepts();
      expect(concepts.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('getSpecialTaxFeatures', () => {
    it('should return an array of special tax features', () => {
      const features = getSpecialTaxFeatures();
      expect(features).toBeDefined();
      expect(features.length).toBeGreaterThan(0);
    });

    it('should return features with required properties', () => {
      const features = getSpecialTaxFeatures();
      const firstFeature = features[0];
      
      expect(firstFeature).toHaveProperty('id');
      expect(firstFeature).toHaveProperty('name');
      expect(firstFeature).toHaveProperty('description');
      expect(firstFeature).toHaveProperty('appliesTo');
    });

    it('should have at least 2 features as per story requirements', () => {
      const features = getSpecialTaxFeatures();
      expect(features.length).toBeGreaterThanOrEqual(2);
    });
  });
}); 