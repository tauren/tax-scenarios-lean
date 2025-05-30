# Tax Scenarios Analyzer Lean MVP Architecture Document

**Version:** 1.1-lean
**Date:** May 30, 2025
**Author:** Fred (Architect Agent) & Vibe CEO (User)

## Introduction / Preamble

This document outlines the overall project architecture for the **Lean Minimum Viable Product (MVP)** of the "Tax Scenarios Analyzer." It focuses exclusively on its client-side implementation as a single-page application (SPA) designed to run entirely within the user's browser. The primary goal of this lean MVP is to provide users with a tool to estimate **capital gains tax implications** and assess qualitative factors across different scenarios.

This document serves as the guiding architectural blueprint for the development of this lean MVP, ensuring consistency and adherence to chosen patterns and technologies. It details the data structures, core calculation logic (focused on capital gains tax), application data flow for a single active plan, and high-level strategies for error handling, security, and deployment.

**Relationship to Frontend Architecture:**
This document aligns with the `front-end-architecture-v0.2.md` (Lean MVP version) and `front-end-spec-v0.1.md` (Lean MVP version), which detail the frontend-specific design and user experience. Core technology stack selections are consistent with those documents.

## Table of Contents

1.  Introduction / Preamble
2.  Technical Summary
3.  Technology Choices & Rationale
4.  Core Components & Data Models (Lean MVP)
5.  Conceptual Data Flow
6.  Calculation Engine Logic (Lean MVP - Capital Gains Focus)
7.  Application Data Flow (Lean MVP - Single Active Plan & Sharing)
8.  Error Handling Strategy
9.  Security Considerations
10. Deployment Considerations
11. Testing Strategy (MVP)
12. Future Enhancements

## Technical Summary

The Tax Scenarios Analyzer Lean MVP is architected as an entirely client-side Single-Page Application (SPA) built with TypeScript (latest stable, e.g., 5.x), React 19, Vite (latest stable), leveraging ShadCN UI with Tailwind CSS 4 for styling, and Zustand (latest stable) for state management. LZ-String (latest stable) will be used for data compression for the URL sharing feature.

For this lean MVP, the core calculation engine focuses exclusively on **estimating capital gains tax**, using user-provided effective Short-Term and Long-Term rates for each scenario. Other tax types (income, property, consumption) are not calculated by the engine. Users input gross income figures (from various sources) and living expenses primarily for overall financial context and net outcome calculation.

The application supports qualitative assessment through user-defined weighted goals (based on a global list of concepts) and scenario-specific attribute evaluations. Data persistence for the MVP is simplified to a **single "Active Plan"** continuously auto-saved to `localStorage`. The ability to share this active plan via a compressed, URL-encoded string is retained, including overwrite safety prompts.

`SpecialTaxFeature`s, particularly those impacting capital gains (e.g., requiring gain bifurcation based on asset residency details), are supported. The architecture is designed for automated CI/CD deployment to static hosting platforms like Cloudflare Pages. The primary performance goal for the MVP is reasonable responsiveness, with calculations completing within a few seconds for typical data loads.

## Technology Choices & Rationale

The technology stack for this Lean MVP was selected based on the primary developer's (Vibe CEO) familiarity and expertise with these tools. This choice aims to maximize development speed and efficiency for this personal project, allowing for rapid iteration and delivery of core MVP features. While formal evaluation of alternatives was not conducted for this phase, the chosen stack (TypeScript, React 19, Vite, Tailwind CSS 4, Zustand, ShadCN UI) represents a modern, robust, and widely adopted ecosystem for building performant client-side applications.

## Core Components & Data Models (Lean MVP)

### 1. `AppConfig` Model (Static Configuration - Lean MVP)

Includes lean template scenarios (focused on Capital Gains Tax setup and qualitative defaults), global special tax feature definitions relevant to the MVP's scope, and a master list of qualitative concepts.

```typescript
interface CapitalGainsTaxRate { // User provides effective ST/LT rates for a scenario
    minIncome: number; // For MVP effective rates: 0
    maxIncome?: number; // For MVP effective rates: undefined
    shortTermRate: number; // User's effective short-term CGT rate for the scenario
    longTermRate: number; // User's effective long-term CGT rate for the scenario
}

interface SpecialTaxFeature { // Global definition
    id: string; 
    name: string; 
    description: string;
    appliesTo: "INCOME" | "CAPITAL_GAINS" | "OTHER"; // MVP will focus on those applying to CAPITAL_GAINS or OTHER financial outcomes
    inputs?: {
        key: string;
        type: "NUMBER" | "DATE" | "STRING" | "BOOLEAN";
        label: string;
        placeholder?: string;
    }[];
    requiresGainBifurcation?: boolean; 
}

interface GlobalQualitativeConcept {
    id: string;          // Canonical, unique ID (e.g., "safety-low-crime")
    name: string;        // Default display name (e.g., "Low Crime Rate")
    category: string;    // e.g., "Safety & Security"
    description?: string;// Explanation of the concept
}

interface AppConfig {
    templateScenarios: Scenario[]; // Lean templates, focused on CGT setup & qualitative defaults
    globalSpecialTaxFeatures: SpecialTaxFeature[]; // Curated list relevant for MVP's CGT focus
    globalQualitativeConcepts: GlobalQualitativeConcept[];
    projectionPeriodYears: number; // Default projection duration (e.g., 10 years)
}
```

### 2. `UserAppState` Model (Represents the Active Plan's Data - Lean MVP)

Core data for the single active plan.

```typescript
interface UserAppState {
    activePlanInternalName: string; // User-editable name for the current plan/session
    initialAssets: Asset[]; 
    scenarios: Scenario[]; 
    userQualitativeGoals: UserQualitativeGoal[];
}
```
*Note: This active `UserAppState` is stored compressed in `localStorage` under a single key (e.g., `taxAnalyzer_activePlan`). No list of multiple named saved plans is part of the Lean MVP.*

### 3. `Asset` Model (Within `UserAppState.initialAssets`)

```typescript
interface Asset {
    id: string; 
    name: string;
    assetType?: "STOCK" | "CRYPTO" | "REAL_ESTATE" | "OTHER"; // Optional for user input
    quantity: number;
    costBasisPerUnit: number; 
    fairMarketValuePerUnit?: number; // Optional for user input
    acquisitionDate: string; 
}
```

### 4. `ScenarioIncomeSource` Model (Within `Scenario.incomeSources` - Lean MVP)

For MVP, this captures gross income for financial context; its tax rate is not directly used by the core engine for income tax calculation as that feature is deferred.

```typescript
interface ScenarioIncomeSource {
    id: string; 
    name: string;
    type: "EMPLOYMENT" | "RENTAL_PROPERTY" | "OTHER";
    annualAmount: number; // User inputs this for financial overview
    startYear: number;
    endYear?: number; 
    sourceJurisdictionInfo?: string; // Optional, purely informational text for user to note origin (e.g., "CA Rental")
    // Effective tax rate fields for income are omitted for Lean MVP
    notes?: string;
}
```

### 5. `PlannedAssetSale` Model (Within Scenario)

```typescript
interface PlannedAssetSale {
    id: string; 
    assetId: string; // References Asset.id
    year: number; 
    quantity: number; 
    salePricePerUnit: number; 
}
```

### 6. `AnnualExpense` Model (Category within Scenario)

```typescript
interface AnnualExpense { 
    id: string; 
    name: string;
    amount: number; 
}
```

### 7. `ScenarioAssetTaxDetail` Model (Within Scenario)
Relevant for `SpecialTaxFeature`s that `requireGainBifurcation` for capital gains.
```typescript
interface ScenarioAssetTaxDetail {
    assetId: string; // References Asset.id
    residencyAcquisitionDate: string; 
    valueAtResidencyAcquisitionDatePerUnit: number;
}
```

### 8. `Scenario` Model (Lean MVP)

Self-contained with its parameters. Focus is on user-provided effective capital gains tax rates. Fields for other tax types (income, property, consumption rates for engine calculation) are omitted for this lean MVP.

```typescript
interface Scenario {
    id: string; 
    name: string; // User-editable name for this specific scenario
    
    templateReferenceId?: string; // Optional: ID of the appConfig.templateScenarios this was based on
    displayLocationName: string; 
    locationCountry: string;     
    locationState?: string;    
    locationCity?: string;     

    // Capital Gains Tax: User provides effective ST/LT rates for the scenario.
    // Stored in an array, but for MVP, only the first element (index 0) is used by the engine.
    capitalGainsTaxRates: CapitalGainsTaxRate[]; 

    // Fields for incomeTaxRates, propertyTaxRate, consumptionTaxRate (for engine calculation) are OMITTED for Lean MVP.
    // Users can track property/consumption taxes as part of their AnnualExpense entries if desired.

    projectionPeriodYears: number;
    residencyStartDate?: string; // Informational and for use by STFs needing residency dates
    
    scenarioAssetTaxDetails?: ScenarioAssetTaxDetail[]; // For STFs affecting CGT that require bifurcation

    incomeSources: ScenarioIncomeSource[]; // Captures gross income for context
    annualExpenses: { 
        categories: AnnualExpense[]; 
        additionalCosts?: number;
    };
    plannedAssetSales: PlannedAssetSale[];
    selectedSpecialTaxFeatures: { // Primarily those affecting CGT or overall financial outcome for MVP
        featureId: string; 
        inputs: { [key: string]: any };
    }[];
    scenarioSpecificAttributes: ScenarioAttribute[]; 
}
```

### 9. `UserQualitativeGoal` Model (Within `UserAppState.userQualitativeGoals`)

Links to a `GlobalQualitativeConcept` and adds user's personal weighting.

```typescript
interface UserQualitativeGoal {
    id: string; // Unique UUID for this specific user goal instance
    conceptId: string; // The ID from AppConfig.globalQualitativeConcepts. Non-editable post-creation.
    name: string; // Initially copied from globalQualitativeConcepts.name, user can then edit.
    category: string; // Initially copied from globalQualitativeConcepts.category; non-editable or derived via conceptId.
    description?: string; // Initially copied, user can edit.
    weight: "Low" | "Medium" | "High" | "Critical"; 
}
```

### 10. `ScenarioAttribute` Model (Within `Scenario.scenarioSpecificAttributes`)

Links to a `GlobalQualitativeConcept` and stores user's scenario-specific assessment.

```typescript
interface ScenarioAttribute {
    conceptId: string; // The ID from AppConfig.globalQualitativeConcepts. Non-editable post-creation.
                       // Display name, category, description are looked up from AppConfig.globalQualitativeConcepts.
    userSentiment: "Positive" | "Neutral" | "Negative"; 
    significanceToUser: "None" | "Low" | "Medium" | "High"; 
    notes?: string; 
}
```

### 11. `CalculationResult` Model (Internal to Application State - Lean MVP)

Reflects MVP's focus: Capital Gains Tax is calculated; other taxes are effectively zero from the engine's perspective unless impacted by a Special Tax Feature.

```typescript
interface ScenarioYearlyProjection {
    year: number;
    grossIncome: number; 
    totalExpenses: number; 
    capitalGainsIncome: number;
    taxBreakdown: {
        // incomeTax: 0, // Not calculated by MVP engine
        // propertyTaxEstimate: 0, // Not calculated by MVP engine
        // consumptionTaxEstimate: 0, // Not calculated by MVP engine
        capitalGainsTax: number;    // Calculated by MVP engine
        totalTax: number; // Primarily capitalGainsTax + STF impacts for MVP
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

## Conceptual Data Flow

The following diagram illustrates the high-level data flow within the client-side application for the Lean MVP:

```mermaid
graph TD
    A[User Interaction via UI] --> B{Active UserAppState (In Memory via Zustand)};
    B --> C[localStorage (taxAnalyzer_activePlan) - Auto-Save/Load Active Plan];
    B --> D[Calculation Engine];
    E[AppConfig (Static Data - Templates, Global Concepts, STFs)] --> D;
    D --> F[AppCalculatedState (In Memory - Scenario Results)];
    F --> A;
    B --> G[https://learn.microsoft.com/en-us/answers/questions/377433/dont-compress-flask-web-app](https://learn.microsoft.com/en-us/answers/questions/377433/dont-compress-flask-web-app);
    G --> H[Shareable URL (URL Parameters)];
    H --> B;
```

**Flow Description:**
1.  The user interacts with the UI (built with React components).
2.  User actions modify the `Active UserAppState`, which is managed by Zustand.
3.  Changes to the `Active UserAppState` are periodically auto-saved (compressed) to `localStorage` and can be loaded from `localStorage` on application startup.
4.  The `Calculation Engine` takes the `Active UserAppState` and static `AppConfig` data as input.
5.  The `Calculation Engine` produces `AppCalculatedState` (containing results for each scenario).
6.  This `AppCalculatedState` updates the application's state, which in turn updates the UI to display results.
7.  The `URL Sharing Service` can serialize and compress the `Active UserAppState` to generate a shareable URL, and can deserialize and decompress a plan from a URL to populate the `Active UserAppState`.

## Calculation Engine Logic (Lean MVP - Capital Gains Focus)

The Calculation Engine processes a self-contained `Scenario` object from the active `UserAppState`. For MVP, it primarily calculates capital gains tax and qualitative fit scores. Other tax types are not calculated by the core engine.

### 1. `calculateScenarioProjection(scenario, userAppState, appConfig)`

* **Input:** A `Scenario` object, `userAppState` (for `initialAssets` and `userQualitativeGoals`), `appConfig` (for `globalSpecialTaxFeatures` and `globalQualitativeConcepts` definitions).
* **Logic:**
    1.  Initializes an empty array for `yearlyProjections`.
    2.  Iterates from `currentYear = 1` up to `scenario.projectionPeriodYears`.
    3.  For each `currentYear`, it calls a series of sub-functions to compute financial metrics:
        * `grossIncome = calculateIncomeForYear(currentYear, scenario)`
        * `totalExpensesFromCategories = calculateTotalExpenses(currentYear, scenario)`
        * `capitalGainsData = calculateCapitalGainsForYear(currentYear, scenario, userAppState, appConfig)`
        * `taxBreakdown = calculateTaxes_MVP(currentYear, capitalGainsData, scenario, appConfig)`
        * `additionalScenarioCostsForYear = scenario.annualExpenses.additionalCosts || 0;`
        * `netFinancialOutcome = calculateNetFinancialOutcome(grossIncome, totalExpensesFromCategories, taxBreakdown.totalTax, additionalScenarioCostsForYear)`
    4.  Aggregates these results for `currentYear` into a `ScenarioYearlyProjection` object.
    5.  Adds the `ScenarioYearlyProjection` to the `yearlyProjections` array.
    6.  After the loop, it calls `qualitativeFitScore = calculateQualitativeFitScore(scenario, userAppState, appConfig)`.
    7.  Computes `totalNetFinancialOutcomeOverPeriod` by summing `netFinancialOutcome` from all `yearlyProjections`.
* **Output:** A `ScenarioResults` object.
* **Edge Case Consideration:** During implementation, ensure graceful handling of scenarios with missing optional data (e.g., no assets, no planned sales, zero rates), typically by resulting in zero tax/outcome for the affected parts rather than errors.

### 2. `calculateIncomeForYear(currentYear, scenario)`

* **Input:** `currentYear`, `scenario.incomeSources`.
* **Logic:** Sums `annualAmount` for all `ScenarioIncomeSource` objects in `scenario.incomeSources` where `incomeSource.startYear <= currentYear` and (`incomeSource.endYear === undefined || incomeSource.endYear >= currentYear`). This sum is for contextual financial overview and net financial outcome, not for engine-calculated income tax in MVP.
* **Output:** `grossIncome: number`.

### 3. `calculateTotalExpenses(currentYear, scenario)`

* **Input:** `currentYear`, `scenario.annualExpenses`.
* **Logic:** Sums `amount` from all `AnnualExpense` objects in `scenario.annualExpenses.categories`. `scenario.annualExpenses.additionalCosts` is handled separately.
* **Output:** `totalExpensesFromCategories: number`.

### 4. `calculateCapitalGainsForYear(currentYear, scenario, userAppState, appConfig)`

* **Input:** `currentYear`, `scenario`, `userAppState.initialAssets`, `appConfig`.
* **Logic:**
    1.  Identifies all `PlannedAssetSale` objects in `scenario.plannedAssetSales` where `sale.year === currentYear`.
    2.  Determines if gain bifurcation is required by checking `requiresGainBifurcation` on any active `SpecialTaxFeature` selected in the `scenario` (looked up from `appConfig.globalSpecialTaxFeatures`).
    3.  Initializes `aggregatedResults` for `totalCapitalGainsIncome`, `preResidencyCapitalGains` (ST/LT), and `postResidencyCapitalGains` (ST/LT).
    4.  For each sale:
        a.  Retrieves the `Asset`.
        b.  Calculates `TotalGain`.
        c.  If `bifurcationNeeded` and `scenario.scenarioAssetTaxDetails` for the asset exist, calculates `PreResidencyGain` and `PostResidencyGain`, categorizing each as ST/LT based on relevant holding periods (Asset.acquisitionDate to ScenarioAssetTaxDetail.residencyAcquisitionDate for Pre; ScenarioAssetTaxDetail.residencyAcquisitionDate to sale date for Post).
        d.  Else (no bifurcation or missing details for it), attributes `TotalGain` to `postResidencyCapitalGains` (categorized as ST/LT based on total holding period from `Asset.acquisitionDate` to sale date).
    5.  Sums all gains into `aggregatedResults`.
* **Output:** An object: `{ totalCapitalGainsIncome, preResidencyCapitalGains: { longTerm, shortTerm }, postResidencyCapitalGains: { longTerm, shortTerm } }`.

### 5. `determineTaxableIncome(grossIncome)`
* **Input:** `grossIncome`.
* **Logic:** For the Lean MVP, this function primarily serves as a pass-through or contextual value. Since no general income tax deductions are processed by the engine, `taxableIncome` for the purpose of any STF needing such a concept would effectively be `grossIncome`.
* **Output:** `taxableIncome: number` (which is `grossIncome` for MVP context).

### 6. `calculateTaxes_MVP(currentYear, capitalGainsData, scenario, appConfig)`

* **Input:** `currentYear`, `capitalGainsData`, `scenario`, `appConfig`.
* **Logic:**
    1.  Initialize `taxBreakdown = { incomeTax: 0, capitalGainsTax: 0, propertyTaxEstimate: 0, consumptionTaxEstimate: 0, totalTax: 0 }`.
    2.  **Capital Gains Tax (MVP - Scenario Effective Rates):**
        * If `scenario.capitalGainsTaxRates` and `scenario.capitalGainsTaxRates.length > 0` (expecting one entry at index 0 for MVP):
            * `effectiveST_Rate = scenario.capitalGainsTaxRates[0].shortTermRate || 0;`
            * `effectiveLT_Rate = scenario.capitalGainsTaxRates[0].longTermRate || 0;`
            * `shortTermTax = capitalGainsData.postResidencyCapitalGains.shortTerm * effectiveST_Rate;`
            * `longTermTax = capitalGainsData.postResidencyCapitalGains.longTerm * effectiveLT_Rate;`
            * (Note: If `preResidencyGains` exist, `SpecialTaxFeature`s are responsible for their specific tax treatment. If no STF handles them, this baseline calculation applies only to `postResidencyCapitalGains` or to total gains if bifurcation did not result in separate pre-residency amounts being non-taxable by the baseline).
            * `taxBreakdown.capitalGainsTax = shortTermTax + longTermTax;`
        * Else, `taxBreakdown.capitalGainsTax = 0;`
    3.  **Other Standard Taxes (Not Calculated by Engine in MVP):**
        * `taxBreakdown.incomeTax = 0;`
        * `taxBreakdown.propertyTaxEstimate = 0;`
        * `taxBreakdown.consumptionTaxEstimate = 0;`
    4.  **Applies Special Tax Features:**
        * Iterates `scenario.selectedSpecialTaxFeatures`. For each `selectedFeatureEntry`:
            * Retrieve `featureDefinition` from `appConfig.globalSpecialTaxFeatures`.
            * Call specific handler function, passing necessary data (current `taxBreakdown` for modification, `capitalGainsData`, `scenario.incomeSources` for contextual income if STF needs it, `selectedFeatureEntry.inputs`, `scenario`, `appConfig`).
            * Handler primarily modifies `taxBreakdown.capitalGainsTax` or adds other specific financial impacts relevant to MVP (e.g., reducing CGT, adding specific fees categorized under total tax). STFs affecting "INCOME" will need to be carefully designed for MVP, as there's no baseline engine-calculated income tax for them to modify; they might add a specific income-related tax or credit directly.
    5.  Calculate `taxBreakdown.totalTax` by summing components (primarily `capitalGainsTax` and any direct tax/credit impacts from STFs).
* **Output:** The modified `taxBreakdown` object.

### 7. `calculateNetFinancialOutcome(grossIncome, totalExpensesFromCategories, totalTax, additionalScenarioCosts)`

* **Input:** `grossIncome`, `totalExpensesFromCategories`, `totalTax`, `additionalScenarioCosts` (from `scenario.annualExpenses.additionalCosts`).
* **Logic:** `netFinancialOutcome = grossIncome - totalExpensesFromCategories - totalTax - additionalScenarioCosts`.
* **Output:** `netFinancialOutcome: number`.

### 8. `calculateQualitativeFitScore(scenario, userAppState, appConfig)`
* **Input:** `scenario: Scenario`, `userAppState: UserAppState`, `appConfig: AppConfig`.
* **Logic:**
    1.  Initialize `totalWeightedScoreContribution = 0` and `sumOfMaxPossibleGoalContributions = 0`.
    2.  Define non-linear numerical mappings for weights (e.g., `goalWeightMap = { "Low": 1, "Medium": 3, "High": 7, "Critical": 15 }`) and significance (e.g., `significanceMap = { "None": 0, "Low": 1, "Medium": 2, "High": 3 }`). Sentiments: `Positive: 1, Neutral: 0, Negative: -1`.
    3.  Iterate through each `goal` in `userAppState.userQualitativeGoals`:
        a.  `goalWeightNumeric = goalWeightMap[goal.weight] || 0`.
        b.  `sumOfMaxPossibleGoalContributions += goalWeightNumeric * (significanceMap["High"])`.
        c.  Find `scenarioAttribute` in `scenario.scenarioSpecificAttributes` where `scenarioAttribute.conceptId === goal.conceptId`.
        d.  If found:
            i.  If `scenarioAttribute.userSentiment === "Neutral"` OR `scenarioAttribute.significanceToUser === "None"`, contribution is `0`.
            ii. Else, `attributeEffect = sentimentMap[scenarioAttribute.userSentiment] * significanceMap[scenarioAttribute.significanceToUser]`. Add `attributeEffect * goalWeightNumeric` to `totalWeightedScoreContribution`.
    4.  Normalize `totalWeightedScoreContribution` against `sumOfMaxPossibleGoalContributions` to a 0-100 scale. (Handle `sumOfMaxPossibleGoalContributions === 0` by returning a default like 50). `qualitativeFitScore = Math.max(0, Math.min(100, ((totalWeightedScoreContribution + sumOfMaxPossibleGoalContributions) / (2 * sumOfMaxPossibleGoalContributions)) * 100))`.
    5.  **Note:** The UI should provide a transparent breakdown of score composition.
* **Output:** `qualitativeFitScore: number`.

## Application Data Flow (Lean MVP - Single Active Plan & Sharing)

Manages a single "Active Plan" with auto-save and URL sharing. No list of multiple named saved plans for MVP.

### `localStorage` Structure:
* **Key `taxAnalyzer_activePlan`:** Stores the `compressedPlanDataString` of the current working `UserAppState`. This is subject to frequent continuous auto-save.

### Runtime (In-Memory) State for Active Session:
* `activeUserAppState: UserAppState` (the deserialized, working object).
* `isDirty: boolean` (tracks if `activeUserAppState` has unsaved changes since last load from URL/example or new plan creation).

### 1. Initial Application Load
1.  Load `AppConfig`.
2.  **Load Active Plan:**
    * Check URL for a shared plan string (`compressedPlanDataString`). If present and successfully parsed/decompressed:
        * The application uses this data to populate `activeUserAppState`.
        * Set `isDirty = false` (as it's freshly loaded).
        * Auto-save this state to `taxAnalyzer_activePlan` to make it the current working copy.
    * Else (no valid URL string), attempt to load `compressedPlanDataString` from `localStorage` key `taxAnalyzer_activePlan`.
        * If found and valid: Deserialize into `activeUserAppState`. Set `isDirty = false`.
    * Else (no stored plan, no URL plan, or data is invalid):
        * Initialize `activeUserAppState` as a new, "Untitled Plan" (e.g., `activePlanInternalName: "Untitled Plan"`, empty assets/scenarios/goals).
        * Set `isDirty = false`.
        * Auto-save this initial "Untitled Plan" state to `taxAnalyzer_activePlan`.

### 2. Scenario Creation/Modification within Active Plan
* **From Template:** User selects a template from `AppConfig.templateScenarios`. A deep copy is made and added to/replaces a scenario in `activeUserAppState.scenarios`.
* **Custom Scenario:** User creates a new scenario structure, inputting effective CGT rates and other details.
* Modifying any part of `activeUserAppState` sets runtime `isDirty = true`.

### 3. Continuous Auto-Save of Active Plan
* When `activeUserAppState` is modified (and `isDirty` is true), it is serialized to `compressedPlanDataString` and saved to `taxAnalyzer_activePlan`. Conceptually, after a successful auto-save, `isDirty` might be reset to `false` relative to the `localStorage` copy, or it reflects "changed since last explicit load/new." For MVP, `isDirty`'s main role is to manage prompts before overwriting the active state from an external source like a URL.

### 4. Plan Management Operations (Simplified for Lean MVP):

#### 4.1. New Plan (from scratch by user action, e.g., "Clear & Start New" button)
1.  Check if current runtime `isDirty` for `activeUserAppState`. If yes, prompt user: "Discard unsaved changes in '{current activeUserAppState.activePlanInternalName}' and start a new plan? [Discard & Create New] [Cancel]".
2.  If "Discard & Create New" (or if not dirty):
    * Initialize `activeUserAppState` to a new "Untitled Plan" structure.
    * Set runtime `isDirty = false`.
    * Auto-save this new "Untitled Plan" state to `taxAnalyzer_activePlan`.

#### 4.2. Load Plan (from Shareable URL, including Examples loaded via URL)
1.  This flow is primarily handled during Initial Application Load if a URL parameter is present.
2.  If a mechanism allows loading a new URL *while the app is running* (e.g., user pastes a shared link into a UI input field and clicks "Load"):
    * Check if current runtime `isDirty`. If yes, prompt: "Loading this shared plan will discard your current unsaved changes to '{current activeUserAppState.activePlanInternalName}'. Proceed? [Load & Discard Current] [Cancel]".
    * If "Load & Discard Current" (or if not dirty): Parse the new URL string, decompress, deserialize into `activeUserAppState`. Set `isDirty = false`. Auto-save to `taxAnalyzer_activePlan`.

#### 4.3. (Explicit "Save to Named Slot", "Save As to Named Slot", "Clone from List", "Delete Named Plan", "Rename Slot", "Lock Slot" are DEFERRED from Lean MVP as there is no list of multiple named saved plans). The only "save" is the continuous auto-save of the single active plan.

### 5. Sharing Active Plan via URL
1.  User clicks a "Share Plan" UI action.
2.  Current `activeUserAppState` (including its `activePlanInternalName`) is serialized to JSON, then compressed (e.g., using LZ-String), and finally URL-encoded.
3.  The resulting string is presented to the user for copying/sharing.

### 6. Calculation Initiation, Engine Processing, Results
These operations function on the current `activeUserAppState`. UI changes trigger recalculations as needed.

### 7. Special Tax Feature Logic
This logic operates on the data within the `activeUserAppState.scenarios`. Definitions of available features come from `appConfig.globalSpecialTaxFeatures`.

## Error Handling Strategy

### 1. Principles of Error Handling
* **Graceful Degradation:** The application should strive to remain functional or recover gracefully even when errors occur, preventing data loss for the active session where possible.
* **User Feedback:** Users should be informed clearly and concisely about errors, what might have gone wrong, and if possible, how to resolve it or what to try next. Technical jargon should be avoided in user-facing messages.
* **Preventative Measures:** Input validation (e.g., for rates, amounts) should be employed at the UI level to prevent obviously invalid data from entering the calculation pipeline or `UserAppState`.
* **Logging (Client-Side):** Errors should be logged to the browser's console with sufficient detail for debugging purposes during development.
* **Testability:** Error paths and fallback mechanisms should be considered during testing.

### 2. Types of Errors and Handling Mechanisms

#### 2.1. User Input Validation Errors
* **Description:** User-provided data does not conform to expected types, formats, or reasonable constraints (e.g., non-numeric tax rates, negative quantities).
* **Detection:** Client-Side UI Validation (on input change/blur, form submission).
* **Handling:** Immediate UI feedback (e.g., inline error messages next to input fields), prevent submission or calculation if critical data is invalid, provide user guidance on expected input.

#### 2.2. Data Consistency Errors
* **Description:** `UserAppState` contains logically inconsistent data that might not be caught by simple input validation (e.g., a `PlannedAssetSale` references an `assetId` that no longer exists in `initialAssets`; a `SpecialTaxFeature` requiring gain bifurcation is selected, but `scenarioAssetTaxDetails` are missing for an asset involved in a relevant sale).
* **Detection:** Pre-Calculation Checks within the Calculation Engine or before initiating calculations.
* **Handling:** Display a clear warning or error message to the user, ideally pinpointing the inconsistency. Prevent calculation for the affected scenario or component, or display results with clear caveats about the inconsistency.

#### 2.3. Calculation Logic Errors
* **Description:** Bugs, unexpected edge cases (e.g., division by zero if not handled, null reference exceptions), or unhandled states within the Calculation Engine functions.
* **Detection:** Robust testing (unit, integration). Runtime checks and `try-catch` blocks around sensitive calculation segments.
* **Handling:** Display a generic "A calculation error occurred" message to the user. Prevent display of potentially corrupted or incorrect results. Log detailed error information (stack trace, relevant state snapshot if possible) to the browser console for debugging.

#### 2.4. `localStorage` Errors
* **Description:** Issues saving or loading the `activeUserAppState` (key `taxAnalyzer_activePlan`) to/from `localStorage`. This can be due to various reasons like browser security settings, private Browse mode, `localStorage` being full (quota exceeded), or data corruption.
* **Detection:** Wrap all `localStorage.setItem()` and `localStorage.getItem()` operations in `try-catch` blocks.
* **Handling:**
    * **On Load Failure:** If loading from `localStorage` fails, the application should initialize with a new "Untitled Plan" state, and inform the user that their previous session could not be restored.
    * **On Save Failure:** If auto-saving to `localStorage` fails, inform the user (e.g., via a non-intrusive toast notification) that their current work cannot be saved automatically. The application should continue to function with the in-memory `activeUserAppState`. The user should be advised to use the "Share Plan via URL" feature to manually back up their current state if `localStorage` remains unavailable.

### 3. Centralized Error Reporting (Future Consideration)
For post-MVP, integration with a client-side error tracking service (e.g., Sentry, Bugsnag) could be considered to gather information on runtime errors experienced by users.

### 4. Implementation Details
* **React Error Boundaries:** Implement React Error Boundaries at appropriate levels in the component tree to catch JavaScript errors during rendering, log them, and display a fallback UI instead of a crashed component tree.
* **UI Feedback Utilities:** Use consistent UI patterns for feedback (e.g., toasts for transient notifications, modals for critical alerts requiring user action).
* **Clear Error States in UI:** Ensure UI components reflect error states clearly where applicable (e.g., highlighting invalid input fields).

## Security Considerations

### 1. Core Security Principles for Client-Side MVP
* **Data Confidentiality (Local):** User-entered data is stored only in their browser's `localStorage` and does not leave their device unless they explicitly use the "Share Plan via URL" feature.
* **Data Integrity:** Primarily focused on preventing corruption of local data and ensuring that data loaded from a shared URL is processed safely.
* **Availability:** Ensuring the application remains accessible and functional from static hosting.
* **Transparency:** Clearly informing users about how and where their data is stored (locally) and the implications of using the sharing feature.

### 2. Specific Security Considerations and Mitigations

#### 2.1. Data Storage (`localStorage`)
* **Risk:** Data in `localStorage` is stored in plain text (though compressed) and is accessible by any script from the same origin. If an XSS vulnerability exists, this data could be compromised.
* **Mitigation:**
    * The application will not request or store highly sensitive Personally Identifiable Information (PII) like social security numbers, bank account details, etc. Data is financial planning information.
    * Users will be informed that their data is stored locally in their browser.
    * Regular XSS prevention measures (see below) are crucial.

#### 2.2. Cross-Site Scripting (XSS) Prevention
* **Risk:** Malicious scripts injected into the application (e.g., via user inputs that are unsafely rendered, or from compromised dependencies) could access `localStorage` or manipulate the user session.
* **Mitigation:**
    * **React's JSX Escaping:** React automatically escapes content rendered within JSX, providing a strong defense against XSS from data binding.
    * **Content Security Policy (CSP):** Implement a strict CSP header to control which resources (scripts, styles, images) the browser is allowed to load, reducing the attack surface.
    * **Avoid `dangerouslySetInnerHTML`:** Use this React feature only when absolutely necessary and with carefully sanitized HTML.
    * **Sanitize User Inputs for Display:** If user-provided text is used in contexts where JSX escaping might not apply (e.g., setting `href` attributes directly, though less common), ensure it's appropriately sanitized.

#### 2.3. Cross-Site Request Forgery (CSRF) Prevention
* **Mitigation:** CSRF is primarily a concern for applications with server-side state-changing actions initiated by user sessions. As a purely client-side application with no backend user accounts or server-side sessions, CSRF is not directly applicable in its traditional sense for the MVP.

#### 2.4. Dependency Security
* **Risk:** Vulnerabilities in third-party libraries (npm packages) used in the project.
* **Mitigation:**
    * Use reputable and well-maintained libraries.
    * Keep dependencies updated to patch known vulnerabilities (e.g., using `npm audit` or services like GitHub Dependabot).
    * Minimize the number of dependencies to reduce the attack surface.

#### 2.5. Client-Side Code Tampering
* **Risk:** Users or browser extensions can modify the application's JavaScript code running in their own browser.
* **Mitigation:** This is an inherent characteristic of client-side applications ("Trust the Client, but Verify on Server" - though no server for MVP). For MVP, acknowledge this. Calculations are for user estimation; critical financial decisions should involve professional advice. Code minification/uglification during the build process offers slight obfuscation but is not a security feature.

#### 2.6. URL Parameter Handling (for "Share Plan via URL" feature)
* **Risk:** Large amounts of data in URL parameters can expose information if URLs are logged or shared insecurely by the user. URLs also have length limits.
* **Mitigation:**
    * **Data Compression:** The `UserAppState` is compressed (e.g., using LZ-String) before being URL-encoded to reduce its size in the URL.
    * **No Highly Sensitive PII:** Reinforce that the data shared this way should not contain highly sensitive PII.
    * **Validation and Sanitization on Load:** When loading data from a URL, thoroughly validate its structure and sanitize any string inputs before incorporating them into the application state to prevent XSS or data corruption. Use `try-catch` during decompression and deserialization.
    * **User Awareness:** Inform users that the shared link contains their plan data.

#### 2.7. HTTPS Everywhere
* **Mitigation:** Serve the application exclusively over HTTPS to encrypt data in transit between the user and the static hosting provider, protecting against man-in-the-middle attacks. This is typically handled by the hosting platform (e.g., Cloudflare Pages).

### 3. Future Security Considerations (Beyond MVP)
If the application evolves to include backend services and user accounts:
* Implement robust Authentication (AuthN) and Authorization (AuthZ) mechanisms.
* All server-side inputs must be validated.
* Consider encryption at rest for user data stored on the server.
* Secure APIs (e.g., input validation, rate limiting, authentication).
* Regular security audits and penetration testing.

## Deployment Considerations

### 1. Build Process
* **Technology Stack:** TypeScript and React.
* **Build Tool:** **Vite** will be used for its fast development server and optimized production builds.
* **Output:** The build process will generate a `dist` directory containing static assets (HTML, CSS, JavaScript bundles).

### 2. Hosting Environment
* **Static Site Hosting:** The application, being purely client-side, is well-suited for static site hosting platforms.
* **Selected Platform: Cloudflare Pages.** This platform offers global CDN, HTTPS, CI/CD integration with GitHub, and a generous free tier suitable for this project.
* **Alternatives:** Vercel, Netlify, GitHub Pages, AWS S3 + CloudFront, Google Cloud Storage + CDN (these often involve more configuration or cost for custom domains/SSL at scale compared to integrated platforms like Cloudflare Pages for simple static sites).

### 3. Deployment Workflow (CI/CD Pipeline)
1.  **Version Control:** Git will be used for version control, with the repository hosted on a platform like GitHub.
2.  **Branching Strategy:** A common strategy like Gitflow (or a simplified version like GitHub Flow) will be used:
    * `main` branch: Represents production-ready code.
    * `develop` (or `dev`) branch: Integration branch for features.
    * Feature branches: For individual features/bugfixes, branched from `develop` and merged back via Pull Requests.
3.  **Automated Deployments with Cloudflare Pages:**
    * Connect the GitHub repository to Cloudflare Pages.
    * Configure Cloudflare Pages to build and deploy from the `main` branch automatically upon pushes (for production deployment).
    * Optionally, configure preview deployments from the `develop` branch or Pull Requests.

### 4. Domain Management
* A custom domain (if desired) will be configured via a DNS provider. Cloudflare Pages provides guidance on integrating custom domains.

## Testing Strategy (MVP)

The testing strategy for the Lean MVP aims to ensure core functionality, reliability, and a good user experience, balancing thoroughness with development speed.

1.  **Unit Tests:**
    * **Focus:** Core calculation logic functions within the Calculation Engine (e.g., `calculateCapitalGainsForYear`, components of `calculateTaxes_MVP`, `calculateQualitativeFitScore`), utility functions, and state transformation logic within Zustand stores (if actions become complex).
    * **Tools:** Jest and React Testing Library (or Vitest, given the Vite build tool).
    * **Goal:** Verify that individual units of code work correctly in isolation.

2.  **Component Tests (Integration/Shallow Rendering):**
    * **Focus:** Key React components, especially those with significant user interaction, conditional rendering, or integration with Zustand state.
    * **Tools:** React Testing Library with Jest/Vitest.
    * **Goal:** Ensure components render correctly given certain props/state and that user interactions trigger expected behaviors (e.g., state updates, service calls). Detailed component testing strategy will be in the Frontend Architecture Document.

3.  **End-to-End (E2E) Tests (Limited Scope for MVP):**
    * **Focus:** Critical user flows such as:
        * Creating a new scenario.
        * Inputting asset and sales data to see a capital gains tax calculation.
        * Defining qualitative goals and assessing a scenario.
        * Sharing a plan via URL and successfully loading it in another browser session.
        * Using a key `SpecialTaxFeature` (e.g., one involving gain bifurcation).
    * **Tools:** Playwright or Cypress.
    * **Goal:** Verify that integrated parts of the application work together as expected from a user's perspective. Due to MVP constraints, E2E test coverage will be selective.

4.  **Manual Testing & User Acceptance Testing (UAT):**
    * **Focus:** Exploratory testing, usability checks, and validation against the PRD requirements by the primary user/developer (Vibe CEO).
    * **Goal:** Catch issues not covered by automated tests and ensure the application meets the user's core needs.

**General Principles for MVP Testing:**
* Prioritize testing for the core value proposition (capital gains tax estimation, qualitative scoring, URL sharing).
* Write tests for business logic and critical UI paths.
* Ensure calculations are validated against manual examples or simple spreadsheets for accuracy.
* Testing strategy details specific to frontend components will be further elaborated in the Frontend Architecture Document.

## Future Enhancements
(Reflecting features deferred from the comprehensive version to achieve the Lean MVP)

The Lean MVP focuses on capital gains tax estimation, qualitative comparison, and simplified single-plan persistence. The following features, many of which were detailed in previous comprehensive architectural iterations, are planned for future enhancements:

1.  **Comprehensive Tax Calculation Engine:**
    * **Income Tax:** Calculation of income tax (employment, rental, business) using user-provided effective rates initially, then evolving to support full progressive tax bracket processing from `Scenario` data.
    * **Property & Consumption Taxes:** Engine-driven calculation of these based on rates defined in the `Scenario`.
    * **Deductions & Credits:** Standard and itemized deductions, common tax credits relevant to income.

2.  **Advanced "Named Plan Management" System:**
    * Storing and managing a list of multiple "Named Saved Plans" in `localStorage` (using a structure like `SavedPlanEntry[]`).
    * Explicit "Save Plan," "Save Plan As," "Clone Saved Plan," "Delete Saved Plan," "Rename Saved Plan Slot" functionalities.
    * Plan locking/unlocking (`isLocked` status on `SavedPlanEntry`).
    * `createDate` and `lastSavedDate` tracking for saved plans.
    * More sophisticated conflict resolution and prompting when loading plans over dirty active states, in context of a list of saved plans.

3.  **Advanced Multi-Jurisdictional Tax Logic:**
    * More robust handling of income sourced from multiple jurisdictions beyond user-inputted effective rates.
    * Built-in engine support for concepts like Foreign Tax Credits, understanding tax treaties, and applying different tax rules based on structured income source location data.

4.  **Data Migration for `localStorage`:**
    * Implementing logic to handle transitions and migrations if the structure of data stored in `localStorage` (e.g., `taxAnalyzer_activePlan` or the future `taxAnalyzer_savedPlansList`) changes between application versions.

5.  **User Interface and Experience Enhancements:**
    * AI-Driven Scenario Builder (e.g., parsing natural language to pre-fill scenario data).
    * User Accounts & Cloud Storage (for cross-device sync and backup, replacing/supplementing `localStorage`).
    * Improved and Expanded `templateScenarios` library in `AppConfig` with more varied and detailed examples.
    * Import/Export functionality for plan data (e.g., CSV, JSON).
    * More Interactive Visualizations and comparative dashboards.
    * "What-If" Analysis Tools (e.g., sliders for key inputs to see immediate financial outcome changes).
    * Guided Onboarding & Enhanced Contextual Tooltips.

6.  **Qualitative Assessment Enhancements:**
    * Allowing users to define fully custom `GlobalQualitativeConcept`-like entries if the master list is insufficient.
    * Integration with external data sources for richer qualitative attribute information (e.g., cost of living indices, safety scores for locations).
    * AI-Powered Qualitative Insights based on user goals and scenario assessments.

7.  **Reporting and Integrations:**
    * PDF/Printable Reports summarizing scenario comparisons and financial projections.
    * API Integrations with third-party financial planning tools or tax preparation software (if applicable).

8.  **Technical Platform Enhancements:**
    * Server-Side Rendering (SSR) or Static Site Generation (SSG) for improved SEO (if public-facing content becomes a goal) and initial load performance.
    * Web Workers for offloading computationally intensive calculations to keep the UI responsive, especially for complex multi-year projections.
    * A dedicated backend if user accounts, server-side AI processing, or more complex data management features are introduced.
    * Full Internationalization (i18n) and Localization (L10n) if the tool targets a broader international audience.
    * More sophisticated client-side performance optimizations (e.g., advanced memoization, virtualized lists for large data sets).
