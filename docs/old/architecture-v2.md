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

The Tax Scenarios Analyzer MVP is architected as a lean, entirely client-side Single-Page Application (SPA) built with TypeScript and React, leveraging Tailwind CSS for styling and React Hooks (potentially Zustand) for state management. All financial and qualitative calculations, along with user data persistence via `localStorage`, occur exclusively within the user's browser. New scenarios are created by deep-copying "template scenarios" (predefined locations with estimated effective tax rates and default qualitative attribute assessments) or by starting with a blank structure for custom locations; in MVP, users input their own effective tax rates for baseline calculations. User qualitative goals are defined by selecting from a global list of concepts and assigning personal weights. Each user scenario is self-contained with all necessary tax parameters and scenario-specific qualitative attribute assessments (which also link back to global concepts). The application emphasizes modularity in its calculation engine to allow for extensible tax rule implementation (e.g., `SpecialTaxFeature`s like Puerto Rico's Act 60, which can have complex logic), with explicit triggers for more advanced calculations like gain bifurcation. User scenario data can be shared via compressed URL parameters, and the application is designed for automated CI/CD deployment to static hosting platforms like Cloudflare Pages.

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

### 2. `UserAppState` Model (Persistent User Data)

This model represents the entire user's saved state, persisted to `localStorage`.

```typescript
interface UserAppState {
    initialAssets: Asset[]; 
    scenarios: Scenario[]; 
    userQualitativeGoals: UserQualitativeGoal[]; // User's personal qualitative goals and their weights
}
```

### 3. `Asset` Model

Represents a single financial asset owned by the user.

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

### 4. `IncomeSource` Model

Represents a recurring income stream.

```typescript
interface IncomeSource {
    id: string; 
    name: string;
    type: "EMPLOYMENT" | "RENTAL_PROPERTY" | "OTHER";
    annualAmount: number;
    startYear: number;
    endYear?: number; 
    locationId?: string; 
}
```

### 5. `PlannedAssetSale` Model

Represents a planned sale of an asset within a specific year of a scenario.

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

Represents an annual living expense category within a scenario.

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
    residencyAcquisitionDate: string; 
    valueAtResidencyAcquisitionDatePerUnit: number;
}
```

### 8. `Scenario` Model (Core User Data)

This is the core model for a specific tax residency scenario. Each scenario object is self-contained with all necessary parameters for calculation after being initialized (from a template or custom). For MVP, `incomeTaxRates` and `capitalGainsTaxRates` will each hold a single object representing user-provided effective rates.

```typescript
interface Scenario {
    id: string; 
    name: string; 
    
    templateReferenceId?: string; 
    displayLocationName: string; 
    locationCountry: string;     
    locationState?: string;    
    locationCity?: string;     

    incomeTaxRates: TaxRate[]; 
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

### 9. `UserQualitativeGoal` Model (Within UserAppState)

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

### 10. `ScenarioAttribute` Model (Within Scenario)

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

### 11. `CalculationResult` Model (Internal to Application State)

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

The Calculation Engine processes a self-contained `Scenario` object.

### 4.1. `calculateScenarioProjection(scenario, userAppState, appConfig)`

* **Input:** A `Scenario` object, `userAppState` (for `initialAssets` and `userQualitativeGoals`), `appConfig` (for `globalSpecialTaxFeatures` and `globalQualitativeConcepts` definitions).
* **Logic:**
    1.  Initializes an empty array for `yearlyProjections`.
    2.  Iterates from `currentYear = 1` up to `scenario.projectionPeriodYears`.
    3.  For each `currentYear`, it calls a series of sub-functions to compute financial metrics.
    4.  Aggregates these results into a `ScenarioYearlyProjection` object.
    5.  Adds the `ScenarioYearlyProjection` to the `yearlyProjections` array.
    6.  After the loop, it calls `qualitativeFitScore = calculateQualitativeFitScore(scenario, userAppState, appConfig)`.
    7.  Computes `totalNetFinancialOutcomeOverPeriod` by summing `netFinancialOutcome` from all `yearlyProjections`.
* **Output:** A `ScenarioResults` object.

### 4.2. `calculateIncomeForYear(currentYear, scenario)`

* **Input:** `currentYear`, `scenario.incomeSources`.
* **Logic:** Sums `annualAmount` for all `IncomeSource` objects in `scenario.incomeSources` where `incomeSource.startYear <= currentYear` and (`incomeSource.endYear === undefined || incomeSource.endYear >= currentYear`).
* **Output:** `grossIncome: number`.

### 4.3. `calculateTotalExpenses(currentYear, scenario)`

* **Input:** `currentYear`, `scenario.annualExpenses`.
* **Logic:** Sums `amount` from all `AnnualExpense` objects in `scenario.annualExpenses.categories`.
* **Output:** `totalExpensesFromCategories: number`.

### 4.4. `calculateCapitalGainsForYear(currentYear, scenario, userAppState, appConfig)`

* **Input:** `currentYear`, `scenario`, `userAppState.initialAssets`, `appConfig`.
* **Logic:** (As previously detailed: identifies sales, checks if bifurcation is needed based on selected STFs having `requiresGainBifurcation: true`, calculates TotalGain, then conditionally Pre/Post Residency Gains using `scenario.scenarioAssetTaxDetails`, otherwise attributes TotalGain to PostResidencyGains.)
* **Output:** An object containing: `totalCapitalGainsIncome`, `preResidencyCapitalGains: { longTerm, shortTerm }`, `postResidencyCapitalGains: { longTerm, shortTerm }`.

### 4.5. `determineTaxableIncome(grossIncome)`

* **Input:** `grossIncome`.
* **Logic:** For MVP, this function returns `grossIncome`. It acts as a placeholder for future, more detailed deduction logic (e.g., standard or itemized deductions).
* **Output:** `taxableIncome: number`.

### 4.6. `calculateTaxes(currentYear, taxableIncome, capitalGainsData, rentalIncome, scenario, appConfig)`

* **Input:** As previously defined.
* **Internal Functions (Conceptual for MVP):**
    * `calculateStandardIncomeTax_MVP(taxableIncome, incomeTaxRates: TaxRate[]): number`:
        * Retrieves `effectiveRate = incomeTaxRates[0]?.rate || 0`.
        * Returns `taxableIncome * effectiveRate`.
    * `calculateStandardCapitalGainsTax_MVP(cgData, capitalGainsTaxRates: CapitalGainsTaxRate[]): { shortTermTax: number, longTermTax: number, total: number }`:
        * Retrieves `effectiveST_Rate = capitalGainsTaxRates[0]?.shortTermRate || 0`.
        * Retrieves `effectiveLT_Rate = capitalGainsTaxRates[0]?.longTermRate || 0`.
        * (Assumes for MVP, standard CGT applies to `cgData.postResidencyCapitalGains` or `cgData.totalCapitalGainsIncome` if bifurcation isn't active/relevant for the general calc).
        * `shortTermTax = cgData.postResidencyCapitalGains.shortTerm * effectiveST_Rate`.
        * `longTermTax = cgData.postResidencyCapitalGains.longTerm * effectiveLT_Rate`.
        * Returns `{ shortTermTax, longTermTax, total: shortTermTax + longTermTax }`.
* **Logic:**
    1.  Initialize `taxBreakdown`.
    2.  **Standard Income Tax (MVP - Effective Rate):** `incomeTax = calculateStandardIncomeTax_MVP(taxableIncome, scenario.incomeTaxRates)`. Assign to `taxBreakdown.federalIncomeTax` (or split if scenario indicates how).
    3.  **Standard Capital Gains Tax (MVP - Effective Rates):** `cgTaxObject = calculateStandardCapitalGainsTax_MVP(capitalGainsData, scenario.capitalGainsTaxRates)`. Assign `cgTaxObject.total` to `taxBreakdown.capitalGainsTax`.
    4.  **Property & Consumption Tax (MVP - Simple Estimates):** Calculate using `scenario.propertyTaxRate` and `scenario.consumptionTaxRate`.
    5.  **Applies Special Tax Features:** (Logic as previously detailed: handlers use bifurcated gains if `featureDefinition.requiresGainBifurcation` is true and modify `taxBreakdown`).
    6.  Calculate `taxBreakdown.totalTax`.
* **Output:** The modified `taxBreakdown` object.

### 4.7. `calculateNetFinancialOutcome(grossIncome, totalExpenses, totalTax, additionalScenarioCosts)`

* **Input:** `grossIncome`, `totalExpenses` (from categories), `totalTax`, `additionalScenarioCosts` (from `scenario.annualExpenses.additionalCosts`).
* **Logic:** `netFinancialOutcome = grossIncome - totalExpenses - totalTax - additionalScenarioCosts`.
* **Output:** `netFinancialOutcome: number`.

### 4.8. `calculateQualitativeFitScore(scenario, userAppState, appConfig)`

* **Input:**
    * `scenario: Scenario` (containing `scenario.scenarioSpecificAttributes: ScenarioAttribute[]`)
    * `userAppState: UserAppState` (containing `userAppState.userQualitativeGoals: UserQualitativeGoal[]`)
    * `appConfig: AppConfig` (containing `appConfig.globalQualitativeConcepts` for lookup if needed, though ideally `UserQualitativeGoal` has copied necessary display info).
* **Logic:**
    1.  Initialize `totalWeightedScoreContribution = 0` and `sumOfAbsoluteMaxGoalContributions = 0`.
    2.  Define non-linear numerical mappings for weights and significance:
        * `goalWeightMap = { "Low": 1, "Medium": 3, "High": 7, "Critical": 15 }`
        * `significanceMap = { "None": 0, "Low": 1, "Medium": 2, "High": 3 }`
        * `sentimentMap = { "Positive": 1, "Neutral": 0, "Negative": -1 }`
    3.  Iterate through each `goal` in `userAppState.userQualitativeGoals`:
        a.  `goalWeightNumeric = goalWeightMap[goal.weight] || 0`.
        b.  The maximum positive contribution this goal could make is `goalWeightNumeric * significanceMap["High"]`. Add this to `sumOfAbsoluteMaxGoalContributions`.
        c.  Find the corresponding `scenarioAttribute` in `scenario.scenarioSpecificAttributes` where `scenarioAttribute.conceptId === goal.conceptId`.
        d.  If a matching `scenarioAttribute` is found:
            i.  If `scenarioAttribute.userSentiment === "Neutral"` OR `scenarioAttribute.significanceToUser === "None"`:
                * The contribution for this pairing is `0`.
            ii. Else:
                * `sentimentValue = sentimentMap[scenarioAttribute.userSentiment] || 0`.
                * `significanceValue = significanceMap[scenarioAttribute.significanceToUser] || 0`.
                * `attributeEffect = sentimentValue * significanceValue`.
                * `totalWeightedScoreContribution += attributeEffect * goalWeightNumeric`.
        e.  Else (no matching scenario attribute for a user goal): Contribution is `0`.
    4.  **Normalization (Example to a 0-100 scale):**
        * If `sumOfAbsoluteMaxGoalContributions === 0`, then `qualitativeFitScore = 50` (neutral default if no weighted goals to score against).
        * Else, `qualitativeFitScore = ((totalWeightedScoreContribution + sumOfAbsoluteMaxGoalContributions) / (2 * sumOfAbsoluteMaxGoalContributions)) * 100`. This maps the score range from `[-sumOfAbsoluteMaxGoalContributions, +sumOfAbsoluteMaxGoalContributions]` to `[0, 100]`. Ensure score is capped at 0 and 100.
    5.  **Note:** The User Interface should provide a transparent breakdown of how the qualitative score is composed, potentially showing contributions per goal or category, to allow users to understand its derivation.
* **Output:** `qualitativeFitScore: number` (e.g., on a 0-100 scale).

## Application Data Flow

### 1. Initial Application Load

1.  **Load Static Configuration:** Application loads `AppConfig` (including `templateScenarios`, `globalSpecialTaxFeatures`, and `globalQualitativeConcepts`).
2.  **Load User State:** Checks URL for shared state, then `localStorage`. Initializes empty `UserAppState` if none found.

### 2. Scenario Creation/Modification

1.  **User Initiates New Scenario:**
    * **Option A: Create from Predefined Location Template:**
        1.  UI lists templates from `appConfig.templateScenarios`. Fuzzy search aids selection.
        2.  User selects a template.
        3.  A **deep copy** of the template `Scenario` is made.
        4.  New `Scenario` gets a unique `id`, adjusted `name`, and `templateReferenceId`. `scenarioSpecificAttributes` are copied with their default `userSentiment` and `significanceToUser` from the template.
        5.  Added to `userAppState.scenarios`. User then modifies this self-contained object.
    * **Option B: Create a Custom Scenario "From Scratch":**
        1.  User chooses this option.
        2.  A minimal `Scenario` is created. `incomeTaxRates` and `capitalGainsTaxRates` arrays initialized with one placeholder object for effective rates. Expense/attribute lists are empty.
        3.  UI guides user to fill all details: `displayLocationName`, `locationCountry`, all tax rates, `annualExpenses.categories`, and `scenarioSpecificAttributes` (by selecting concepts from `globalQualitativeConcepts` and then setting their `userSentiment` and `significanceToUser` for this scenario).
        4.  Added to `userAppState.scenarios`.
2.  **User Defines/Modifies `userQualitativeGoals`:**
    * UI allows user to manage their `userQualitativeGoals` list in `UserAppState`.
    * When adding a goal, user selects a concept from `appConfig.globalQualitativeConcepts`. The `conceptId`, default `name`, `category`, `description` are copied. User sets their personal `weight` and can edit the copied `name`/`description`.
3.  **User Modifies Existing Scenario / Selects Special Tax Features:**
    * User edits properties of a `Scenario`. This includes inputting/changing effective rates and customizing `userSentiment`/`significanceToUser` for `ScenarioAttribute`s.
    * `Scenario.residencyStartDate` is user-editable.
    * If user selects an STF (from `appConfig.globalSpecialTaxFeatures`) where `requiresGainBifurcation` is true:
        * UI prompts for/confirms `Scenario.residencyStartDate`.
        * UI guides population of `scenario.scenarioAssetTaxDetails`.
    * If no STF requiring bifurcation is active, `scenarioAssetTaxDetails` may be empty/ignored.

### 3. Calculation Initiation

(As previously defined, `appConfig` is passed to `calculateScenarioProjection`).

### 4. Calculation Engine Processing

(As per revised logic in Section 4).

### 5. Results Storage and Display

(As previously defined).

### 6. Data Persistence

(As previously defined).

### 7. Sharing Current State as a Link

(As previously defined).

### 8. Special Tax Feature Logic

(As previously defined).

## Error Handling Strategy

(Content from previous full output - Section 6)

### 1. Principles of Error Handling

* **Graceful Degradation:** The application should strive to remain functional or recover gracefully even when errors occur.
* **User Feedback:** Users should be informed clearly and concisely about errors, what went wrong, and if possible, how to resolve it. Technical jargon should be avoided.
* **Preventative Measures:** Input validation and data sanitization should be employed to prevent invalid data from entering the calculation pipeline in the first place.
* **Logging (Client-Side):** Errors should be logged to the browser's console for debugging purposes during development and potential reporting in a production environment.
* **Testability:** Error paths should be testable to ensure they behave as expected.

### 2. Types of Errors and Handling Mechanisms

#### 2.1. User Input Validation Errors

* **Description:** User data doesn't conform to expected constraints (e.g., a `Scenario` object is missing required effective tax rates).
* **Detection:** Client-Side Validation, Schema Validation.
* **Handling:** Immediate UI feedback, prevent submission/calculation, user guidance.

#### 2.2. Data Consistency Errors

* **Description:** `UserAppState` contains logically inconsistent data (e.g., `PlannedAssetSale` referencing non-existent `assetId`; a feature requiring gain bifurcation is selected but `scenarioAssetTaxDetails` are missing).
* **Detection:** Pre-Calculation Checks within the Calculation Engine.
* **Handling:** Alert user, pinpoint issue, prevent calculation for affected scenario or display warnings.

#### 2.3. Calculation Logic Errors

* **Description:** Bugs or unexpected edge cases in Calculation Engine.
* **Detection:** Testing, runtime checks, `try-catch` blocks.
* **Handling:** Generic "calculation error" notification, prevent bad data display, log stack trace.

#### 2.4. `localStorage` Errors

* **Description:** Issues saving/loading `UserAppState`.
* **Detection:** `try-catch` blocks, feature detection.
* **Handling:** Inform user, operate with in-memory data, warn of non-persistence. Offer manual export.

### 3. Centralized Error Reporting (Future Consideration)

Integrate a client-side error tracking service.

### 4. Implementation Details

* **React Error Boundaries:** Catch JS errors, display fallback UI.
* **Utility Functions:** Consistent user feedback.
* **Clear Error States:** UI indicators for errors.

## Security Considerations

(Content from previous full output - Section 7)

### 1. Core Security Principles for Client-Side MVP

* **Data Confidentiality (Local):** Treat user data with care.
* **Data Integrity:** Prevent modification by external scripts.
* **Availability:** Ensure application accessibility.
* **Transparency:** Communicate data handling.

### 2. Specific Security Considerations and Mitigations

#### 2.1. Data Storage (`localStorage`)

* **Risk:** Plain text.
* **Mitigation:** No highly sensitive PII. Inform users data is local. Minimal data.

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
* **Mitigation:** Data compression. No highly sensitive PII. Validate/sanitize data loaded from URL. User awareness.

#### 2.7. HTTPS Everywhere

* **Mitigation:** Serve application exclusively over HTTPS.

### 3. Future Security Considerations (Beyond MVP)

If backend/accounts added: Robust AuthN/AuthZ, server-side validation, encryption, API security, audits.

## Deployment Considerations

(Content from previous full output - Section 8)

### 1. Build Process

* **Technology Stack:** TypeScript and React.
* **Build Tool:** **Vite**.
* **Output:** `dist` directory.

### 2. Hosting Environment

* **Static Site Hosting.**
* **Selected Platform: Cloudflare Pages.**
* **Alternatives:** Vercel/Netlify; AWS/GCP (more complex/costly for MVP).

### 3. Deployment Workflow (CI/CD Pipeline)

1.  **Version Control:** Git (e.g., GitHub).
2.  **Branching Strategy:** `main`, `dev`, Feature Branches.
3.  **Automated Deployments with Cloudflare Pages.**

### 4. Domain Management

* DNS provider for custom domain.

## Future Enhancements

(Content from previous full output - Section 9, with "Improved Template Scenarios" adaptation)

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

* **User Accounts & Cloud Storage.**
* **Improved Template Scenarios:** Expand `templateScenarios` library in `AppConfig`, regular updates.
* **Import/Export Functionality.**
* **Interactive Visualizations.**
* **"What-If" Analysis Tools.**
* **Guided Onboarding & Tooltips.**

### 4. Deeper Qualitative Analysis

* **User-Defined Custom Qualitative Concepts:** Allow users to define `GlobalQualitativeConcept`-like entries if the master list is insufficient (V2 feature, would require careful ID management).
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
