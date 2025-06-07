import type { QualitativeStatement } from '@/types';

export const qualitativeStatements: QualitativeStatement[] = [
    // === FINANCIAL === (conceptId: "fi")
    { id: "fin-low-gct", statementText: "A low or zero Capital Gains Tax rate", conceptId: "fi" },
    { id: "fin-low-income-tax", statementText: "A low overall personal income tax burden", conceptId: "fi" },
    { id: "fin-affordable-housing", statementText: "Reasonable and affordable housing options (rent or buy)", conceptId: "fi" },
    { id: "fin-low-cost-living", statementText: "A low general cost of living (groceries, utilities, etc.)", conceptId: "fi" },
    { id: "fin-currency-stability", statementText: "A stable local currency and reliable banking system", conceptId: "fi" },

    // === LIFESTYLE & CULTURE === (conceptId: "lc")
    { id: "life-work-balance", statementText: "A culture that values a healthy work-life balance", conceptId: "lc" },
    { id: "life-food-scene", statementText: "A vibrant and diverse culinary and restaurant scene", conceptId: "lc" },
    { id: "life-nightlife", statementText: "Diverse and accessible entertainment and nightlife options", conceptId: "lc" },
    { id: "life-arts-culture", statementText: "A rich and active arts and cultural scene (museums, theater, music)", conceptId: "lc" },
    { id: "life-outdoor-rec", statementText: "Abundant opportunities for outdoor recreation (hiking, beaches, parks)", conceptId: "lc" },

    // === HEALTH & HEALTHCARE === (conceptId: "hh")
    { id: "hw-high-quality-health", statementText: "Access to high-quality, modern medical facilities and specialists", conceptId: "hh" },
    { id: "hw-affordable-health", statementText: "Affordable healthcare costs and comprehensive insurance options", conceptId: "hh" },

    // === SAFETY & STABILITY === (conceptId: "ss")
    { id: "ss-low-crime", statementText: "Low crime rates and a strong sense of personal safety", conceptId: "ss" },
    { id: "ss-political-stability", statementText: "A stable political environment, distant from geopolitical conflicts", conceptId: "ss" },

    // === ENVIRONMENT & CLIMATE === (conceptId: "ec")
    { id: "ec-sunny-climate", statementText: "A predominantly warm and sunny climate", conceptId: "ec" },
    { id: "ec-seasons-climate", statementText: "Four distinct seasons with varied weather", conceptId: "ec" },
    { id: "ec-clean-air", statementText: "High air and environmental quality with low pollution", conceptId: "ec" },

    // === GOVERNANCE & BUREAUCRACY === (conceptId: "gb")
    { id: "gov-low-bureaucracy", statementText: "Simple, efficient, and transparent government bureaucracy", conceptId: "gb" },
    { id: "gov-easy-residency", statementText: "Clear and attainable pathways to long-term residency or citizenship", conceptId: "gb" },
    { id: "gov-rule-of-law", statementText: "A strong and impartial rule of law that protects personal and property rights", conceptId: "gb" },

    // === INFRASTRUCTURE & CONNECTIVITY === (conceptId: "ic")
    { id: "infra-fast-internet", statementText: "Fast, reliable, and affordable high-speed internet", conceptId: "ic" },
    { id: "infra-public-transport", statementText: "Efficient, clean, and extensive public transportation", conceptId: "ic" },
    { id: "infra-airport", statementText: "Excellent connectivity via a major international airport", conceptId: "ic" },
    { id: "infra-walkability", statementText: "A highly walkable city center with pedestrian-friendly areas", conceptId: "ic" },

    // === CAREER & EDUCATION === (conceptId: "ce")
    { id: "ce-job-market", statementText: "A strong job market with opportunities in my field", conceptId: "ce" },
    { id: "ce-business-friendly", statementText: "A favorable environment for entrepreneurs and starting a business", conceptId: "ce" },
    { id: "ce-good-schools", statementText: "Access to high-quality international or private schools for children", conceptId: "ce" },
    { id: "ce-higher-ed", statementText: "Access to prestigious universities for higher education", conceptId: "ce" },

    // === SOCIAL & COMMUNITY === (conceptId: "sc")
    { id: "sc-english-spoken", statementText: "English is widely spoken, making daily life easy without the local language", conceptId: "sc" },
    { id: "sc-expat-community", statementText: "A large, active, and welcoming expat community", conceptId: "sc" },
    { id: "sc-easy-integration", statementText: "Ease of social integration with the local population", conceptId: "sc" },
    { id: "sc-family-proximity", statementText: "Geographic proximity to my family and friends", conceptId: "sc" },

    // === LEGAL & ADMINISTRATIVE === (conceptId: "la")
    { id: "la-simple-admin", statementText: "Simple, efficient, and transparent government bureaucracy", conceptId: "la" },
    { id: "la-clear-legal", statementText: "Clear and attainable pathways to long-term residency or citizenship", conceptId: "la" },
    { id: "la-rule-of-law", statementText: "A strong and impartial rule of law that protects personal and property rights", conceptId: "la" }
];

// [
//   {
//     id: "financial-1",
//     conceptId: "financial",
//     statementText: "I want to minimize my tax burden",
//     sentiment: "positive"
//   },
//   {
//     id: "financial-2",
//     conceptId: "financial",
//     statementText: "I want to maintain a high standard of living",
//     sentiment: "positive"
//   },
//   {
//     id: "lifestyle-1",
//     conceptId: "lifestyle",
//     statementText: "I want access to quality healthcare",
//     sentiment: "positive"
//   },
//   {
//     id: "lifestyle-2",
//     conceptId: "lifestyle",
//     statementText: "I want to live in a safe environment",
//     sentiment: "positive"
//   },
//   {
//     id: "career-1",
//     conceptId: "career",
//     statementText: "I want good career opportunities",
//     sentiment: "positive"
//   },
//   {
//     id: "career-2",
//     conceptId: "career",
//     statementText: "I want a good work-life balance",
//     sentiment: "positive"
//   },
//   {
//     id: "family-1",
//     conceptId: "family",
//     statementText: "I want to be close to family",
//     sentiment: "positive"
//   },
//   {
//     id: "family-2",
//     conceptId: "family",
//     statementText: "I want a strong social network",
//     sentiment: "positive"
//   },
//   {
//     id: "legal-1",
//     conceptId: "legal",
//     statementText: "I want simple administrative processes",
//     sentiment: "positive"
//   },
//   {
//     id: "legal-2",
//     conceptId: "legal",
//     statementText: "I want clear legal requirements",
//     sentiment: "positive"
//   }
// ]; 