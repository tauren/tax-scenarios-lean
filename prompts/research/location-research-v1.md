# Location Research Prompt v1

**Purpose:** Research popular international destinations for tax optimization, focusing on capital gains tax rates and quality of life factors.

**Last Updated:** 2024-03-19

**Version:** 1.0

## Prompt

I need to research 3-4 popular international destinations for tax optimization, specifically focusing on capital gains tax rates. Please provide the information as an array of LocationResearch objects, where each object follows this structure:

```typescript
interface LocationResearch {
    // Basic Location Info (maps to Scenario.location* fields)
    location: {
        country: string;
        state?: string;
        city?: string;
        displayName: string;  // Maps to Scenario.displayLocationName
    };

    // Tax Information (maps to Scenario.capitalGainsTaxRates and SpecialTaxFeature)
    tax: {
        capitalGains: {
            shortTermRate: number;
            longTermRate: number;
            specialConditions?: string;
        };
        residencyRequirements: {
            minimumStayDays: number;
            visaOptions: string[];
            specialPrograms?: string[];
        };
        treaties: {
            countries: string[];
            specialProvisions?: string;
        };
    };

    // Cost of Living (maps to AnnualExpense categories)
    costOfLiving: {
        housing: {
            averageRent: number;
            averagePurchase: number;
            currency: string;
            notes?: string;
        };
        transportation: {
            publicTransit: number;
            carOwnership: number;
            fuel: number;
            currency: string;
            notes?: string;
        };
        utilities: {
            electricity: number;
            water: number;
            internet: number;
            currency: string;
            notes?: string;
        };
        healthcare: {
            insurance: number;
            outOfPocket: number;
            currency: string;
            notes?: string;
        };
        groceries: {
            monthlyAverage: number;
            currency: string;
            notes?: string;
        };
        dining: {
            averageMeal: number;
            currency: string;
            notes?: string;
        };
    };

    // Quality of Life (maps to GlobalQualitativeConcept categories)
    qualityOfLife: {
        safety: {
            crimeRate: number;  // 1-5 scale
            politicalStability: number;  // 1-5 scale
            notes?: string;
        };
        healthcare: {
            quality: number;  // 1-5 scale
            accessibility: number;  // 1-5 scale
            internationalStandards: boolean;
            notes?: string;
        };
        climate: {
            averageTemperature: string;
            humidity: string;
            seasons: string[];
            notes?: string;
        };
        infrastructure: {
            internet: number;  // 1-5 scale
            transportation: number;  // 1-5 scale
            utilities: number;  // 1-5 scale
            notes?: string;
        };
        culture: {
            languageBarrier: number;  // 1-5 scale (1 = high barrier)
            expatCommunity: number;  // 1-5 scale
            culturalDifferences: string[];
            notes?: string;
        };
        lifestyle: {
            entertainment: number;  // 1-5 scale
            outdoorActivities: number;  // 1-5 scale
            shopping: number;  // 1-5 scale
            notes?: string;
        };
    };

    // Practical Considerations (maps to ScenarioAttribute)
    practical: {
        expatProfile: {
            typicalAge: string;
            commonProfessions: string[];
            averageStayDuration: string;
            communitySize: string;
        };
        challenges: {
            commonIssues: string[];
            solutions: string[];
        };
        advantages: {
            keyBenefits: string[];
            uniqueFeatures: string[];
        };
        recommendations: {
            bestFor: string[];
            notRecommendedFor: string[];
            tips: string[];
        };
    };

    // Special Features (maps to SpecialTaxFeature)
    specialFeatures: {
        taxOptimization: {
            uniqueRules: string[];
            opportunities: string[];
            restrictions: string[];
        };
        residency: {
            programs: string[];
            requirements: string[];
            benefits: string[];
        };
    };
}
```

Please provide an array of 3-4 LocationResearch objects, each representing a different location. Focus on locations that are:
- Realistically accessible to average people (not just ultra-wealthy)
- Have established expatriate communities
- Have clear, stable tax policies
- Are popular enough to have good documentation and support systems

For each location, ensure:
1. All monetary values are in the local currency (specified in each costOfLiving section)
2. All ratings are on a 1-5 scale where 5 is excellent/best
3. Include specific, recent data where possible
4. Note any significant changes expected in the near future
5. Highlight any unique features or considerations that make this location stand out

The goal is to identify locations that would make good template scenarios for a tax planning tool, representing different approaches to capital gains taxation (e.g., zero-tax jurisdictions, low-tax jurisdictions, jurisdictions with special conditions).

Please format the response as a valid JSON array of LocationResearch objects.

## Usage Notes

- This prompt is designed to gather comprehensive data about potential tax-optimization locations
- The response format is structured to easily map to our application's data models
- All monetary values should be in local currency
- All ratings use a 1-5 scale where 5 is the best
- The data will be used to create template scenarios in our application

## Related Files

- `src/models/index.ts` - Contains the application's data models
- `src/data/templateScenarios.data.ts` - Where the research data will be used
- `docs/architecture-lean-v1.2.md` - Contains the architecture specifications

## Change Log

- 2024-03-19: Initial version created 