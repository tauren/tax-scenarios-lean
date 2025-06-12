# AI Task Prompt: Generate Relocation Scenario Templates

## High-Level Goal
Your primary task is to generate a comprehensive TypeScript array of 12 TemplateScenario objects. This array will be used as a set of pre-built templates in a relocation planning application. The goal is to provide users with a rich, realistic, and well-researched starting point for comparing various relocation destinations, saving them significant data entry and research time.

## Target Persona for Data Generation
You must generate all data from the perspective of a specific user persona. This persona dictates the financial assumptions and, most importantly, the qualitative judgments (pros, cons, and neutral observations).
- Current Location: High-tax Western US state (assume California, Oregon, or Washington).
- Financial Profile: A middle-income professional, not an ultra-high-net-worth individual.
- Income/Assets: Assume an annual salary (e.g., ~$150k USD), income from a single rental property, and some retirement savings/investments. They are planning for potential early retirement.
- Perspective: Their viewpoint is shaped by their current life. For example:
  - **Climate**: They are accustomed to a Mediterranean or temperate climate. Extreme heat and humidity in places like Southeast Asia or the Middle East would likely be a "Negative" or "Neutral" observation, not an obvious "Positive".
  - **Cost**: They are sensitive to the high cost of living and taxes in their current location, so lower costs elsewhere are a significant "Positive".
  - **Lifestyle**: They value outdoor activities, safety, and access to modern amenities.

## Output Format and Structure

**IMPORTANT**: The primary and non-negotiable deliverable for this task is a single TypeScript code block. While you may perform research and generate a narrative report for context, the final, most critical output MUST be the code itself. The code must be a complete, copy-paste-ready TypeScript array.

The final output must be a single, complete TypeScript array named `templateScenarios`. It must conform exactly to the `TemplateScenario` type definition provided in the **Asset 1**: `templateScenarios.data.ts` file below.
- The output should be a single code block containing the complete array.
- Crucially, do not generate `id` fields for any sub-elements within the `incomeSources`, `annualExpenses`, `oneTimeExpenses`, or `scenarioSpecificAttributes` arrays.
- Each top-level `TemplateScenario` object must have a unique string `id` in the format `"template-<location>"` (e.g., `"template-california"`).
- Populate all `TemplateScenario` objects with annual expenses for each element in the example, such as `Housing`, `Transportation`, etc.

## List of 12 Scenarios to Generate
You are to create one TemplateScenario object for each of the following locations:
1. California (The baseline, representing the user's current life)
2. Florida
3. Puerto Rico
4. Mexico
5. Panama
6. Paraguay
7. Portugal
8. Spain
9. Thailand
10. Vietnam
11. Malaysia
12. Dubai

## Detailed Content Requirements
For each of the 12 scenarios, populate the properties as detailed in the `TemplateScenario` type and exemplified in Asset 3: Complete TemplateScenario Example.

## Required Assets for Task Execution

### Asset 1: `templateScenarios.data.ts` (The required output structure)

```typescript
import type { Scenario, IncomeSource, AnnualExpense, OneTimeExpense, ScenarioSpecificAttribute } from '@/types';

// Define types for template items that extend from original types
type TemplateIncomeSource = Omit<IncomeSource, 'id'>;
type TemplateAnnualExpense = Omit<AnnualExpense, 'id'>;
type TemplateOneTimeExpense = Omit<OneTimeExpense, 'id'>;
type TemplateScenarioSpecificAttribute = Omit<ScenarioSpecificAttribute, 'id' | 'scenarioId' | 'mappedGoalId'>;

// Define a type for template scenarios that extends from Scenario
type TemplateScenario = Partial<Omit<Scenario, 'id' | 'incomeSources' | 'annualExpenses' | 'oneTimeExpenses' | 'scenarioSpecificAttributes'>> & {
  id: string;
  name: string;
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
  scenarioSpecificAttributes?: TemplateScenarioSpecificAttribute[];
};

// The final output should be an array of this type.
export const templateScenarios: TemplateScenario[] = [
  // ... Your generated 12 scenarios will go here ...
];
```

### Asset 2: `scenarioSpecificAttributes_example.json` (Example of qualitative data)

```json
[
  {
    "name": "Extremely low cost of living extends retirement funds significantly",
    "sentiment": "Positive",
    "significance": "Critical"
  },
  {
    "name": "Year-round hot and humid climate is a major change from the dry US West Coast",
    "sentiment": "Negative",
    "significance": "High"
  },
  {
    "name": "Vibrant and inexpensive street food culture",
    "sentiment": "Positive",
    "significance": "Medium"
  },
  {
    "name": "Visa runs and bureaucracy can be a recurring hassle",
    "sentiment": "Negative",
    "significance": "Medium"
  },
  {
    "name": "Healthcare quality is excellent in major cities but can be inconsistent elsewhere",
    "sentiment": "Neutral",
    "significance": "High"
  }
]
```

### Asset 3: Complete `TemplateScenario` Example

This example for Portugal demonstrates the expected level of detail and adherence to the 
persona.

```typescript
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
    { name: "Bureaucracy ('Finanças') can be slow and frustrating", sentiment: "Negative", significance: "High" },
    { name: "Excellent and affordable public transportation in major cities", sentiment: "Positive", significance: "Medium" },
    { name: "Learning Portuguese is essential for deep integration", sentiment: "Neutral", significance: "High" },
    { name: "Incredibly safe country with low violent crime rates", sentiment: "Positive", significance: "Critical" },
    { name: "Access to fresh, high-quality food and wine is exceptional", sentiment: "Positive", significance: "Medium" },
    { name: "Customer service can be less efficient than in the US", sentiment: "Negative", significance: "Low" }
  ]
}
```
