import type { QualitativeStatement } from '@/types';

interface StatementExample {
  statementId: string;
  pros: string[];
  cons: string[];
}

export const qualitativeStatementExamples: StatementExample[] = [
  // === FINANCIAL & ECONOMIC (fe) ===
  {
    statementId: "fe-low-tax",
    pros: [
      "No state income tax",
      "Low capital gains tax rates",
      "Favorable tax treaties with home country",
      "Tax incentives for foreign investors"
    ],
    cons: [
      "High progressive tax rates",
      "Complex tax system with many rules",
      "Double taxation on foreign income",
      "Limited tax deductions available"
    ]
  },
  {
    statementId: "fe-cost-living",
    pros: [
      "Affordable housing compared to income",
      "Low cost of groceries and daily essentials",
      "Reasonable healthcare costs",
      "Good value for money in services"
    ],
    cons: [
      "Expensive housing market",
      "High cost of imported goods",
      "Expensive healthcare system",
      "High cost of education"
    ]
  },
  {
    statementId: "fe-housing",
    pros: [
      "Wide range of affordable housing options",
      "Good quality construction standards",
      "Favorable property laws for foreigners",
      "Strong property rights protection"
    ],
    cons: [
      "Limited housing availability",
      "Restrictive property ownership laws",
      "High property taxes",
      "Poor construction quality"
    ]
  },

  // === QUALITY OF LIFE (ql) ===
  {
    statementId: "ql-work-life",
    pros: [
      "Standard 40-hour work week",
      "Generous vacation policies",
      "Flexible work arrangements common",
      "Strong labor protections"
    ],
    cons: [
      "Long working hours expected",
      "Limited vacation time",
      "Work culture prioritizes overtime",
      "Poor work-life balance norms"
    ]
  },
  {
    statementId: "ql-food-culture",
    pros: [
      "Diverse international cuisine",
      "High quality local restaurants",
      "Fresh local ingredients available",
      "Vibrant food markets"
    ],
    cons: [
      "Limited food variety",
      "Expensive dining options",
      "Poor food quality standards",
      "Limited international cuisine"
    ]
  },
  {
    statementId: "ql-language",
    pros: [
      "English widely spoken in business",
      "Good English language education",
      "Many English-speaking expats",
      "English-friendly services"
    ],
    cons: [
      "Limited English proficiency",
      "Language barrier in daily life",
      "Few English-speaking services",
      "Local language required for integration"
    ]
  },

  // === HEALTH & SAFETY (hs) ===
  {
    statementId: "hs-healthcare",
    pros: [
      "World-class medical facilities",
      "English-speaking doctors available",
      "Short wait times for specialists",
      "Modern medical technology"
    ],
    cons: [
      "Limited medical facilities",
      "Long wait times for care",
      "Language barrier with doctors",
      "Outdated medical equipment"
    ]
  },
  {
    statementId: "hs-safety",
    pros: [
      "Low crime rates",
      "Safe public transportation",
      "Well-lit streets at night",
      "Effective police presence"
    ],
    cons: [
      "High crime rates",
      "Unsafe public areas",
      "Corrupt law enforcement",
      "Political instability"
    ]
  },

  // === ENVIRONMENT & CLIMATE (ec) ===
  {
    statementId: "ec-weather",
    pros: [
      "Mild temperatures year-round",
      "Comfortable humidity levels",
      "Plenty of sunshine",
      "Minimal extreme weather"
    ],
    cons: [
      "Extreme heat in summer",
      "High humidity year-round",
      "Limited sunshine",
      "Frequent extreme weather"
    ]
  },
  {
    statementId: "ec-air",
    pros: [
      "Clean air quality",
      "Low pollution levels",
      "Good environmental regulations",
      "Green spaces throughout city"
    ],
    cons: [
      "Poor air quality",
      "High pollution levels",
      "Limited environmental protection",
      "Industrial areas nearby"
    ]
  },

  // === GOVERNANCE & FREEDOM (gf) ===
  {
    statementId: "gf-bureaucracy",
    pros: [
      "Efficient government services",
      "Online service availability",
      "Clear administrative processes",
      "Helpful government offices"
    ],
    cons: [
      "Slow government processes",
      "Complex paperwork requirements",
      "Corrupt officials",
      "Inefficient services"
    ]
  },
  {
    statementId: "gf-residency",
    pros: [
      "Clear residency pathways",
      "Reasonable requirements",
      "Fast processing times",
      "Good support for applicants"
    ],
    cons: [
      "Complex residency rules",
      "Long processing times",
      "Unclear requirements",
      "Restrictive policies"
    ]
  },

  // === OPPORTUNITY & DEVELOPMENT (od) ===
  {
    statementId: "od-career",
    pros: [
      "Strong job market in my field",
      "Competitive salaries",
      "Good career progression",
      "International companies present"
    ],
    cons: [
      "Limited job opportunities",
      "Low salary levels",
      "Few career advancement options",
      "Limited international presence"
    ]
  },
  {
    statementId: "od-infrastructure",
    pros: [
      "Modern transportation system",
      "Reliable high-speed internet",
      "Well-maintained roads",
      "Efficient public services"
    ],
    cons: [
      "Poor transportation network",
      "Unreliable internet service",
      "Bad road conditions",
      "Inadequate public services"
    ]
  }
]; 