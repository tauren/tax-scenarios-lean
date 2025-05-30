# Tax Scenarios Analyzer MVP Architecture Document

## Introduction / Preamble

This document outlines the overall project architecture for the "Tax Scenarios Analyzer MVP," focusing exclusively on its client-side implementation. As a single-page application (SPA) designed to run entirely within the user's browser, there are no traditional backend systems, shared services, or database concerns in this MVP.

Its primary goal is to serve as the guiding architectural blueprint for AI-driven development and subsequent implementation, ensuring consistency and adherence to chosen patterns and technologies within the client-side environment. This document will detail the structure, data flow, calculation logic, persistence mechanisms (including management of multiple named user plans), and qualitative assessment features, with a focus on MVP simplicity.

**Relationship to Frontend Architecture:**
Given that the "Tax Scenarios Analyzer MVP" is a client-side web application with a significant user interface, a separate Frontend Architecture Document will be created to detail the frontend-specific design. This document (the overall architecture) will establish the definitive core technology stack selections, which are binding for the frontend components.

## Table of Contents

1.  Introduction / Preamble
2.  Technical Summary
3.  Core Components & Data Models
4.  Calculation Engine Logic
5.  Application Data Flow (including Plan Management)
6.  Error Handling Strategy
7.  Security Considerations
8.  Deployment Considerations
9.  Future Enhancements

## Technical Summary

The Tax Scenarios Analyzer MVP is architected as a lean, entirely client-side Single-Page Application (SPA) built with TypeScript and React. For MVP, users will input their own *effective tax rates* directly into scenarios, both for overall scenario income (as a default) and optionally on a per-income-source basis (as an override). Capital gains will also use user-provided effective rates for the scenario. This simplifies the core tax calculation engine for the initial version.

The application supports management of multiple "Named Saved Plans," where each plan is a self-contained `UserAppState`. A continuously auto-saved "Active Plan" allows users to work without frequent manual saves. New scenarios within a plan are created by deep-copying "template scenarios" (predefined locations with estimated effective tax rates and default qualitative attribute assessments) or by starting with a blank structure for custom locations. User qualitative goals are defined by selecting from a global list of concepts and assigning personal weights. Each user scenario is self-contained with its tax parameters and scenario-specific qualitative attribute assessments.

The calculation engine emphasizes modularity for `SpecialTaxFeature`s (e.g., Puerto Rico's Act 60), which can have complex, self-contained logic, including gain bifurcation if needed. User scenario data can be shared via compressed URL parameters. The application is designed for automated CI/CD deployment to static hosting platforms.

## Core Components & Data Models

### 1. `AppConfig` Model (Static Configuration)

This model defines static application-wide data, including template scenarios, global special tax feature definitions, and a master list of qualitative concepts.

```typescript
// TaxRate and CapitalGainsTaxRate structures define how users input effective rates for scenarios
// For CapitalGainsTaxRate, it's scenario-wide. For income tax, rates are on ScenarioIncomeSource or Scenario.
interface TaxRate { // Used by Scenario.capitalGainsTaxRates and potentially SpecialTaxFeatures
    minIncome: number; // For MVP effective rates: 0
    maxIncome?: number; // For MVP effective rates: undefined
    rate: number; // Effective rate as a decimal
}

interface CapitalGainsTaxRate { // For MVP, in Scenario.capitalGainsTaxRates, this holds effective ST/LT rates.
    minIncome: number; // For MVP effective rates: 0
    maxIncome?: number; // For MVP effective rates: undefined
    shortTermRate: number; // User's effective short-term CGT rate for the scenario
    longTermRate: number; // User's effective long-term CGT rate for the scenario
}

interface SpecialTaxFeature {
    id: string; 
    name: string; 
    description: string;
    appliesTo: "INCOME" | "CAPITAL_GAINS" | "OTHER"; 
    inputs?: {
        key: string;
        type: "NUMBER" | "DATE" | "STRING" | "BOOLEAN";
        label: string;
        placeholder?: string;
    }[];
    requiresGainBifurcation?: boolean; 
}

interface GlobalQualitativeConcept {
    id: string;
    name: string;
    category: string;
    description?: string;
}

interface AppConfig {
    templateScenarios: Scenario[]; 
    globalSpecialTaxFeatures: SpecialTaxFeature[]; 
    globalQualitativeConcepts: GlobalQualitativeConcept[];
    projectionPeriodYears: number; 
}
```

### 2. `UserAppState` Model (Represents an Active or Saved Plan's Data)

This model is the core data for a single "Plan."

```typescript
interface UserAppState {
    activePlanInternalName: string; 
    initialAssets: Asset[]; 
    scenarios: Scenario[]; 
    userQualitativeGoals: UserQualitativeGoal[];
}
```

### 3. `SavedPlanEntry` Model (For List of Named Saved Plans)

Defines an entry in the list of user-saved plans.

```typescript
interface SavedPlanEntry {
    planUUID: string;
    userDisplayName: string;
    createDate: string;
    lastSavedDate: string;
    isLocked: boolean;
    compressedPlanDataString: string;
}
```
*Note: The list `SavedPlanEntry[]` is stored in `localStorage` within an object like `{ version: 1, plans: SavedPlanEntry[] }`. Data migration between versions is not an MVP feature, but the version is stored for future use.*

### 4. `Asset` Model (Within `UserAppState.initialAssets`)

```typescript
interface Asset {
    id: string; 
    name: string;
    assetType?: "STOCK" | "CRYPTO" | "REAL_ESTATE" | "OTHER"; 
    quantity: number;
    costBasisPerUnit: number; 
    fairMarketValuePerUnit?: number; 
    acquisitionDate: string; 
}
```

### 5. `ScenarioIncomeSource` Model (Within `Scenario.incomeSources`)

Represents a recurring income stream within a `Scenario`, with its own optional effective tax rate for MVP.

```typescript
interface ScenarioIncomeSource {
    id: string; 
    name: string;
    type: "EMPLOYMENT" | "RENTAL_PROPERTY" | "OTHER";
    annualAmount: number;
    startYear: number;
    endYear?: number; 
    sourceJurisdictionInfo?: string; // Optional, purely informational text for user to note origin (e.g., "CA Rental", "UK Salary")
    overrideEffectiveTaxRate?: number; // Optional: User-inputted effective tax rate for THIS income source in THIS scenario (as decimal, e.g., 0.25 for 25%)
    notes?: string;
}
```

### 6. `PlannedAssetSale` Model (Within Scenario)

```typescript
interface PlannedAssetSale {
    id: string; 
    assetId: string; 
    year: number; 
    quantity: number; 
    salePricePerUnit: number; 
}
```

### 7. `AnnualExpense` Model (Category within Scenario)

```typescript
interface AnnualExpense { 
    id: string; 
    name: string;
    amount: number; 
}
```

### 8. `ScenarioAssetTaxDetail` Model (Within Scenario)
Represents asset-specific details for tax calculations under a new residency for a `Scenario`.
```typescript
interface ScenarioAssetTaxDetail {
    assetId: string; 
    residencyAcquisitionDate: string; 
    valueAtResidencyAcquisitionDatePerUnit: number;
}
```

### 9. `Scenario` Model (Core component of `UserAppState.scenarios`)

Self-contained with its parameters. For MVP, income tax is primarily handled via `ScenarioIncomeSource.overrideEffectiveTaxRate` or `Scenario.defaultEffectiveIncomeTaxRate`.

```typescript
interface Scenario {
    id: string; 
    name: string; 
    
    templateReferenceId?: string; 
    displayLocationName: string; 
    locationCountry: string;     
    locationState?: string;    
    locationCity?: string;     

    // For MVP, scenario-wide income tax is a single effective rate. This field is used if an income source doesn't have an override.
    defaultEffectiveIncomeTaxRate?: number; // Optional: User's default effective income tax rate for this scenario (as decimal)

    // For MVP, capitalGainsTaxRates will contain a single CapitalGainsTaxRate object where 
    // 'shortTermRate' and 'longTermRate' are user-provided effective CGT rates for the scenario.
    capitalGainsTaxRates: CapitalGainsTaxRate[]; 
    propertyTaxRate: number; // User-provided effective rate for the scenario
    consumptionTaxRate: number; // User-provided effective rate for the scenario

    projectionPeriodYears: number;
    residencyStartDate?: string; 
    
    scenarioAssetTaxDetails?: ScenarioAssetTaxDetail[]; 

    incomeSources: ScenarioIncomeSource[]; // Now uses ScenarioIncomeSource
    annualExpenses: { 
        categories: AnnualExpense[]; 
        additionalCosts?: number;
    };
    plannedAssetSales: PlannedAssetSale[];
    selectedSpecialTaxFeatures: { 
        featureId: string; 
        inputs: { [key: string]: any };
    }[];
    scenarioSpecificAttributes: ScenarioAttribute[]; 
}
```

### 10. `UserQualitativeGoal` Model (Within `UserAppState.userQualitativeGoals`)

```typescript
interface UserQualitativeGoal {
    id: string; 
    conceptId: string; 
    name: string; 
    category: string; 
    description?: string; 
    weight: "Low" | "Medium" | "High" | "Critical"; 
}
```

### 11. `ScenarioAttribute` Model (Within `Scenario.scenarioSpecificAttributes`)

```typescript
interface ScenarioAttribute {
    conceptId: string; 
    userSentiment: "Positive" | "Neutral" | "Negative"; 
    significanceToUser: "None" | "Low" | "Medium" | "High"; 
    notes?: string; 
}
```

### 12. `CalculationResult` Model (Internal to Application State)
```typescript
interface ScenarioYearlyProjection {
    year: number;
    grossIncome: number;
    totalExpenses: number;
    capitalGainsIncome: number; 
    taxBreakdown: {
        incomeTax: number; // Combined income tax from all sources
        capitalGainsTax: number;
        propertyTaxEstimate: number; 
        consumptionTaxEstimate: number; 
        totalTax: number;
    };
    additionalScenarioCosts: number;
    netFinancialOutcome: number; 
}

interface ScenarioResults {
    scenarioId: string;
    yearlyProjections: ScenarioYearlyProjection[];
    totalNetFinancialOutcomeOverPeriod: number;
    qualitativeFitScore: number; 
}

interface AppCalculatedState {
    resultsByScenario: { [scenarioId: string]: ScenarioResults };
}
```

## Calculation Engine Logic

The Calculation Engine processes a self-contained `Scenario` object from the active `UserAppState`.

### 4.1. `calculateScenarioProjection(scenario, userAppState, appConfig)`

* **Input:** A `Scenario` object, `userAppState` (for `initialAssets` and `userQualitativeGoals`), `appConfig` (for `globalSpecialTaxFeatures` and `globalQualitativeConcepts` definitions).
* **Logic:**
    1.  Initializes an empty array for `yearlyProjections`.
    2.  Iterates from `currentYear = 1` up to `scenario.projectionPeriodYears`.
    3.  For each `currentYear`, it calls a series of sub-functions to compute financial metrics:
        * `grossIncome = calculateIncomeForYear(currentYear, scenario)`
        * `totalExpensesFromCategories = calculateTotalExpenses(currentYear, scenario)`
        * `capitalGainsData = calculateCapitalGainsForYear(currentYear, scenario, userAppState, appConfig)`
        * `taxableIncome = determineTaxableIncome(grossIncome)`
        * `rentalIncomeThisYear = scenario.incomeSources.reduce((sum, s) => s.type === 'RENTAL_PROPERTY' && s.startYear <= currentYear && (s.endYear === undefined || s.endYear >= currentYear) ? sum + s.annualAmount : sum, 0)`
        * `taxBreakdown = calculateTaxes(currentYear, grossIncome, capitalGainsData, rentalIncomeThisYear, scenario, appConfig)` // Pass grossIncome instead of taxableIncome if effective rates apply to gross.
        * `additionalScenarioCostsForYear = scenario.annualExpenses.additionalCosts || 0;` (Logic to handle one-time vs. recurring annual `additionalCosts` needs to be defined; for MVP, assume it applies each year if present).
        * `netFinancialOutcome = calculateNetFinancialOutcome(grossIncome, totalExpensesFromCategories, taxBreakdown.totalTax, additionalScenarioCostsForYear)`
    4.  Aggregates these results for `currentYear` into a `ScenarioYearlyProjection` object:
        ```typescript
        {
            year: currentYear,
            grossIncome: grossIncome,
            totalExpenses: totalExpensesFromCategories,
            capitalGainsIncome: capitalGainsData.totalCapitalGainsIncome,
            taxBreakdown: taxBreakdown,
            additionalScenarioCosts: additionalScenarioCostsForYear,
            netFinancialOutcome: netFinancialOutcome
        }
        ```
    5.  Adds the `ScenarioYearlyProjection` to the `yearlyProjections` array.
    6.  After the loop, it calls `qualitativeFitScore = calculateQualitativeFitScore(scenario, userAppState, appConfig)`.
    7.  Computes `totalNetFinancialOutcomeOverPeriod` by summing `netFinancialOutcome` from all `yearlyProjections`.
* **Output:** A `ScenarioResults` object containing `scenarioId`, `yearlyProjections`, `totalNetFinancialOutcomeOverPeriod`, and `qualitativeFitScore`.

### 4.2. `calculateIncomeForYear(currentYear, scenario)`

* **Input:** `currentYear`, `scenario.incomeSources`.
* **Logic:** Sums `annualAmount` for all `ScenarioIncomeSource` objects in `scenario.incomeSources` where `incomeSource.startYear <= currentYear` and (`incomeSource.endYear === undefined || incomeSource.endYear >= currentYear`).
* **Output:** `grossIncome: number`.

### 4.3. `calculateTotalExpenses(currentYear, scenario)`

* **Input:** `currentYear`, `scenario.annualExpenses`.
* **Logic:** Sums `amount` from all `AnnualExpense` objects in `scenario.annualExpenses.categories`. `scenario.annualExpenses.additionalCosts` is handled separately in `calculateNetFinancialOutcome` via `additionalScenarioCostsForYear` passed to it.
* **Output:** `totalExpensesFromCategories: number`.

### 4.4. `calculateCapitalGainsForYear(currentYear, scenario, userAppState, appConfig)`

* **Input:** `currentYear`, `scenario`, `userAppState.initialAssets`, `appConfig`.
* **Logic:**
    1.  Identifies all `PlannedAssetSale` objects in `scenario.plannedAssetSales` where `sale.year === currentYear`.
    2.  **Determine if gain bifurcation is required for this scenario:**
        * `bifurcationNeeded = false;`
        * Iterate through `scenario.selectedSpecialTaxFeatures`. For each `selectedFeatureEntry`:
            * Find the `SpecialTaxFeature` definition in `appConfig.globalSpecialTaxFeatures` where `id === selectedFeatureEntry.featureId`.
            * If the feature definition exists and its `requiresGainBifurcation` is `true`, set `bifurcationNeeded = true;` and break loop.
    3.  Initialize `aggregatedResults = { totalCapitalGainsIncome: 0, preResidencyCapitalGains: { longTerm: 0, shortTerm: 0 }, postResidencyCapitalGains: { longTerm: 0, shortTerm: 0 } }`.
    4.  For each matching `PlannedAssetSale`:
        a.  Retrieves the corresponding `Asset` from `userAppState.initialAssets` using `assetId`. If not found, log an error and skip this sale.
        b.  Finds the `ScenarioAssetTaxDetail` object within `scenario.scenarioAssetTaxDetails` (if `scenario.scenarioAssetTaxDetails` exists) that matches the current `PlannedAssetSale.assetId`. Let's call this `assetTaxDetailForScenario`.
        c.  Determines the actual sale date within `currentYear` (e.g., assume end of year for MVP for holding period calculations).
        d.  Calculate `TotalGain = (PlannedAssetSale.quantity * PlannedAssetSale.salePricePerUnit) - (PlannedAssetSale.quantity * Asset.costBasisPerUnit)`. Add `TotalGain` to `aggregatedResults.totalCapitalGainsIncome`.
        e.  If `bifurcationNeeded` is `true` AND `assetTaxDetailForScenario` exists:
            * `PreResidencyGain = (PlannedAssetSale.quantity * assetTaxDetailForScenario.valueAtResidencyAcquisitionDatePerUnit) - (PlannedAssetSale.quantity * Asset.costBasisPerUnit)`.
            * Determine if `PreResidencyGain` is Long-Term or Short-Term (e.g., holding period from `Asset.acquisitionDate` to `assetTaxDetailForScenario.residencyAcquisitionDate` > 1 year). Add to the respective field in `aggregatedResults.preResidencyCapitalGains`.
            * `PostResidencyGain = (PlannedAssetSale.quantity * PlannedAssetSale.salePricePerUnit) - (PlannedAssetSale.quantity * assetTaxDetailForScenario.valueAtResidencyAcquisitionDatePerUnit)`.
            * Determine if `PostResidencyGain` is Long-Term or Short-Term (e.g., holding period from `assetTaxDetailForScenario.residencyAcquisitionDate` to `saleDate` > 1 year). Add to the respective field in `aggregatedResults.postResidencyCapitalGains`.
        f.  Else (if bifurcation is not needed or `assetTaxDetailForScenario` is missing for a required bifurcation):
            * Determine if `TotalGain` is Long-Term or Short-Term (based on `Asset.acquisitionDate` to `saleDate` > 1 year).
            * If `TotalGain` is long-term, add to `aggregatedResults.postResidencyCapitalGains.longTerm`. Else, add to `aggregatedResults.postResidencyCapitalGains.shortTerm`.
            * Ensure `aggregatedResults.preResidencyCapitalGains` components remain `0`.
    5.  Return `aggregatedResults`.
* **Output:** An object containing: `totalCapitalGainsIncome`, `preResidencyCapitalGains: { longTerm, shortTerm }`, `postResidencyCapitalGains: { longTerm, shortTerm }`.

### 4.5. `determineTaxableIncome(grossIncome)`

* **Input:** `grossIncome` from `calculateIncomeForYear`.
* **Logic:** For MVP, this function returns `grossIncome` directly. It assumes no standard deductions are applied by the engine to arrive at taxable income before effective tax rates (for income) are applied. It serves as a placeholder for future, more detailed deduction logic.
* **Output:** `taxableIncome: number` (which is `grossIncome` for MVP).

### 4.6. `calculateTaxes(currentYear, grossIncome, capitalGainsData, rentalIncome, scenario, appConfig)`

* **Input:**
    * `currentYear: number`
    * `grossIncome: number` (total from all income sources for the year)
    * `capitalGainsData: { totalCapitalGainsIncome, preResidencyCapitalGains, postResidencyCapitalGains }`
    * `rentalIncome: number` (subset of grossIncome, passed for potential use by specific features)
    * `scenario: Scenario`
    * `appConfig: AppConfig`
* **Logic:**
    1.  Initialize `taxBreakdown = { incomeTax: 0, capitalGainsTax: 0, propertyTaxEstimate: 0, consumptionTaxEstimate: 0, totalTax: 0 }`.
    2.  **Standard Income Tax (MVP - Per Source or Default Scenario Effective Rate):**
        * Initialize `totalScenarioIncomeTax = 0`.
        * For each `incomeSource` in `scenario.incomeSources` active in `currentYear`:
            * `rateToApply = incomeSource.overrideEffectiveTaxRate ?? scenario.defaultEffectiveIncomeTaxRate ?? 0;`
            * `taxForThisSource = incomeSource.annualAmount * rateToApply;`
            * `totalScenarioIncomeTax += taxForThisSource;`
        * `taxBreakdown.incomeTax = totalScenarioIncomeTax;`
    3.  **Standard Capital Gains Tax (MVP - Scenario Effective Rates):**
        * If `scenario.capitalGainsTaxRates` and `scenario.capitalGainsTaxRates.length > 0`:
            * `effectiveST_Rate = scenario.capitalGainsTaxRates[0].shortTermRate || 0;`
            * `effectiveLT_Rate = scenario.capitalGainsTaxRates[0].longTermRate || 0;`
            * `shortTermTax = capitalGainsData.postResidencyCapitalGains.shortTerm * effectiveST_Rate;`
            * `longTermTax = capitalGainsData.postResidencyCapitalGains.longTerm * effectiveLT_Rate;`
            * (Note: If pre-residency gains are not handled by an STF, they are taxed here by these effective rates if `postResidencyCapitalGains` also includes them, or this logic assumes `postResidencyCapitalGains` is the relevant base).
            * `taxBreakdown.capitalGainsTax = shortTermTax + longTermTax;`
        * Else, `taxBreakdown.capitalGainsTax = 0;`
    4.  **Property Tax (MVP - Simple Estimate):**
        * (Estimate based on representative asset values from `userAppState.initialAssets` with `assetType === 'REAL_ESTATE'`, multiplied by `scenario.propertyTaxRate`. This requires access to `userAppState.initialAssets` or passing summed relevant asset values).
        * `taxBreakdown.propertyTaxEstimate = (Total FMV of Real Estate Assets in `userAppState.initialAssets` applicable to this scenario) * scenario.propertyTaxRate;`
    5.  **Consumption Tax (MVP - Simple Estimate):**
        * `totalCategoryExpenses = scenario.annualExpenses.categories.reduce((sum, cat) => sum + cat.amount, 0)`.
        * `taxBreakdown.consumptionTaxEstimate = (totalCategoryExpenses * (scenario.consumptionTaxRate || 0))`.
    6.  **Applies Special Tax Features (Dynamic Hook):**
        * Iterates through `scenario.selectedSpecialTaxFeatures`. For each `selectedFeatureEntry`:
            * Retrieve the full `featureDefinition` from `appConfig.globalSpecialTaxFeatures` using `selectedFeatureEntry.featureId`.
            * If `featureDefinition` exists:
                * Call the specific JavaScript handler function for this feature (e.g., `applyFeatureLogic_PR_Act60(...)`).
                * Pass necessary data: `currentYear`, current `taxBreakdown` (for modification), `grossIncome` (and its per-source breakdown via `scenario.incomeSources` if needed), `capitalGainsData`, `rentalIncome`, `selectedFeatureEntry.inputs`, the `scenario` itself, and `appConfig`.
                * The handler function implements the feature's specific rules and directly updates the values within the `taxBreakdown` object.
    7.  Recalculate `taxBreakdown.totalTax` by summing all positive tax components in `taxBreakdown` and subtracting any credits or negative adjustments applied by special features.
* **Output:** The modified `taxBreakdown` object.

### 4.7. `calculateNetFinancialOutcome(grossIncome, totalExpensesFromCategories, totalTax, additionalScenarioCosts)`

* **Input:** `grossIncome`, `totalExpensesFromCategories` (from `calculateTotalExpenses`), `totalTax`, `additionalScenarioCosts` (from `scenario.annualExpenses.additionalCosts`, applied for the relevant year).
* **Logic:** `netFinancialOutcome = grossIncome - totalExpensesFromCategories - totalTax - additionalScenarioCosts`.
* **Output:** `netFinancialOutcome: number`.

### 4.8. `calculateQualitativeFitScore(scenario, userAppState, appConfig)`

* **Input:**
    * `scenario: Scenario` (containing `scenario.scenarioSpecificAttributes: ScenarioAttribute[]`)
    * `userAppState: UserAppState` (containing `userAppState.userQualitativeGoals: UserQualitativeGoal[]`)
    * `appConfig: AppConfig` (containing `appConfig.globalQualitativeConcepts` to look up display names/categories if needed for display logic, though `UserQualitativeGoal` copies them).
* **Logic:**
    1.  Initialize `totalWeightedScoreContribution = 0` and `sumOfMaxPossibleGoalContributions = 0`.
    2.  Define non-linear numerical mappings for weights and significance:
        * `goalWeightMap = { "Low": 1, "Medium": 3, "High": 7, "Critical": 15 }` (Example values)
        * `significanceMap = { "None": 0, "Low": 1, "Medium": 2, "High": 3 }` (Example values)
        * `sentimentMap = { "Positive": 1, "Neutral": 0, "Negative": -1 }`
    3.  Iterate through each `goal` in `userAppState.userQualitativeGoals`:
        a.  `goalWeightNumeric = goalWeightMap[goal.weight] || 0`.
        b.  The maximum positive contribution this goal could make is `goalWeightNumeric * (significanceMap["High"])`. Add this to `sumOfMaxPossibleGoalContributions`.
        c.  Find the corresponding `scenarioAttribute` in `scenario.scenarioSpecificAttributes` where `scenarioAttribute.conceptId === goal.conceptId`.
        d.  If a matching `scenarioAttribute` is found:
            i.  If `scenarioAttribute.userSentiment === "Neutral"` OR `scenarioAttribute.significanceToUser === "None"`:
                * The contribution for this pairing is `0`.
            ii. Else:
                * `sentimentValue = sentimentMap[scenarioAttribute.userSentiment] || 0`.
                * `significanceValue = significanceMap[scenarioAttribute.significanceToUser] || 0`.
                * `attributeEffect = sentimentValue * significanceValue`; // Ranges from -3 to +3 based on example maps
                * `totalWeightedScoreContribution += attributeEffect * goalWeightNumeric`.
        e.  Else (no matching scenario attribute for a user goal): Contribution is `0`.
    4.  **Normalization (Example to a 0-100 scale):**
        * If `sumOfMaxPossibleGoalContributions === 0` (no weighted goals defined by user or all weights map to 0), then `qualitativeFitScore = 50` (representing a neutral default).
        * Else, `qualitativeFitScore = ((totalWeightedScoreContribution + sumOfMaxPossibleGoalContributions) / (2 * sumOfMaxPossibleGoalContributions)) * 100`. This formula maps the score range from `[-sumOfMaxPossibleGoalContributions, +sumOfMaxPossibleGoalContributions]` to `[0, 100]`.
        * Ensure the final score is capped: `qualitativeFitScore = Math.max(0, Math.min(100, qualitativeFitScore))`.
    5.  **Note:** The User Interface should provide a transparent breakdown of how the qualitative score is composed, potentially showing contributions per goal or category, to allow users to understand its derivation.
* **Output:** `qualitativeFitScore: number` (e.g., on a 0-100 scale).

## Application Data Flow (including Plan Management)

The application manages an "Active Plan" (current working state) and a list of "Named Saved Plans," both persisted in `localStorage`.

### `localStorage` Structure:
* **Key `taxAnalyzer_activePlan`:** Stores the `compressedPlanDataString` of the current working `UserAppState`. This is subject to frequent continuous auto-save.
* **Key `taxAnalyzer_savedPlansList`:** Stores an object: `{ version: 1, plans: SavedPlanEntry[] }`. This list is modified only by explicit user plan management actions. (Data migration between `version`s is not an MVP feature, but the version is stored for future use).

### Runtime (In-Memory) State for Active Session:
The application maintains these in memory regarding the active plan:
* `activeUserAppState: UserAppState` (the deserialized, working object).
* `currentActivePlanUUID?: string` (the `planUUID` from `SavedPlanEntry` if loaded from a saved slot).
* `currentActivePlanUserDisplayName?: string` (the `userDisplayName` from the `SavedPlanEntry`).
* `isActivePlanLocked: boolean` (reflects lock status of the loaded `SavedPlanEntry`).
* `isDirty: boolean` (tracks if `activeUserAppState` has unsaved changes relative to `currentActivePlanUUID` or its last explicit save).

### 1. Initial Application Load

1.  **Load Static Configuration:** `AppConfig` (including `templateScenarios`, `globalSpecialTaxFeatures`, `globalQualitativeConcepts`) is loaded.
2.  **Load Saved Plans List:** Attempt to load and parse `{ version, plans: SavedPlanEntry[] }` from `localStorage` key `taxAnalyzer_savedPlansList`. If not found or parsing fails, initialize with an empty list `{ version: 1, plans: [] }`.
3.  **Load Active Plan:**
    * Check URL for a shared plan string (`compressedPlanDataString`). If present and valid, the application should offer to make this the active plan. This may involve prompting the user if their current `activeUserAppState` (if any from `localStorage`) has unsaved changes (`isDirty === true`).
    * Else, attempt to load `compressedPlanDataString` from `localStorage` key `taxAnalyzer_activePlan`.
    * If a `compressedPlanDataString` is successfully obtained (from URL or `localStorage`) and is valid:
        * Decompress and deserialize it into `activeUserAppState`.
        * Initialize runtime state: `currentActivePlanUUID` is initially undefined (it's set when explicitly loading from or saving to the named list). `isActivePlanLocked = false`, `isDirty = false`. The `activeUserAppState.activePlanInternalName` comes from the deserialized data.
    * If no active plan is found (no URL string, nothing in `taxAnalyzer_activePlan`, or data is invalid):
        * Initialize `activeUserAppState` as a new, "Untitled Plan" (e.g., `activePlanInternalName: "Untitled Plan"`, empty `initialAssets`, `scenarios`, `userQualitativeGoals`).
        * Set runtime state: `currentActivePlanUUID = undefined`, `currentActivePlanUserDisplayName = undefined`, `isActivePlanLocked = false`, `isDirty = false`.
        * Auto-save this initial "Untitled Plan" state to `taxAnalyzer_activePlan`.

### 2. Scenario Creation/Modification within Active Plan

* When creating a new scenario from a template, a deep copy of the selected `templateScenario` from `appConfig.templateScenarios` is made. This includes its `defaultEffectiveIncomeTaxRate` (if defined), `capitalGainsTaxRates` (with effective rates for MVP), `incomeSources` (with their `overrideEffectiveTaxRate` or relying on the scenario default), `annualExpenses.categories`, and `scenarioSpecificAttributes` (with default `userSentiment` and `significanceToUser`).
* When creating a new custom scenario from scratch, its `capitalGainsTaxRates` array is initialized with one placeholder object for effective rates. `defaultEffectiveIncomeTaxRate` might be initialized to 0 or a placeholder. `incomeSources` are added by the user, who can specify `overrideEffectiveTaxRate`. Expense/attribute lists are empty.
* Users modify `activeUserAppState` directly. Any change sets the runtime `isDirty = true`.
* **User Defines/Modifies `userQualitativeGoals`:**
    * UI allows user to manage their `userQualitativeGoals` list in `activeUserAppState`.
    * When adding a goal, user selects a concept from `appConfig.globalQualitativeConcepts`. The `conceptId`, default `name`, `category`, `description` are copied into the new `UserQualitativeGoal` object. User sets their personal `weight` and can edit the copied `name`/`description`.

### 3. Continuous Auto-Save of Active Plan

* Whenever `activeUserAppState` is modified significantly (or on a suitable short timer/on blur events), it is serialized to `compressedPlanDataString` and saved to `localStorage` under the key `taxAnalyzer_activePlan`.

### 4. Plan Management Operations:

#### 4.1. New Plan (from scratch by user action)
1.  Check if current runtime `isDirty` for `activeUserAppState`. If yes, prompt user: "You have unsaved changes in '{current activeUserAppState.activePlanInternalName}'. [Save Current Plan] [Save As New...] [Discard Changes & Create New] [Cancel]".
    * If "Save Current Plan": Execute "Save Active Plan" flow (4.3). If successful (or if plan was not dirty), proceed.
    * If "Save As New...": Execute "Save As Active Plan" flow (4.4). If successful, proceed.
    * If "Discard Changes & Create New": Proceed.
    * If "Cancel": Abort new plan creation.
2.  If proceeding:
    * Initialize `activeUserAppState` to a new "Untitled Plan" structure (e.g., `activePlanInternalName: "Untitled Plan"`).
    * Update runtime state: `currentActivePlanUUID = undefined`, `currentActivePlanUserDisplayName = undefined`, `isActivePlanLocked = false`, `isDirty = false`.
    * Auto-save this new "Untitled Plan" state to `taxAnalyzer_activePlan`.

#### 4.2. Load Named Plan (from `taxAnalyzer_savedPlansList`)
1.  User selects a `SavedPlanEntry` from the displayed list of saved plans.
2.  Check if current runtime `isDirty` for `activeUserAppState`. If yes, prompt user: "You have unsaved changes in '{current activeUserAppState.activePlanInternalName}'. [Save Current Plan] [Save As New...] [Discard Changes & Load Selected] [Cancel Load]".
    * Handle prompt responses similarly to 4.1.1.
3.  If proceeding to load:
    * Decompress and deserialize `SavedPlanEntry.compressedPlanDataString` into `activeUserAppState`.
    * Update runtime state: `currentActivePlanUUID = SavedPlanEntry.planUUID`, `currentActivePlanUserDisplayName = SavedPlanEntry.userDisplayName`, `isActivePlanLocked = SavedPlanEntry.isLocked`. Set runtime `isDirty = false`.
    * Auto-save this newly loaded state to `taxAnalyzer_activePlan`.

#### 4.3. Save Active Plan
1.  If runtime `currentActivePlanUUID` is defined (meaning it was loaded from or previously saved to a named slot):
    * Find the corresponding `SavedPlanEntry` in the `taxAnalyzer_savedPlansList` plans array using `currentActivePlanUUID`.
    * If the found `SavedPlanEntry.isLocked` is `true`:
        * Prompt user: "'{SavedPlanEntry.userDisplayName}' is locked. [Save As New Plan...] [Unlock and Save to '{SavedPlanEntry.userDisplayName}'] [Cancel]".
        * If "Unlock and Save": Set `SavedPlanEntry.isLocked = false` in the list (and update `isActivePlanLocked` runtime state), then proceed to save to this slot.
        * If "Save As New Plan...": Trigger the "Save As Active Plan" flow (4.4).
        * If "Cancel": Do nothing.
        * Return after prompt handling if not proceeding with direct save.
    * (If not locked or was unlocked by prompt) Serialize current `activeUserAppState` to `newCompressedPlanDataString`.
    * Update the found `SavedPlanEntry`: `compressedPlanDataString = newCompressedPlanDataString`, `lastSavedDate = now()`. (The `activeUserAppState.activePlanInternalName` is saved within `newCompressedPlanDataString`).
    * Save the updated `taxAnalyzer_savedPlansList` (the whole object with version and plans array) to `localStorage`.
    * Update runtime `isDirty = false`.
2.  Else (runtime `currentActivePlanUUID` is `undefined`, i.e., an "Untitled Plan" or a plan from a URL that hasn't been saved yet):
    * Trigger the "Save As Active Plan" flow (4.4).

#### 4.4. Save As Active Plan
1.  Prompt user for a `newUserDisplayName` for the new saved slot. If not provided, use `activeUserAppState.activePlanInternalName` as a default for the slot name.
2.  Generate `newPlanUUID = UUID()`.
3.  Set `createDate = now()`, `lastSavedDate = now()`, `isLocked = false`.
4.  Serialize current `activeUserAppState` into `currentCompressedPlanDataString`.
5.  Create a new `SavedPlanEntry` using `newPlanUUID`, `newUserDisplayName`, `createDate`, `lastSavedDate`, `isLocked`, and `currentCompressedPlanDataString`.
6.  Add this new `SavedPlanEntry` to the `taxAnalyzer_savedPlansList` plans array.
7.  Save the updated `taxAnalyzer_savedPlansList` to `localStorage`.
8.  Update runtime state: `currentActivePlanUUID = newPlanUUID`, `currentActivePlanUserDisplayName = newUserDisplayName`, `isActivePlanLocked = false`, `isDirty = false`.

#### 4.5. Clone Saved Plan (from list)
1.  User selects a source `SavedPlanEntry` from the `taxAnalyzer_savedPlansList`.
2.  Prompt user for a `newUserDisplayName` for the cloned slot (default: "Copy of {source.userDisplayName}" or derive from the internal name within `source.compressedPlanDataString`).
3.  Generate `newPlanUUID = UUID()`.
4.  Set `createDate = now()`, `lastSavedDate = now()`, `isLocked = false`.
5.  The `compressedPlanDataString` is taken directly from `source.compressedPlanDataString`.
6.  Create new `SavedPlanEntry` and add to `taxAnalyzer_savedPlansList` plans array.
7.  Save updated `taxAnalyzer_savedPlansList` to `localStorage`.

#### 4.6. Delete Saved Plan
1.  User selects a `SavedPlanEntry` from the `taxAnalyzer_savedPlansList` and confirms deletion.
2.  Remove the `SavedPlanEntry` from the `taxAnalyzer_savedPlansList` plans array.
3.  Save updated `taxAnalyzer_savedPlansList` to `localStorage`.
4.  If the deleted `planUUID` matches the runtime `currentActivePlanUUID`:
    * Set runtime `currentActivePlanUUID = undefined`, `currentActivePlanUserDisplayName = undefined`. (The `activeUserAppState` remains in memory and in `taxAnalyzer_activePlan` but is now effectively "Untitled" or detached from a named saved slot).

#### 4.7. Rename Saved Plan Slot
1.  User selects a `SavedPlanEntry` from the `taxAnalyzer_savedPlansList` and provides a new `userDisplayName`.
2.  Update the `userDisplayName` property of the corresponding `SavedPlanEntry` in the `taxAnalyzer_savedPlansList` plans array.
3.  Update its `lastSavedDate = now()`.
4.  Save updated `taxAnalyzer_savedPlansList` to `localStorage`.
5.  If the renamed plan's `planUUID` matches runtime `currentActivePlanUUID`, update runtime `currentActivePlanUserDisplayName`.

#### 4.8. Toggle Lock Status of Saved Plan
1.  User selects a `SavedPlanEntry` from the `taxAnalyzer_savedPlansList` to toggle its lock status.
2.  Update `SavedPlanEntry.isLocked` property (true to false, or false to true) in the `taxAnalyzer_savedPlansList` plans array.
3.  Update its `lastSavedDate = now()`.
4.  Save updated `taxAnalyzer_savedPlansList` to `localStorage`.
5.  If the affected plan's `planUUID` matches runtime `currentActivePlanUUID`, update runtime `isActivePlanLocked` to reflect the new status.

### 5. Calculation Initiation, Engine Processing, Results, Sharing

These operations primarily function on the `activeUserAppState`. The plan management layer ensures the correct `activeUserAppState` is loaded and its context (UUID, lock status) is known. Sharing via URL generates a `compressedPlanDataString` from the current `activeUserAppState`.

### 6. Special Tax Feature Logic

This logic operates on the data within the `activeUserAppState.scenarios`. Definitions of available features come from `appConfig.globalSpecialTaxFeatures`.

## Error Handling Strategy

### 1. Principles of Error Handling
* **Graceful Degradation:** Application remains functional or recovers gracefully.
* **User Feedback:** Clear, concise error information for users, avoiding technical jargon.
* **Preventative Measures:** Input validation and data sanitization.
* **Logging (Client-Side):** Errors logged to browser console for debugging.
* **Testability:** Error paths are testable.

### 2. Types of Errors and Handling Mechanisms

#### 2.1. User Input Validation Errors
* **Description:** User data doesn't conform to expected types, formats, or constraints (e.g., a `Scenario` object is missing required effective tax rates).
* **Detection:** Client-Side Validation (on form submission/`onChange`), schema validation if used. TypeScript helps during development.
* **Handling:** Immediate UI feedback (inline messages), prevent submission/calculation, user guidance.

#### 2.2. Data Consistency Errors
* **Description:** `UserAppState` or `SavedPlanEntry` list contains logically inconsistent data (e.g., `PlannedAssetSale` referencing non-existent `assetId`; a feature requiring gain bifurcation is selected but `scenarioAssetTaxDetails` are missing).
* **Detection:** Pre-Calculation Checks, checks during load/save operations.
* **Handling:** Alert user, pinpoint issue, prevent problematic operation or display warnings.

#### 2.3. Calculation Logic Errors
* **Description:** Bugs or unexpected edge cases in Calculation Engine.
* **Detection:** Testing, runtime checks, `try-catch` blocks.
* **Handling:** Generic "calculation error" notification, prevent bad data display, log stack trace.

#### 2.4. `localStorage` Errors
* **Description:** Issues saving/loading data (e.g., `taxAnalyzer_activePlan`, `taxAnalyzer_savedPlansList`) to/from `localStorage` (quota exceeded, security restrictions, corrupted data).
* **Detection:** `try-catch` blocks around all `localStorage` operations.
* **Handling:** Inform user of issue and consequences (e.g., "Could not save plan list. Changes might be lost."). Attempt to operate with in-memory data if possible but warn prominently of non-persistence. Offer manual export of active plan data as JSON if feasible.

### 3. Centralized Error Reporting (Future Consideration)
Integrate a client-side error tracking service (e.g., Sentry, Bugsnag).

### 4. Implementation Details
* **React Error Boundaries:** Catch JS errors in component tree, display fallback UI.
* **Utility Functions:** Consistent user feedback (toasts, modals).
* **Clear Error States:** UI indicators for errors.

## Security Considerations

### 1. Core Security Principles for Client-Side MVP
* **Data Confidentiality (Local):** User data does not leave browser unless explicitly shared via URL by user.
* **Data Integrity:** Prevent modification by external scripts (XSS).
* **Availability:** Ensure application accessibility.
* **Transparency:** Communicate data handling (local, `localStorage`).

### 2. Specific Security Considerations and Mitigations

#### 2.1. Data Storage (`localStorage`)
* **Risk:** Plain text, sandboxed per origin.
* **Mitigation:** No highly sensitive PII. Inform users data is local.

#### 2.2. Cross-Site Scripting (XSS) Prevention
* **Risk:** Script injection.
* **Mitigation:** React's JSX escaping. Strict CSP. Avoid `dangerouslySetInnerHTML`.

#### 2.3. Cross-Site Request Forgery (CSRF) Prevention
* **Mitigation:** Not directly applicable for client-side-only MVP.

#### 2.4. Dependency Security
* **Risk:** Vulnerabilities in third-party libraries.
* **Mitigation:** Regular updates (`npm audit`). Reputable libraries.

#### 2.5. Client-Side Code Tampering
* **Risk:** Users/extensions can modify local JS.
* **Mitigation:** Acknowledge "Trust the Client". Minification for performance.

#### 2.6. URL Parameter Handling (for sharing)
* **Risk:** Data in URLs.
* **Mitigation:** Data compression. No highly sensitive PII. Validate/sanitize data loaded from URL. User awareness.

#### 2.7. HTTPS Everywhere
* **Mitigation:** Serve application exclusively over HTTPS.

### 3. Future Security Considerations (Beyond MVP)
If backend/accounts added: Robust AuthN/AuthZ, server-side validation, encryption, API security, audits.

## Deployment Considerations

### 1. Build Process
* **Technology Stack:** TypeScript and React.
* **Build Tool:** **Vite**.
* **Output:** `dist` directory.

### 2. Hosting Environment
* **Static Site Hosting.**
* **Selected Platform: Cloudflare Pages.**
* **Alternatives:** Vercel/Netlify; AWS/GCP.

### 3. Deployment Workflow (CI/CD Pipeline)
1.  **Version Control:** Git (e.g., GitHub).
2.  **Branching Strategy:** `main`, `dev`, Feature Branches.
3.  **Automated Deployments with Cloudflare Pages.**

### 4. Domain Management
* DNS provider for custom domain.

## Future Enhancements

### 1. AI-Driven Scenario Builder
* **Natural Language Input.**
* **AI Module for Scenario Generation.**

### 2. Expanded Tax Calculation Fidelity & Scope
* **More Granular Income Types.**
* **Deductions & Credits.**
* **Full Progressive Bracket Processing** for income and capital gains, evolving from MVP's effective rate input.
* **Multi-Year Projections with Dynamic Changes & Inflation.**
* **Wealth Transfer Taxes.**
* **Social Security/National Insurance Contributions.**

### 3. Enhanced Data Management & User Experience
* **User Accounts & Cloud Storage:** For `UserAppState` (active plan) and the list of `SavedPlanEntry`, enabling cross-device sync and backup.
* **Improved Template Scenarios:** Expand `templateScenarios` library in `AppConfig`.
* **Import/Export Functionality** for plans and financial data.
* **Interactive Visualizations.**
* **"What-If" Analysis Tools.**
* **Guided Onboarding & Tooltips.**
* **More Robust Plan Versioning/History:** Beyond simple save slots, allow viewing history or reverting specific named plans.

### 4. Deeper Qualitative Analysis
* **User-Defined Custom Qualitative Concepts:** Allow users to define `GlobalQualitativeConcept`-like entries if the master list is insufficient (V2 feature).
* **Integration with External Data for Qualitative Factors.**
* **AI-Powered Qualitative Insights.**

### 5. Integration & Reporting
* **PDF/Printable Reports.**
* **API Integrations (Third-Party Tools).**
* **Educational Content & Resources.**

### 6. Technical Enhancements
* **Server-Side Rendering (SSR) / Static Site Generation (SSG).**
* **Web Workers.**
* **Backend for Advanced Features & Data.**
* **State Management Refinement.**
* **Internationalization (i18n) and Localization (l10n).**
* **Data Migration Logic:** Implement logic to handle transitions between different versions of `localStorage` data structures (e.g., for `taxAnalyzer_savedPlansList`).
