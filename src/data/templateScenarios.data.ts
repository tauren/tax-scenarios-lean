import type { Scenario, IncomeSource, AnnualExpense, OneTimeExpense } from '@/types';
import type { ScenarioQualitativeAttribute } from '@/types/qualitative';

// Define types for template items that extend from original types
type TemplateIncomeSource = Omit<IncomeSource, 'id'>;
type TemplateAnnualExpense = Omit<AnnualExpense, 'id'>;
type TemplateOneTimeExpense = Omit<OneTimeExpense, 'id'>;
type TemplateScenarioQualitativeAttribute = Omit<ScenarioQualitativeAttribute, 'id' | 'mappedGoalId'>;

// Define a type for template scenarios that extends from Scenario
export type TemplateScenario = Partial<Omit<Scenario, 'id' | 'incomeSources' | 'annualExpenses' | 'oneTimeExpenses' | 'scenarioSpecificAttributes'>> & {
  id: string;  // Keep the template ID required
  name: string;  // Keep the name required
  shortDescription?: string;
  longDescription?: string;
  keyReasons?: string[];
  location: {
    country: string;
    state?: string;
  };
  tax: {
    capitalGains: {
      shortTermRate: number;
      longTermRate: number;
    };
    incomeRate: number;
  };
  incomeSources?: TemplateIncomeSource[];
  annualExpenses?: TemplateAnnualExpense[];
  oneTimeExpenses?: TemplateOneTimeExpense[];
  scenarioSpecificAttributes?: TemplateScenarioQualitativeAttribute[];
};

export const templateScenarios: TemplateScenario[] = [
  {
    id: "template-blank",
    name: "Blank Template",
    location: {
      country: "Blank"
    },
    tax: {
      capitalGains: {
        shortTermRate: 0,
        longTermRate: 0,
      },
      incomeRate: 0
    }
  },
  {
    id: "template-portugal-bad",
    name: "Portugal BAD",
    location: {
      country: "Portugal"
    },
    tax: {
      capitalGains: {
        shortTermRate: 28,
        longTermRate: 28,
      },
      incomeRate: 28
    },
    incomeSources: [
      {
        name: "Salary",
        type: "EMPLOYMENT",
        annualAmount: 150000,
        startYear: 2025,
        endYear: undefined,
      },
      {
        name: "Rental Property",
        type: "RENTAL_PROPERTY",
        annualAmount: 30000,
        startYear: 2025,
        endYear: undefined,
      }
    ],
    annualExpenses: [
      {
        name: "Housing",
        amount: 3000,
      },
      {
        name: "Transportation",
        amount: 200,
      },
      {
        name: "Food",
        amount: 1000,
      },
      {
        name: "Utilities",
        amount: 200,
      },
      {
        name: "Healthcare",
        amount: 300,
      },
      {
        name: "Insurance",
        amount: 100,
      },
      {
        name: "Entertainment",
        amount: 400,
      },
      {
        name: "Education",
        amount: 400,
      },
      {
        name: "Personal Care",
        amount: 300,
      },
      {
        name: "Legal",
        amount: 5000,
      },
      {
        name: "Other",
        amount: 500,
      }
    ],
    oneTimeExpenses: [
      {
        name: "New Car",
        amount: 40000,
        year: 2025,
      },
      {
        name: "Rental Deposit",
        amount: 5000,
        year: 2025,
      },
      {
        name: "Furniture",
        amount: 20000,
        year: 2025,
      },
      {
        name: "Tax Program Donation",
        amount: 100000,
        year: 2025,
      }
    ]
  },
  {
    id: "template-california",
    name: "California",
    shortDescription: "The high-tax West Coast baseline with a strong economy and lifestyle benefits.",
    longDescription: "California is home to a leading tech and entertainment economy, beautiful coastline and mountain environments, and generally mild Mediterranean climate along the coast. It offers world-class universities and outdoor recreation. However, it has very high living costs (especially housing) and high state income taxes, making overall taxes among the highest in the U.S. Traffic congestion, wildfires and occasional severe weather (droughts, heat waves) are important considerations.",
    keyReasons: [
      "World-class economy and job opportunities (tech, entertainment, etc.)",
      "Excellent outdoor recreation (beaches, mountains, parks)",
      "High taxes and very high housing costs",
      "Mild coastal climate (sunny winters) but wildfire and drought risk",
      "Diverse culture and amenities, with strong public universities and healthcare"
    ],
    location: {
      country: "United States",
      state: "California"
    },
    tax: {
      capitalGains: {
        shortTermRate: 14,
        longTermRate: 14
      },
      incomeRate: 13
    },
    incomeSources: [
      {
        name: "Professional Salary",
        type: "EMPLOYMENT",
        annualAmount: 75000,
        startYear: 2025,
        endYear: undefined
      },
      {
        name: "US Rental Property Income",
        type: "RENTAL_PROPERTY",
        annualAmount: 24000,
        startYear: 2025,
        endYear: undefined
      }
    ],
    annualExpenses: [
      { name: "Housing", amount: 30000 },
      { name: "Transportation", amount: 3600 },
      { name: "Food", amount: 10000 },
      { name: "Utilities", amount: 3000 },
      { name: "Healthcare", amount: 4000 },
      { name: "Insurance", amount: 2000 },
      { name: "Entertainment", amount: 5000 },
      { name: "Education", amount: 0 },
      { name: "Personal Care", amount: 3000 },
      { name: "Legal", amount: 1000 },
      { name: "Other", amount: 4000 }
    ],
    oneTimeExpenses: [
      { name: "Emergency Fund Seed Money", amount: 5000, year: 2025 },
      { name: "Local Moving/Storage", amount: 2000, year: 2025 },
      { name: "Initial Furnishings", amount: 5000, year: 2025 }
    ],
    scenarioSpecificAttributes: [
      { name: "High state income tax (up to ~13%) and very high housing costs", sentiment: "Negative", significance: "Critical" },
      { name: "Mediterranean climate along the coast provides great weather for outdoor activities", sentiment: "Positive", significance: "Medium" },
      { name: "Excellent tech and entertainment job market (Silicon Valley, Hollywood)", sentiment: "Positive", significance: "Medium" },
      { name: "Traffic congestion and high population density in major cities", sentiment: "Negative", significance: "High" },
      { name: "Wildfire risk and occasional droughts/heat waves in summer", sentiment: "Negative", significance: "Medium" }
    ]
  },
  {
    id: "template-florida",
    name: "Florida",
    shortDescription: "Warm and tax-friendly state with beaches, but high humidity and hurricanes.",
    longDescription: "Florida offers year-round warm weather, miles of coastline and a relaxed beach lifestyle. There is no state income tax, which appeals to retirees and professionals alike. The cost of living and housing are generally lower than in California. Major cities like Miami and Orlando have growing amenities and international airports. Drawbacks include hot, humid summers and hurricane risk, and less public transit outside city centers.",
    keyReasons: [
      "No state income tax (significantly lower overall taxes)",
      "Warm, sunny climate and abundant beaches for outdoor life",
      "Lower housing and living costs compared to California",
      "Large retiree and expat community, English spoken everywhere",
      "Hurricane season and high summer humidity"
    ],
    location: {
      country: "United States",
      state: "Florida"
    },
    tax: {
      capitalGains: {
        shortTermRate: 0,
        longTermRate: 0
      },
      incomeRate: 0
    },
    incomeSources: [
      {
        name: "Professional Salary",
        type: "EMPLOYMENT",
        annualAmount: 75000,
        startYear: 2025,
        endYear: undefined
      },
      {
        name: "US Rental Property Income",
        type: "RENTAL_PROPERTY",
        annualAmount: 24000,
        startYear: 2025,
        endYear: undefined
      }
    ],
    annualExpenses: [
      { name: "Housing", amount: 15000 },
      { name: "Transportation", amount: 3000 },
      { name: "Food", amount: 6000 },
      { name: "Utilities", amount: 2400 },
      { name: "Healthcare", amount: 3000 },
      { name: "Insurance", amount: 1200 },
      { name: "Entertainment", amount: 4000 },
      { name: "Education", amount: 0 },
      { name: "Personal Care", amount: 2400 },
      { name: "Legal", amount: 1000 },
      { name: "Other", amount: 3000 }
    ],
    oneTimeExpenses: [
      { name: "Moving Truck (from CA to FL)", amount: 2000, year: 2025 },
      { name: "Rental Deposit (3 months rent)", amount: 6000, year: 2025 },
      { name: "Initial Furnishings", amount: 3000, year: 2025 },
      { name: "Car Shipping", amount: 1500, year: 2025 }
    ],
    scenarioSpecificAttributes: [
      { name: "No state income tax – significantly lower taxes than California", sentiment: "Positive", significance: "Critical" },
      { name: "Tropical climate and beaches support active outdoor lifestyle", sentiment: "Positive", significance: "Medium" },
      { name: "Hurricane season and high humidity in summer can be a major concern", sentiment: "Negative", significance: "High" },
      { name: "Lower cost of living and housing compared to many US states", sentiment: "Positive", significance: "Medium" },
      { name: "International airports and tourism infrastructure are well developed", sentiment: "Positive", significance: "Medium" }
    ]
  },
  {
    id: "template-puerto-rico",
    name: "Puerto Rico",
    shortDescription: "US territory with tropical climate, USD currency, and attractive tax incentives.",
    longDescription: "Puerto Rico combines tropical Caribbean living with many US conveniences (USD, US laws, no visa requirement). The cost of living is generally lower than the mainland US (especially housing). Crucially, Act 60 tax incentives allow new residents to pay 4% tax on certain income and 0% on capital gains earned after moving. Popular areas include San Juan and coastal towns. Drawbacks are hurricane risk, some infrastructure issues, and Spanish being the primary language.",
    keyReasons: [
      "US territory – no visa needed, USD currency, similar legal system",
      "Act 60 tax incentives: 4% flat tax and 0% on new capital gains",
      "Lower cost of living and affordable housing",
      "Beautiful beaches and warm climate year-round",
      "Hurricane season and less developed infrastructure"
    ],
    location: {
      country: "Puerto Rico"
    },
    tax: {
      capitalGains: {
        shortTermRate: 0,
        longTermRate: 0
      },
      incomeRate: 4
    },
    incomeSources: [
      {
        name: "Professional Salary",
        type: "EMPLOYMENT",
        annualAmount: 75000,
        startYear: 2025,
        endYear: undefined
      },
      {
        name: "US Rental Property Income",
        type: "RENTAL_PROPERTY",
        annualAmount: 24000,
        startYear: 2025,
        endYear: undefined
      }
    ],
    annualExpenses: [
      { name: "Housing", amount: 12000 },
      { name: "Transportation", amount: 2400 },
      { name: "Food", amount: 6000 },
      { name: "Utilities", amount: 2400 },
      { name: "Healthcare", amount: 3000 },
      { name: "Insurance", amount: 1200 },
      { name: "Entertainment", amount: 3000 },
      { name: "Education", amount: 0 },
      { name: "Personal Care", amount: 2400 },
      { name: "Legal", amount: 1000 },
      { name: "Other", amount: 3000 }
    ],
    oneTimeExpenses: [
      { name: "Flight to Puerto Rico (one-way)", amount: 800, year: 2025 },
      { name: "Act 60 legal/tax advisor fees", amount: 2000, year: 2025 },
      { name: "Rental Deposit (3 months)", amount: 4500, year: 2025 },
      { name: "Moving Services (partial)", amount: 1500, year: 2025 },
      { name: "Initial Furnishings", amount: 3000, year: 2025 }
    ],
    scenarioSpecificAttributes: [
      { name: "No US visa needed and US laws/currency apply", sentiment: "Positive", significance: "Critical" },
      { name: "Significant tax breaks for residents (Act 60: low income tax, 0% capital gains)", sentiment: "Positive", significance: "Critical" },
      { name: "Beautiful tropical scenery, but hurricane risk and summer heat are serious negatives", sentiment: "Negative", significance: "High" },
      { name: "Lower overall cost of living (especially housing) compared to mainland USA", sentiment: "Positive", significance: "Medium" },
      { name: "Spanish language predominates; English is common but fluency is recommended", sentiment: "Neutral", significance: "Medium" }
    ]
  },
  {
    id: "template-mexico",
    name: "Mexico",
    shortDescription: "Nearshoring favorite – rich culture, low costs, but some safety concerns.",
    longDescription: "Mexico offers diverse climates (beaches on coasts, cooler highlands) and a culture rich in history and cuisine. The cost of living is extremely low (often less than half of U.S. costs), especially outside major cities. Popular expat destinations (Mexico City, beach towns, colonial cities) have modern amenities. Proximity to the U.S. (geography, flights, and use of USD in tourist areas) is convenient. Downside: public safety varies by region (organized crime is a concern in some areas), and Spanish is needed for deep integration.",
    keyReasons: [
      "Low cost of living and affordable housing",
      "Proximity to the US (short flights, USD accepted in many areas)",
      "Vibrant culture, excellent food and warm climate",
      "Retirement visa options with moderate tax incentives",
      "Security issues in certain regions"
    ],
    location: {
      country: "Mexico"
    },
    tax: {
      capitalGains: {
        shortTermRate: 25,
        longTermRate: 25
      },
      incomeRate: 25
    },
    incomeSources: [
      {
        name: "Professional Salary",
        type: "EMPLOYMENT",
        annualAmount: 75000,
        startYear: 2025,
        endYear: undefined
      },
      {
        name: "US Rental Property Income",
        type: "RENTAL_PROPERTY",
        annualAmount: 24000,
        startYear: 2025,
        endYear: undefined
      }
    ],
    annualExpenses: [
      { name: "Housing", amount: 10000 },
      { name: "Transportation", amount: 3000 },
      { name: "Food", amount: 3600 },
      { name: "Utilities", amount: 1800 },
      { name: "Healthcare", amount: 1500 },
      { name: "Insurance", amount: 800 },
      { name: "Entertainment", amount: 2400 },
      { name: "Education", amount: 0 },
      { name: "Personal Care", amount: 1800 },
      { name: "Legal", amount: 500 },
      { name: "Other", amount: 2000 }
    ],
    oneTimeExpenses: [
      { name: "Temporary Resident Visa & Legal Fees", amount: 2000, year: 2025 },
      { name: "Rental Deposit (2-3 months)", amount: 3000, year: 2025 },
      { name: "International Moving (partial)", amount: 3000, year: 2025 },
      { name: "Initial Furnishings", amount: 3000, year: 2025 },
      { name: "Flight to Mexico", amount: 500, year: 2025 }
    ],
    scenarioSpecificAttributes: [
      { name: "Rich culture and cuisine with warm climate", sentiment: "Positive", significance: "Medium" },
      { name: "Extremely low cost of living – housing and food very affordable", sentiment: "Positive", significance: "Critical" },
      { name: "Close to the US – easy travel and familiar amenities", sentiment: "Positive", significance: "High" },
      { name: "Varying safety: organized crime is a concern in some regions", sentiment: "Negative", significance: "High" },
      { name: "Bureaucratic residency process and language barrier (Spanish)", sentiment: "Negative", significance: "Medium" }
    ]
  },
  {
    id: "template-panama",
    name: "Panama",
    shortDescription: "Modern Central American hub – USD, canal city, territorial tax system.",
    longDescription: "Panama combines a U.S. dollar economy with tropical surroundings and modern city life. Panama City has skyscrapers, an international airport, and excellent healthcare. The country uses territorial taxation: foreign-sourced income (like a US salary) is not taxed. The \"Friendly Nations Visa\" makes residency relatively easy for citizens of many countries. The climate is equatorial (hot and humid year-round, with a rainy season). Panama offers beaches and mountains (e.g., Boquete) for outdoor lovers. However, humidity and traffic in Panama City are downsides.",
    keyReasons: [
      "No tax on foreign income – only local Panama income is taxed",
      "USD currency and U.S.-style banking system (easy for Americans)",
      "Modern infrastructure and healthcare in Panama City",
      "Friendly Nations visa allows easy residency path",
      "Tropical climate: hot/humid all year with a rainy season"
    ],
    location: {
      country: "Panama"
    },
    tax: {
      capitalGains: {
        shortTermRate: 10,
        longTermRate: 10
      },
      incomeRate: 15
    },
    incomeSources: [
      {
        name: "Professional Salary",
        type: "EMPLOYMENT",
        annualAmount: 75000,
        startYear: 2025,
        endYear: undefined
      },
      {
        name: "US Rental Property Income",
        type: "RENTAL_PROPERTY",
        annualAmount: 24000,
        startYear: 2025,
        endYear: undefined
      }
    ],
    annualExpenses: [
      { name: "Housing", amount: 15000 },
      { name: "Transportation", amount: 2400 },
      { name: "Food", amount: 3600 },
      { name: "Utilities", amount: 2400 },
      { name: "Healthcare", amount: 2000 },
      { name: "Insurance", amount: 1200 },
      { name: "Entertainment", amount: 3000 },
      { name: "Education", amount: 0 },
      { name: "Personal Care", amount: 1200 },
      { name: "Legal", amount: 1000 },
      { name: "Other", amount: 2000 }
    ],
    oneTimeExpenses: [
      { name: "Friendly Nations Visa & Legal Fees", amount: 2000, year: 2025 },
      { name: "International Mover (partial)", amount: 4000, year: 2025 },
      { name: "Rental Deposit (3 months)", amount: 4500, year: 2025 },
      { name: "Initial Furnishings", amount: 3000, year: 2025 },
      { name: "Flight to Panama", amount: 800, year: 2025 }
    ],
    scenarioSpecificAttributes: [
      { name: "Territorial tax system: foreign income is not taxed locally", sentiment: "Positive", significance: "Critical" },
      { name: "USD currency and US-style banking, making finances straightforward", sentiment: "Positive", significance: "High" },
      { name: "Modern infrastructure and healthcare in Panama City", sentiment: "Positive", significance: "Medium" },
      { name: "Tropical climate (very hot and humid year-round) and rainy season", sentiment: "Negative", significance: "Medium" },
      { name: "Friendly Nations visa simplifies residency for many nationalities", sentiment: "Positive", significance: "Medium" }
    ]
  },
  {
    id: "template-paraguay",
    name: "Paraguay",
    shortDescription: "Low-profile, very low cost country with simple taxes but less development.",
    longDescription: "Paraguay offers an extremely affordable lifestyle (much cheaper than the US) and very low flat taxes. The income tax is a flat 10% for residents, and there's effectively no tax on foreign income. This can greatly extend retirement savings. Paraguay is largely Spanish/Guaraní speaking and has a more rural, relaxed feel. The climate is subtropical with hot summers (sometimes exceeding 40°C). Infrastructure is less developed than in popular expat countries, with limited internet and healthcare in rural areas. Expats need patience with bureaucracy and basic services.",
    keyReasons: [
      "Extremely low cost of living (esp. housing and food)",
      "Flat 10% personal income tax (no tax on foreign income)",
      "Warm climate and low population density",
      "Basic infrastructure in rural areas; limited expat community",
      "Generally safe with a laid-back lifestyle"
    ],
    location: {
      country: "Paraguay"
    },
    tax: {
      capitalGains: {
        shortTermRate: 8,
        longTermRate: 8
      },
      incomeRate: 10
    },
    incomeSources: [
      {
        name: "Professional Salary",
        type: "EMPLOYMENT",
        annualAmount: 75000,
        startYear: 2025,
        endYear: undefined
      },
      {
        name: "US Rental Property Income",
        type: "RENTAL_PROPERTY",
        annualAmount: 24000,
        startYear: 2025,
        endYear: undefined
      }
    ],
    annualExpenses: [
      { name: "Housing", amount: 10000 },
      { name: "Transportation", amount: 2400 },
      { name: "Food", amount: 2400 },
      { name: "Utilities", amount: 1200 },
      { name: "Healthcare", amount: 1500 },
      { name: "Insurance", amount: 800 },
      { name: "Entertainment", amount: 2000 },
      { name: "Education", amount: 0 },
      { name: "Personal Care", amount: 1200 },
      { name: "Legal", amount: 500 },
      { name: "Other", amount: 1000 }
    ],
    oneTimeExpenses: [
      { name: "Temporary Residence Visa & Legal Fees", amount: 500, year: 2025 },
      { name: "Criminal Record Check & Translation", amount: 100, year: 2025 },
      { name: "Rental Deposit (2 months)", amount: 2000, year: 2025 },
      { name: "International Mover (partial)", amount: 3000, year: 2025 },
      { name: "Initial Furnishings", amount: 2000, year: 2025 }
    ],
    scenarioSpecificAttributes: [
      { name: "Very low cost of living – essentials cost a fraction of US prices", sentiment: "Positive", significance: "Critical" },
      { name: "Flat 10% income tax (no tax on foreign income)", sentiment: "Positive", significance: "High" },
      { name: "Small, relaxed lifestyle with limited expat community", sentiment: "Neutral", significance: "Medium" },
      { name: "Language barrier (Spanish/Guaraní) can be a major hurdle", sentiment: "Negative", significance: "High" },
      { name: "Extremely hot summers (often >40°C) and basic infrastructure", sentiment: "Negative", significance: "High" }
    ]
  },
  {
    id: "template-portugal",
    name: "Portugal",
    shortDescription: "A popular EU lifestyle destination with a favorable tax program.",
    longDescription: "Portugal offers a compelling blend of old-world European charm, beautiful coastlines, and a surprisingly affordable cost of living. For Americans, its main draw is the combination of a high quality of life, safety, and the Non-Habitual Resident (NHR) tax program, which can significantly reduce taxes on foreign income for 10 years. While bureaucracy can be a challenge and salaries are lower than in the US, many find the relaxed pace of life and access to the rest of Europe to be a worthy trade-off.",
    keyReasons: [
      "Favorable NHR tax regime for 10 years",
      "Relatively low cost of living for Western Europe",
      "High level of safety and security",
      "Clear pathway to EU residency and citizenship",
      "Pleasant climate and beautiful natural scenery"
    ],
    location: {
      country: "Portugal"
    },
    tax: {
      capitalGains: {
        shortTermRate: 28,
        longTermRate: 28
      },
      incomeRate: 25
    },
    incomeSources: [
      {
        name: "Professional Salary",
        type: "EMPLOYMENT",
        annualAmount: 75000,
        startYear: 2025,
        endYear: undefined
      },
      {
        name: "US Rental Property Income",
        type: "RENTAL_PROPERTY",
        annualAmount: 24000,
        startYear: 2025,
        endYear: undefined
      }
    ],
    annualExpenses: [
      { name: "Housing", amount: 18000 },
      { name: "Transportation", amount: 3600 },
      { name: "Food", amount: 7200 },
      { name: "Utilities", amount: 2400 },
      { name: "Healthcare", amount: 3000 },
      { name: "Insurance", amount: 1200 },
      { name: "Entertainment", amount: 4800 },
      { name: "Education", amount: 0 },
      { name: "Personal Care", amount: 2400 },
      { name: "Legal", amount: 1000 },
      { name: "Other", amount: 3000 }
    ],
    oneTimeExpenses: [
      { name: "D7 Visa Application & Legal Fees", amount: 5000, year: 2025 },
      { name: "Rental Deposit (2-3 months rent)", amount: 4500, year: 2025 },
      { name: "International Mover (Partial)", amount: 7000, year: 2025 },
      { name: "Initial Furnishings", amount: 5000, year: 2025 }
    ],
    scenarioSpecificAttributes: [
      { name: "Bureaucracy can be slow and frustrating", sentiment: "Negative", significance: "High" },
      { name: "Excellent and affordable public transportation in major cities", sentiment: "Positive", significance: "Medium" },
      { name: "Learning Portuguese is essential for deep integration", sentiment: "Neutral", significance: "High" },
      { name: "Incredibly safe country with low violent crime rates", sentiment: "Positive", significance: "Critical" },
      { name: "Access to fresh, high-quality food and wine is exceptional", sentiment: "Positive", significance: "Medium" },
      { name: "Customer service can be less efficient than in the US", sentiment: "Negative", significance: "Low" }
    ]
  },
  {
    id: "template-spain",
    name: "Spain",
    shortDescription: "Sunny European country with affordable living and rich culture.",
    longDescription: "Spain provides a relaxed Mediterranean lifestyle with historic cities, beautiful beaches, and a relatively low cost of living by Western European standards. The overall cost of living is still much lower than in the US. Spain has excellent healthcare and infrastructure, a temperate climate (especially in coastal regions), and an open business environment. Bureaucracy can be slow and taxes (around 24%) are moderate. Spanish is the official language, but English is common in major cities and tourist areas.",
    keyReasons: [
      "Mediterranean climate with sunny weather and beaches",
      "Affordable cost of living (US is significantly more expensive)",
      "High-quality healthcare and public services",
      "Rich cultural heritage and outdoor lifestyle",
      "Use of Spanish language (familiar for many) and growing expat communities"
    ],
    location: {
      country: "Spain"
    },
    tax: {
      capitalGains: {
        shortTermRate: 23,
        longTermRate: 23
      },
      incomeRate: 24
    },
    incomeSources: [
      {
        name: "Professional Salary",
        type: "EMPLOYMENT",
        annualAmount: 75000,
        startYear: 2025,
        endYear: undefined
      },
      {
        name: "US Rental Property Income",
        type: "RENTAL_PROPERTY",
        annualAmount: 24000,
        startYear: 2025,
        endYear: undefined
      }
    ],
    annualExpenses: [
      { name: "Housing", amount: 20000 },
      { name: "Transportation", amount: 3000 },
      { name: "Food", amount: 7200 },
      { name: "Utilities", amount: 2400 },
      { name: "Healthcare", amount: 2400 },
      { name: "Insurance", amount: 1200 },
      { name: "Entertainment", amount: 4800 },
      { name: "Education", amount: 0 },
      { name: "Personal Care", amount: 2400 },
      { name: "Legal", amount: 1000 },
      { name: "Other", amount: 3000 }
    ],
    oneTimeExpenses: [
      { name: "NIE and Residency Application Fees", amount: 1500, year: 2025 },
      { name: "Rental Deposit (3 months)", amount: 6000, year: 2025 },
      { name: "International Mover (Partial)", amount: 6000, year: 2025 },
      { name: "Initial Furnishings", amount: 4000, year: 2025 },
      { name: "Flight to Spain", amount: 800, year: 2025 }
    ],
    scenarioSpecificAttributes: [
      { name: "Affordable living costs and Mediterranean lifestyle", sentiment: "Positive", significance: "Medium" },
      { name: "Quality healthcare and social services", sentiment: "Positive", significance: "Medium" },
      { name: "Moderate taxes (~24% personal income tax) and EU regulations", sentiment: "Neutral", significance: "Medium" },
      { name: "Rich culture and Spanish language (easier integration than in non-Spanish countries)", sentiment: "Positive", significance: "High" },
      { name: "Bureaucratic processes can be slow", sentiment: "Negative", significance: "Low" }
    ]
  },
  {
    id: "template-thailand",
    name: "Thailand",
    shortDescription: "Tropical Southeast Asia: very low costs and vibrant culture, but extreme heat.",
    longDescription: "Thailand offers some of the lowest living costs of any country, making it very attractive for retirees. Expat hubs like Bangkok, Chiang Mai and the islands are popular. The culture is rich and the food is renowned worldwide. Infrastructure in major cities is good and private healthcare is affordable. The tropical climate means year-round warmth (often 30°C+) with a monsoon season. Downsides include needed visa extensions for long stays, limited English outside city centers, and occasional political unrest.",
    keyReasons: [
      "Extremely low cost of living (US costs much higher)",
      "World-famous cuisine and friendly locals",
      "Warm tropical climate with beaches and mountains",
      "Modern amenities in big cities (Bangkok hospitals, airports)",
      "Visa requirements (non-permanent visas) and extreme summer heat"
    ],
    location: {
      country: "Thailand"
    },
    tax: {
      capitalGains: {
        shortTermRate: 15,
        longTermRate: 15
      },
      incomeRate: 10
    },
    incomeSources: [
      {
        name: "Professional Salary",
        type: "EMPLOYMENT",
        annualAmount: 75000,
        startYear: 2025,
        endYear: undefined
      },
      {
        name: "US Rental Property Income",
        type: "RENTAL_PROPERTY",
        annualAmount: 24000,
        startYear: 2025,
        endYear: undefined
      }
    ],
    annualExpenses: [
      { name: "Housing", amount: 6000 },
      { name: "Transportation", amount: 2400 },
      { name: "Food", amount: 3600 },
      { name: "Utilities", amount: 2400 },
      { name: "Healthcare", amount: 1500 },
      { name: "Insurance", amount: 1200 },
      { name: "Entertainment", amount: 3000 },
      { name: "Education", amount: 0 },
      { name: "Personal Care", amount: 1200 },
      { name: "Legal", amount: 1000 },
      { name: "Other", amount: 2000 }
    ],
    oneTimeExpenses: [
      { name: "Thailand Long-term Visa Fees", amount: 200, year: 2025 },
      { name: "Flight to Thailand", amount: 1200, year: 2025 },
      { name: "International Mover (Partial)", amount: 5000, year: 2025 },
      { name: "Initial Furnishings", amount: 3000, year: 2025 },
      { name: "Motorbike Purchase", amount: 2000, year: 2025 }
    ],
    scenarioSpecificAttributes: [
      { name: "Exceptionally low living costs (rent, food, etc.)", sentiment: "Positive", significance: "Critical" },
      { name: "Rich culture and cuisine with a friendly expat community", sentiment: "Positive", significance: "Medium" },
      { name: "Year-round tropical weather (positive for outdoors, but very hot/humid summers)", sentiment: "Neutral", significance: "High" },
      { name: "Visa renewals and some political instability occasionally", sentiment: "Negative", significance: "Medium" },
      { name: "Excellent private healthcare and travel hub (Bangkok)", sentiment: "Positive", significance: "Medium" }
    ]
  },
  {
    id: "template-vietnam",
    name: "Vietnam",
    shortDescription: "Rapidly developing, very low cost, vibrant cities; authoritarian government.",
    longDescription: "Vietnam has a very low cost of living, especially for cities like Ho Chi Minh City and Hanoi which offer modern amenities. The country is known for its rapid economic growth and investment opportunities. Expats enjoy delicious food, a safe environment (low violent crime), and rich local culture. Downsides include limited political freedom, strict single-party rule, and a significant language barrier (Vietnamese). The climate is hot and humid, with occasional typhoons and pollution in cities.",
    keyReasons: [
      "Exceptionally low cost of living (rent, food, etc.)",
      "Rapidly growing economy and emerging tech scene",
      "Low crime and friendly communities",
      "Excellent cuisine and vibrant urban life",
      "One-party government and language barrier"
    ],
    location: {
      country: "Vietnam"
    },
    tax: {
      capitalGains: {
        shortTermRate: 20,
        longTermRate: 20
      },
      incomeRate: 20
    },
    incomeSources: [
      {
        name: "Professional Salary",
        type: "EMPLOYMENT",
        annualAmount: 75000,
        startYear: 2025,
        endYear: undefined
      },
      {
        name: "US Rental Property Income",
        type: "RENTAL_PROPERTY",
        annualAmount: 24000,
        startYear: 2025,
        endYear: undefined
      }
    ],
    annualExpenses: [
      { name: "Housing", amount: 4000 },
      { name: "Transportation", amount: 1200 },
      { name: "Food", amount: 2000 },
      { name: "Utilities", amount: 1000 },
      { name: "Healthcare", amount: 1000 },
      { name: "Insurance", amount: 800 },
      { name: "Entertainment", amount: 2000 },
      { name: "Education", amount: 0 },
      { name: "Personal Care", amount: 1000 },
      { name: "Legal", amount: 500 },
      { name: "Other", amount: 1000 }
    ],
    oneTimeExpenses: [
      { name: "Vietnam Long-term Visa & Fees", amount: 100, year: 2025 },
      { name: "Flight to Vietnam", amount: 900, year: 2025 },
      { name: "International Mover (Partial)", amount: 5000, year: 2025 },
      { name: "Initial Furnishings", amount: 3000, year: 2025 },
      { name: "Health Check & Vaccinations", amount: 200, year: 2025 }
    ],
    scenarioSpecificAttributes: [
      { name: "Extremely low cost of living – one of the cheapest expat destinations", sentiment: "Positive", significance: "Critical" },
      { name: "Rapidly developing economy with modern city amenities", sentiment: "Positive", significance: "Medium" },
      { name: "Strict government control and limited political freedom", sentiment: "Negative", significance: "Medium" },
      { name: "Very hot and humid climate; air pollution in major cities", sentiment: "Negative", significance: "High" },
      { name: "Friendly locals and safe country, but Vietnamese language is challenging", sentiment: "Neutral", significance: "Medium" }
    ]
  },
  {
    id: "template-malaysia",
    name: "Malaysia",
    shortDescription: "Modern multicultural country with reasonable costs and excellent amenities.",
    longDescription: "Malaysia (especially Kuala Lumpur) is a blend of modern city life and diverse cultures (Malay, Chinese, Indian). It offers a lower cost of living than Western countries and high-quality healthcare. English is widely spoken, which makes adaptation easier. The climate is tropical (hot and humid year-round). A popular expat program (MM2H) exists, though tax rates can be as high as 28%. KL has a great public transit system and international community. Drawbacks include occasional haze from regional fires and conservative social policies.",
    keyReasons: [
      "Lower living costs than Western cities",
      "Top-notch healthcare and infrastructure",
      "English widely spoken; cultural diversity",
      "Modern city amenities (KL transit, airports)",
      "Hot, humid climate and monsoon seasons",
      "No tax on foreign-sourced income; tax up to 28%"
    ],
    location: {
      country: "Malaysia"
    },
    tax: {
      capitalGains: {
        shortTermRate: 0,
        longTermRate: 0
      },
      incomeRate: 28
    },
    incomeSources: [
      {
        name: "Professional Salary",
        type: "EMPLOYMENT",
        annualAmount: 75000,
        startYear: 2025,
        endYear: undefined
      },
      {
        name: "US Rental Property Income",
        type: "RENTAL_PROPERTY",
        annualAmount: 24000,
        startYear: 2025,
        endYear: undefined
      }
    ],
    annualExpenses: [
      { name: "Housing", amount: 6000 },
      { name: "Transportation", amount: 2400 },
      { name: "Food", amount: 3600 },
      { name: "Utilities", amount: 2400 },
      { name: "Healthcare", amount: 1500 },
      { name: "Insurance", amount: 1200 },
      { name: "Entertainment", amount: 3000 },
      { name: "Education", amount: 0 },
      { name: "Personal Care", amount: 1200 },
      { name: "Legal", amount: 1000 },
      { name: "Other", amount: 2000 }
    ],
    oneTimeExpenses: [
      { name: "MM2H Visa Application Fees", amount: 2000, year: 2025 },
      { name: "International Mover (Partial)", amount: 5000, year: 2025 },
      { name: "Initial Furnishings", amount: 3000, year: 2025 },
      { name: "Rental Deposit (3 months)", amount: 6000, year: 2025 },
      { name: "Flight to Malaysia", amount: 800, year: 2025 }
    ],
    scenarioSpecificAttributes: [
      { name: "Lower living costs than in the US", sentiment: "Positive", significance: "High" },
      { name: "Excellent healthcare system and infrastructure", sentiment: "Positive", significance: "Medium" },
      { name: "Multicultural society and English widely spoken", sentiment: "Positive", significance: "Medium" },
      { name: "Hot and humid climate year-round, with occasional haze", sentiment: "Negative", significance: "Medium" },
      { name: "No tax on foreign-sourced income; progressive tax for residents", sentiment: "Positive", significance: "Medium" }
    ]
  },
  {
    id: "template-dubai",
    name: "Dubai",
    shortDescription: "Prosperous Gulf city with tax-free income, luxury lifestyle, but very hot climate.",
    longDescription: "Dubai (UAE) is a global business hub known for its luxury lifestyle, skyscrapers, and zero personal income tax. Salaries can be high, and there is no capital gains tax. The city is extremely safe and modern, with world-class amenities. However, the cost of living is also very high (especially housing, schooling, and entertainment). The climate is desert: extremely hot summers (often above 45°C) and warm winters. Cultural norms are more conservative than in the West (dress and behavior), and permanent residency is difficult for expats.",
    keyReasons: [
      "0% income tax and 0% capital gains tax",
      "High salaries and luxury lifestyle",
      "Exceptional safety and modern infrastructure",
      "World-class amenities (shopping, hotels, airports)",
      "Extreme summer heat and high cost of living"
    ],
    location: {
      country: "United Arab Emirates",
      state: "Dubai"
    },
    tax: {
      capitalGains: {
        shortTermRate: 0,
        longTermRate: 0
      },
      incomeRate: 0
    },
    incomeSources: [
      {
        name: "Professional Salary",
        type: "EMPLOYMENT",
        annualAmount: 75000,
        startYear: 2025,
        endYear: undefined
      },
      {
        name: "US Rental Property Income",
        type: "RENTAL_PROPERTY",
        annualAmount: 24000,
        startYear: 2025,
        endYear: undefined
      }
    ],
    annualExpenses: [
      { name: "Housing", amount: 30000 },
      { name: "Transportation", amount: 2400 },
      { name: "Food", amount: 7200 },
      { name: "Utilities", amount: 3000 },
      { name: "Healthcare", amount: 3000 },
      { name: "Insurance", amount: 2000 },
      { name: "Entertainment", amount: 3000 },
      { name: "Education", amount: 0 },
      { name: "Personal Care", amount: 1200 },
      { name: "Legal", amount: 1000 },
      { name: "Other", amount: 4000 }
    ],
    oneTimeExpenses: [
      { name: "Residence Visa & Emirates ID Fees", amount: 1000, year: 2025 },
      { name: "International Mover (Partial)", amount: 7000, year: 2025 },
      { name: "Initial Furnishings", amount: 5000, year: 2025 },
      { name: "Rental Deposit (approx. 5% of annual rent)", amount: 3000, year: 2025 },
      { name: "International Health Insurance (1 year)", amount: 2000, year: 2025 }
    ],
    scenarioSpecificAttributes: [
      { name: "0% income and capital gains tax – maximizes take-home pay", sentiment: "Positive", significance: "Critical" },
      { name: "Luxury amenities and exceptional safety", sentiment: "Positive", significance: "High" },
      { name: "Extreme desert climate (very hot summers) is challenging", sentiment: "Negative", significance: "High" },
      { name: "Very high cost of living (esp. rent, schooling) offsets tax benefits", sentiment: "Negative", significance: "High" },
      { name: "Diverse expat community but no path to permanent residency", sentiment: "Neutral", significance: "Medium" }
    ]
  }  
]; 