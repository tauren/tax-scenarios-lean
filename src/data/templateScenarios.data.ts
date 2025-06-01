import type { Scenario } from '@/types';

export const templateScenarios: Scenario[] = [
  {
    id: "template-portugal",
    name: "Portugal",
    projectionPeriod: 10,
    residencyStartDate: new Date(),
    incomeSources: [],
    annualExpenses: [],
    oneTimeExpenses: [],
    location: {
      country: "Portugal"
    },
    tax: {
      capitalGains: {
        shortTermRate: 28,
        longTermRate: 28,
        specialConditions: "For non-tax residents, a flat rate of 28% applies to capital gains. For tax residents, capital gains are generally aggregated with other income and taxed at progressive rates (up to 48%). However, under the now-phasing-out Non-Habitual Resident (NHR) regime, certain foreign-sourced capital gains could be exempt if taxed in the source country with which Portugal has a double taxation treaty, or if they are not considered Portuguese source income. For new applicants from 2024, the NHR regime is largely replaced by a new 'Tax Incentive for Scientific Research and Innovation' regime, which offers a 20% flat rate on certain employment/self-employment income and exemption for certain foreign-sourced income for 10 years, but capital gains treatment might differ. Existing NHRs are protected under the old rules."
      },
      residencyRequirements: {
        minimumStayDays: 183,
        visaOptions: [
          "D7 Visa (Passive Income Visa)",
          "Digital Nomad Visa",
          "Golden Visa (investment-based, undergoing significant changes/phasing out for new real estate/capital transfer investments)"
        ],
        specialPrograms: [
          "Non-Habitual Resident (NHR) regime (for those who qualified before 2024)",
          "Tax Incentive for Scientific Research and Innovation (new regime from 2024 for specific professions)"
        ]
      },
      treaties: {
        countries: [
          "USA",
          "UK",
          "Canada",
          "Germany",
          "France",
          "Spain",
          "Brazil",
          "China",
          "India"
        ],
        specialProvisions: "Portugal has an extensive network of double taxation treaties to prevent double taxation on income and capital gains. The specific treatment of capital gains depends on the treaty with the source country and the NHR status (if applicable)."
      }
    },
    costOfLiving: {
      housing: {
        averageRent: 1200,
        averagePurchase: 400000,
        currency: "EUR",
        notes: "Average monthly rent for a 1-bedroom apartment in Lisbon/Porto city center. Average purchase price for a 2-bedroom apartment in a major city. Prices vary significantly by location (Lisbon/Porto are higher)."
      },
      transportation: {
        publicTransit: 40,
        carOwnership: 200,
        fuel: 1.75,
        currency: "EUR",
        notes: "Monthly public transport pass. Estimated monthly cost for car ownership (insurance, maintenance, parking, excluding fuel). Fuel price per liter."
      },
      utilities: {
        electricity: 80,
        water: 25,
        internet: 35,
        currency: "EUR",
        notes: "Estimated monthly costs for a single person/couple."
      },
      healthcare: {
        insurance: 50,
        outOfPocket: 30,
        currency: "EUR",
        notes: "Estimated monthly cost for basic private health insurance. Average out-of-pocket cost per doctor visit. Public healthcare is available to residents."
      },
      groceries: {
        monthlyAverage: 250,
        currency: "EUR",
        notes: "Estimated monthly grocery bill for a single person."
      },
      dining: {
        averageMeal: 15,
        currency: "EUR",
        notes: "Average cost for a meal at a mid-range restaurant."
      }
    },
    qualityOfLife: {
      safety: {
        crimeRate: 4,
        politicalStability: 4,
        notes: "Generally very safe with low crime rates. Stable democratic government."
      },
      healthcare: {
        quality: 4,
        accessibility: 4,
        internationalStandards: true,
        notes: "Good public healthcare system (SNS) and excellent private options. English-speaking doctors are common in urban areas."
      },
      climate: {
        averageTemperature: "15-25°C",
        humidity: "Moderate",
        seasons: [
          "Mild, wet winters",
          "Hot, dry summers",
          "Pleasant springs and autumns"
        ],
        notes: "Mediterranean climate, warmer in the south, cooler and wetter in the north."
      },
      infrastructure: {
        internet: 4,
        transportation: 4,
        utilities: 4,
        notes: "Good internet coverage, efficient public transport in major cities, well-maintained utilities."
      },
      culture: {
        languageBarrier: 3,
        expatCommunity: 5,
        culturalDifferences: [
          "Pace of life is slower",
          "Emphasis on family and community",
          "Bureaucracy can be slow"
        ],
        notes: "English is widely spoken in tourist areas and among younger generations, but learning Portuguese is beneficial. Very large and welcoming expat community."
      },
      lifestyle: {
        entertainment: 4,
        outdoorActivities: 5,
        shopping: 4,
        notes: "Vibrant nightlife, rich history, beautiful beaches, surfing, hiking. Good shopping options in cities."
      }
    },
    practical: {
      expatProfile: {
        typicalAge: "30s-60s",
        commonProfessions: [
          "Digital Nomads",
          "Retirees",
          "Entrepreneurs",
          "Tech professionals"
        ],
        averageStayDuration: "Long-term (5+ years)",
        communitySize: "Very large and growing"
      },
      challenges: {
        commonIssues: [
          "Bureaucracy and administrative processes can be slow",
          "Finding affordable housing in major cities",
          "Learning Portuguese for full integration"
        ],
        solutions: [
          "Hire local professionals (lawyers, accountants)",
          "Start housing search early and consider smaller cities",
          "Enroll in language classes and engage with locals"
        ]
      },
      advantages: {
        keyBenefits: [
          "Attractive tax regimes (for those who qualify)",
          "High quality of life and safety",
          "Affordable cost of living compared to other Western European countries",
          "Beautiful climate and diverse landscapes",
          "Welcoming culture and large expat community"
        ],
        uniqueFeatures: [
          "NHR regime (though changing) offered significant tax benefits for new residents.",
          "Strategic location for travel within Europe and to the Americas.",
          "Rich history and vibrant cultural scene."
        ]
      },
      recommendations: {
        bestFor: [
          "Retirees seeking a warm climate and good healthcare",
          "Digital nomads and remote workers",
          "Entrepreneurs looking for a European base",
          "Individuals seeking a high quality of life at a reasonable cost"
        ],
        notRecommendedFor: [
          "Those unwilling to navigate bureaucracy",
          "Individuals seeking a fast-paced, high-stress environment"
        ],
        tips: [
          "Consult with a tax advisor regarding the NHR regime changes and new incentives.",
          "Learn basic Portuguese phrases.",
          "Be patient with administrative processes."
        ]
      }
    },
    specialFeatures: {
      taxOptimization: {
        uniqueRules: [
          "NHR regime (phasing out for new applicants from 2024, but existing NHRs protected) offered significant tax exemptions on certain foreign-sourced income.",
          "New 'Tax Incentive for Scientific Research and Innovation' regime for specific high-value activities."
        ],
        opportunities: [
          "Potential for significant tax savings on foreign-sourced capital gains under NHR (for those who qualified).",
          "Attractive for passive income earners and retirees.",
          "New regime may benefit certain professionals."
        ],
        restrictions: [
          "NHR regime is no longer available for new applicants from 2024 (with some exceptions).",
          "Capital gains on Portuguese-sourced assets are generally taxed."
        ]
      },
      residency: {
        programs: [
          "D7 Visa (Passive Income)",
          "Digital Nomad Visa",
          "Golden Visa (investment, undergoing changes)"
        ],
        requirements: [
          "Proof of sufficient passive income (D7)",
          "Proof of remote work and income (Digital Nomad)",
          "Investment (Golden Visa, subject to changes)",
          "Clean criminal record, health insurance"
        ],
        benefits: [
          "EU residency and Schengen area travel.",
          "Pathway to permanent residency and citizenship.",
          "Access to public services and healthcare."
        ]
      }
    }
  },
  {
    id: "template-cyprus",
    name: "Cyprus",
    projectionPeriod: 10,
    residencyStartDate: new Date(),
    incomeSources: [],
    annualExpenses: [],
    oneTimeExpenses: [],
    location: {
      country: "Cyprus"
    },
    tax: {
      capitalGains: {
        shortTermRate: 0,
        longTermRate: 0,
        specialConditions: "Capital gains from the disposal of shares, bonds, debentures, and other titles are generally exempt from capital gains tax in Cyprus, provided the underlying assets do not include immovable property located in Cyprus. Gains from the disposal of immovable property located in Cyprus are subject to a 20% capital gains tax. This 0% rate on securities is a significant draw."
      },
      residencyRequirements: {
        minimumStayDays: 183,
        visaOptions: [
          "Work Permits",
          "Business Visas",
          "Digital Nomad Visa",
          "Permanent Residency by Investment (Category F, etc.)"
        ],
        specialPrograms: [
          "Non-Domicile status: Individuals who become tax residents of Cyprus but are not domiciled in Cyprus are exempt from Special Contribution for Defence (SCD) on dividends and interest income for 17 years. This indirectly enhances capital gains from investments that generate dividends/interest."
        ]
      },
      treaties: {
        countries: [
          "USA",
          "UK",
          "Canada",
          "Germany",
          "France",
          "Russia",
          "China",
          "India"
        ],
        specialProvisions: "Cyprus has an extensive network of double taxation treaties, particularly beneficial for international business and investment activities."
      }
    },
    costOfLiving: {
      housing: {
        averageRent: 800,
        averagePurchase: 250000,
        currency: "EUR",
        notes: "Average monthly rent for a 1-bedroom apartment in city center. Average purchase price for a 2-bedroom apartment in a major city. Prices vary significantly by location (Limassol is higher)."
      },
      transportation: {
        publicTransit: 30,
        carOwnership: 150,
        fuel: 1.45,
        currency: "EUR",
        notes: "Monthly public transport pass. Estimated monthly cost for car ownership (insurance, maintenance, parking, excluding fuel). Fuel price per liter."
      },
      utilities: {
        electricity: 100,
        water: 20,
        internet: 40,
        currency: "EUR",
        notes: "Estimated monthly costs for a single person/couple. Air conditioning can significantly increase electricity costs in summer."
      },
      healthcare: {
        insurance: 60,
        outOfPocket: 40,
        currency: "EUR",
        notes: "Estimated monthly cost for basic private health insurance. Average out-of-pocket cost per doctor visit. Public healthcare is available to residents."
      },
      groceries: {
        monthlyAverage: 200,
        currency: "EUR",
        notes: "Estimated monthly grocery bill for a single person."
      },
      dining: {
        averageMeal: 12,
        currency: "EUR",
        notes: "Average cost for a meal at a mid-range restaurant."
      }
    },
    qualityOfLife: {
      safety: {
        crimeRate: 4,
        politicalStability: 4,
        notes: "Generally very safe with low crime rates. Stable political environment."
      },
      healthcare: {
        quality: 4,
        accessibility: 4,
        internationalStandards: true,
        notes: "Good healthcare system with both public and private options. English is widely spoken in medical facilities."
      },
      climate: {
        averageTemperature: "18-30°C",
        humidity: "Moderate",
        seasons: [
          "Mild, wet winters",
          "Hot, dry summers",
          "Pleasant springs and autumns"
        ],
        notes: "Mediterranean climate with long, hot summers and mild winters."
      },
      infrastructure: {
        internet: 4,
        transportation: 3,
        utilities: 4,
        notes: "Good internet coverage, reliable utilities. Public transport is available but car ownership is common."
      },
      culture: {
        languageBarrier: 2,
        expatCommunity: 5,
        culturalDifferences: [
          "Strong emphasis on family and community",
          "Relaxed pace of life",
          "Business culture can be formal"
        ],
        notes: "English is widely spoken, making it easy for expats to integrate. Large international business community."
      },
      lifestyle: {
        entertainment: 4,
        outdoorActivities: 5,
        shopping: 4,
        notes: "Beautiful beaches, hiking trails, and water sports. Good shopping options in cities."
      }
    },
    practical: {
      expatProfile: {
        typicalAge: "30s-50s",
        commonProfessions: [
          "Business Owners",
          "International Investors",
          "Digital Nomads",
          "Tech professionals"
        ],
        averageStayDuration: "Medium to long-term (3+ years)",
        communitySize: "Large and growing"
      },
      challenges: {
        commonIssues: [
          "Finding long-term rental properties",
          "Adjusting to summer heat",
          "Navigating business regulations"
        ],
        solutions: [
          "Work with local real estate agents",
          "Consider properties with good air conditioning",
          "Hire local business consultants"
        ]
      },
      advantages: {
        keyBenefits: [
          "0% capital gains tax on securities",
          "EU member state benefits",
          "Strategic location between Europe and Asia",
          "English widely spoken",
          "High quality of life"
        ],
        uniqueFeatures: [
          "Non-Domicile status offers significant tax benefits",
          "Strong international business community",
          "Beautiful Mediterranean lifestyle"
        ]
      },
      recommendations: {
        bestFor: [
          "International investors and business owners",
          "Individuals seeking tax optimization",
          "Those who enjoy Mediterranean climate",
          "People looking for a business-friendly environment"
        ],
        notRecommendedFor: [
          "Those who prefer cold climates",
          "Individuals seeking a fast-paced urban environment"
        ],
        tips: [
          "Consult with a tax advisor about Non-Domicile status",
          "Consider the summer heat when choosing accommodation",
          "Learn about local business culture"
        ]
      }
    },
    specialFeatures: {
      taxOptimization: {
        uniqueRules: [
          "0% capital gains tax on securities (except for immovable property in Cyprus)",
          "Non-Domicile status offers 17 years of tax benefits on dividends and interest"
        ],
        opportunities: [
          "Significant tax savings for international investors",
          "Attractive for holding companies and investment structures",
          "Beneficial for passive income earners"
        ],
        restrictions: [
          "Capital gains on Cyprus immovable property taxed at 20%",
          "Must meet residency requirements for tax benefits"
        ]
      },
      residency: {
        programs: [
          "Permanent Residency by Investment",
          "Digital Nomad Visa",
          "Work Permits"
        ],
        requirements: [
          "Investment or sufficient income",
          "Clean criminal record",
          "Health insurance",
          "Proof of accommodation"
        ],
        benefits: [
          "EU residency rights",
          "Access to healthcare and education",
          "Pathway to citizenship"
        ]
      }
    }
  },
  {
    id: "template-uae",
    name: "Dubai, UAE",
    projectionPeriod: 10,
    residencyStartDate: new Date(),
    incomeSources: [],
    annualExpenses: [],
    oneTimeExpenses: [],
    location: {
      country: "United Arab Emirates",
      city: "Dubai"
    },
    tax: {
      capitalGains: {
        shortTermRate: 0,
        longTermRate: 0,
        specialConditions: "The UAE generally imposes no personal income tax or capital gains tax on individuals. This applies to capital gains derived from the sale of shares, real estate (for individuals, unless it's a business activity), and other personal investments. A corporate tax was introduced in 2023, but it typically does not apply to an individual's personal investment gains."
      },
      residencyRequirements: {
        minimumStayDays: 90,
        visaOptions: [
          "Employment Visa",
          "Investor Visa",
          "Freelance Visa",
          "Golden Visa (long-term residency for investors, entrepreneurs, talented individuals)",
          "Digital Nomad Visa"
        ],
        specialPrograms: [
          "Golden Visa: Offers 5 or 10-year renewable residency for various categories of investors, entrepreneurs, and talented individuals, providing long-term stability.",
          "Virtual Working Programme (Digital Nomad Visa): Allows remote workers to live in Dubai for one year."
        ]
      },
      treaties: {
        countries: [
          "USA",
          "UK",
          "Canada",
          "Germany",
          "France",
          "India",
          "China",
          "Russia"
        ],
        specialProvisions: "The UAE has a wide network of double taxation treaties aimed at preventing double taxation and promoting international trade and investment. These treaties can be beneficial for individuals with income or assets in other jurisdictions."
      }
    },
    costOfLiving: {
      housing: {
        averageRent: 2500,
        averagePurchase: 700000,
        currency: "AED",
        notes: "Average monthly rent for a 1-bedroom apartment in a desirable area of Dubai. Average purchase price for a 2-bedroom apartment. Housing costs are high, especially in prime locations."
      },
      transportation: {
        publicTransit: 100,
        carOwnership: 400,
        fuel: 3.0,
        currency: "AED",
        notes: "Monthly public transport pass (Metro, bus). Estimated monthly cost for car ownership (insurance, maintenance, parking, excluding fuel). Fuel price per liter is relatively low."
      },
      utilities: {
        electricity: 600,
        water: 150,
        internet: 350,
        currency: "AED",
        notes: "Estimated monthly costs for a single person/couple, including AC which is a major cost."
      },
      healthcare: {
        insurance: 500,
        outOfPocket: 150,
        currency: "AED",
        notes: "Estimated monthly cost for comprehensive private health insurance (mandatory for residents). Average out-of-pocket cost per doctor visit."
      },
      groceries: {
        monthlyAverage: 1500,
        currency: "AED",
        notes: "Estimated monthly grocery bill for a single person. Imported goods can be expensive."
      },
      dining: {
        averageMeal: 75,
        currency: "AED",
        notes: "Average cost for a meal at a mid-range restaurant. Dining out is a popular activity and can be expensive."
      }
    },
    qualityOfLife: {
      safety: {
        crimeRate: 5,
        politicalStability: 5,
        notes: "Extremely low crime rate, one of the safest cities globally. Highly stable government."
      },
      healthcare: {
        quality: 5,
        accessibility: 5,
        internationalStandards: true,
        notes: "World-class private healthcare facilities and highly skilled medical professionals. Mandatory health insurance ensures accessibility."
      },
      climate: {
        averageTemperature: "25-40°C",
        humidity: "High",
        seasons: [
          "Hot, humid summers",
          "Mild, pleasant winters"
        ],
        notes: "Desert climate with very hot summers (May-September) and comfortable winters (October-April)."
      },
      infrastructure: {
        internet: 5,
        transportation: 5,
        utilities: 5,
        notes: "Excellent, modern infrastructure including high-speed internet, efficient public transport (Metro, taxis), and reliable utilities."
      },
      culture: {
        languageBarrier: 1,
        expatCommunity: 5,
        culturalDifferences: [
          "Conservative social norms (though tolerant)",
          "Weekend is Friday-Saturday",
          "Ramadan observance"
        ],
        notes: "English is the primary language of business and daily life. Over 80% of the population are expats, leading to a highly diverse and integrated international community."
      },
      lifestyle: {
        entertainment: 5,
        outdoorActivities: 3,
        shopping: 5,
        notes: "Abundant entertainment options, world-class shopping malls, fine dining. Outdoor activities are limited during hot summers but excellent in winter."
      }
    },
    practical: {
      expatProfile: {
        typicalAge: "25-55",
        commonProfessions: [
          "Finance",
          "Real Estate",
          "Hospitality",
          "IT",
          "Healthcare",
          "Trade"
        ],
        averageStayDuration: "Medium to Long-term (3-10+ years)",
        communitySize: "Massive and highly diverse"
      },
      challenges: {
        commonIssues: [
          "High cost of living, especially housing",
          "Extreme summer heat",
          "Cultural adjustments and conservative social norms"
        ],
        solutions: [
          "Budget carefully and consider living slightly outside prime areas",
          "Utilize air-conditioned indoor facilities during summer",
          "Respect local customs and laws, engage with expat groups for support"
        ]
      },
      advantages: {
        keyBenefits: [
          "0% personal income tax and capital gains tax",
          "High safety and security",
          "Excellent infrastructure and services",
          "Global business hub and connectivity",
          "Diverse and multicultural environment"
        ],
        uniqueFeatures: [
          "Truly tax-free environment for individuals.",
          "Strategic location connecting East and West.",
          "Rapidly developing economy and futuristic vision."
        ]
      },
      recommendations: {
        bestFor: [
          "High-net-worth individuals and investors",
          "Professionals seeking career growth and tax efficiency",
          "Entrepreneurs looking for a business-friendly environment",
          "Families seeking a safe and modern lifestyle"
        ],
        notRecommendedFor: [
          "Those on a tight budget",
          "Individuals who prefer a very relaxed, slow-paced lifestyle",
          "People who dislike hot climates"
        ],
        tips: [
          "Understand the visa requirements thoroughly before moving.",
          "Factor in the high cost of living, especially housing and schooling.",
          "Embrace the multicultural environment and be open to new experiences."
        ]
      }
    },
    specialFeatures: {
      taxOptimization: {
        uniqueRules: [
          "No personal income tax or capital gains tax for individuals.",
          "Corporate tax introduced in 2023, but generally does not apply to personal investment gains."
        ],
        opportunities: [
          "Maximize net returns on investments due to zero capital gains tax.",
          "Ideal for individuals with significant investment portfolios or high-earning professions.",
          "Opportunity to accumulate wealth tax-free."
        ],
        restrictions: [
          "While no personal tax, businesses are now subject to corporate tax.",
          "Need to establish genuine residency to benefit from tax advantages."
        ]
      },
      residency: {
        programs: [
          "Golden Visa (5 or 10 years)",
          "Freelance Visa",
          "Digital Nomad Visa",
          "Investor Visa"
        ],
        requirements: [
          "Investment in property or business (Golden Visa/Investor Visa)",
          "Proof of remote work and income (Digital Nomad/Freelance)",
          "Employment contract (Employment Visa)",
          "Clean criminal record, health insurance"
        ],
        benefits: [
          "Long-term residency stability.",
          "Access to world-class services and infrastructure.",
          "Ability to sponsor family members.",
          "No personal income or capital gains tax."
        ]
      }
    }
  }
]; 