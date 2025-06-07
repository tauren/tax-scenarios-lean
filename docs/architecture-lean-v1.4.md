# Tax Scenarios Analyzer Lean MVP Architecture Document

**Version:** 1.4-lean
**Date:** June 07, 2025
**Author:** Fred (Architect Agent) & Vibe CEO (User)

## Introduction / Preamble

This document outlines the overall project architecture for the **Lean Minimum Viable Product (MVP)** of the "Tax Scenarios Analyzer." It focuses exclusively on its client-side implementation as a single-page application (SPA) designed to run entirely within the user's browser. The primary goal of this lean MVP is to provide users with a tool to estimate **capital gains tax implications** and assess qualitative factors across different scenarios.

This document serves as the guiding architectural blueprint for the development of this lean MVP, ensuring consistency and adherence to chosen patterns and technologies. It details the data structures, core calculation logic (focused on capital gains tax), application data flow for a single active plan, and high-level strategies for error handling, security, and deployment.

**Relationship to Frontend Architecture:**
This document aligns with the `front-end-architecture-v0.3.md` (Lean MVP version) and `front-end-spec-v0.1.md` (Lean MVP version), which detail the frontend-specific design and user experience. Core technology stack selections are consistent with those documents.

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

The Tax Scenarios Analyzer Lean MVP is architected as an entirely client-side Single-Page Application (SPA) built with TypeScript (latest stable, e.g., 5.x), React 19, Vite (latest stable), leveraging ShadCN UI with Tailwind CSS 4 for styling, and Zustand (latest stable) for state management. LZ-String (latest stable) will be used for data compression for the URL sharing feature.

For this lean MVP, the core calculation engine focuses exclusively on **estimating capital gains tax**. All date-related properties within the application's in-memory data models are handled as native JavaScript `Date` objects to ensure type safety and ease of calculation. Conversion to and from ISO 8601 strings occurs only at the serialization/deserialization boundary (e.g., when interacting with `localStorage` or URL parameters).

The application supports qualitative assessment through a **"Jot Down & Map" workflow**. Users can create personalized, weighted goals (derived from a master list of statements) and create scenario-specific attributes (notes) which are then mapped to these goals to calculate a fit score. Data persistence for the MVP is simplified to a **single "Active Plan"** continuously auto-saved to `localStorage`. The ability to share this active plan via a compressed, URL-encoded string is retained.

The architecture is designed for automated CI/CD deployment to static hosting platforms like Cloudflare Pages.

## Technology Choices & Rationale

The technology stack for this Lean MVP was selected based on the primary developer's (Vibe CEO) familiarity and expertise with these tools. This choice aims to maximize development speed and efficiency for this personal project, allowing for rapid iteration and delivery of core MVP features. The chosen stack (TypeScript, React 19, Vite, Tailwind CSS 4, Zustand, ShadCN UI) represents a modern, robust, and widely adopted ecosystem for building performant client-side applications.

## Core Components & Data Models (Lean MVP)

### 1. `AppConfig` Model (Static Configuration - Lean MVP)

Includes lean template scenarios, global special tax feature definitions, and master lists for the qualitative assessment feature.

```typescript
interface CapitalGainsTaxRate {
    minIncome: number;
    maxIncome?: number;
    shortTermRate: number;
    longTermRate: number;
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

interface QualitativeConcept {
    id: string;
    name: string;
    description: string;
}

interface QualitativeStatement {
    id: string;
    conceptId: string;
    statementText: string;
}

interface AppConfig {
    templateScenarios: Scenario[];
    globalSpecialTaxFeatures: SpecialTaxFeature[];
    qualitativeConcepts: QualitativeConcept[];
    qualitativeStatements: QualitativeStatement[];
    projectionPeriodYears: number;
}
```

### 2. `UserAppState` Model (Represents the Active Plan's Data - Lean MVP)

Core data for the single active plan.

```typescript
interface UserAppState {
    activePlanInternalName: string;
    initialAssets: Asset[]; 
    scenarios: Scenario[]; 
    userQualitativeGoals: UserQualitativeGoal[];
}
```

### 3. `Asset` Model (Within `UserAppState.initialAssets`)

```typescript
interface Asset {
    id: string; 
    name: string;
    assetType?: "STOCK" | "CRYPTO" | "REAL_ESTATE" | "OTHER";
    quantity: number;
    costBasisPerUnit: number; 
    fairMarketValuePerUnit?: number;
    acquisitionDate: Date; // UPDATED: Changed from string to Date
}
```

### 4. `ScenarioIncomeSource` Model (Within `Scenario.incomeSources` - Lean MVP)

```typescript
interface ScenarioIncomeSource {
    id: string; 
    name: string;
    type: "EMPLOYMENT" | "RENTAL_PROPERTY" | "OTHER";
    annualAmount: number;
    startYear: number;
    endYear?: number; 
    sourceJurisdictionInfo?: string;
    notes?: string;
}
```

### 5. `PlannedAssetSale` Model (Within Scenario)

```typescript
interface PlannedAssetSale {
    id: string; 
    assetId: string;
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

```typescript
interface ScenarioAssetTaxDetail {
    assetId: string;
    residencyAcquisitionDate: Date; // UPDATED: Changed from string to Date
    valueAtResidencyAcquisitionDatePerUnit: number;
}
```

### 8. `UserQualitativeGoal` Model (Within `UserAppState.userQualitativeGoals`)

```typescript
interface UserQualitativeGoal {
    id: string;
    conceptId: string;
    name: string;
    weight: "Low" | "Medium" | "High" | "Critical"; 
}
```

### 9. `ScenarioAttribute` Model (Within `Scenario.scenarioSpecificAttributes`)

```typescript
interface ScenarioAttribute {
    id: string;
    notes: string;
    userSentiment: "Positive" | "Neutral" | "Negative"; 
    significanceToUser: "None" | "Low" | "Medium" | "High"; 
    goalId?: string;
}
```

### 10. `Scenario` Model (Lean MVP)

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
    residencyStartDate?: Date; // UPDATED: Changed from string to Date
    
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
    A[User Interaction via UI] --> B{Active UserAppState (In Memory via Zustand w/ Date objects)};
    B --> C[Serialization Service];
    C --> D[localStorage (taxAnalyzer_activePlan) - Stored as strings];
    C --> E[Shareable URL (URL Parameters) - Stored as strings];
    D --> F[Deserialization Service w/ Date Reviver];
    E --> F;
    F --> B;
    B --> G[Calculation Engine];
    H[AppConfig (Static Data)] --> G;
    G --> I[AppCalculatedState (In Memory - Scenario Results)];
    I --> A;
```

**Flow Description:**
1.  The user interacts with the UI, modifying the `Active UserAppState`.
2.  The `Active UserAppState` is managed by Zustand and **always contains native `Date` objects for date properties** during runtime.
3.  Changes trigger a **Serialization Service**, which converts the state to a JSON string (automatically changing `Date` objects to ISO strings) before saving to `localStorage` or generating a URL.
4.  On application load, a **Deserialization Service** parses the JSON string from `localStorage` or a URL. It uses a **"reviver" function** to convert any ISO date strings back into native `Date` objects, ensuring the in-memory state is correctly typed.
5.  The `Calculation Engine` takes the rich, in-memory `UserAppState` (with `Date` objects) as input to perform calculations.

## Calculation Engine Logic (Lean MVP - Capital Gains Focus)

The Calculation Engine processes a self-contained `Scenario` object from the active `UserAppState`. It uses native `Date` objects for all date-based calculations (e.g., determining holding periods).

### 1. `calculateScenarioProjection(scenario, userAppState, appConfig)`

* **Input:** A `Scenario` object, `userAppState`, `appConfig`.
* **Logic:**
    1.  Initializes `yearlyProjections`.
    2.  Iterates from `currentYear = 1` up to `scenario.projectionPeriodYears`.
    3.  For each `currentYear`, it calls sub-functions to compute financial metrics.
    4.  Aggregates these results into a `ScenarioYearlyProjection` object.
    5.  After the loop, it calls the dedicated `QualitativeScoringService` to get the `qualitativeFitScore`.
    6.  Computes `totalNetFinancialOutcomeOverPeriod`.
* **Output:** A `ScenarioResults` object.

### 2. `calculateIncomeForYear(currentYear, scenario)`

* **Input:** `currentYear`, `scenario.incomeSources`.
* **Logic:** Sums `annualAmount` for all `ScenarioIncomeSource` objects where `incomeSource.startYear <= currentYear` and (`incomeSource.endYear === undefined || incomeSource.endYear >= currentYear`).
* **Output:** `grossIncome: number`.

### 3. `calculateTotalExpenses(currentYear, scenario)`

* **Input:** `currentYear`, `scenario.annualExpenses`.
* **Logic:** Sums `amount` from all `AnnualExpense` objects in `scenario.annualExpenses.categories`.
* **Output:** `totalExpensesFromCategories: number`.

### 4. `calculateCapitalGainsForYear(currentYear, scenario, userAppState, appConfig)`

* **Input:** `currentYear`, `scenario`, `userAppState.initialAssets`, `appConfig`.
* **Logic:** Identifies `PlannedAssetSale`s for the year, calculates total gain, and if required by an active `SpecialTaxFeature`, bifurcates the gain into pre- and post-residency portions, categorizing each as Short-Term or Long-Term.
* **Output:** An object detailing total, pre-residency, and post-residency capital gains.

### 5. `determineTaxableIncome(grossIncome)`
* **Input:** `grossIncome`.
* **Logic:** For the Lean MVP, this function acts as a pass-through, returning `grossIncome`. It serves as a placeholder for future, more complex income tax calculations.
* **Output:** `taxableIncome: number`.

### 6. `calculateTaxes_MVP(currentYear, capitalGainsData, scenario, appConfig)`

* **Input:** `currentYear`, `capitalGainsData`, `scenario`, `appConfig`.
* **Logic:** Calculates capital gains tax by applying the user-provided effective Short-Term and Long-Term rates from the `scenario` to the calculated gains. Then, it iterates through any selected `SpecialTaxFeatures` and applies their logic, which may modify the final tax breakdown.
* **Output:** A `taxBreakdown` object.

### 7. `calculateNetFinancialOutcome(grossIncome, totalExpensesFromCategories, totalTax, additionalScenarioCosts)`

* **Input:** `grossIncome`, `totalExpensesFromCategories`, `totalTax`, `additionalScenarioCosts`.
* **Logic:** `netFinancialOutcome = grossIncome - totalExpensesFromCategories - totalTax - additionalScenarioCosts`.
* **Output:** `netFinancialOutcome: number`.

### 8. `QualitativeScoringService.calculateScore(scenario, userAppState)`
* **Input:** A `Scenario` object and the `userQualitativeGoals` from the `userAppState`.
* **Logic:** This logic is encapsulated in a dedicated `QualitativeScoringService`. It only considers `ScenarioAttribute` items that have been mapped to a `UserQualitativeGoal`. It converts sentiment, significance, and goal weight to numerical values to produce a normalized score from 0-100.
* **Output:** A `qualitativeFitScore` (number).

## Application Data Flow (Lean MVP - Single Active Plan & Sharing)

### Data Serialization and Deserialization (Date Handling)
To ensure type safety and consistency, the application will adhere to the following strategy:

* **In-Memory State:** All data models within the running application (e.g., in the Zustand store) will use native JavaScript `Date` objects for all date-related properties.
* **Serialization (Saving/Sharing):** When persisting the state to `localStorage` or generating a shareable URL, the application state will be passed through `JSON.stringify()`. This process automatically converts `Date` objects into a standardized ISO 8601 string format (e.g., `"2025-06-07T12:00:00.000Z"`).
* **Deserialization (Loading):** When loading data from `localStorage` or a URL, the application will use `JSON.parse()` with a custom "reviver" function. This function's responsibility is to inspect every value being parsed; if a value is a string that matches the ISO 8601 date format, the reviver will instantly convert it back into a native `Date` object. This crucial step happens in one central place, ensuring that the rest of the application always receives a clean, correctly-typed data structure.

### `localStorage` Structure:
* **Key `taxAnalyzer_activePlan`:** Stores the `compressedPlanDataString` of the current working `UserAppState`.

### Runtime (In-Memory) State for Active Session:
* `activeUserAppState: UserAppState`
* `isDirty: boolean`

*[The high-level logic for Initial Load, Scenario Creation, Auto-Save, Plan Management, and Sharing remains as described in v1.3, operating on the principle of a single active plan.]*

## Error Handling Strategy

### 1. Principles of Error Handling
* **Graceful Degradation:** Application remains functional or recovers gracefully.
* **User Feedback:** Clear, concise error information for users, avoiding technical jargon.
* **Preventative Measures:** Input validation and data sanitization.
* **Logging (Client-Side):** Errors logged to browser console for debugging.
* **Testability:** Error paths are testable.

### 2. Types of Errors and Handling Mechanisms

* **User Input Validation Errors:** Handled via immediate UI feedback and form validation.
* **Data Consistency Errors:** Handled by pre-calculation checks within the Calculation Engine, alerting the user.
* **Calculation Logic Errors:** Caught via `try-catch` blocks, displaying a generic error and logging details.
* **`localStorage` Errors:** Caught via `try-catch` blocks, informing the user of persistence issues.

### 3. Implementation Details
* **React Error Boundaries:** To catch JS errors in components and display a fallback UI.
* **Utility Functions:** For consistent user feedback messaging.

## Security Considerations

### 1. Core Security Principles for Client-Side MVP
* **Data Confidentiality (Local):** User data does not leave the browser unless explicitly shared via URL.
* **Data Integrity:** Prevent modification by external scripts (XSS).
* **Availability:** Ensure application accessibility via static hosting.

### 2. Specific Security Considerations and Mitigations

* **Data Storage (`localStorage`):** Data is not encrypted at rest in the browser. No highly sensitive PII should be stored.
* **Cross-Site Scripting (XSS) Prevention:** React's JSX escaping provides a strong default defense. A strict Content Security Policy (CSP) will be implemented.
* **Dependency Security:** Use tools like `npm audit` to check for vulnerabilities in third-party libraries.
* **URL Parameter Handling (for sharing):** Data is compressed but not encrypted. Users must be aware that the URL contains their plan data. The application must validate and sanitize any data loaded from a URL.
* **HTTPS Everywhere:** The application will be served exclusively over HTTPS.

## Deployment Considerations

### 1. Build Process
* **Technology Stack:** TypeScript, React 19, Vite.
* **Build Tool:** **Vite**.
* **Output:** Optimized static assets in a `dist` directory.

### 2. Hosting Environment
* **Platform:** Static Site Hosting, specifically Cloudflare Pages.

### 3. Deployment Workflow (CI/CD Pipeline)
* **Source Repository:** GitHub.
* **Automation Tool:** GitHub Actions integrated with Cloudflare Pages.
* **Triggers:** Pushes to the `main` branch trigger production deployments. Pull requests trigger preview deployments.
* **Pipeline Steps:** Checkout -> Install Dependencies -> Lint -> Test -> Build -> Deploy.

### 4. Rollback Strategy
* **Method:** Cloudflare Pages maintains a history of all deployments, allowing for instant rollback to any previous version via their dashboard.

## Testing Strategy (MVP)

The testing strategy for the Lean MVP focuses on ensuring the reliability of core calculations, essential UI interactions, and data persistence/sharing.

1.  **Unit Tests:**
    * **Focus:** Core calculation logic, utility functions, and critical state transformation logic.
    * **Tools:** Vitest (or Jest).
2.  **Component Tests:**
    * **Focus:** Key React components, particularly those with user interaction for data input, and components managing local UI state.
    * **Tools:** React Testing Library with Vitest (or Jest).
3.  **End-to-End (E2E) Tests (Limited Scope for MVP):**
    * **Focus:** Critical user flows like creating a scenario, inputting data, viewing results, and sharing/loading a plan via URL.
    * **Tools:** Playwright or Cypress.
4.  **Manual Testing:**
    * **Focus:** Exploratory testing, usability checks, and validation against PRD requirements.

## Change Log

| Change | Date | Version | Description | Author |
| :--- | :--- | :--- | :--- | :--- |
| Initial Draft from PRD 1.1 | May 30, 2025 | 1.2-lean | Created a lean architecture doc based on the focused MVP PRD. | Fred (Architect) |
| Qualitative Feature Refactor | June 01, 2025 | 1.3-lean | Overhauled qualitative data models and calculation logic to support the new "Jot Down & Map" workflow. | Fred (Architect) |
| **Date Handling Strategy Update** | **June 07, 2025** | **1.4-lean** | **Updated all date properties in data models from `string` to native `Date` objects. Documented the required serialization/deserialization "hydration" strategy.** | **Fred (Architect)** |

## Future Enhancements

The Lean MVP focuses on capital gains tax estimation, qualitative comparison, and simplified single-plan persistence. The following features are planned for future enhancements:

1.  **Comprehensive Tax Calculation Engine:** Full calculation for Income, Property, and Consumption taxes, including progressive brackets and deductions.
2.  **Advanced "Named Plan Management" System:** Full support for saving, loading, and managing multiple named plans.
3.  **Advanced Multi-Jurisdictional Tax Logic:** Built-in engine support for concepts like Foreign Tax Credits and tax treaties.
4.  **Data Migration for `localStorage`:** Logic to handle data structure changes between application versions.
5.  **User Interface and Experience Enhancements:** AI-Driven Scenario Builder, User Accounts & Cloud Storage, Import/Export, Interactive Visualizations, and Guided Onboarding.
6.  **Qualitative Assessment Enhancements:** Allowing user-defined custom concepts and integration with external data sources.
7.  **Reporting and Integrations:** PDF/Printable Reports and third-party tool integrations.
8.  **Technical Platform Enhancements:** Server-Side Rendering (SSR), Web Workers, and a dedicated backend.
