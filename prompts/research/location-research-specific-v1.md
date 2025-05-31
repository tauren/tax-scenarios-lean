# Location Research Prompt - Specific Locations v1

**Purpose:** Research specific international destinations for tax optimization, focusing on capital gains tax rates and quality of life factors.

**Last Updated:** 2024-03-20

**Version:** 1.0

## Prompt

I need to research the following specific international destinations for tax optimization, focusing on capital gains tax rates:

[LIST OF LOCATIONS TO RESEARCH]

For each location, please provide the information as a LocationResearch object following this structure:

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

For each location, ensure:
1. All monetary values are in the local currency (specified in each costOfLiving section)
2. All ratings are on a 1-5 scale where 5 is excellent/best
3. Include specific, recent data where possible
4. Note any significant changes expected in the near future
5. Highlight any unique features or considerations that make this location stand out

The goal is to gather comprehensive data about each specified location to create template scenarios for our tax planning tool, representing different approaches to capital gains taxation.

Please format the response as a valid JSON array of LocationResearch objects, one for each location specified.

## Usage Notes

- This prompt is designed to gather comprehensive data about specific tax-optimization locations
- The response format is structured to easily map to our application's data models
- All monetary values should be in local currency
- All ratings use a 1-5 scale where 5 is the best
- The data will be used to create template scenarios in our application

## Related Files

- `src/models/index.ts` - Contains the application's data models
- `src/data/templateScenarios.data.ts` - Where the research data will be used
- `docs/architecture-lean-v1.2.md` - Contains the architecture specifications

## Example Usage

To use this prompt, replace `[LIST OF LOCATIONS TO RESEARCH]` with your specific locations, for example:

```
I need to research the following specific international destinations for tax optimization, focusing on capital gains tax rates:

1. Singapore
2. Dubai, UAE
3. Lisbon, Portugal
4. Panama City, Panama

For each location, please provide...
```

## Change Log

- 2024-03-20: Initial version created 