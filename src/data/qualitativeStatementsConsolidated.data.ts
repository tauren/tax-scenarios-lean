import type { QualitativeStatement } from '@/types';

export const qualitativeStatementsConsolidated: QualitativeStatement[] = [
    // === FINANCIAL & ECONOMIC (fe) ===
    { id: "fe-low-tax", statementText: "A favorable tax environment with low personal and capital gains tax rates", conceptId: "fe" },
    { id: "fe-cost-living", statementText: "A reasonable cost of living that allows for a comfortable lifestyle", conceptId: "fe" },
    { id: "fe-housing", statementText: "Access to affordable and quality housing options (rent or buy)", conceptId: "fe" },
    { id: "fe-currency", statementText: "A stable local currency and reliable banking system", conceptId: "fe" },
    { id: "fe-business", statementText: "A business-friendly environment with clear regulations and low bureaucracy", conceptId: "fe" },
    { id: "fe-investment", statementText: "Good opportunities for investment and wealth preservation", conceptId: "fe" },

    // === QUALITY OF LIFE (ql) ===
    { id: "ql-work-life", statementText: "A culture that values and supports a healthy work-life balance", conceptId: "ql" },
    { id: "ql-food-culture", statementText: "A vibrant and diverse culinary scene with good restaurants", conceptId: "ql" },
    { id: "ql-arts", statementText: "Rich cultural offerings including museums, theater, and music venues", conceptId: "ql" },
    { id: "ql-outdoors", statementText: "Abundant opportunities for outdoor recreation and nature activities", conceptId: "ql" },
    { id: "ql-language", statementText: "English is widely spoken, making daily life easier", conceptId: "ql" },
    { id: "ql-community", statementText: "A welcoming and active expat community for social support", conceptId: "ql" },
    { id: "ql-integration", statementText: "Ease of social integration with the local population", conceptId: "ql" },

    // === HEALTH & SAFETY (hs) ===
    { id: "hs-healthcare", statementText: "Access to high-quality, modern medical facilities and specialists", conceptId: "hs" },
    { id: "hs-health-cost", statementText: "Affordable healthcare costs and comprehensive insurance options", conceptId: "hs" },
    { id: "hs-safety", statementText: "Low crime rates and a strong sense of personal safety", conceptId: "hs" },
    { id: "hs-stability", statementText: "A stable political environment, distant from geopolitical conflicts", conceptId: "hs" },
    { id: "hs-emergency", statementText: "Quick access to emergency services and good response times", conceptId: "hs" },

    // === ENVIRONMENT & CLIMATE (ec) ===
    { id: "ec-weather", statementText: "A comfortable climate with moderate temperatures year-round", conceptId: "ec" },
    { id: "ec-seasons", statementText: "Four distinct seasons with varied weather patterns", conceptId: "ec" },
    { id: "ec-air", statementText: "High air quality with low pollution levels", conceptId: "ec" },
    { id: "ec-nature", statementText: "Access to beautiful natural landscapes and outdoor spaces", conceptId: "ec" },
    { id: "ec-sustainability", statementText: "Strong environmental policies and sustainability initiatives", conceptId: "ec" },

    // === GOVERNANCE & FREEDOM (gf) ===
    { id: "gf-democracy", statementText: "A stable democratic system with strong rule of law", conceptId: "gf" },
    { id: "gf-bureaucracy", statementText: "Simple, efficient, and transparent government bureaucracy", conceptId: "gf" },
    { id: "gf-residency", statementText: "Clear and attainable pathways to long-term residency or citizenship", conceptId: "gf" },
    { id: "gf-freedoms", statementText: "Strong protection of personal freedoms and civil rights", conceptId: "gf" },
    { id: "gf-corruption", statementText: "Low levels of corruption and transparent governance", conceptId: "gf" },

    // === OPPORTUNITY & DEVELOPMENT (od) ===
    { id: "od-career", statementText: "Good job opportunities in my field with competitive salaries", conceptId: "od" },
    { id: "od-entrepreneur", statementText: "A favorable environment for entrepreneurs and starting a business", conceptId: "od" },
    { id: "od-education", statementText: "Access to high-quality international schools and universities", conceptId: "od" },
    { id: "od-infrastructure", statementText: "Modern infrastructure including reliable internet and transportation", conceptId: "od" },
    { id: "od-connectivity", statementText: "Excellent international connectivity via major airports", conceptId: "od" },
    { id: "od-innovation", statementText: "A forward-thinking environment with opportunities for growth", conceptId: "od" }
]; 