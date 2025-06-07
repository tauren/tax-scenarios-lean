I have completed the analysis and updated the architecture document as requested.

Here is the new, updated version of the `architecture-lean-v1.2.md` document. I have incremented the version to `1.3-lean`, updated the data models and calculation logic for the qualitative feature, and added a change log to track revisions.

# Tax Scenarios Analyzer Lean MVP Architecture Document

**Version:** 1.3-lean
**Date:** June 01, 2025
**Author:** Fred (Architect Agent) & Vibe CEO (User)

## Introduction / Preamble

This document outlines the overall project architecture for the **Lean Minimum Viable Product (MVP)** of the "Tax Scenarios Analyzer." It focuses exclusively on its client-side implementation as a single-page application (SPA) designed to run entirely within the user's browser. The primary goal of this lean MVP is to provide users with a tool to estimate **capital gains tax implications** and assess qualitative factors across different scenarios.

This document serves as the guiding architectural blueprint for the development of this lean MVP, ensuring consistency and adherence to chosen patterns and technologies. It details the data structures, core calculation logic (focused on capital gains tax), application data flow for a single active plan, and high-level strategies for error handling, security, and deployment.

**Relationship to Frontend Architecture:**
[cite_start]This document aligns with the `front-end-architecture-v0.3.md` [cite: 2] [cite_start](Lean MVP version) and `front-end-spec-v0.1.md` [cite: 3] (Lean MVP version), which detail the frontend-specific design and user experience. Core technology stack selections are consistent with those documents.

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
12. Change Log
13. Future Enhancements

## Technical Summary

The Tax Scenarios Analyzer Lean MVP is architected as an entirely client-side Single-Page Application (SPA) built with TypeScript (latest stable, e.g., 5.x), React 19, Vite (latest stable), leveraging ShadCN UI with Tailwind CSS 4 for styling, and Zustand (latest stable) for state management. [cite_start]LZ-String (latest stable) will be used for data compression for the URL sharing feature[cite: 1].

For this lean MVP, the core calculation engine focuses exclusively on **estimating capital gains tax**, using user-provided effective Short-Term and Long-Term rates for each scenario. Other tax types (income, property, consumption) are not calculated by the engine. [cite_start]Users input gross income figures (from various sources) and living expenses primarily for overall financial context and net outcome calculation[cite: 1].

The application supports qualitative assessment through a **"Jot Down & Map" workflow**. [cite_start]Users can create personalized, weighted goals (derived from a master list of statements) and create scenario-specific attributes (notes) which are then mapped to these goals to calculate a fit score[cite: 9]. Data persistence for the MVP is simplified to a **single "Active Plan"** continuously auto-saved to `localStorage`. [cite_start]The ability to share this active plan via a compressed, URL-encoded string is retained, including overwrite safety prompts[cite: 1].

`SpecialTaxFeature`s, particularly those impacting capital gains (e.g., requiring gain bifurcation based on asset residency details), are supported. [cite_start]The architecture is designed for automated CI/CD deployment to static hosting platforms like Cloudflare Pages, with rollback capabilities provided by the hosting platform[cite: 1]. [cite_start]The primary performance goal for the MVP is reasonable responsiveness, with calculations completing within a few seconds for typical data loads[cite: 1].

## Technology Choices & Rationale

The technology stack for this Lean MVP was selected based on the primary developer's (Vibe CEO) familiarity and expertise with these tools. This choice aims to maximize development speed and efficiency for this personal project, allowing for rapid iteration and delivery of core MVP features. [cite_start]The chosen stack (TypeScript, React 19, Vite, Tailwind CSS 4, Zustand, ShadCN UI) represents a modern, robust, and widely adopted ecosystem for building performant client-side applications[cite: 1]. [cite_start]While a formal evaluation of alternatives was not conducted for this phase, these technologies are well-suited to the project's requirements[cite: 1].

## Core Components & Data Models (Lean MVP)

### 1. `AppConfig` Model (Static Configuration - Lean MVP)

Includes lean template scenarios (focused on Capital Gains Tax setup and qualitative defaults), global special tax feature definitions relevant to the MVP's scope, and master lists for the qualitative assessment feature.

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

// NEW QUALITATIVE MODELS
interface QualitativeConcept {
    id: string;          // A unique identifier for the broad concept (e.g., "financial", "lifestyle_culture").
    name: string;        // The display name for the concept (e.g., "Financial Considerations").
    description: string; // A brief explanation of what the concept covers.
}

interface QualitativeStatement {
    id: string;                // A unique identifier for the specific statement (e.g., "fin-low-gct").
    conceptId: string;         // Foreign key linking to QualitativeConcept.id.
    statementText: string;     // The preference statement a user can select (e.g., "A low or zero Capital Gains Tax rate").
}

interface AppConfig {
    templateScenarios: Scenario[]; // Lean templates, focused on CGT setup & qualitative defaults
    globalSpecialTaxFeatures: SpecialTaxFeature[]; // Curated list relevant for MVP's CGT focus
    qualitativeConcepts: QualitativeConcept[];      // The new master list of broad concepts.
    qualitativeStatements: QualitativeStatement[];  // The new master list of selectable statements.
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

### 8. `UserQualitativeGoal` Model (Within `UserAppState.userQualitativeGoals`)

A user's personalized goal, created from a `QualitativeStatement` but existing as its own entity.

```typescript
interface UserQualitativeGoal {
    id: string;        // A unique UUID for this personal goal instance.
    conceptId: string; // The ID of the parent QualitativeConcept.
    name: string;      // The user's custom (or initially copied) goal text.
    weight: "Low" | "Medium" | "High" | "Critical"; 
}
```

### 9. `ScenarioAttribute` Model (Within `Scenario.scenarioSpecificAttributes`)

A user's note or observation about a specific scenario, which can be mapped to a `UserQualitativeGoal`.

```typescript
interface ScenarioAttribute {
    id: string;                  // A unique UUID for this specific scenario attribute.
    notes: string;               // The user's free-text observation (e.g., "Lisbon has great weather").
    userSentiment: "Positive" | "Neutral" | "Negative"; 
    significanceToUser: "None" | "Low" | "Medium" | "High"; 
    goalId?: string;             // Optional foreign key mapping to UserQualitativeGoal.id.
}
```

### 10. `Scenario` Model (Lean MVP)

Self-contained with its parameters.

```typescript
interface Scenario {
    id: string; 
    name: string; 
    
    templateReferenceId?: string;
    displayLocationName: string; 
    locationCountry: string;     
    locationState?: string;    
    locationCity?: string;     

    capitalGainsTaxRates: CapitalGainsTaxRate[]; 

    projectionPeriodYears: number;
    residencyStartDate?: string; 
    
    scenarioAssetTaxDetails?: ScenarioAssetTaxDetail[];

    incomeSources: ScenarioIncomeSource[];
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

### 11. `CalculationResult` Model (Internal to Application State - Lean MVP)

Reflects MVP's focus: Capital Gains Tax is calculated; other taxes are effectively zero from the engine's perspective unless impacted by a Special Tax Feature.

```typescript
interface ScenarioYearlyProjection {
    year: number;
    grossIncome: number; 
    totalExpenses: number; 
    capitalGainsIncome: number;
    taxBreakdown: {
        capitalGainsTax: number;
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

## Conceptual Data Flow

The following diagram illustrates the high-level data flow within the client-side application for the Lean MVP:

```mermaid
graph TD
    A[User Interaction via UI] --> B{Active UserAppState (In Memory via Zustand)};
    B --> C[localStorage (taxAnalyzer_activePlan) - Auto-Save/Load Active Plan];
    B --> D[Calculation Engine];
    E[AppConfig (Static Data - Concepts, Statements, STFs)] --> D;
    D --> F[AppCalculatedState (In Memory - Scenario Results)];
    F --> A;
    B --> Ghttps://www.computerworld.com/article/3520801/buyers-guide-enterprise-file-sync-and-sharing-services.html;
    G --> H[Shareable URL (URL Parameters)];
    H --> B;
```

**Flow Description:**
1.  The user interacts with the UI (built with React components).
2.  User actions modify the `Active UserAppState`, which is managed by Zustand. This includes the "Jot Down & Map" workflow where a user can create a `ScenarioAttribute` and later map it to a `UserQualitativeGoal`.
3.  Changes to the `Active UserAppState` are periodically auto-saved (compressed) to `localStorage`.
4.  The `Calculation Engine` takes the `Active UserAppState` and static `AppConfig` data as input.
5.  The `Calculation Engine` produces `AppCalculatedState` (containing results for each scenario).
6.  This `AppCalculatedState` updates the application's state, which in turn updates the UI to display results.
7.  The `URL Sharing Service` can serialize and compress the `Active UserAppState` to generate a shareable URL, and can deserialize and decompress a plan from a URL.

## Calculation Engine Logic (Lean MVP - Capital Gains Focus)

The Calculation Engine processes a self-contained `Scenario` object from the active `UserAppState`. For MVP, it primarily calculates capital gains tax and qualitative fit scores. Other tax types are not calculated by the core engine.

### 1. `calculateScenarioProjection(scenario, userAppState, appConfig)`

* **Input:** A `Scenario` object, `userAppState`, `appConfig`.
* **Logic:**
    1.  Initializes `yearlyProjections`.
    2.  Iterates from `currentYear = 1` up to `scenario.projectionPeriodYears`.
    3.  For each `currentYear`, it calls sub-functions to compute financial metrics.
    4.  Aggregates these results into a `ScenarioYearlyProjection` object.
    5.  After the loop, it calls the dedicated `QualitativeScoringService` (see below) to get the `qualitativeFitScore`.
    6.  Computes `totalNetFinancialOutcomeOverPeriod`.
* **Output:** A `ScenarioResults` object.

*[Sub-functions 2 through 7 remain unchanged from version 1.2]*

### 8. `QualitativeScoringService.calculateScore(scenario, userAppState)`
* **Input:** A `Scenario` object and the `userQualitativeGoals` from the `userAppState`.
* **Logic:**
    1.  [cite_start]This logic is now encapsulated in a dedicated `QualitativeScoringService` as per `story-4.7-scoring-system.md`[cite: 12].
    2.  The service iterates through the `scenario.scenarioSpecificAttributes`.
    3.  It **only considers attributes that have a `goalId`**, meaning they have been mapped by the user to one of their personal goals.
    4.  For each mapped attribute, it retrieves the corresponding `UserQualitativeGoal` to get its `weight`.
    5.  The service converts the `userSentiment` ("Positive", "Neutral", "Negative"), the attribute's `significanceToUser` ("None", "Low", "Medium", "High"), and the goal's `weight` ("Low", "Medium", "High", "Critical") into numerical values as specified in the stories (e.g., story 4.7).
    6.  It calculates a weighted contribution for each mapped attribute.
    7.  The total score is aggregated and then normalized to a consistent scale (e.g., 0-100).
    8.  The service should also be able to provide a detailed breakdown of score components for UI display and handle caching to optimize performance.
* **Output:** A `qualitativeFitScore` (number) and potentially a detailed breakdown of its components.

## Application Data Flow (Lean MVP - Single Active Plan & Sharing)

*[This section remains largely unchanged from version 1.2, as the high-level flow of persisting and sharing the single active plan is the same. The "Jot Down & Map" workflow is a change in the UI interaction that modifies the `UserAppState`, which then triggers the existing auto-save and calculation flows.]*

## Error Handling Strategy

*[This section remains unchanged from version 1.2.]*

## Security Considerations

*[This section remains unchanged from version 1.2.]*

## Deployment Considerations

*[This section remains unchanged from version 1.2.]*

## Testing Strategy (MVP)

*[This section remains unchanged from version 1.2.]*

## Change Log

| Change | Date | Version | Description | Author |
| :--- | :--- | :--- | :--- | :--- |
| Initial Draft from PRD 1.1 | May 30, 2025 | 1.2-lean | Created a lean architecture doc based on the focused MVP PRD. | Fred (Architect) |
| Qualitative Feature Refactor | June 01, 2025 | 1.3-lean | Overhauled qualitative data models and calculation logic to support the new "Jot Down & Map" workflow, as specified in Epic 4 stories (4.2-4.7). Added Change Log. | Fred (Architect) |

## Future Enhancements
(Reflecting features deferred from the comprehensive version to achieve the Lean MVP)

*[This section remains unchanged from version 1.2.]*