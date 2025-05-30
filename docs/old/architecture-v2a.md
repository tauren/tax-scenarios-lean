# Tax Scenarios Analyzer MVP Architecture Document

## Introduction / Preamble

This document outlines the overall project architecture for the "Tax Scenarios Analyzer MVP," focusing exclusively on its client-side implementation. As a single-page application (SPA) designed to run entirely within the user's browser, there are no traditional backend systems, shared services, or database concerns in this MVP.

Its primary goal is to serve as the guiding architectural blueprint for AI-driven development and subsequent implementation, ensuring consistency and adherence to chosen patterns and technologies within the client-side environment. This document will detail the structure, data flow, calculation logic, persistence mechanisms (including management of multiple named user plans), and qualitative assessment features.

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

The Tax Scenarios Analyzer MVP is architected as a lean, entirely client-side Single-Page Application (SPA) built with TypeScript and React, leveraging Tailwind CSS for styling and React Hooks (potentially Zustand) for state management. All financial and qualitative calculations, along with user data persistence via `localStorage`, occur exclusively within the user's browser.

The application supports management of multiple "Named Saved Plans," where each plan is a self-contained `UserAppState` (including its scenarios, assets, and goals). A continuously auto-saved "Active Plan" allows users to work without frequent manual saves. New scenarios within a plan are created by deep-copying "template scenarios" (predefined locations with estimated effective tax rates and default qualitative attribute assessments) or by starting with a blank structure for custom locations; in MVP, users input their own effective tax rates for baseline calculations. User qualitative goals are defined by selecting from a global list of concepts and assigning personal weights. Each user scenario is self-contained with all necessary tax parameters and scenario-specific qualitative attribute assessments (which also link back to global concepts).

The calculation engine emphasizes modularity for extensible tax rule implementation (e.g., `SpecialTaxFeature`s like Puerto Rico's Act 60, which can have complex logic), with explicit triggers for more advanced calculations like gain bifurcation. User scenario data (as part of a plan) can be shared via compressed URL parameters. The application is designed for automated CI/CD deployment to static hosting platforms like Cloudflare Pages.

## Core Components & Data Models

### 1. `AppConfig` Model (Static Configuration)

This model defines the static, application-wide configuration data. It includes template scenarios for predefined locations, global definitions for special tax features, and a master list of qualitative concepts.

```typescript
interface TaxRate { // For MVP, in Scenario.incomeTaxRates, this will hold a single effective rate.
    minIncome: number; // For MVP effective rate: 0
    maxIncome?: number; // For MVP effective rate: undefined
    rate: number; // User's effective income tax rate as a decimal (e.g., 0.22 for 22%)
}

interface CapitalGainsTaxRate { // For MVP, in Scenario.capitalGainsTaxRates, this will hold effective ST/LT rates.
    minIncome: number; // For MVP effective rates: 0
    maxIncome?: number; // For MVP effective rates: undefined
    shortTermRate: number; // User's effective short-term CGT rate
    longTermRate: number; // User's effective long-term CGT rate
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
    id: string;          // Canonical, unique ID (e.g., "safety-low-crime", "lifestyle-weather-sunshine")
    name: string;        // Default display name (e.g., "Low Crime Rate", "Sunny Weather")
    category: string;    // e.g., "Safety & Security", "Lifestyle & Climate"
    description?: string;// Explanation of the concept
}

interface AppConfig {
    templateScenarios: Scenario[]; 
    globalSpecialTaxFeatures: SpecialTaxFeature[]; 
    globalQualitativeConcepts: GlobalQualitativeConcept[]; // Master list of qualitative concepts
    projectionPeriodYears: number; 
}
```

### 2. `UserAppState` Model (Represents an Active or Saved Plan's Data)

This model represents the core data for a single "Plan," whether it's the currently active plan or a plan stored within the list of saved plans (where it would be compressed).

```typescript
interface UserAppState {
    activePlanInternalName: string; // The "internal name" or "title" of the plan itself, user-editable.
    initialAssets: Asset[]; 
    scenarios: Scenario[]; 
    userQualitativeGoals: UserQualitativeGoal[]; // User's personal qualitative goals and their weights for this plan
}
```

### 3. `SavedPlanEntry` Model (For List of Named Saved Plans)

This structure defines an entry in the list of multiple user-saved plans stored in `localStorage`.

```typescript
interface SavedPlanEntry {
    planUUID: string;          // System-generated UUID for this saved slot
    userDisplayName: string;   // User-defined name for this slot in the list of saved plans
    createDate: string;        // ISO date string or timestamp - when this planUUID/slot was first created
    lastSavedDate: string;     // ISO date string or timestamp - last time this slot was updated/saved to
    isLocked: boolean;         // User can toggle this for a saved plan, defaults to false
    compressedPlanDataString: string; // Compressed string of a full UserAppState object for this plan
}
```
*Note: The list of `SavedPlanEntry[]` will be stored in `localStorage` under a stable key (e.g., `taxAnalyzer_savedPlansList`) as part of an object that includes a data structure version, e.g., `{ version: 1, plans: SavedPlanEntry[] }`. Data migration between versions is not an MVP feature, but the version is stored for future use.*

### 4. `Asset` Model

Represents a single financial asset owned by the user, part of `UserAppState`.

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

### 5. `IncomeSource` Model (Within Scenario)

Represents a recurring income stream within a `Scenario`.

```typescript
interface IncomeSource {
    id: string; 
    name: string;
    type: "EMPLOYMENT" | "RENTAL_PROPERTY" | "OTHER";
    annualAmount: number;
    startYear: number;
    endYear?: number; 
    locationId?: string; // Optional. Identifies the specific jurisdiction where this income originates if different from the scenario's primary location. For MVP, this is primarily informational; future enhancements or specific SpecialTaxFeatures may use this for source-specific tax rules or credits.
}
```

### 6. `PlannedAssetSale` Model (Within Scenario)

Represents a planned sale of an asset within a specific year of a `Scenario`.

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

Represents an annual living expense category within a `Scenario`.

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

This is the core model for a specific tax residency scenario. Each scenario object is self-contained with all necessary parameters for calculation after being initialized (from a template or custom). For MVP, `incomeTaxRates` and `capitalGainsTaxRates` will each hold a single object representing user-provided effective rates.

```typescript
interface Scenario {
    id: string; 
    name: string; // User-editable name for this specific scenario (e.g., "PR Move 2025", "Stay in CA")
    
    templateReferenceId?: string; // Optional: ID of the appConfig.templateScenarios this was based on
    displayLocationName: string; // User-friendly display name, e.g., "California, USA" or "Custom: My Ideal Island"
    locationCountry: string;     // Structured: e.g., "US", "PT" (important for some feature logic)
    locationState?: string;    // Structured: e.g., "CA", "PR"
    locationCity?: string;     // Structured: e.g., "San Francisco", "San Juan"

    // For MVP, incomeTaxRates will contain a single TaxRate object where 'rate' is the effective income tax rate.
    // minIncome/maxIncome in that object will be 0/undefined respectively.
    incomeTaxRates: TaxRate[]; 
    // For MVP, capitalGainsTaxRates will contain a single CapitalGainsTaxRate object where 
    // 'shortTermRate' and 'longTermRate' are effective CGT rates.
    // minIncome/maxIncome in that object will be 0/undefined respectively.
    capitalGainsTaxRates: CapitalGainsTaxRate[]; 
    propertyTaxRate: number; 
    consumptionTaxRate: number; 

    projectionPeriodYears: number;
    residencyStartDate?: string; 
    
    scenarioAssetTaxDetails?: ScenarioAssetTaxDetail[]; 

    incomeSources: IncomeSource[];
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

Represents a user's overarching qualitative goal, its importance, and its conceptual link to the global list.

```typescript
interface UserQualitativeGoal {
    id: string; // Unique UUID for this specific user goal instance
    conceptId: string; // The ID from AppConfig.globalQualitativeConcepts this goal is conceptually based on. Non-editable by user post-creation.
    name: string; // Initially copied from globalQualitativeConcepts.name, user can then edit this for their personal display label.
    category: string; // Initially copied from globalQualitativeConcepts.category; ideally non-editable or derived via conceptId for UI consistency.
    description?: string; // Initially copied from globalQualitativeConcepts.description, user can edit.
    weight: "Low" | "Medium" | "High" | "Critical"; // How important this goal is to the user overall
}
```

### 11. `ScenarioAttribute` Model (Within `Scenario.scenarioSpecificAttributes`)

Represents a specific attribute of a scenario/location, its conceptual link, and the user's assessment of it for that particular scenario.

```typescript
interface ScenarioAttribute {
    conceptId: string; // The ID from AppConfig.globalQualitativeConcepts this attribute instance refers to. Non-editable by user post-creation.
                       // The display name, category, and description are looked up from AppConfig.globalQualitativeConcepts using this conceptId.
    userSentiment: "Positive" | "Neutral" | "Negative"; // User's perceived sentiment of this attribute for THIS scenario
    significanceToUser: "None" | "Low" | "Medium" | "High"; // How much this attribute's sentiment (good or bad) for THIS scenario matters to the user.
    notes?: string; // Optional user notes specific to this attribute in this scenario
}
```

### 12. `CalculationResult` Model (Internal to Application State)

While not directly persisted, this structure represents the output of the `Calculation Engine` for a single scenario, which will be held in application state for display.

```typescript
interface ScenarioYearlyProjection {
    year: number;
    grossIncome: number;
    totalExpenses: number;
    capitalGainsIncome: number; 
    taxBreakdown: {
        federalIncomeTax: number;
        stateIncomeTax: number;
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
        * `taxBreakdown = calculateTaxes(currentYear, taxableIncome, capitalGainsData, rentalIncomeThisYear, scenario, appConfig)`
        * `additionalScenarioCostsForYear = scenario.annualExpenses.additionalCosts || 0;` (Note: Logic to handle one-time vs. recurring annual `additionalCosts` needs to be defined; for MVP, assume it applies each year if present).
        * `netFinancialOutcome = calculateNetFinancialOutcome(grossIncome, totalExpensesFromCategories, taxBreakdown.totalTax, additionalScenarioCostsForYear)`
    4.  Aggregates these results for `currentYear` into a `ScenarioYearlyProjection` object:
        ```typescript
        {
            year: currentYear,
            grossIncome: grossIncome,
            totalExpenses: totalExpensesFromCategories, // Note: does not include additionalScenarioCostsForYear here, as that's separate for netFinancialOutcome
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
* **Logic:** Sums `annualAmount` for all `IncomeSource` objects in `scenario.incomeSources` where `incomeSource.startYear <= currentYear` and (`incomeSource.endYear === undefined || incomeSource.endYear >= currentYear`).
* **Output:** `grossIncome: number`.

### 4.3. `calculateTotalExpenses(currentYear, scenario)`

* **Input:** `currentYear`, `scenario.annualExpenses`.
* **Logic:** Sums `amount` from all `AnnualExpense` objects in `scenario.annualExpenses.categories`. `scenario.annualExpenses.additionalCosts` is handled separately in `calculateNetFinancialOutcome`.
* **Output:** `totalExpensesFromCategories: number`.

### 4.4. `calculateCapitalGainsForYear(currentYear, scenario, userAppState, appConfig)`

* **Input:** `currentYear`, `scenario`, `userAppState.initialAssets`, `appConfig` (to look up `requiresGainBifurcation` on selected features).
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
* **Logic:** For MVP, this function returns `grossIncome` directly. It assumes no standard deductions or adjustments are applied by the engine to arrive at taxable income before applying the user-provided effective income tax rate. It serves as a placeholder for future, more detailed deduction logic.
* **Output:** `taxableIncome: number`.

### 4.6. `calculateTaxes(currentYear, taxableIncome, capitalGainsData, rentalIncome, scenario, appConfig)`

* **Input:**
    * `currentYear: number`
    * `taxableIncome: number` (from 4.5, for MVP this is likely `grossIncome`)
    * `capitalGainsData: { totalCapitalGainsIncome, preResidencyCapitalGains, postResidencyCapitalGains }` (from 4.4)
    * `rentalIncome: number` (passed in, subset of grossIncome if needed by features)
    * `scenario: Scenario`
    * `appConfig: AppConfig`
* **Internal Functions (Conceptual for MVP - logic might be inline or actual separate functions):**
    * `calculateStandardIncomeTax_MVP(taxableInc, incomeTaxRates: TaxRate[]): number`:
        * If `!incomeTaxRates || incomeTaxRates.length === 0` return 0.
        * Retrieves `effectiveRate = incomeTaxRates[0].rate || 0`.
        * Returns `taxableInc * effectiveRate`.
    * `calculateStandardCapitalGainsTax_MVP(cgData, capitalGainsTaxRates: CapitalGainsTaxRate[]): number`:
        * If `!capitalGainsTaxRates || capitalGainsTaxRates.length === 0` return 0.
        * Retrieves `effectiveST_Rate = capitalGainsTaxRates[0].shortTermRate || 0`.
        * Retrieves `effectiveLT_Rate = capitalGainsTaxRates[0].longTermRate || 0`.
        * `shortTermTax = cgData.postResidencyCapitalGains.shortTerm * effectiveST_Rate`.
        * `longTermTax = cgData.postResidencyCapitalGains.longTerm * effectiveLT_Rate`.
        * (Note: For MVP, baseline calculation uses `postResidencyCapitalGains`. If `preResidencyGains` exist and no special feature handles them, they are effectively untaxed by baseline or taxed as per standard rules if ST/LT rates are global. This needs to be consistent with feature expectations.)
        * Returns `shortTermTax + longTermTax`.
* **Logic:**
    1.  Initialize `taxBreakdown = { federalIncomeTax: 0, stateIncomeTax: 0, capitalGainsTax: 0, propertyTaxEstimate: 0, consumptionTaxEstimate: 0, totalTax: 0 }`.
    2.  **Standard Income Tax (MVP - Effective Rate):**
        * `calculatedIncomeTax = calculateStandardIncomeTax_MVP(taxableIncome, scenario.incomeTaxRates)`.
        * For MVP, this total `calculatedIncomeTax` might be broadly assigned to `taxBreakdown.federalIncomeTax`. A more nuanced split would require more data in `TaxRate` or scenario.
    3.  **Standard Capital Gains Tax (MVP - Effective Rates):**
        * `taxBreakdown.capitalGainsTax = calculateStandardCapitalGainsTax_MVP(capitalGainsData, scenario.capitalGainsTaxRates)`.
    4.  **Property Tax (MVP - Simple Estimate):**
        * (Estimate based on representative asset values and `scenario.propertyTaxRate`. For example, sum `fairMarketValuePerUnit * quantity` for assets in `userAppState.initialAssets` of `assetType === 'REAL_ESTATE'`, then multiply by `scenario.propertyTaxRate`. This needs access to asset values.)
        * `taxBreakdown.propertyTaxEstimate = (Estimated Real Estate Value for Scenario) * scenario.propertyTaxRate`.
    5.  **Consumption Tax (MVP - Simple Estimate):**
        * `totalCategoryExpenses = scenario.annualExpenses.categories.reduce((sum, cat) => sum + cat.amount, 0)`.
        * `taxBreakdown.consumptionTaxEstimate = (totalCategoryExpenses * (scenario.consumptionTaxRate || 0))`. (Assumes consumption tax applies to all categorized expenses for simplicity).
    6.  **Applies Special Tax Features (Dynamic Hook):**
        * Iterates through `scenario.selectedSpecialTaxFeatures`. For each `selectedFeatureEntry`:
            * Retrieve the full `featureDefinition` from `appConfig.globalSpecialTaxFeatures` using `selectedFeatureEntry.featureId`.
            * If `featureDefinition` exists:
                * Call the specific JavaScript handler function for this feature (e.g., `applyFeatureLogic_PR_Act60(...)`).
                * Pass necessary data: `currentYear`, current `taxBreakdown` (for modification), `taxableIncome`, `capitalGainsData`, `rentalIncome`, `selectedFeatureEntry.inputs`, the `scenario` itself (for its rates if needed), and `appConfig` (for any baseline rates the feature might reference).
                * The handler function implements the feature's specific rules and directly updates the values within the `taxBreakdown` object.
    7.  Recalculate `taxBreakdown.totalTax` by summing all positive tax components in `taxBreakdown` (federal, state, capital gains, property, consumption, any others added by features) and subtracting any credits or negative adjustments.
* **Output:** The modified `taxBreakdown` object.

### 4.7. `calculateNetFinancialOutcome(grossIncome, totalExpensesFromCategories, totalTax, additionalScenarioCosts)`

* **Input:** `grossIncome`, `totalExpensesFromCategories` (from `calculateTotalExpenses`), `totalTax`, `additionalScenarioCosts` (from `scenario.annualExpenses.additionalCosts`, applied for the relevant year).
* **Logic:** `netFinancialOutcome = grossIncome - totalExpensesFromCategories - totalTax - additionalScenarioCosts`.
* **Output:** `netFinancialOutcome: number`.

### 4.8. `calculateQualitativeFitScore(scenario, userAppState, appConfig)`

* **Input:**
    * `scenario: Scenario`
    * `userAppState: UserAppState` (containing `userQualitativeGoals`)
    * `appConfig: AppConfig` (containing `globalQualitativeConcepts` to look up display names/categories if needed, though `UserQualitativeGoal` now copies them)
* **Logic:**
    1.  Initialize `totalWeightedScoreContribution = 0` and `sumOfMaxPossibleGoalContributions = 0`.
    2.  Define non-linear numerical mappings for weights and significance:
        * `goalWeightMap = { "Low": 1, "Medium": 3, "High": 7, "Critical": 15 }` (Example values)
        * `significanceMap = { "None": 0, "Low": 1, "Medium": 2, "High": 3 }` (Example values)
        * `sentimentMap = { "Positive": 1, "Neutral": 0, "Negative": -1 }`
    3.  Iterate through each `goal` in `userAppState.userQualitativeGoals`:
        a.  `goalWeightNumeric = goalWeightMap[goal.weight] || 0`.
        b.  `sumOfMaxPossibleGoalContributions += goalWeightNumeric * (significanceMap["High"])`. (This assumes maximum positive sentiment alignment for normalization purposes).
        c.  Find the corresponding `scenarioAttribute` in `scenario.scenarioSpecificAttributes` where `scenarioAttribute.conceptId === goal.conceptId`.
        d.  If a matching `scenarioAttribute` is found:
            i.  If `scenarioAttribute.userSentiment === "Neutral"` OR `scenarioAttribute.significanceToUser === "None"`:
                * The contribution for this pairing is `0`.
            ii. Else:
                * `sentimentValue = sentimentMap[scenarioAttribute.userSentiment] || 0`.
                * `significanceValue = significanceMap[scenarioAttribute.significanceToUser] || 0`.
                * `attributeEffect = sentimentValue * significanceValue`. // Max effect is 1*3=3, Min effect is -1*3=-3
                * `totalWeightedScoreContribution += attributeEffect * goalWeightNumeric`.
        e.  Else (no matching scenario attribute for a user goal): Contribution is `0`.
    4.  **Normalization (Example to a 0-100 scale):**
        * If `sumOfMaxPossibleGoalContributions === 0` (no weighted goals defined by user or all weights are 0), then `qualitativeFitScore = 50` (representing a neutral default).
        * Else, `qualitativeFitScore = ((totalWeightedScoreContribution + sumOfMaxPossibleGoalContributions) / (2 * sumOfMaxPossibleGoalContributions)) * 100`. This formula maps the score range from `[-sumOfMaxPossibleGoalContributions, +sumOfMaxPossibleGoalContributions]` to `[0, 100]`.
        * Ensure the final score is capped between 0 and 100. `qualitativeFitScore = Math.max(0, Math.min(100, qualitativeFitScore))`.
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
        * Initialize runtime state: `currentActivePlanUUID` should be determined (e.g., if the active plan was an auto-save of a previously named plan, this link might need to be inferred or stored alongside `taxAnalyzer_activePlan`, or simply be `undefined` initially for an active session that hasn't been explicitly saved to/loaded from the named list yet). `isActivePlanLocked = false` (unless loaded from a locked state via URL which is complex for MVP), `isDirty = false`. The `activeUserAppState.activePlanInternalName` is derived from the deserialized data.
    * If no active plan is found (no URL string, nothing in `taxAnalyzer_activePlan`, or data is invalid):
        * Initialize `activeUserAppState` as a new, "Untitled Plan" (e.g., `activePlanInternalName: "Untitled Plan"`, empty `initialAssets`, `scenarios`, `userQualitativeGoals`).
        * Set runtime state: `currentActivePlanUUID = undefined`, `currentActivePlanUserDisplayName = undefined`, `isActivePlanLocked = false`, `isDirty = false`.
        * Auto-save this initial "Untitled Plan" state to `taxAnalyzer_activePlan`.

### 2. Scenario Creation/Modification within Active Plan

* When creating a new scenario from a template, a deep copy of the selected `templateScenario` from `appConfig.templateScenarios` is made. This includes its `incomeTaxRates` and `capitalGainsTaxRates` (which for MVP templates will contain a single entry with effective rates), `annualExpenses.categories`, and `scenarioSpecificAttributes` (with default `userSentiment` and `significanceToUser`).
* When creating a new custom scenario from scratch, its `incomeTaxRates` and `capitalGainsTaxRates` arrays are initialized with a single placeholder record (e.g., rate: 0), prompting user input for effective rates. Other financial arrays/objects start empty.
* Users modify `activeUserAppState` directly. Any change sets the runtime `isDirty = true`.

### 3. Continuous Auto-Save of Active Plan

* Whenever `activeUserAppState` is modified significantly (or on a suitable short timer/on blur events), it is serialized to `compressedPlanDataString` and saved to `localStorage` under the key `taxAnalyzer_activePlan`.

### 4. Plan Management Operations:

#### 4.1. New Plan (from scratch by user action)
1.  Check if current runtime `isDirty` for `activeUserAppState`. If yes, prompt user: "You have unsaved changes in '{current activeUserAppState.activePlanInternalName}'. [Save Current Plan] [Save As New...] [Discard Changes & Create New] [Cancel]".
    * If "Save Current Plan": Execute "Save Active Plan" flow (4.3). If successful, proceed.
    * If "Save As New...": Execute "Save As Active Plan" flow (4.4). If successful, proceed.
    * If "Discard Changes & Create New": Proceed.
    * If "Cancel": Abort new plan creation.
2.  If proceeding:
    * Initialize `activeUserAppState` to a new "Untitled Plan" structure.
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
        * If "Unlock and Save": Set `SavedPlanEntry.isLocked = false` in the list, then proceed to save to this slot.
        * If "Save As New Plan...": Trigger the "Save As Active Plan" flow (4.4).
        * If "Cancel": Do nothing.
        * Return after prompt handling if not proceeding with direct save.
    * (If not locked or was unlocked by prompt) Serialize current `activeUserAppState` to `newCompressedPlanDataString`.
    * Update the found `SavedPlanEntry`: `compressedPlanDataString = newCompressedPlanDataString`, `lastSavedDate = now()`. (The `activePlanInternalName` within `newCompressedPlanDataString` is also saved).
    * Save the updated `taxAnalyzer_savedPlansList` (the whole array object with version) to `localStorage`.
    * Update runtime `isDirty = false`.
2.  Else (runtime `currentActivePlanUUID` is `undefined`, i.e., an "Untitled Plan" or a plan from a URL that hasn't been saved yet):
    * Trigger the "Save As Active Plan" flow (4.4).

#### 4.4. Save As Active Plan
1.  Prompt user for a `newUserDisplayName` for the new saved slot. If not provided, perhaps use `activeUserAppState.activePlanInternalName` as a default.
2.  Generate `newPlanUUID = UUID()`.
3.  Set `createDate = now()`, `lastSavedDate = now()`, `isLocked = false`.
4.  Serialize current `activeUserAppState` into `currentCompressedPlanDataString`. (Ensure `activeUserAppState.activePlanInternalName` is up-to-date if user also changed it).
5.  Create a new `SavedPlanEntry` using `newPlanUUID`, `newUserDisplayName`, `createDate`, `lastSavedDate`, `isLocked`, and `currentCompressedPlanDataString`.
6.  Add this new `SavedPlanEntry` to the `taxAnalyzer_savedPlansList` plans array.
7.  Save the updated `taxAnalyzer_savedPlansList` (the whole array object with version) to `localStorage`.
8.  Update runtime state: `currentActivePlanUUID = newPlanUUID`, `currentActivePlanUserDisplayName = newUserDisplayName`, `isActivePlanLocked = false`, `isDirty = false`.

#### 4.5. Clone Saved Plan (from list)
1.  User selects a source `SavedPlanEntry` from the `taxAnalyzer_savedPlansList`.
2.  Prompt user for a `newUserDisplayName` for the cloned slot (default: "Copy of {source.userDisplayName}" or derive from source plan's internal name).
3.  Generate `newPlanUUID = UUID()`.
4.  Set `createDate = now()`, `lastSavedDate = now()` (as it's a new save slot representing the data at this point), `isLocked = false`.
5.  The `compressedPlanDataString` is taken directly from `source.compressedPlanDataString`.
6.  Create new `SavedPlanEntry` and add to `taxAnalyzer_savedPlansList` plans array.
7.  Save updated `taxAnalyzer_savedPlansList` to `localStorage`.
    * (The UI might then offer to load this clone into the active state, which would follow the "Load Named Plan" flow, including prompts for unsaved changes to the currently active plan).

#### 4.6. Delete Saved Plan
1.  User selects a `SavedPlanEntry` from the `taxAnalyzer_savedPlansList` and confirms deletion.
2.  Remove the `SavedPlanEntry` from the `taxAnalyzer_savedPlansList` plans array.
3.  Save updated `taxAnalyzer_savedPlansList` to `localStorage`.
4.  If the deleted `planUUID` matches the runtime `currentActivePlanUUID`:
    * Set runtime `currentActivePlanUUID = undefined` and `currentActivePlanUserDisplayName = undefined`. (The `activeUserAppState` itself remains in memory and in `taxAnalyzer_activePlan` but is now effectively "Untitled" or detached from a named saved slot).

#### 4.7. Rename Saved Plan Slot
1.  User selects a `SavedPlanEntry` from the `taxAnalyzer_savedPlansList` and provides a new `userDisplayName`.
2.  Update the `userDisplayName` property of the corresponding `SavedPlanEntry` in the `taxAnalyzer_savedPlansList` plans array.
3.  Update its `lastSavedDate = now()` (as metadata of the slot changed).
4.  Save updated `taxAnalyzer_savedPlansList` to `localStorage`.
5.  If the renamed plan's `planUUID` matches runtime `currentActivePlanUUID`, update runtime `currentActivePlanUserDisplayName`.

#### 4.8. Toggle Lock Status of Saved Plan
1.  User selects a `SavedPlanEntry` from the `taxAnalyzer_savedPlansList` to toggle its lock status.
2.  Update `SavedPlanEntry.isLocked` property (true to false, or false to true) in the `taxAnalyzer_savedPlansList` plans array.
3.  Update its `lastSavedDate = now()` (as metadata of the slot changed).
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
* **Detection:** Client-Side Validation (on form submission/`onChange`), schema validation if used.
* **Handling:** Immediate UI feedback, prevent submission/calculation, user guidance.

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
* **Full Progressive Bracket Processing.**
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
