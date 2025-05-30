# Tax Scenarios Analyzer Lean MVP Architecture Document

**Version:** 1.2-lean
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

`SpecialTaxFeature`s, particularly those impacting capital gains (e.g., requiring gain bifurcation based on asset residency details), are supported. The architecture is designed for automated CI/CD deployment to static hosting platforms like Cloudflare Pages, with rollback capabilities provided by the hosting platform. The primary performance goal for the MVP is reasonable responsiveness, with calculations completing within a few seconds for typical data loads.

## Technology Choices & Rationale

The technology stack for this Lean MVP was selected based on the primary developer's (Vibe CEO) familiarity and expertise with these tools. This choice aims to maximize development speed and efficiency for this personal project, allowing for rapid iteration and delivery of core MVP features. The chosen stack (TypeScript, React 19, Vite, Tailwind CSS 4, Zustand, ShadCN UI) represents a modern, robust, and widely adopted ecosystem for building performant client-side applications. While a formal evaluation of alternatives was not conducted for this phase, these technologies are well-suited to the project's requirements.

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
* **Edge Case Consideration:** During implementation, attention should be paid to calculation edge cases, such as scenarios with no assets, no planned sales, or zero values for rates/amounts, ensuring the engine handles these gracefully (e.g., by producing zero tax/outcome rather than errors).
* **Output:** A `ScenarioResults` object.

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
        c.  If `bifurcationNeeded` and `scenario.scenarioAssetTaxDetails` for the asset exist, calculates `PreResidencyGain` and `PostResidencyGain`, categorizing each as ST/LT based on relevant holding periods.
        d.  Else, attributes `TotalGain` to `postResidencyCapitalGains` (categorized as ST/LT based on total holding period).
    5.  Sums all gains into `aggregatedResults`.
* **Output:** An object: `{ totalCapitalGainsIncome, preResidencyCapitalGains: { longTerm, shortTerm }, postResidencyCapitalGains: { longTerm, shortTerm } }`.

### 5. `determineTaxableIncome(grossIncome)`
* **Input:** `grossIncome`.
* **Logic:** For the Lean MVP, this function primarily serves as a pass-through. Since no standard income tax is calculated by the engine, and capital gains are handled separately, this function might simply return `grossIncome` if needed for context by any `SpecialTaxFeature` or for display. If no STF requires a distinct "taxable income" from "gross income" for MVP, this function's utility is minimal for core calculations.
* **Output:** `taxableIncome: number` (effectively `grossIncome` for MVP context).

### 6. `calculateTaxes_MVP(currentYear, capitalGainsData, scenario, appConfig)`

* **Input:** `currentYear`, `capitalGainsData`, `scenario`, `appConfig`.
* **Logic:**
    1.  Initialize `taxBreakdown = { capitalGainsTax: 0, totalTax: 0 }`. (Other tax fields like incomeTax, propertyTaxEstimate, consumptionTaxEstimate are not calculated by the engine in MVP and will implicitly be 0 unless an STF adds them).
    2.  **Capital Gains Tax (MVP - Scenario Effective Rates):**
        * If `scenario.capitalGainsTaxRates` and `scenario.capitalGainsTaxRates.length > 0` (expecting one entry at index 0 for MVP):
            * `effectiveST_Rate = scenario.capitalGainsTaxRates[0].shortTermRate || 0;`
            * `effectiveLT_Rate = scenario.capitalGainsTaxRates[0].longTermRate || 0;`
            * `shortTermTax = capitalGainsData.postResidencyCapitalGains.shortTerm * effectiveST_Rate;`
            * `longTermTax = capitalGainsData.postResidencyCapitalGains.longTerm * effectiveLT_Rate;`
            * `taxBreakdown.capitalGainsTax = shortTermTax + longTermTax;`
        * Else, `taxBreakdown.capitalGainsTax = 0;`
    3.  **Applies Special Tax Features:**
        * Iterates `scenario.selectedSpecialTaxFeatures`. For each `selectedFeatureEntry`:
            * Retrieve `featureDefinition` from `appConfig.globalSpecialTaxFeatures`.
            * Call specific handler function, passing necessary data (current `taxBreakdown` for modification, `capitalGainsData`, `scenario.incomeSources` for contextual income if STF needs it, `selectedFeatureEntry.inputs`, `scenario`, `appConfig`).
            * Handler primarily modifies `taxBreakdown.capitalGainsTax` or adds other specific financial impacts categorized under `totalTax`.
    4.  Calculate `taxBreakdown.totalTax` by summing components (primarily `capitalGainsTax` and STF impacts for MVP).
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
    4.  Normalize `totalWeightedScoreContribution` against `sumOfMaxPossibleGoalContributions` to a 0-100 scale. If `sumOfMaxPossibleGoalContributions === 0`, score is 50 (neutral default). Else, `qualitativeFitScore = Math.max(0, Math.min(100, ((totalWeightedScoreContribution + sumOfMaxPossibleGoalContributions) / (2 * sumOfMaxPossibleGoalContributions)) * 100))`.
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
    * Check URL for a shared plan string. If present and successfully parsed/decompressed:
        * The application prompts the user if `activeUserAppState` (from a previous session in `localStorage`) is `isDirty`. If the user chooses to proceed with URL data, this data populates `activeUserAppState`.
        * Set `isDirty = false`.
        * Auto-save this state to `taxAnalyzer_activePlan`.
    * Else (no valid URL string), attempt to load `compressedPlanDataString` from `localStorage` key `taxAnalyzer_activePlan`.
        * If found and valid: Deserialize into `activeUserAppState`. Set `isDirty = false`.
    * Else (no stored plan, no URL plan, or data is invalid):
        * Initialize `activeUserAppState` as a new "Untitled Plan" (e.g., `activePlanInternalName: "Untitled Plan"`, empty assets/scenarios/goals).
        * Set `isDirty = false`.
        * Auto-save this initial "Untitled Plan" state to `taxAnalyzer_activePlan`.

### 2. Scenario Creation/Modification within Active Plan
* **From Template:** User selects a template from `AppConfig.templateScenarios`. A deep copy is made and added to/replaces a scenario in `activeUserAppState.scenarios`. Template includes effective CGT rates.
* **Custom Scenario:** User creates a new scenario structure. UI prompts for effective CGT rates. Other financial arrays/objects start empty.
* Modifying any part of `activeUserAppState` sets runtime `isDirty = true`.
* **User Defines/Modifies `userQualitativeGoals`:** User selects concepts from `appConfig.globalQualitativeConcepts`, copies descriptive data, assigns personal `weight`, and can edit copied `name`/`description`.

### 3. Continuous Auto-Save of Active Plan
* When `activeUserAppState` is modified (and `isDirty` is true), it is serialized to `compressedPlanDataString` and saved to `taxAnalyzer_activePlan`.

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
* **Graceful Degradation:** Application remains functional or recovers gracefully.
* **User Feedback:** Clear, concise error information for users, avoiding technical jargon.
* **Preventative Measures:** Input validation and data sanitization.
* **Logging (Client-Side):** Errors logged to browser console for debugging.
* **Testability:** Error paths are testable.

### 2. Types of Errors and Handling Mechanisms

#### 2.1. User Input Validation Errors
* **Description:** User data doesn't conform to expected types, formats, or constraints (e.g., a `Scenario` object is missing required effective CGT rates).
* **Detection:** Client-Side Validation, Schema Validation (if used).
* **Handling:** Immediate UI feedback, prevent calculation if critical data missing, user guidance.

#### 2.2. Data Consistency Errors
* **Description:** `UserAppState` contains logically inconsistent data (e.g., `PlannedAssetSale` referencing non-existent `assetId`; a feature requiring gain bifurcation is selected but `scenarioAssetTaxDetails` are missing).
* **Detection:** Pre-Calculation Checks within the Calculation Engine.
* **Handling:** Alert user, pinpoint issue, prevent calculation for affected scenario or display warnings.

#### 2.3. Calculation Logic Errors
* **Description:** Bugs or unexpected edge cases in Calculation Engine.
* **Detection:** Testing, runtime checks, `try-catch` blocks.
* **Handling:** Generic "calculation error" notification, prevent bad data display, log stack trace.

#### 2.4. `localStorage` Errors
* **Description:** Issues saving/loading `taxAnalyzer_activePlan` to/from `localStorage`.
* **Detection:** `try-catch` blocks.
* **Handling:** Inform user, operate with in-memory data, warn of non-persistence. Offer manual export (via share string).

### 3. Centralized Error Reporting (Future Consideration)
Integrate a client-side error tracking service.

### 4. Implementation Details
* **React Error Boundaries:** Catch JS errors, display fallback UI.
* **Utility Functions:** Consistent user feedback.
* **Clear Error States:** UI indicators for errors.

## Security Considerations

### 1. Core Security Principles for Client-Side MVP
* **Data Confidentiality (Local):** User data does not leave browser unless explicitly shared.
* **Data Integrity:** Prevent modification by external scripts (XSS).
* **Availability:** Ensure application accessibility.
* **Transparency:** Communicate data handling.

### 2. Specific Security Considerations and Mitigations

#### 2.1. Data Storage (`localStorage`)
* **Risk:** Plain text.
* **Mitigation:** No highly sensitive PII. Inform users data is local.

#### 2.2. Cross-Site Scripting (XSS) Prevention
* **Risk:** Script injection.
* **Mitigation:** React's JSX escaping. Strict CSP. Avoid `dangerouslySetInnerHTML`.

#### 2.3. Cross-Site Request Forgery (CSRF) Prevention
* **Mitigation:** Not directly applicable for client-side-only MVP.

#### 2.4. Dependency Security
* **Risk:** Vulnerabilities in third-party libraries.
* **Mitigation:** Regular updates. Reputable libraries.

#### 2.5. Client-Side Code Tampering
* **Risk:** Users/extensions can modify local JS.
* **Mitigation:** Acknowledge "Trust the Client". Minification for performance.

#### 2.6. URL Parameter Handling (for sharing)
* **Risk:** Data in URLs.
* **Mitigation:** Data compression. No highly sensitive PII. Validate/sanitize data loaded. User awareness.

#### 2.7. HTTPS Everywhere
* **Mitigation:** Serve application exclusively over HTTPS.

### 3. Future Security Considerations (Beyond MVP)
If backend/accounts added: Robust AuthN/AuthZ, server-side validation, encryption, API security, audits.

## Deployment Considerations

### 1. Build Process
* **Technology Stack:** TypeScript, React 19, Vite.
* **Build Tool:** **Vite**.
* **Output:** `dist` directory.

### 2. Hosting Environment
* **Static Site Hosting.**
* **Selected Platform: Cloudflare Pages.**
* **Alternatives:** Vercel/Netlify; AWS/GCP.

### 3. Deployment Workflow (CI/CD Pipeline)
1.  **Source Repository:** GitHub.
2.  **Automation Tool:** GitHub Actions integrated with Cloudflare Pages.
3.  **Branching Strategy & Triggers:**
    * `main` branch: Push triggers production build and deployment.
    * `develop` branch (optional): Push triggers staging build and deployment.
    * Pull Requests (to `main` or `develop`): Trigger preview deployments to unique URLs.
4.  **Key Pipeline Steps (Conceptual for GitHub Actions):**
    * Checkout code.
    * Set up Node.js environment.
    * Install dependencies (e.g., `npm ci`).
    * Run linters/formatters (e.g., ESLint, Prettier).
    * Run automated tests (unit, component).
    * Build application (e.g., `npm run build`).
    * Deploy to Cloudflare Pages (using official Cloudflare Pages GitHub Action, with project name and API token configured as GitHub Secrets).
5.  **Environment Variables/Secrets:** Build-time environment variables managed in Cloudflare Pages build settings or GitHub Actions. Secrets (Cloudflare API token) stored in GitHub repository secrets.

### 4. Domain Management
* Custom domain configured via DNS provider, pointing to Cloudflare Pages deployment.

### 5. Rollback Strategy
* **Method:** Cloudflare Pages maintains a history of all deployments.
* **Process:** If a new deployment introduces critical issues, rollback to a previous, stable deployment can be performed instantly via the Cloudflare Pages dashboard (by selecting a past deployment and promoting it) or potentially via API/CLI tools.
* **Minimizing Need:** Thorough testing in preview deployments (for Pull Requests) and staging environments (for `develop` branch) aims to catch issues before they reach production, reducing the need for rollbacks.

## Testing Strategy (MVP)

The testing strategy for the Lean MVP focuses on ensuring the reliability of core calculations (capital gains), essential UI interactions, and data persistence/sharing.

1.  **Unit Tests:**
    * **Focus:** Core calculation logic within the Calculation Engine (e.g., `calculateCapitalGainsForYear`, components of `calculateTaxes_MVP` related to CGT, `calculateQualitativeFitScore`), utility functions, and critical state transformation logic.
    * **Tools:** Vitest (or Jest) with React Testing Library utilities where helpful.
    * **Goal:** Verify individual functions and logic units operate correctly in isolation with various inputs, including edge cases.
2.  **Component Tests:**
    * **Focus:** Key React components, particularly those with user interaction for data input (e.g., scenario editor forms for CGT rates, asset sales), components displaying calculated results, and components managing local UI state.
    * **Tools:** React Testing Library with Vitest (or Jest).
    * **Goal:** Ensure components render correctly, respond to user interactions as expected, and integrate correctly with state management (Zustand) for reading and updating data. (Further details in Frontend Architecture Document).
3.  **End-to-End (E2E) Tests (Limited Scope for MVP):**
    * **Focus:** Critical user flows for the lean MVP:
        * Creating a new scenario from a template.
        * Inputting asset details and planned sales.
        * Inputting scenario-specific effective capital gains tax rates.
        * Viewing the calculated capital gains tax and net financial outcome.
        * Defining a few qualitative goals and assessing them in a scenario to see a qualitative fit score.
        * Generating a shareable URL for the active plan.
        * Successfully loading a plan from a shareable URL (including overwrite prompt).
    * **Tools:** Playwright or Cypress.
    * **Goal:** Verify integrated application functionality from a user's perspective.
4.  **Manual Testing:**
    * **Focus:** Exploratory testing, usability checks, validation against PRD requirements, and testing scenarios difficult to automate.
    * **Goal:** Catch issues not covered by automated tests and ensure the application meets the core user needs for the lean MVP.

## Future Enhancements
(Reflecting features deferred from the comprehensive version to achieve the Lean MVP)

The Lean MVP focuses on capital gains tax estimation, qualitative comparison, and simplified single-plan persistence. The following features, many of which were detailed in previous comprehensive architectural iterations (e.g., referred to as `architecture-v3.md` during discussions), are planned for future enhancements:

1.  **Comprehensive Tax Calculation Engine:**
    * **Income Tax:** Calculation of income tax (employment, rental, business) using user-provided effective rates initially, then evolving to support full progressive tax bracket processing.
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
    * AI-Driven Scenario Builder.
    * User Accounts & Cloud Storage.
    * Improved and Expanded `templateScenarios` library in `AppConfig`.
    * Import/Export Functionality.
    * More Interactive Visualizations.
    * "What-If" Analysis Tools.
    * Guided Onboarding & Enhanced Contextual Tooltips.

6.  **Qualitative Assessment Enhancements:**
    * Allowing users to define fully custom `GlobalQualitativeConcept`-like entries if the master list is insufficient.
    * Integration with External Data for Qualitative Factors.
    * AI-Powered Qualitative Insights.

7.  **Reporting and Integrations:**
    * PDF/Printable Reports.
    * API Integrations (Third-Party Tools).

8.  **Technical Platform Enhancements:**
    * Server-Side Rendering (SSR) / Static Site Generation (SSG).
    * Web Workers.
    * Backend for Advanced Features & Data.
    * Full Internationalization (i18n) and Localization (L10n).
