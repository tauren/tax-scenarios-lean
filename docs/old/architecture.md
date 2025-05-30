# Tax Scenarios Analyzer MVP Architecture Document

## Introduction / Preamble

This document outlines the overall project architecture for the "Tax Scenarios Analyzer MVP," focusing exclusively on its client-side implementation. As a single-page application (SPA) designed to run entirely within the user's browser, there are no traditional backend systems, shared services, or database concerns in this MVP.

Its primary goal is to serve as the guiding architectural blueprint for AI-driven development and subsequent implementation, ensuring consistency and adherence to chosen patterns and technologies within the client-side environment. This document will detail the structure, data flow, calculation logic, and persistence mechanisms that enable the application's functionality.

**Relationship to Frontend Architecture:**
Given that the "Tax Scenarios Analyzer MVP" is a client-side web application with a significant user interface, a separate Frontend Architecture Document will be created to detail the frontend-specific design. This document (the overall architecture) will establish the definitive core technology stack selections, which are binding for the frontend components.

## Table of Contents

1.  Introduction / Preamble
2.  Technical Summary
3.  Core Components & Data Models
4.  Calculation Engine Logic
5.  Application Data Flow
6.  Error Handling Strategy
7.  Security Considerations
8.  Deployment Considerations
9.  Future Enhancements

## Technical Summary

The Tax Scenarios Analyzer MVP is architected as a lean, entirely client-side Single-Page Application (SPA) built with TypeScript and React, leveraging Tailwind CSS for styling and React Hooks (potentially Zustand) for state management. All financial and qualitative calculations, along with user data persistence via `localStorage`, occur exclusively within the user's browser. The application emphasizes modularity in its calculation engine to allow for extensible tax rule implementation (e.g., special tax features like Puerto Rico's Act 60). User scenario data can be shared via compressed URL parameters, and the application is designed for automated CI/CD deployment to static hosting platforms like Cloudflare Pages.

## Core Components & Data Models

### 1. `AppConfig` Model (Static Configuration)

This model defines the static, application-wide configuration data that does not change based on user input. It is loaded once at application startup.

```typescript
interface TaxRate {
    minIncome: number;
    maxIncome?: number; // undefined for the highest bracket
    rate: number; // as a decimal (e.g., 0.25 for 25%)
}

interface CapitalGainsTaxRate {
    minIncome: number;
    maxIncome?: number;
    shortTermRate: number; // for assets held <= 1 year
    longTermRate: number; // for assets held > 1 year
}

interface DefaultExpenseCategory {
    id: string; // Unique ID for category, e.g., "housing", "food"
    name: string;
    description?: string;
    defaultAmount: number; // Monthly default
}

interface LocationDefaults {
    id: string; // Unique ID for location, e.g., "US-CA", "PR"
    name: string; // Display name, e.g., "California, USA", "Puerto Rico"
    country: string;
    state?: string; // Applicable for federal systems
    city?: string; // For city-specific taxes/costs if needed
    incomeTaxRates: TaxRate[];
    capitalGainsTaxRates: CapitalGainsTaxRate[];
    propertyTaxRate: number; // As a decimal, e.g., 0.01 for 1%
    consumptionTaxRate: number; // Sales tax / VAT, e.g., 0.07 for 7%
    defaultExpenseCategories: DefaultExpenseCategory[];
    defaultQualitativeAttributes: QualitativeAttribute[]; // Defaults for new scenarios
    specialTaxFeatures?: SpecialTaxFeature[]; // IDs of applicable special tax features
}

interface SpecialTaxFeature {
    id: string; // Unique ID for the feature, e.g., "PR-ACT-60"
    name: string; // Display name, e.g., "Puerto Rico Act 60 Benefits"
    description: string;
    appliesTo: "INCOME" | "CAPITAL_GAINS" | "OTHER"; // Type of tax it impacts
    // Inputs required from the user if they select this feature for a scenario
    inputs?: {
        key: string;
        type: "NUMBER" | "DATE" | "STRING" | "BOOLEAN";
        label: string;
        placeholder?: string;
    }[];
}

interface AppConfig {
    locations: LocationDefaults[];
    // Other global app settings, e.g., projection period years
    projectionPeriodYears: number; // Default projection duration (e.g., 10 years)
}
```

### 2. `UserAppState` Model (Persistent User Data)

This model represents the entire user's saved state, persisted to `localStorage`.

```typescript
interface UserAppState {
    initialAssets: Asset[]; // All assets user owns, regardless of scenario
    scenarios: Scenario[]; // All defined scenarios, including baseline and comparisons
}
```

### 3. `Asset` Model

Represents a single financial asset owned by the user.

```typescript
interface Asset {
    id: string; // Unique ID for the asset
    name: string;
    assetType: "STOCK" | "CRYPTO" | "REAL_ESTATE" | "OTHER";
    quantity: number;
    costBasisPerUnit: number; // Original purchase price per unit
    fairMarketValuePerUnit: number; // Current value per unit
    acquisitionDate: string; // ISO 8601 date string (e.g., "YYYY-MM-DD") - original purchase date

    // NEW: For scenarios involving residency-based tax breaks (e.g., PR Act 60)
    // This date marks when the asset's basis effectively "resets" for the new residency's tax purposes.
    // It would typically be the Scenario.residencyStartDate for this asset.
    residencyAcquisitionDate?: string; // Date (e.g., "YYYY-MM-DD") when tax residency for *this asset's appreciation* effectively changed.
    // NEW: The fair market value of the asset per unit on the residencyAcquisitionDate.
    valueAtResidencyAcquisitionDatePerUnit?: number;
}
```

### 4. `IncomeSource` Model

Represents a recurring income stream.

```typescript
interface IncomeSource {
    id: string; // Unique ID
    name: string;
    type: "EMPLOYMENT" | "RENTAL_PROPERTY" | "OTHER";
    annualAmount: number;
    startYear: number;
    endYear?: number; // Undefined if ongoing
    locationId?: string; // Specific location for this income source if different from scenario's
}
```

### 5. `PlannedAssetSale` Model

Represents a planned sale of an asset within a specific year of a scenario.

```typescript
interface PlannedAssetSale {
    id: string; // Unique ID
    assetId: string; // References Asset.id
    year: number; // Year of the projection when the sale occurs
    quantity: number; // Quantity of the asset sold
    salePricePerUnit: number; // Expected sale price per unit
}
```

### 6. `AnnualExpense` Model

Represents an annual living expense category.

```typescript
interface AnnualExpense {
    id: string; // Unique ID (e.g., from DefaultExpenseCategory.id)
    name: string;
    amount: number; // Annual amount for this category
}
```

### 7. `Scenario` Model

This is the core model for a specific tax residency scenario, including user-defined inputs and selections.

```typescript
interface Scenario {
    id: string; // Unique ID for the scenario
    name: string; // User-defined name (e.g., "Current US", "Puerto Rico Move")
    locationId: string; // References LocationDefaults.id
    projectionPeriodYears: number; // How many years to project for this scenario
    residencyStartDate?: string; // NEW: The date the user's tax residency for this scenario begins (e.g., move date to PR)

    incomeSources: IncomeSource[];
    annualExpenses: {
        categories: AnnualExpense[];
        additionalCosts?: number; // Lump sum costs not categorized, e.g., moving expenses
    };
    plannedAssetSales: PlannedAssetSale[];

    selectedSpecialTaxFeatures: {
        featureId: string; // References SpecialTaxFeature.id
        inputs: { [key: string]: any }; // User-provided inputs for the feature
    }[];

    scenarioSpecificAttributes: QualitativeAttribute[]; // User-defined qualitative priorities for this scenario
}
```

### 8. `QualitativeAttribute` Model

Represents a user's qualitative goal or preference for user goal.

```typescript
interface QualitativeAttribute {
    id: string; // Unique ID (e.g., "weather", "healthcare")
    name: string; // Display name for user goal
    category: string; // e.g., "Healthcare", "Safety", "Cultural Fit"
    weight: "Low" | "Medium" | "High" | "Critical"; // User-assigned importance
    description?: string;
}
```

### 9. `CalculationResult` Model (Internal to Application State)

While not directly persisted, this structure represents the output of the `Calculation Engine` for a single scenario, which will be held in application state for display.

```typescript
interface ScenarioYearlyProjection {
    year: number;
    grossIncome: number;
    totalExpenses: number;
    capitalGainsIncome: number; // Total from planned sales
    taxBreakdown: {
        federalIncomeTax: number;
        stateIncomeTax: number;
        capitalGainsTax: number;
        propertyTaxEstimate: number; // Basic estimate based on location
        consumptionTaxEstimate: number; // Basic estimate
        // Add other specific tax components as calculated
        totalTax: number;
    };
    additionalScenarioCosts: number;
    netFinancialOutcome: number; // Income - Expenses - Taxes - Additional Costs
}

interface ScenarioResults {
    scenarioId: string;
    yearlyProjections: ScenarioYearlyProjection[];
    totalNetFinancialOutcomeOverPeriod: number;
    qualitativeFitScore: number; // Calculated score based on user goals and scenario attributes
}

interface AppCalculatedState {
    resultsByScenario: { [scenarioId: string]: ScenarioResults };
    // Other derived/calculated data for comparison dashboard etc.
}
```

## Calculation Engine Logic

The Calculation Engine is the core of the application, responsible for processing `Scenario` and `UserAppState` data to generate `ScenarioResults`. It operates on a modular, year-by-year basis.

### 4.1. `calculateScenarioProjection(scenario, userAppState)`

* **Input:** A `Scenario` object, and the global `UserAppState` (containing `initialAssets`).
* **Logic:**
    1.  Initializes an empty array for `yearlyProjections`.
    2.  Iterates from `currentYear = 1` up to `scenario.projectionPeriodYears`.
    3.  For each `currentYear`, it calls a series of sub-functions (detailed below) to compute financial metrics.
    4.  Aggregates the results for `currentYear` into a `ScenarioYearlyProjection` object.
    5.  After the loop, it calls `calculateQualitativeFitScore` once.
    6.  Computes `totalNetFinancialOutcomeOverPeriod`.
* **Output:** A `ScenarioResults` object.

### 4.2. `calculateIncomeForYear(currentYear, scenario)`

* **Input:** `currentYear`, `scenario.incomeSources`.
* **Logic:** Sums `annualAmount` for all `IncomeSource` objects whose `startYear` is less than or equal to `currentYear` and `endYear` (if defined) is greater than or equal to `currentYear`.
* **Output:** `grossIncome: number`.

### 4.3. `calculateTotalExpenses(currentYear, scenario)`

* **Input:** `currentYear`, `scenario.annualExpenses`.
* **Logic:** Sums `amount` from all `AnnualExpense` categories and adds `additionalCosts`. (Future: could incorporate inflation).
* **Output:** `totalExpenses: number`.

### 4.4. `calculateCapitalGainsForYear(currentYear, scenario, userAppState)`

* **Input:** `currentYear`, `scenario.plannedAssetSales`, `userAppState.initialAssets`, `scenario.residencyStartDate`.
* **Logic:**
    1.  Identifies all `PlannedAssetSale` objects where `year` matches `currentYear`.
    2.  For each matching `PlannedAssetSale`:
        a.  Retrieves the corresponding `Asset` from `userAppState.initialAssets` using `assetId`.
        b.  Determines the actual sale date within `currentYear` (e.g., end of year or specific user input).
        c.  **Calculate Total Gain:** `TotalGain = (PlannedAssetSale.quantity * PlannedAssetSale.salePricePerUnit) - (PlannedAssetSale.quantity * Asset.costBasisPerUnit)`
        d.  **Calculate Pre-Residency Gain (if applicable):**
            * If `Asset.residencyAcquisitionDate` and `Asset.valueAtResidencyAcquisitionDatePerUnit` are present:
                `PreResidencyGain = (PlannedAssetSale.quantity * Asset.valueAtResidencyAcquisitionDatePerUnit) - (PlannedAssetSale.quantity * Asset.costBasisPerUnit)`
            * Determines if `PreResidencyGain` is Long-Term or Short-Term based on `Asset.acquisitionDate` to `Asset.residencyAcquisitionDate`.
        e.  **Calculate Post-Residency Gain (if applicable):**
            * If `Asset.residencyAcquisitionDate` and `Asset.valueAtResidencyAcquisitionDatePerUnit` are present:
                `PostResidencyGain = (PlannedAssetSale.quantity * PlannedAssetSale.salePricePerUnit) - (PlannedAssetSale.quantity * Asset.valueAtResidencyAcquisitionDatePerUnit)`
            * Determines if `PostResidencyGain` is Long-Term or Short-Term based on `Asset.residencyAcquisitionDate` to actual `saleDate`.
        f.  If no `residencyAcquisitionDate` is set, all gains are `totalGain`.
        g.  Aggregates `preResidencyGain` (long/short), `postResidencyGain` (long/short), and `totalGain` components from all sales for the year.
* **Output:** An object containing:
    * `totalCapitalGainsIncome`: Sum of all gains.
    * `preResidencyCapitalGains`: `{ longTerm: number, shortTerm: number }` (or just `total: number`).
    * `postResidencyCapitalGains`: `{ longTerm: number, shortTerm: number }` (or just `total: number`).

### 4.5. `determineTaxableIncome(grossIncome)`

* **Input:** `grossIncome` (from `calculateIncomeForYear`).
* **Logic:** Simple deduction from gross income to arrive at the taxable income. (MVP: May be a placeholder or simple standard deduction, future: more complex deductions).
* **Output:** `taxableIncome: number`.

### 4.6. `calculateTaxes(currentYear, taxableIncome, capitalGainsData, rentalIncome, scenario)`

* **Input:** `currentYear`, `taxableIncome`, `capitalGainsData` (from 4.4), `rentalIncome` (part of `grossIncome`), `scenario`.
* **Logic:**
    1.  Retrieves `LocationDefaults` for `scenario.locationId`.
    2.  Calculates `federalIncomeTax` based on `taxableIncome` and `locationDefaults.incomeTaxRates`.
    3.  Calculates `stateIncomeTax` based on `taxableIncome` and `locationDefaults.incomeTaxRates` (if applicable).
    4.  Calculates `capitalGainsTax` using `locationDefaults.capitalGainsTaxRates` applied to `capitalGainsData.totalCapitalGainsIncome` (or its long/short term components).
    5.  Estimates `propertyTaxEstimate` based on `realEstateAssetValue` and `locationDefaults.propertyTaxRate`.
    6.  Estimates `consumptionTaxEstimate` based on a portion of expenses and `locationDefaults.consumptionTaxRate`.
    7.  **Applies Special Tax Features (Dynamic Hook):**
        * Iterates through `scenario.selectedSpecialTaxFeatures`.
        * For each `selectedFeature`, calls a dedicated `SpecialTaxFeature` handler function (e.g., `applyPuertoRicoAct60Benefits`), passing: `currentYear`, `taxableIncome`, the *granular capital gains data* (`preResidencyCapitalGains`, `postResidencyCapitalGains`), `selectedFeature.inputs`, and access to baseline US Federal tax rates.
        * Example `applyPuertoRicoAct60Benefits` Logic:
            * Applies standard *U.S. Federal capital gains rates* to `preResidencyCapitalGains`.
            * Applies 0% tax to `postResidencyCapitalGains`.
            * Modifies the `taxBreakdown` to reflect these specific tax applications.
    8.  Sums all individual tax components to get `totalTax`.
* **Output:** `taxBreakdown: { ... }`.

### 4.7. `calculateNetFinancialOutcome(...)`

* **Input:** `grossIncome`, `totalExpenses`, `totalTax`, `additionalScenarioCosts`.
* **Logic:** `netFinancialOutcome = grossIncome - totalExpenses - totalTax - additionalScenarioCosts`.
* **Output:** `netFinancialOutcome: number`.

### 4.8. `calculateQualitativeFitScore(scenario, userAppState)`

* **Input:** `scenario.scenarioSpecificAttributes`, `userAppState.qualitativeGoals`.
* **Logic:**
    1.  For each `scenarioSpecificAttribute` in the current scenario:
        a.  Find the matching `qualitativeGoal` from `userAppState`.
        b.  Compare the `sentiment` of the scenario attribute to the `sentiment` of the user's goal.
        c.  Factor in the `weight` of the user's goal (e.g., "Critical" goals have a higher impact on the score).
    2.  Aggregates these comparisons into a single numerical `qualitativeFitScore` (e.g., 0-100).
* **Output:** `qualitativeFitScore: number`.

## Application Data Flow

This section outlines the flow of data through the Tax Scenarios Analyzer MVP, from user input to final results.

### 1. Initial Application Load

1.  **Load Static Configuration:** The application loads `AppConfig` from a JSON file or similar source. This provides the application with locations, default expense categories, tax rates, special tax features, and default qualitative attributes.
2.  **Load User State (Prioritized):**
    * **Check for Shared State:** The application first checks for a `UserAppState` (or a subset thereof) encoded in a URL query parameter.
        * If a shared state is found:
            * It is decompressed and parsed.
            * The user is presented with a choice:
                1.  **"Replace Local Data"**: Overwrite the existing `localStorage` `UserAppState` with the shared state.
                2.  **"Add to Local Data"**: Merge the scenarios from the shared state into the existing `localStorage` `UserAppState` (handling potential ID conflicts).
                3.  **"View Temporarily"**: Load the shared state into temporary application memory without affecting `localStorage`.
                4.  **"Discard Shared Data"**: Ignore the shared state and proceed with `localStorage`.
    * **Load from `localStorage`:** If no shared state is present in the query parameter, or if the user chooses not to use it, the application attempts to load `UserAppState` from `localStorage`.
    * If `UserAppState` doesn't exist (first use or discarded shared state), an empty `UserAppState` is initialized.

### 2. Scenario Creation/Modification

1.  **User Initiates New Scenario:** The user is presented with two primary options for creating a new scenario:
    * **"Define New Location" (Unified Flow):**
        * The user inputs Country, State (if applicable), and City using a form (e.g., text inputs, dropdowns with auto-completion).
        * The application attempts to find a matching `LocationDefaults` entry in `AppConfig` based on the provided Country/State/City.
        * **If a match is found:**
            * A new `Scenario` object is created. Its `locationId` is set to the matched `LocationDefaults.id`.
            * Its `annualExpenses.categories` and `scenarioSpecificAttributes` are populated by *deep copying* the `defaultExpenseCategories` and `defaultQualitativeAttributes` from the matched `LocationDefaults`. A unique `id` is generated for each copied expense category.
            * If the selected location's `SpecialTaxFeatures` or the `Scenario` setup itself requires a `residencyStartDate`, the user is prompted to provide this date. This date is then used to populate the `residencyAcquisitionDate` in each `Asset` within `UserAppState.initialAssets`. The user is also prompted to provide `valueAtResidencyAcquisitionDatePerUnit` for each asset.
        * **If no match is found:**
            * A new "blank" `Scenario` object is created. Its `locationId` would reflect the custom input (e.g., a custom ID or the raw input string).
            * All financial and qualitative fields (`annualExpenses.categories`, `taxRates`, `scenarioSpecificAttributes`, etc.) start empty or with minimal generic placeholders, requiring the user to manually populate all data. The user is notified that no defaults were found for the specified location.
    * **"Copy from Baseline Scenario"**:
        * The application identifies the current baseline scenario (the first `Scenario` in `UserAppState.scenarios`).
        * A *deep copy* of the baseline scenario is created.
        * The user can then modify the `locationId`, `name`, and any other details (e.g., specific `incomeSources`, `annualExpenses`, `plannedAssetSales`, `selectedSpecialTaxFeatures`, `scenarioSpecificAttributes`) of this new scenario. This option is particularly useful for quickly setting up comparison scenarios that share many characteristics with the baseline.
2.  **User Modifies Existing Scenario:**
    * The user modifies various properties of an existing `Scenario` (e.g., income sources, expense amounts, planned asset sales, qualitative attribute sentiments, special tax feature inputs). These modifications are directly reflected in the `Scenario` object within `UserAppState.scenarios`.

### 3. Calculation Initiation

1.  **User Triggers Calculation:** The user initiates the calculation, typically by clicking a "Calculate" button.
2.  **Calculation Engine Orchestration:**
    * For each `Scenario` in `UserAppState.scenarios`:
        * The `calculateScenarioProjection(scenario, userAppState)` function is called.

### 4. Calculation Engine Processing

1.  **Yearly Projection Loop:** The `calculateScenarioProjection` function iterates through each year in the scenario's `projectionPeriodYears`.
2.  **Modular Calculations:** For each year, it calls the sub-functions detailed in Section 4.
3.  **Qualitative Fit Score:** After the yearly projections, `calculateQualitativeFitScore(scenario, userAppState)` is called.
4.  **Results Aggregation:** The `calculateScenarioProjection` function aggregates the yearly results and returns a `ScenarioResults` object.

### 5. Results Storage and Display

1.  **Store Results:** The `ScenarioResults` object for each scenario is stored in an `AppCalculatedState` object (which is *not* persisted; it's held in application memory).
2.  **Display Results:** The application's UI displays the calculated results to the user. This typically involves:
    * Presenting the `yearlyProjections` in a tabular or chart format.
    * Displaying the `totalNetFinancialOutcomeOverPeriod` for each scenario.
    * Showing the `qualitativeFitScore` for each scenario, often with visual cues (e.g., a color-coded bar).
    * Allowing the user to compare the results of different scenarios.

### 6. Data Persistence

1.  **Periodic Save:** The application periodically (e.g., every few minutes, or on significant changes) saves the `UserAppState` to `localStorage`. This ensures that the user's data is preserved between sessions.

### 7. Sharing Current State as a Link

1.  **User Initiates Share:** The user can trigger an action (e.g., click a "Share" button).
2.  **Serialize and Compress:** The current `UserAppState` (or a selectively chosen subset of scenarios) is:
    * Serialized to a JSON string.
    * Compressed using a client-side compression library (e.g., LZ-String).
3.  **Generate URL:** The compressed string is appended as a query parameter to the application's URL.
4.  **Present Link:** The full URL is then presented to the user, who can copy and share it. This link can be used by other users to load the specific state, as described in "1. Initial Application Load." This mechanism is also the primary way to manage and transfer specific test scenarios across different deployment environments.

### 8. Special Tax Feature Logic

1.  **External Module:** The logic for each `SpecialTaxFeature` (e.g., Puerto Rico Act 60, Portugal NHR) resides in a separate "Special Tax Feature Logic Module." This module contains JavaScript functions that are dynamically invoked by the `calculateTaxes` function.
2.  **Dynamic Invocation:** The `calculateTaxes` function uses the `featureId` in `Scenario.selectedSpecialTaxFeatures` to determine which handler function to call.
3.  **Modular Design:** These handler functions are designed to reuse the generic tax calculation sub-functions (e.g., `calculateCapitalGainsForYear` for its granular pre/post residency gain data) whenever possible, only implementing the specific logic that is unique to that tax feature.

## Error Handling Strategy

A robust error handling strategy is essential for providing a stable and user-friendly experience, even in a client-side-only application. While the MVP does not involve complex backend interactions, effective management of client-side errors, data inconsistencies, and calculation issues is paramount.

### 1. Principles of Error Handling

* **Graceful Degradation:** The application should strive to remain functional or recover gracefully even when errors occur.
* **User Feedback:** Users should be informed clearly and concisely about errors, what went wrong, and if possible, how to resolve it. Technical jargon should be avoided.
* **Preventative Measures:** Input validation and data sanitization should be employed to prevent invalid data from entering the calculation pipeline in the first place.
* **Logging (Client-Side):** Errors should be logged to the browser's console for debugging purposes during development and potential reporting in a production environment (e.g., via a client-side error reporting service if added later).
* **Testability:** Error paths should be testable to ensure they behave as expected.

### 2. Types of Errors and Handling Mechanisms

#### 2.1. User Input Validation Errors

* **Description:** Occur when a user provides data that does not conform to expected types, formats, or constraints.
* **Detection:** Client-Side Validation (on form submission/`onChange`), Schema Validation (e.g., with TypeScript interfaces and libraries like Zod).
* **Handling:** Immediate UI feedback (inline messages), prevent submission/calculation until resolved, provide user guidance.

#### 2.2. Data Consistency Errors

* **Description:** Occur when `UserAppState` contains logically inconsistent data (e.g., `PlannedAssetSale` referencing non-existent `assetId`).
* **Detection:** Pre-Calculation Checks within the Calculation Engine, leveraging TypeScript's type system.
* **Handling:** Alert user (modal/notification), pinpoint issue, prevent calculation for critical inconsistencies.

#### 2.3. Calculation Logic Errors

* **Description:** Bugs or unexpected edge cases within the Calculation Engine (e.g., division by zero, infinite loops).
* **Detection:** Thorough Unit and Integration Testing, runtime checks (e.g., `NaN` checks), `try-catch` blocks around core logic.
* **Handling:** Generic "calculation error" notification to user, prevent display of bad data, log full stack trace to console for developers.

#### 2.4. `localStorage` Errors

* **Description:** Issues saving or loading `UserAppState` to/from `localStorage` (e.g., quota exceeded, security restrictions).
* **Detection:** `try-catch` blocks around all `localStorage` operations, feature detection.
* **Handling:** Inform user of issue and likely cause, continue operating with in-memory data but warn of non-persistence.

### 3. Centralized Error Reporting (Future Consideration)

For a production application, integrate a client-side error tracking service (e.g., Sentry, Bugsnag) to automatically capture and report JavaScript errors, performance issues, and user session details.

### 4. Implementation Details

* **React Error Boundaries:** Utilize React Error Boundaries for catching errors in UI components.
* **Utility Functions:** Create common utility functions for consistent user feedback (toasts, modals).
* **Clear Error States:** Define clear UI states for errors (e.g., red borders, disabled buttons, error banners).

## Security Considerations

As a client-side web application running entirely within the user's browser, the Tax Scenarios Analyzer MVP's security strategy focuses primarily on safeguarding client-side data, preventing cross-site scripting (XSS), and managing dependencies securely. Traditional backend security concerns are out of scope for this MVP.

### 1. Core Security Principles for Client-Side MVP

* **Data Confidentiality (Local):** User-entered financial and personal preference data should be treated with care, even if only locally.
* **Data Integrity:** Prevent unauthorized or accidental modification of application logic or user data.
* **Availability:** Ensure the application remains accessible and functional.
* **Transparency:** Clearly communicate to users how their data is handled and stored.

### 2. Specific Security Considerations and Mitigations

#### 2.1. Data Storage (`localStorage`)

* **Risk:** `localStorage` is insecure for highly sensitive data.
* **Mitigation:** **Never** store highly sensitive PII (SSNs, credit cards, passwords). Inform users data is local and unencrypted. Only store minimal necessary data.

#### 2.2. Cross-Site Scripting (XSS) Prevention

* **Risk:** Malicious scripts could compromise `localStorage` or UI.
* **Mitigation:** React's auto-escaping, implement a strict **Content Security Policy (CSP)**, avoid `dangerouslySetInnerHTML`.

#### 2.3. Cross-Site Request Forgery (CSRF) Prevention

* **Risk:** Unwanted requests.
* **Mitigation:** Not applicable for current MVP scope (no backend API calls).

#### 2.4. Dependency Security

* **Risk:** Vulnerabilities in third-party libraries.
* **Mitigation:** Regular updates (e.g., `npm audit`), choose reputable libraries.

#### 2.5. Client-Side Code Tampering

* **Risk:** Users can inspect and modify client-side code.
* **Mitigation:** Obfuscation/Minification (for performance, not security), acknowledge "Trust the Client" model for personal planning tool.

#### 2.6. URL Parameter Handling (for sharing)

* **Risk:** Exposing data in URLs.
* **Mitigation:** Data compression (LZ-String), no sensitive PII in URLs, input validation on load.

#### 2.7. HTTPS Everywhere

* **Mitigation:** Serve application exclusively over HTTPS to encrypt all traffic.

### 3. Future Security Considerations (Beyond MVP)

If backend services, user accounts, or payments are introduced, a comprehensive security strategy encompassing authentication, authorization, data encryption, API security, and regular audits would be paramount.

## Deployment Considerations

As a purely client-side Single-Page Application (SPA), the deployment of the Tax Scenarios Analyzer MVP is streamlined, focusing on efficient, reliable, and cost-effective delivery to end-users.

### 1. Build Process

* **Technology Stack:** TypeScript and React.
* **Build Tool:** **Vite** will be used, providing fast development and optimized production builds (tree shaking, minification, code splitting, asset hashing).
* **Output:** A `dist` directory with static assets ready for deployment.

### 2. Hosting Environment

* **Static Site Hosting:** Ideal for client-side SPAs.
* **Selected Platform: Cloudflare Pages:**
    * **Free Tier:** Generous free tier.
    * **Global CDN:** Fast load times worldwide.
    * **Built-in HTTPS:** Automatic SSL certificates.
    * **Custom Domain Support:** Seamless integration with existing Cloudflare domains.
    * **SPA Routing Fallback:** Easily configured to redirect all paths to `index.html` for client-side routing.
* **Comparison:** Cloudflare Pages is highly competitive with Vercel and Netlify for static site hosting, offering robust features. While Google Cloud Platform (Cloud Storage + Cloud CDN) is an option, it typically involves a steeper learning curve and potential costs for an MVP.

### 3. Deployment Workflow (CI/CD Pipeline)

A robust Continuous Integration/Continuous Deployment (CI/CD) pipeline will be implemented.

1.  **Version Control:** Git repository (e.g., GitHub).
2.  **Branching Strategy:**
    * **`main` branch:** Production-ready state, always deployable.
    * **`dev` (or `develop`) branch:** Ongoing feature development and integration.
    * **Feature Branches:** Short-lived branches off `dev` for individual tasks.
3.  **Automated Deployments with Cloudflare Pages:**
    * Integrates directly with Git repository.
    * **Production Deployment:** On every `push` or `merge` to `main`, Cloudflare Pages automatically builds and deploys to the production domain.
    * **Staging/UAT Deployment (Optional):** `dev` branch can be deployed to a separate staging environment (e.g., `dev.yourdomain.com`).
    * **Preview Deployments:** Cloudflare Pages provides automatic preview deployments for every Pull Request, allowing testing in a live, production-like environment *before* merging. This significantly reduces the need for long-lived `test` branches.

### 4. Domain Management

* Leveraging Cloudflare for domains simplifies DNS setup for pointing to Cloudflare Pages.

## Future Enhancements

The Tax Scenarios Analyzer MVP lays a solid foundation. This section outlines key enhancements for future development.

### 1. AI-Driven Scenario Builder

* **Natural Language Input:** Advanced input field for users to describe goals and preferences in natural language.
* **AI Module for Scenario Generation:** An AI module (likely leveraging an LLM) would analyze this input to:
    * Automatically generate and pre-populate initial scenarios (locations, income, expenses, asset sales).
    * Infer qualitative attribute sentiment and significance based on user priorities.
    * Allow iterative refinement via further natural language or UI adjustments.

### 2. Expanded Tax Calculation Fidelity & Scope

* **More Granular Income Types:** Stock options/RSUs, business income, pension/retirement income.
* **Deductions & Credits:** Implement common tax deductions (e.g., standard vs. itemized, mortgage interest) and credits (e.g., child tax credit, foreign tax credits).
* **Multi-Year Projections with Dynamic Changes:** Model changes within the projection period (salary increases, new assets) and incorporate inflation.
* **Wealth Transfer Taxes:** Basic considerations for estate, gift, or inheritance taxes.
* **Social Security/National Insurance Contributions:** Include contributions and benefits.

### 3. Enhanced Data Management & User Experience

* **User Accounts & Cloud Storage:** Implement a backend for secure cloud storage and syncing across devices, replacing `localStorage`.
* **Improved Location Defaults:** Expand `AppConfig.LocationDefaults` for more comprehensive global coverage and regularly update data.
* **Import/Export Functionality:** Allow users to import (e.g., CSV) or export financial data.
* **Interactive Visualizations:** Develop more advanced charts and graphs for better data understanding.
* **"What-If" Analysis Tools:** Enable quick variable tweaking to see immediate impacts on results.
* **Guided Onboarding & Tooltips:** Implement tours and contextual help for new users.

### 4. Deeper Qualitative Analysis

* **Customizable Qualitative Attributes:** Allow users to add their own weighted qualitative attributes.
* **Integration with External Data:** Explore APIs for real-time quality-of-life data (e.g., crime rates, cost of living) to enrich assessments.
* **AI-Powered Qualitative Insights:** Use AI to generate personalized insights based on qualitative goals.

### 5. Integration & Reporting

* **PDF/Printable Reports:** Generate professional-looking reports summarizing scenario comparisons.
* **API Integrations (Third-Party):** Explore integrations with financial planning tools or tax preparation software.
* **Educational Content:** Provide contextual links to relevant articles or government resources.

### 6. Technical Enhancements

* **Server-Side Rendering (SSR) / Static Site Generation (SSG):** For improved SEO and initial load performance (e.g., Next.js).
* **Web Workers:** Offload heavy calculation tasks to keep the UI responsive.
* **Backend for Data and Analytics:** If user accounts or more complex data management are introduced, build a scalable backend.
