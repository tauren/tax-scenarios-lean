# Tax Scenarios Analyzer MVP Product Requirements Document (PRD)

**Version:** 1.0 (Lean MVP Focus)
**Date:** May 29, 2025
**Author:** John (PM Agent) & Vibe CEO (User)

## Document Purpose and Management

This Product Requirements Document (PRD) outlines the goals, features, and requirements for the **lean Minimum Viable Product (MVP)** of the Tax Scenarios Analyzer. The primary focus of this MVP is on providing **capital gains tax estimations** and qualitative comparisons. It is intended to be a guiding document for development. As this is a personal project driven by the User/Developer, this PRD will be treated as a living document. Updates, revisions, and communication regarding changes will be managed through direct review and iterative refinement of the document by the User/Developer.

## Goal, Objective and Context

The **primary goal** of the Tax Scenarios Analyzer MVP is to provide individuals with a general yet insightful tool to compare the financial and qualitative impacts of changing their tax residency, with a **core focus on estimating the financial impact of capital gains**. The application will empower users to make more informed initial decisions about tax residency planning.

**Key Objectives for the Lean MVP:**

1.  **Scenario Comparison:** Enable users to define a "Baseline Scenario" and compare it against multiple "Comparison Scenarios" by specifying alternative tax residency locations.
2.  **Capital Gains Focused Financial Projections:** Provide approximate year-by-year financial projections, including gross income figures (as input by the user for overall financial context; income tax on these sources is not calculated by the core engine for MVP), living expenses, planned asset sales, and **estimated capital gains tax burden**. The overall net financial outcome will reflect these components.
3.  **Qualitative Assessment:** Integrate qualitative factors by allowing users to define and weigh personal goals, and assess each scenario's "lifestyle fit" based on relevant location attributes.
4.  **Intuitive Interface:** Present a clear, intuitive comparison dashboard highlighting key capital gains tax implications, other financial outcomes, and qualitative metrics, with options for detailed drill-down views.
5.  **Simplified Data Management:** Offer robust client-side persistence for a **single "Active Plan"** via `localStorage` and a feature to share this Active Plan's data via URL encoding.
6.  **Clear Scope & Limitations:** Operate as a simplified estimation tool, explicitly outlining its limitations regarding the complexity of tax laws (especially that income, rental, property, and consumption taxes are *not* calculated by the core engine for MVP, only capital gains tax) and the non-provision of professional advice.

**Context:**

The Tax Scenarios Analyzer MVP will be a client-side web application. It is designed for individuals exploring tax residency changes who need a tool to gain a general understanding of potential financial benefits, particularly from a capital gains perspective, and to assess qualitative lifestyle fits before seeking professional advice. User-inputted gross income figures (other than capital gains) are used for calculating overall net financial outcome but are not subject to tax calculation by the MVP engine.

**MVP Success Metrics:**

The success of the Tax Scenarios Analyzer MVP will be evaluated based on the following key metrics:

1.  **Task Completion:** Users can successfully create a baseline scenario and at least one comparison scenario, inputting representative asset, sales, expense, gross income (for context), and qualitative data relevant to capital gains focused planning.
2.  **Insight Generation (Capital Gains Focus):** After using the tool, users can articulate the key estimated capital gains tax differences and resulting net financial outcomes between their compared scenarios.
3.  **User-Perceived Utility (Qualitative):** Initial users (primarily the developer in this personal project context) report the tool as understandable and helpful in conceptualizing capital gains tax and qualitative impacts of residency changes.

**Further Context Notes for MVP:**

* **Problem Scope:** While the need for clarity in tax residency planning is significant for affected individuals, detailed quantification of the total addressable market or the monetary impact of the problem solved is not a primary objective for this personal MVP.
* **Competitive Landscape:** A formal competitive analysis against existing financial planning or tax tools is considered out of scope for this MVP, as the project's initial focus is on building a specific set of functionalities envisioned by the developer. The unique value is perceived in its specific combination of focused capital gains tax estimations and integrated qualitative assessment.
* **Timeframe for Market Goals:** As a personal project, specific timeframes for achieving broader market or user adoption goals are not defined for this MVP phase.

**MVP Validation Approach & Criteria for Moving Beyond MVP**

The validation of this MVP will primarily involve:
* Confirmation that all defined MVP User Stories meet their Acceptance Criteria through developer testing.
* Evaluation against the "MVP Success Metrics" (Task Completion, Insight Generation, User-Perceived Utility) by the primary developer and potentially a small group of initial volunteer testers.

Consideration for moving beyond the MVP to develop features listed in the "Post-MVP Backlog / Future Enhancements" section will be based on the following criteria:
1.  All defined MVP User Stories are fully implemented, tested, and verifiably meet their Acceptance Criteria.
2.  The MVP demonstrably achieves its defined "MVP Success Metrics" through initial testing and evaluation.
3.  There is an identified interest in, or clear potential for, expanded use cases for the application, or a discernible market interest emerges that would justify investment in a more extensive feature set, particularly those deferred from the initial comprehensive vision (e.g., income tax calculations, advanced plan management).

## Functional Requirements (Lean MVP)

The Tax Scenarios Analyzer Lean MVP must provide the following functionalities:

1.  **Scenario Management & Setup (Active Plan Focus):**
    * The system must provide access to a list of pre-configured example scenarios (e.g., via clickable descriptions/links on the application page) that load using the shareable URL mechanism, allowing users to explore the tool's capabilities with sample data focused on capital gains and qualitative comparisons.
    * Users must be able to create a "Baseline Scenario" within their Active Plan.
    * Users must be able to add multiple "Comparison Scenarios" to their Active Plan. When creating a new scenario (Baseline or Comparison), users must have the option to:
        * Start by selecting and deep-copying a `templateScenario` (which will be focused on capital gains setups and qualitative defaults for MVP).
        * Create a "custom" scenario, defining its location components. For such custom scenarios, users will input their own effective capital gains tax rates (other tax rates like income, property, consumption are not actively used by the MVP calculation engine).
    * The system must support a global list of assets (`initialAssets`) available to all scenarios within the Active Plan.
    * Users must be able to override template-derived data or customize data for custom scenarios (e.g., planned asset sales, expenses, qualitative attribute perspectives).
    * The Active Plan must have an associated name, which the user can define or modify.

2.  **Capital Gains Focused Financial Data Input & Projections:**
    * The system must perform year-based financial modeling over a user-defined projection period.
    * Users must be able to input gross income figures for various sources per year (this data is for financial overview and net financial outcome calculation; the MVP engine will *not* calculate income tax on these sources).
    * Users must be able to input detailed `annualExpenses` (categorized and additional costs).
    * Users must be able to manage their global list of `initialAssets` (name, quantity, cost basis, acquisition date, optional type/FMV).
    * Users must be able to define flexible "Planned Asset Sales" per year within each scenario (asset, quantity, sale price) to enable capital gains calculations.
        * During input of a planned asset sale, the system must provide an immediate *estimated* capital gain/loss preview for that transaction.
    * For each scenario, users must be able to input their effective Short-Term and Long-Term **Capital Gains Tax rates**. (The `Scenario` model in the MVP architecture will have `capitalGainsTaxRates: CapitalGainsTaxRate[]` which for MVP will hold these user-provided effective rates).
    * The system must apply selected `SpecialTaxFeatures` (primarily those affecting capital gains or providing other essential MVP logic), using user inputs for these features.
    * The system's core calculation engine for MVP must **calculate estimated Capital Gains Tax** based on planned sales, holding periods, and the scenario-specific effective capital gains tax rates provided by the user.
    * The system must be able to display descriptive notes and eligibility hints for `SpecialTaxFeatures`.

3.  **Qualitative Comparison (Retained in Full):**
    * Users must be able to define and assign weights to their personal `UserQualitativeGoals` (based on `GlobalQualitativeConcepts`).
    * The system must present `ScenarioAttributes` (linked to `GlobalQualitativeConcepts`), potentially pre-populated from `templateScenarios`, with default user perspectives.
    * Users must be able to customize their `userSentiment` and `significanceToUser` for `ScenarioAttributes` in each scenario.
    * Users must be able to add new attributes to a scenario (by selecting from `GlobalQualitativeConcepts`) and define their perspective.
    * The system must calculate and display a "Qualitative Fit Score" for each scenario.

4.  **Intuitive Comparison Dashboard & Views (CGT Focused):**
    * Users must be able to select a subset of scenarios for side-by-side comparison.
    * The system must display an "Overview Table" showing key financial metrics (focused on capital gains tax, overall net outcome based on gross income/expenses/CGT) and qualitative metrics for selected scenarios. The table must be sortable.
    * The system must provide "Scenario Summary Cards" with a quick overview (including CGT impact and Qualitative Fit Score).
    * The system must offer a "Detailed View" for in-depth analysis of a scenario, showing year-by-year financial projections (emphasizing capital gains, with other financials for context) and detailed qualitative assessment.

5.  **Data Input, Feedback, & Simplified Overwrite Safety:**
    * Input interfaces must support clear labeling of fields, logical grouping of related inputs, and contextual validation error feedback.
    * The system must provide clear feedback for core data operations (auto-saving active plan, generating share URL, loading URL).
    * When loading data from an external shared URL (including example links), if the current Active Plan contains significant user-entered data (is not new/empty/default), the system must prompt the user to [Load New & Discard Current Work] or [Cancel Load].

6.  **Simplified Data Persistence & Sharing (Single Active Plan):**
    * The system must continuously auto-save the *current Active Plan* (including its name, scenarios, assets, goals) to `localStorage`.
    * Users must be able to generate an external shareable URL for their current Active Plan.
    * The system must be able to load an Active Plan from an external shared URL.
    * (Note: Management of multiple named, explicitly saved plan slots with locking, cloning, etc., is deferred to post-MVP).

## Non-Functional Requirements (Lean MVP)

1.  **Performance:**
    * **Responsiveness:** The application UI should remain responsive during user interactions, with minimal lag, especially during data input and scenario navigation.
    * **Calculation Time:** Scenario calculations (primarily CGT and qualitative score for MVP) should complete within a reasonable timeframe (e.g., a few seconds for a moderately complex set of scenarios as defined by data volume targets). The system should provide feedback if calculations take more than 1-2 seconds.
    * **Load Time:** Initial application load time should be optimized.
2.  **Usability:**
    * **Learnability:** New users should understand the basic workflow with minimal guidance, supported by example scenarios and clear UI (e.g., tooltips).
    * **Efficiency:** Users should efficiently manage scenarios, input data for CGT planning, and compare results.
    * **Clarity:** Information (CGT estimations, qualitative scores) must be presented clearly. Disclaimers about the estimation nature are crucial.
    * **Error Prevention & Recovery:** Guide users to prevent errors; error messages must be clear.
3.  **Reliability & Availability:**
    * **Client-Side Stability:** Stable operation in supported web browsers.
    * **Data Persistence:** Robust `localStorage` auto-save for the single Active Plan. Graceful handling of `localStorage` errors.
4.  **Security (Client-Side Focus):**
    * Implement measures against common client-side vulnerabilities (e.g., XSS).
    * Secure handling of URL parameter data.
    * Basic client-side security testing during development.
5.  **Accuracy & Data Integrity (for CGT Estimation Tool):**
    * **Calculation Consistency:** Consistent CGT results for given inputs and scenario-defined effective rates.
    * **Transparency of Estimation:** Prominent disclaimers about estimation-only nature, non-provision of professional advice, reliance on user input accuracy, and potentially outdated default data in templates.
6.  **Maintainability (Developer Focus):**
    * Well-organized, commented codebase, following architectural principles.
7.  **Compatibility:** Latest stable versions of major modern web browsers.
8.  **Data Volume & URL Sharing Constraints (Active Plan - Indicative MVP Targets):**
    * The system should aim to handle an Active Plan with up to approximately 20 scenarios, ~20 assets, ~20 years projection for URL sharing functionality. UI for comparison dashboard may display a smaller subset (e.g., 5-7 scenarios) at a time.
    * *Note: These are initial targets; actual limits depend on URL length constraints and client-side performance.*
    * **Scalability:** Scalability for significantly larger data or features beyond this MVP scope (like income tax calculations or numerous saved plans) is a post-MVP consideration requiring architectural changes.
9.  **Accessibility (A11y):** Strive for a good level of accessibility, supported by chosen UI component libraries.
10. **Data Quality & Validation:** Enforce basic data validation for user inputs (types, required fields, reasonable ranges).
11. **Data Retention (Active Plan):** `localStorage` based, subject to browser limits and user actions.
12. **User Support:** Formal support channels are out of scope for this personal MVP.
13. **Development Environment:** Standard modern web development environment (Node.js, Vite).
14. **Monitoring:** External monitoring services are out of scope for MVP.

## User Interaction and Design Goals

* **Overall Vision & Desired User Experience:** Modern, minimalist, intuitive, empowering exploration for capital gains tax planning and qualitative comparison.
* **Key Interaction Paradigms:** Form-based input, item duplication for efficiency in lists.
* **Core Screens/Views (Conceptual - Lean MVP):**
    * Active Plan & Scenario Setup/Editor Area (focused on CGT parameters, expenses, income for context).
    * Comparison Dashboard (Overview Table, Scenario Summary Cards – displaying CGT results, overall financials, qualitative scores).
    * Detailed Scenario View (financials showing CGT impact, qualitative details).
* **Accessibility Aspirations:** Good baseline accessibility.
* **Branding Considerations (High-Level):** Clean, professional, no specific branding for MVP.
* **Target Devices/Platforms:** Web desktop primary, responsive and usable on mobile.

## Technical Assumptions

1.  **Core Application Type:** Client-side only Single-Page Application (SPA). No backend for MVP.
2.  **Primary Technology Stack (Frontend):** TypeScript, React, Vite, Tailwind CSS, Zustand, ShadCN UI, LZ-String. (Developer preference).
3.  **Data Management:** Static JSON for `AppConfig` (leaner `templateScenarios` focused on CGT for MVP). Single Active Plan in `localStorage`.
4.  **Calculations:** Client-side, focused on Capital Gains Tax (using user-provided effective rates) and Qualitative Score. STFs for MVP will primarily affect CGT.
5.  **Deployment:** Static web hosting (Cloudflare Pages).
6.  **Repository & Service Architecture:** Client-Side Monolith (SPA) in a Single Repository. Rationale: Simplicity for MVP.
7.  **Technical Debt:** Strive for clean code, prioritize MVP functionality, document shortcuts for post-MVP.

## Epic Overview (Lean MVP)

This section details the Epics and their constituent User Stories for the Lean MVP.

**Epic 1: Foundational Setup, Core Data Input & Basic Plan Persistence/Loading**
* **Goal:** Establish the basic application structure, allow users to name their "Active Plan," define global assets, and input core data for a "Baseline Scenario" (gross income for context, expenses, effective CGT rates). Ensure the "Active Plan" is automatically saved to and reloaded from `localStorage`. Enable loading of externally defined plans (focused on CGT setups) via the shareable URL mechanism for initial testing and example scenario access, with a simplified overwrite safety prompt.

    * **Story 1.0: Populate Initial Lean MVP Static Configuration Data**
        * **User Story:** "As the project developer, I need a *small, lean initial set* of static `AppConfig` data – including a few CGT-focused `templateScenarios`, foundational `globalQualitativeConcepts`, and 1-2 relevant `globalSpecialTaxFeatures` – to be defined and integrated, so that early development and testing of core MVP functionality can proceed."
        * **Acceptance Criteria (ACs):**
            1.  1-2 diverse locales identified for initial CGT-focused `templateScenarios`.
            2.  `templateScenario` JSON objects created for these, including: location components, MVP-appropriate effective CGT rates (ST/LT), representative expenses, and a few `ScenarioAttribute`s.
            3.  An initial list of ~10 `globalQualitativeConcepts` defined.
            4.  1-2 relevant `globalSpecialTaxFeatures` (e.g., one that `requiresGainBifurcation` for CGT) defined.
            5.  Strategy to use AI assistance for prompt generation for this *initial lean data* acknowledged.
            6.  Initial static data integrated into `AppConfig` and loadable.
            7.  Data structure aligns with the *lean MVP architecture* (to be created by Fred).

    * **Story 1.1: Initialize Basic Application Shell & "Active Plan" Naming**
        * **User Story:** "As a user, I want a basic application shell to load in my browser, with a clear way to see and change the name of my current "Active Plan," so I can identify my work session."
        * **Acceptance Criteria (ACs):** (Focus on shell, plan name input/display; persistence of name with Active Plan save via Story 1.4).
            1.  Application loads a basic UI shell (header, main content, footer).
            2.  UI displays an editable name for the "Active Plan" (defaulting if new).
            3.  User can change the Active Plan name; change reflected in app state.
            4.  Shell is foundationally responsive.

    * **Story 1.2: Implement Global Asset Management**
        * **User Story:** "As a user, I want to define and manage a global list of my financial assets (name, quantity, cost basis, acquisition date, optional type/FMV) within my Active Plan, so that this core asset information can be used consistently across all scenarios I create."
        * **Acceptance Criteria (ACs):** (As previously finalized, reflecting optional type/FMV and no global residency-specific dates).
            1.  UI section for managing global assets.
            2.  Users can add assets with: Name (req), Quantity (req), Cost Basis/Unit (req), Acq Date (req), Asset Type (opt), FMV/Unit (opt).
            3.  Support for sequential add and duplicate asset for editing.
            4.  Assets displayed in a list/table.
            5.  Assets are editable and deletable (with confirmation).
            6.  Asset data stored in Active Plan state.
            7.  UI is responsive.

    * **Story 1.3: Create Baseline Scenario & Input Core Data (CGT Focus)**
        * **User Story:** "As a user, I want to establish my "Baseline Scenario" within my Active Plan (from a CGT-focused template or custom), define its location, input gross income (for context), annual expenses, and my effective Capital Gains Tax rates for this baseline, so I have a foundational scenario."
        * **Acceptance Criteria (ACs):**
            1.  User can create a Baseline Scenario.
            2.  Creation options: Start from a `templateScenario` (deep copy including its effective CGT rates) or Create Custom.
            3.  For Custom: User inputs `displayLocationName`, `locationCountry`, `locationState` (opt), `locationCity` (opt). Scenario starts with empty/default structures for expenses and requires user input for effective CGT rates.
            4.  User can input/manage `IncomeSource` objects (Name, Type, Annual Amount, Start/End Year) for gross income context. (No `IncomeSource.locationId` UI for MVP. No income tax calculation by engine).
            5.  User can input/manage `AnnualExpense` categories (Name, Amount) and `additionalCosts`. (Templates may pre-fill expenses).
            6.  **For this Baseline Scenario, user can input their effective Short-Term and Long-Term Capital Gains Tax rates.**
            7.  Data stored in Active Plan. UI is responsive.
            8.  (Note: For "custom" baseline, input of its specific tax rates for other types like property/consumption is deferred. For template-derived, those rates are copied but unused by MVP engine).

    * **Story 1.4: Implement `localStorage` Persistence for the Single Active Plan**
        * **User Story:** "As a user, I want my entire "Active Plan"... automatically saved to `localStorage`... and reloaded..."
        * **Acceptance Criteria (ACs):** (As previously finalized, focusing on auto-save/reload of the single Active Plan to/from a primary `localStorage` slot).
            1.  Modifications to Active Plan trigger auto-save to `localStorage`.
            2.  Auto-save is efficient and minimizes data loss.
            3.  On launch/refresh, app attempts to load Active Plan from `localStorage`.
            4.  If found, Active Plan is loaded, user resumes session.
            5.  If not found, app starts with a new, empty Active Plan.
            6.  Graceful error handling for `localStorage` write errors (user informed).
            7.  Graceful error handling for `localStorage` read errors (start fresh, user informed).
            8.  Persisted data is serialized `UserAppState` and Active Plan name.

    * **Story 1.5: Implement Loading & Generation of Plan Data via Shareable URL Strings (Active Plan)**
        * **User Stories:**
            * *(Loading)* "As a user, when I open the application with an external shared URL containing plan data, if my current Active Plan contains significant data, I want to be prompted to [Load New & Discard Current Work] or [Cancel], and then if I proceed, have the URL data loaded as my new Active Plan, so I can explore shared data."
            * *(Generating - Dev/Testing)* "As a developer... I want a mechanism... to generate a compressed, URL-encoded string representing the current Active Plan..."
        * **Acceptance Criteria (ACs):**
            * **A. Loading Plan Data from an External URL:**
                1. App checks for URL query parameter with plan data.
                2. System attempts to decode, decompress (LZ-String), and deserialize string into "Active Plan" structure.
                3. If URL data parsed successfully:
                    a. If current Active Plan has significant data (not new/empty), prompt user: "[Load New & Discard Current Work] or [Cancel]."
                    b. If user proceeds (or no prompt needed), URL data becomes the new Active Plan.
                    c. New Active Plan named (e.g., "Loaded from Link" or from data, user can rename later).
                4. If URL data invalid: Handle error gracefully, inform user, load local or start fresh.
                5. Successful load updates UI.
            * **B. Generating a Shareable URL String (Developer-Focused):**
                6. Developer-accessible mechanism to trigger shareable URL string generation.
                7. System takes current Active Plan, serializes, compresses, URL-encodes.
                8. Resulting string made available to developer.
                9. Compression library integrated and functional.

    * **Story 1.6: Display Example Scenario Links (CGT Focused)**
        * **User Story:** "As a user, I want to see a list of links to pre-configured example scenarios (focused on CGT planning)... so I can easily load and explore them..."
        * **Acceptance Criteria (ACs):** (As previously finalized, links use URLs from CGT-focused `templateScenarios`, loading mechanism from Story 1.5).
            1. UI section displays links to example scenarios.
            2. List includes >=1 example with descriptive title (CGT-focused).
            3. Examples are clickable.
            4. Clickable elements associated with pre-generated shareable URL string.
            5. Clicking an example triggers Story 1.5 loading mechanism (prompting if current work exists).
            6. Example list/URLs are static data in app config.
            7. UI is responsive.

**Epic 2: Scenario Creation & Capital Gains Tax Comparison**
* **Goal:** Enable users to create multiple "Comparison Scenarios" (from CGT-focused templates or custom) within their Active Plan, input their effective Capital Gains Tax rates for these, and see a side-by-side comparison of estimated CGT and resulting net financial outcomes.

    * **Story 2.1: Create Comparison Scenario (from Template or Custom - CGT Focus)**
        * **User Story:** "As a user, I want to add a "Comparison Scenario" to my Active Plan, either by selecting a CGT-focused `templateScenario` or by creating a 'custom' scenario where I define the location and my effective Capital Gains Tax rates, so I can model different situations."
        * **Acceptance Criteria (ACs):**
            1. User can create a new Comparison Scenario in Active Plan.
            2. Options: Start from `templateScenario` (deep copy, gets its CGT rates) or Create Custom.
            3. Custom Scenario: User inputs location components; starts with empty/default structures for income, expenses, and requires user input for effective CGT rates.
            4. New scenario added to Active Plan. User can give it a custom display name.
            5. UI is responsive.
            6. (Note: Detailed input of income/expenses is Story 2.3. Input of CGT rates for custom scenario is part of this story or 2.3).

    * **Story 2.2: Create Comparison Scenario by Copying an Existing Scenario**
        * **User Story:** "As a user, I want to create a new "Comparison Scenario" by duplicating an existing scenario... so I can quickly create variations..."
        * **Acceptance Criteria (ACs):** (As previously finalized, ensuring full self-contained scenario including CGT rates is copied).
            1. User can select any existing scenario in Active Plan to duplicate.
            2. UI action to initiate copy.
            3. Deep copy performed (location, tax parameters including CGT rates, income, expenses, etc.).
            4. New scenario gets unique ID, user prompted for display name (defaults to "Copy of...").
            5. Copied scenario added to Active Plan.
            6. User can edit the copy (Story 2.3). UI responsive.

    * **Story 2.3: Edit Core Data of Comparison Scenarios (CGT Focus)**
        * **User Story:** "As a user, I want to edit the core data of my Comparison Scenarios (name, location, gross income, expenses, effective CGT rates, planned asset sales from Epic 3)..."
        * **Acceptance Criteria (ACs):**
            1. User can select and edit any Comparison Scenario.
            2. Modifiable fields: `displayLocationName`, location components, `projectionPeriodYears`, `residencyStartDate` (optional).
            3. If location name changes for a template-derived scenario, its copied tax rates are *not* auto-reset.
            4. User can add/edit/delete `IncomeSource` objects (for gross income context).
            5. User can add/edit/delete `AnnualExpense` categories and `additionalCosts`.
            6. **User can input/edit effective Short-Term and Long-Term Capital Gains Tax rates for this scenario.**
            7. Changes saved to specific scenario in Active Plan. UI responsive.
            8. (Note: UI for editing detailed tax rate arrays for *other tax types* is deferred).

    * **Story 2.4: Implement Capital Gains Tax Calculation Engine**
        * **User Story:** "As a user, I want the system to calculate estimated Capital Gains Tax for each scenario, using my planned asset sales, asset holding periods, and the effective Short-Term/Long-Term Capital Gains Tax rates I've defined for that scenario, so I can see the primary CGT impact."
        * **Acceptance Criteria (ACs):**
            1. A core calculation engine function processes a `Scenario` and `UserAppState`.
            2. For each projection year: Calculates gross earned/rental income (for context only, not taxed by this engine). Calculates ST/LT capital gains from `PlannedAssetSales` (using `Asset.acquisitionDate`).
            3. Applies `Scenario.capitalGainsTaxRates` (user-provided effective ST/LT rates) to categorized gains to calculate CGT for the year. **No other taxes (income, rental, property, consumption) are calculated by this core engine for MVP.**
            4. Calculated CGT for each year available in `ScenarioYearlyProjection.taxBreakdown.capitalGainsTax`. Total tax for MVP in this structure will primarily be this CGT.
            5. Engine structured for future STF integration (Story 3.4).
            6. Basic error handling for missing CGT rates in scenario.

    * **Story 2.5: Display "Scenario Summary Cards" (CGT & Financial Outcome)**
        * **User Story:** "As a user, I want to see a "Scenario Summary Card" for each scenario... displaying its name, location, total estimated Capital Gains Tax, and overall net financial outcome (based on gross income, expenses, and CGT)..."
        * **Acceptance Criteria (ACs):** (As previously finalized, but financial outcomes are now CGT-centric).
            1. One card per scenario in Active Plan (if calculated).
            2. Card displays: Scenario `displayLocationName`, primary location context.
            3. Card displays key aggregated financial outcomes from `ScenarioResults`: Total Net Financial Outcome, Total Estimated Capital Gains Tax.
            4. Clear, scannable format. Visually distinct.
            5. Card is interactive (leads to Detailed View - future story).
            6. Card has control to select/deselect for Overview Comparison Table.
            7. Responsive layout. Data updates dynamically.

    * **Story 2.6: Implement "Overview Comparison Table" (CGT & Financial Outcome)**
        * **User Story:** "As a user, I want to select scenarios for an "Overview Comparison Table" showing key metrics like gross income, expenses, total estimated Capital Gains Tax, and net financial outcome side-by-side, sortable by these metrics..."
        * **Acceptance Criteria (ACs):** (As previously finalized, but financial metrics are CGT-centric).
            1. Overview Comparison Table UI implemented.
            2. Displays data only for user-selected scenarios.
            3. Each scenario is a column with `displayLocationName` header.
            4. Rows are key financial metrics aggregated over projection period (Total Gross Income, Total Expenses, Total Estimated Capital Gains Tax, Total Net Financial Outcome).
            5. Table sortable by these key financial metric columns.
            6. Data updates dynamically.
            7. Clear, readable, responsive format (handles multiple scenarios).
            8. (Note: Qualitative metrics integration is Epic 4).

**Epic 3: Advanced Capital Gains Modeling & Special Tax Features (CGT Focus)**
* **Goal:** Enhance capital gains tax projections by incorporating detailed asset sales planning (with preview) and the application of `SpecialTaxFeatures` relevant to capital gains or overall financial outcomes for MVP.
    * **Story 3.1: Implement Detailed "Planned Asset Sales" Management per Scenario**
        * **User Story:** "As a user, I want to define a detailed plan of asset sales (specifying which of my global assets to sell, the quantity, and the expected sale price) for each year within each of my scenarios, independently from other scenarios, and receive an immediate estimated capital gain/loss preview for each individual sale transaction as I input it, so I can model different liquidation strategies and understand their initial tax implications effectively."
        * **Acceptance Criteria (ACs):**
            1.  Within the editing interface for any given `Scenario` (Baseline or Comparison), a dedicated section allows users to manage "Planned Asset Sales" specific to that scenario.
            2.  Users can add a new planned asset sale entry. The input form for this must allow the user to: Select which of their globally defined `Assets` is being sold (e.g., via a dropdown list populated with names of assets from `UserAppState.initialAssets`); Specify the `year` of the planned sale (must be within the `Scenario`'s `projectionPeriodYears`); Input the `quantity` of the asset to be sold in that transaction (numeric input, validated against available quantity of the selected global asset); Input the expected `salePricePerUnit` for that transaction (numeric input).
            3.  As the user inputs or modifies the details for an individual planned asset sale (`assetId`, `quantity`, `salePricePerUnit`, `year`):
                a.  The system must immediately calculate and display an *estimated* capital gain or loss preview specifically for *that single transaction*.
                b.  This preview calculation must use the selected `Asset`'s `costBasisPerUnit` and `acquisitionDate`.
                c.  The preview must attempt to differentiate between estimated short-term and long-term capital gains based on the holding period (calculated from `Asset.acquisitionDate` to the sale year).
                d.  If the current `Scenario` has an active `SpecialTaxFeature` that `requiresGainBifurcation`, and if `ScenarioAssetTaxDetail` (containing `residencyAcquisitionDate` and `valueAtResidencyAcquisitionDatePerUnit`) has been entered for the selected asset within this scenario (as per Story 3.3), the preview should endeavor to show an estimated gain breakdown (e.g., pre-residency vs. post-residency portions).
                e.  If details for gain bifurcation (per AC 3.d) are required by an active STF but not yet entered for the asset in the scenario, the preview should clearly indicate that the displayed gain is a simple calculation and that full accuracy under the STF requires further asset-specific date/value inputs for that scenario.
                f.  All previews must be explicitly labeled as "Estimated gain/loss for this transaction only" and state that it may not reflect the final overall tax liability for the scenario.
            4.  Users can view a list of all `PlannedAssetSale` entries defined for the current scenario, ideally grouped or sortable by year, showing key details (e.g., asset name, year, quantity, sale price, estimated transaction gain/loss).
            5.  Users can select any existing planned asset sale entry to edit its details.
            6.  Users can delete a planned asset sale entry from the scenario, with a confirmation prompt to prevent accidental deletion.
            7.  All defined `PlannedAssetSale` objects are stored as part of their specific `Scenario` object within the "Active Plan" in the application's internal state.
            8.  The UI for managing planned asset sales, including the preview display, must be responsive and user-friendly.
            9.  Validation must be in place to prevent a user from planning to sell more of an asset (in total across all planned sales for that asset within a scenario, or even across all years) than the globally defined `Asset.quantity`.

    * **Story 3.2: Display Descriptive Notes & Eligibility Hints for Special Tax Features**
        * **User Story:** "As a user, when I am considering or selecting a `special_tax_feature` for one of my scenarios, I want to see its official name, a clear description, short summaries, and any available non-binding "eligibility hints" (all sourced from `appConfig.globalSpecialTaxFeatures`), so I can better understand what each feature entails and determine if it might be relevant to my situation before applying it."
        * **Acceptance Criteria (ACs):**
            1.  Within the editing interface for any given `Scenario`, there must be a dedicated UI section or mechanism that allows users to browse and select available `SpecialTaxFeatures`.
            2.  The list of available `SpecialTaxFeatures` presented to the user is sourced from `appConfig.globalSpecialTaxFeatures`.
            3.  For each `SpecialTaxFeature` visible in the selection UI (or when a user interacts to get more details, e.g., hover, click): Its official `name` must be clearly displayed; Its `description` must be displayed or easily accessible; Any additional short summaries or non-binding "eligibility hints" (if defined within the `SpecialTaxFeature` object in `AppConfig`) must also be displayed to the user.
            4.  Users must be able to select one or more `SpecialTaxFeatures` from the available list to apply them to the current `Scenario`.
            5.  When a `SpecialTaxFeature` is selected: Its `featureId` is added to the `Scenario.selectedSpecialTaxFeatures` array; If the `SpecialTaxFeature` definition in `appConfig.globalSpecialTaxFeatures` specifies `inputs` (e.g., for dates, amounts, specific choices related to that feature), the UI must present appropriate input fields for the user to provide these values *for that instance of the feature within the current scenario*. These user-provided values are stored in the `inputs` object for that selected feature in `Scenario.selectedSpecialTaxFeatures`.
            6.  Users must be able to deselect or remove a previously applied `SpecialTaxFeature` from the current `Scenario`. This action also removes its associated `featureId` and user-provided `inputs` from `Scenario.selectedSpecialTaxFeatures`.
            7.  The information about each `SpecialTaxFeature` (name, description, hints, required inputs) must be presented in a clear, understandable, and easily accessible manner (e.g., using tooltips for hints, clearly labeled input fields within an expandable section for the feature).
            8.  The UI for Browse, selecting, providing inputs for, and deselecting `SpecialTaxFeatures` must be responsive and user-friendly.
            9.  *(Note: The specific UI flow and data input for `ScenarioAssetTaxDetail` when a feature `requiresGainBifurcation` is true, is explicitly handled in Story 3.3. This current story ensures the display of general STF information and the capture of their direct `inputs` as defined in `appConfig.globalSpecialTaxFeatures.inputs`.)*

    * **Story 3.3: Input Scenario-Specific Asset Tax Details for Gain Bifurcation**
        * **User Story:** "As a user, after I have selected a `special_tax_feature` for my scenario that `requiresGainBifurcation` (as defined in its global configuration), I want to be clearly prompted and able to input (or confirm/edit) the `residencyAcquisitionDate` and `valueAtResidencyAcquisitionDatePerUnit` for each of my relevant global assets *specifically for that scenario*, so that capital gains can be accurately bifurcated for tax calculations under that feature."
        * **Acceptance Criteria (ACs):**
            1.  If a user selects or has active one or more `SpecialTaxFeature`(s) for a given `Scenario`, and any of those selected features have their `requiresGainBifurcation` property set to `true` in their `appConfig.globalSpecialTaxFeatures` definition:
                a.  The system must provide a clear and accessible UI section or prompt within that `Scenario`'s editing interface for managing `ScenarioAssetTaxDetail` entries.
                b.  This UI should clearly indicate that these details are necessary for accurately calculating capital gains under the selected special tax feature(s) for that scenario.
            2.  Within this UI section for the current scenario, for each `Asset` listed in the global `UserAppState.initialAssets`, the user must be able to input or edit: A scenario-specific `residencyAcquisitionDate` (date input, YYYY-MM-DD); A scenario-specific `valueAtResidencyAcquisitionDatePerUnit` (numeric input).
            3.  The UI may suggest the `Scenario.residencyStartDate` as a default for the `residencyAcquisitionDate` for assets, but the user must be able to override this on a per-asset, per-scenario basis.
            4.  If `ScenarioAssetTaxDetail` values for an asset have been previously entered for this scenario, those existing values must be displayed and be editable.
            5.  The UI should clearly associate each `residencyAcquisitionDate` and `valueAtResidencyAcquisitionDatePerUnit` input with the specific global asset (e.g., by displaying the asset's name alongside the inputs).
            6.  The system allows the user to provide these details for any subset of their global assets; it is not mandatory to fill these for every asset if the user deems them irrelevant for certain assets under the active STF(s) for that scenario. (Note: The calculation engine, as per `architecture-v2.md` Section 4.4.f, will handle cases where these details are missing for a sold asset when bifurcation is active).
            7.  The entered data for each asset (the `assetId` from the global asset, the scenario-specific `residencyAcquisitionDate`, and `valueAtResidencyAcquisitionDatePerUnit`) is stored as an object within the `Scenario.scenarioAssetTaxDetails` array for the current scenario.
            8.  The UI for managing these scenario-specific asset tax details must be responsive and user-friendly.

    * **Story 3.4: Integrate and Apply Selected `SpecialTaxFeatures` in Calculations**
        * **User Story:** "As a user, after I have selected applicable `special_tax_features` for a scenario and provided any necessary inputs (including scenario-specific asset tax details if required by Story 3.3), I want the tax calculation engine to apply the specific logic of these features to accurately adjust my estimated tax liability (e.g., income tax, capital gains tax) for that scenario, reflecting the benefits or changes introduced by those features."
        * **Acceptance Criteria (ACs):**
            1.  The main tax calculation engine (from Story 2.4) is enhanced to process `SpecialTaxFeatures` after the "basic" tax components (income tax, capital gains tax based on scenario effective rates) have been initially calculated for a given year.
            2.  For each year of a scenario's projection, after basic taxes are calculated, the engine iterates through each `selectedFeatureEntry` in the `Scenario.selectedSpecialTaxFeatures` array.
            3.  For each `selectedFeatureEntry`:
                a.  The engine retrieves the full `SpecialTaxFeature` definition (including `id`, `name`, `appliesTo`, `inputs` schema, `requiresGainBifurcation` flag) from `appConfig.globalSpecialTaxFeatures` using the `selectedFeatureEntry.featureId`.
                b.  If a valid `featureDefinition` is found, a corresponding specific JavaScript handler function for that `SpecialTaxFeature` (e.g., `handleAct60Feature`, `handleForeignTaxCreditFeature`) is invoked.
            4.  The invoked `SpecialTaxFeature` handler function must receive all necessary data context to perform its calculations, including: The current year being processed; The `taxBreakdown` object for the current year (which the handler will modify); Relevant income figures for the year (e.g., `taxableIncome`, `rentalIncome`); The detailed `capitalGainsData` for the year (including `preResidencyCapitalGains` and `postResidencyCapitalGains` components, which would have used `ScenarioAssetTaxDetail` data if provided via Story 3.3 and the STF `requiresGainBifurcation`); The user-provided `inputs` for this specific instance of the STF (from `selectedFeatureEntry.inputs`); The parent `Scenario` object (for access to its general properties and self-contained effective tax rates if needed for comparison by the STF); Relevant parts of `AppConfig` if global constants or baseline US federal rates are needed for reference by the STF's logic.
            5.  Each `SpecialTaxFeature` handler function correctly implements its unique tax rule logic. This logic can modify existing tax components in the `taxBreakdown` (e.g., reduce `capitalGainsTax`, set `incomeTax` to zero for certain income types) or add new specific tax lines or credits.
            6.  For MVP, at least one example `SpecialTaxFeature` that `requiresGainBifurcation` (e.g., a simplified version of a rule like Puerto Rico's Act 60 affecting capital gains as described in concept in `architecture-v2.md` Sections 4.4 & 4.6) is fully implemented and demonstrably alters the `capitalGainsTax` in the `taxBreakdown` when selected and configured with `ScenarioAssetTaxDetail` (input via Story 3.3).
            7.  For MVP, at least one example `SpecialTaxFeature` that affects `incomeTax` (e.g., a feature providing a partial exemption or a flat tax rate on certain income types) is implemented and demonstrably alters the `incomeTax` in the `taxBreakdown` when selected and configured with its `inputs`.
            8.  The order of application if multiple `SpecialTaxFeatures` are selected by the user for a single scenario is predefined and consistently followed by the calculation engine for MVP (e.g., processed in the order they appear in `Scenario.selectedSpecialTaxFeatures`, or based on a fixed internal sequence).
            9.  The final `taxBreakdown.totalTax` for the year accurately reflects the sum of all tax components after modifications by all active, selected, and correctly configured `SpecialTaxFeatures`.
            10. The calculation engine and STF handlers include basic error handling for scenarios where an STF cannot be properly applied due to missing or invalid user `inputs` (beyond the specific `ScenarioAssetTaxDetail` handled in Story 3.3 UI prompts). For instance, it might log a warning, the STF has no effect, and the UI (in later display stories) might indicate the STF was not fully applied.

**Epic 4: Qualitative Assessment & Holistic Comparison View**
* **Goal:** To integrate the qualitative comparison features, allowing users to define personal goals and assign weights, customize how pre-defined location attributes apply to them, and see a "Qualitative Fit Score" for each scenario. This Epic also aims to complete the "Comparison Dashboard" by incorporating these qualitative scores into the "Overview Table" and "Scenario Summary Cards," and implementing the full "Detailed View" which will show comprehensive breakdowns of both financial projections and qualitative assessments for individual scenarios.

    * **Story 4.1: Define and Weight Personal Qualitative Goals**
        * **User Story:** "As a user, I want to define a list of my personal qualitative goals by selecting from a master list of qualitative concepts (e.g., "Good Weather," "Low Crime Rate," "Access to Healthcare"), give them my own descriptive names if desired, and assign a weight (e.g., Low, Medium, High, Critical) to each goal, so the system understands what lifestyle factors are most important to me overall."
        * **Acceptance Criteria (ACs):**
            1.  A dedicated User Interface (UI) section must be available where users can manage their "Personal Qualitative Goals."
            2.  Users must be able to add a new Personal Qualitative Goal to their list.
            3.  When adding a new goal, the system must present the user with a way to select a base qualitative concept from the `appConfig.globalQualitativeConcepts` list (e.g., via a searchable or categorized dropdown menu showing `GlobalQualitativeConcept.name`).
            4.  Upon selection of a `GlobalQualitativeConcept`: A new `UserQualitativeGoal` object is created and associated with the user's `UserAppState`; The `UserQualitativeGoal.conceptId` is set to the `id` of the selected `GlobalQualitativeConcept`; The `UserQualitativeGoal.name`, `UserQualitativeGoal.category`, and `UserQualitativeGoal.description` are initially populated (copied) from the corresponding fields of the selected `GlobalQualitativeConcept`.
            5.  After a `UserQualitativeGoal` is created, the user must be able to edit its `name` and `description` fields to personalize them. The `category` should ideally remain linked to the original concept for consistency, but the display name is key for the user.
            6.  For each `UserQualitativeGoal` in their list, the user must be able to select and assign a `weight` from a predefined set of options (e.g., "Low," "Medium," "High," "Critical").
            7.  The UI must display the user's list of Personal Qualitative Goals, showing for each goal: its (potentially personalized) `name`, its `category`, its (potentially personalized) `description`, and its assigned `weight`.
            8.  Users must be able to edit an existing `UserQualitativeGoal` in their list, specifically to change its personalized `name`, `description`, and its assigned `weight`. (The underlying `conceptId` should remain unchanged after initial selection).
            9.  Users must be able to delete a `UserQualitativeGoal` from their list, with a confirmation prompt to prevent accidental deletion.
            10. All defined `UserQualitativeGoal` objects are stored within the `UserAppState.userQualitativeGoals` array and are persisted as part of the Active Plan's auto-save mechanism (Story 1.4).
            11. The UI for managing Personal Qualitative Goals must be responsive and user-friendly.

    * **Story 4.2: Manage Scenario-Specific Qualitative Attributes & User Perspectives**
        * **User Story:** "As a user, for each of my scenarios, I want to see a list of relevant qualitative attributes (which are based on global qualitative concepts and may be pre-populated if the scenario was created from a `templateScenario`) and be able to customize my perceived `userSentiment` (e.g., Positive, Neutral, Negative) and `significanceToUser` (None, Low, Medium, High) for each attribute specifically for that scenario, so I can tailor the qualitative assessment to my personal perspective on that location. I also want to be able to add new attributes to my scenario by selecting from the master list of qualitative concepts and then defining my perspective on them for that scenario."
        * **Acceptance Criteria (ACs):**
            1.  Within the editing interface for any given `Scenario`, a dedicated UI section must exist for managing its "Scenario-Specific Qualitative Attributes" (`Scenario.scenarioSpecificAttributes`).
            2.  If the `Scenario` was created by copying a `templateScenario`, this section is pre-populated with the `ScenarioAttribute` entries from that template, including their template-defined default `userSentiment` and `significanceToUser` values.
            3.  For each `ScenarioAttribute` displayed for the current scenario, the UI must show: The `name` and `category` of the underlying `GlobalQualitativeConcept` (looked up from `appConfig.globalQualitativeConcepts` via `ScenarioAttribute.conceptId`); Controls allowing the user to set/modify their `userSentiment` for this attribute specifically within this scenario (e.g., selectable options: "Positive," "Neutral," "Negative"); Controls allowing the user to set/modify their `significanceToUser` for this attribute specifically within this scenario (e.g., selectable options: "None," "Low," "Medium," "High"); An optional text input for users to add or edit personal `notes` related to this attribute in this scenario.
            4.  Users must be able to add a new qualitative attribute to the current `Scenario`'s list: This process involves the user selecting a base `GlobalQualitativeConcept` from the master list provided in `appConfig.globalQualitativeConcepts` (e.g., via a searchable or categorized list); Upon selection, a new `ScenarioAttribute` object linked to the chosen `conceptId` is created and added to `Scenario.scenarioSpecificAttributes`; The user must then define their initial `userSentiment` and `significanceToUser` (and optionally `notes`) for this newly added attribute within the current scenario. Default values for a newly added attribute might be `userSentiment: "Neutral"` and `significanceToUser: "None"`.
            5.  Users must be able to remove a `ScenarioAttribute` (whether originally from a template or added manually) from the current scenario's list, with a confirmation prompt.
            6.  All modifications (edits to `userSentiment`, `significanceToUser`, `notes`; additions; deletions) to the `Scenario.scenarioSpecificAttributes` list are stored as part of that specific `Scenario` object within the "Active Plan" in the application's internal state.
            7.  The UI for managing scenario-specific qualitative attributes must be responsive and user-friendly.

    * **Story 4.3: Calculate and Initially Display Qualitative Fit Score**
        * **User Story:** "As a user, after defining my goals and customizing scenario attributes, I want the system to calculate a "Qualitative Fit Score" for each scenario by comparing its attributes (with my sentiments and significances) against my weighted personal goals, and display this score clearly when I am viewing or editing a scenario, so I can get a quantifiable measure of its lifestyle alignment."
        * **Acceptance Criteria (ACs):**
            1.  A function `calculateQualitativeFitScore` is implemented as outlined in the `architecture-v2.md` document (Section 4.8).
            2.  This function correctly takes a `Scenario` object (containing `scenarioSpecificAttributes`), the `UserAppState` (for `userQualitativeGoals`), and `AppConfig` (for `globalQualitativeConcepts` lookup if needed) as inputs.
            3.  The calculation logic iterates through each `UserQualitativeGoal` defined by the user: It correctly retrieves the numerical value for the goal's `weight` (e.g., using the `goalWeightMap` specified in `architecture-v2.md`); It correctly identifies the corresponding `ScenarioAttribute`(s) in the current `Scenario` by matching `ScenarioAttribute.conceptId` with `UserQualitativeGoal.conceptId`.
            4.  For each matched pair of `UserQualitativeGoal` and `ScenarioAttribute`: If the `ScenarioAttribute.userSentiment` is "Neutral" OR its `significanceToUser` is "None", this attribute's specific contribution to the score for that goal category is zero (or a neutral base value); Otherwise, the `ScenarioAttribute.userSentiment` and `ScenarioAttribute.significanceToUser` are converted to numerical values (e.g., using `sentimentMap` and `significanceMap`) to determine an "attribute effect"; This "attribute effect" is then multiplied by the numerical `goalWeightNumeric` of the `UserQualitativeGoal` to determine the weighted score contribution for that pairing.
            5.  The function correctly sums all weighted contributions from all goal-attribute pairings and normalizes this sum to a consistent output scale (e.g., 0-100) as described in `architecture-v2.md` (Section 4.8, point 4, "Normalization").
            6.  If there are no `UserQualitativeGoals` with a weight that would result in a non-zero `sumOfAbsoluteMaxGoalContributions`, the `qualitativeFitScore` defaults to a predefined neutral value (e.g., 50, as per `architecture-v2.md`).
            7.  The calculated `qualitativeFitScore` for each scenario is stored in its corresponding `ScenarioResults` object within the `AppCalculatedState`.
            8.  The `qualitativeFitScore` for all affected scenarios is automatically recalculated whenever: The user's list of `userQualitativeGoals` (or their weights) is modified (as per Story 4.1); A `Scenario`'s `scenarioSpecificAttributes` (their sentiment or significance) are modified (as per Story 4.2).
            9.  For this story, the calculated `qualitativeFitScore` for the currently active/viewed `Scenario` must be clearly displayed to the user within the UI section where they are viewing or editing that scenario's details (e.g., near the qualitative attributes input area or in a summary section for that scenario).
            10. The UI element displaying this initial score must be responsive.
            *(Note: Broader integration of this score into the main "Scenario Summary Cards" and "Overview Comparison Table" is covered in Story 4.4).*

    * **Story 4.4: Integrate Qualitative Scores into Main Comparison Views**
        * **User Story:** "As a user, I want the calculated "Qualitative Fit Score" for each scenario to be displayed on its "Scenario Summary Card" and as a sortable column in the "Overview Comparison Table" alongside key financial metrics, so I can have a holistic side-by-side comparison of all my scenarios."
        * **Acceptance Criteria (ACs):**
            1.  The "Scenario Summary Card" UI component (initially defined in Story 2.5) for each scenario must be updated to clearly and prominently display that scenario's calculated `QualitativeFitScore` (sourced from its `ScenarioResults` object).
            2.  The `QualitativeFitScore` displayed on the Scenario Summary Card must be clearly labeled (e.g., "Qualitative Fit," "Lifestyle Score," or similar).
            3.  The "Overview Comparison Table" UI component (initially defined in Story 2.6) must be updated to include a new dedicated column (or row, depending on the primary table orientation) that displays the `QualitativeFitScore` for each scenario currently selected for comparison.
            4.  This new column/row in the Overview Comparison Table representing the `QualitativeFitScore` must be clearly labeled.
            5.  Users must be able to sort the scenarios displayed in the "Overview Comparison Table" based on the values in the `QualitativeFitScore` column (allowing both ascending and descending order).
            6.  The `QualitativeFitScore` displayed on the Scenario Summary Cards and within the Overview Comparison Table must dynamically update if the score is recalculated for any scenario (due to changes in `UserQualitativeGoals` or a `Scenario`'s `scenarioSpecificAttributes`).
            7.  The presentation of the `QualitativeFitScore` in both the summary cards and the comparison table must be visually integrated with the existing financial metrics in a clear and easily understandable manner.
            8.  The responsiveness of both the Scenario Summary Cards and the Overview Comparison Table must be maintained after the addition of this new data point, ensuring usability across different screen sizes.

    * **Story 4.5: Implement Comprehensive "Detailed View" for Scenarios**
        * **User Story:** "As a user, I want to access a "Detailed View" for any selected scenario, which provides a comprehensive year-by-year breakdown of its financial projections (income, expenses, taxes, net outcomes) AND a detailed listing of its qualitative attributes (showing their underlying concept, my customized sentiments/significance) and an indication of how they contributed to the scenario's Qualitative Fit Score, so I can perform an in-depth analysis of all aspects of that scenario in one place."
        * **Acceptance Criteria (ACs):**
            1.  A "Detailed View" UI is implemented and can be accessed for any individual `Scenario` (e.g., by clicking its "Scenario Summary Card" or a dedicated "details" link/button associated with it).
            2.  The Detailed View clearly displays the `displayLocationName` (or custom scenario name) of the `Scenario` being viewed.
            3.  **Financial Projections Display:**
                a.  The view must present a year-by-year breakdown of the financial projections for the selected `Scenario`, using data from its `ScenarioResults.yearlyProjections` array.
                b.  For each `year` in the `projectionPeriodYears`, the following financial details must be clearly displayed: Gross Income; Total Annual Expenses (sum of categorized expenses and `additionalCosts`); Capital Gains Income; A detailed Tax Breakdown, showing at least: Federal Income Tax, State Income Tax (if applicable), Capital Gains Tax, and Total Tax. (Note: Property and Consumption tax estimates can be included if their calculation is implemented; otherwise, they can be omitted or shown as N/A for this MVP detailed view); Net Financial Outcome for the year.
                c.  This year-by-year financial data should be presented in an easily understandable format (e.g., a clear table or structured list).
            4.  **Qualitative Assessment Display:**
                a.  The view must display a detailed breakdown of the qualitative assessment for the selected `Scenario`.
                b.  It must list each `ScenarioAttribute` associated with the scenario (from `Scenario.scenarioSpecificAttributes`).
                c.  For each listed `ScenarioAttribute`, the display must include: The `name` and `category` of the underlying `GlobalQualitativeConcept` (looked up via `conceptId`); The user's customized `userSentiment` ("Positive," "Neutral," "Negative") for that attribute in this scenario; The user's customized `significanceToUser` ("None," "Low," "Medium," "High") for that attribute in this scenario; Any user-provided `notes` for that attribute in this scenario.
                d.  The view must provide an intuitive summary or indication of how these `ScenarioAttributes` (with their sentiments and significances), in conjunction with the `UserQualitativeGoal` weights, contributed to the scenario's overall `QualitativeFitScore`. (This does not require displaying the exact mathematical formula but should give the user a qualitative understanding of the score's composition).
            5.  The Detailed View must provide a clear way for the user to navigate back to the main dashboard or scenario list.
            6.  The UI for the Detailed View must be responsive, ensuring that all information is presented clearly and is usable across different screen sizes (desktop, tablet, mobile).
            7.  The data displayed within the Detailed View must dynamically update if the underlying scenario data or its calculations change while the view is active or when it is subsequently reopened for that scenario.

**Epic 5: Active Plan Naming & Sharing (Lean MVP)**
* **Goal:** Allow users to name their single "Active Plan" and provide a user-facing way to generate a shareable URL for this Active Plan.
    * **Story 5.1: Name/Rename the Active Plan**
        * **User Story:** "As a user, I want to be able to assign or change the name of my current "Active Plan" at any time through a clear UI input, so I can identify my current work session and this name can be used when the plan is shared or auto-saved."
        * **Acceptance Criteria (ACs):**
            1. The UI displays the name of the Active Plan (defaulting to "Untitled Plan" or similar if new).
            2. User can edit this name via a direct input field.
            3. Changes to the Active Plan name are reflected immediately in the UI and stored in the in-memory Active Plan state.
            4. This Active Plan name is part of the data saved by the continuous auto-save mechanism (Story 1.4) and is included as the internal `activePlanName` when generating a shareable URL.
            5. (Note: Locking functionality is deferred to post-MVP).

    * **Story 5.2: Implement User-Facing "Generate Shareable URL" Feature for Active Plan**
        * **User Story:** "As a user, I want a clear "Share Plan" button or option in the UI that, when clicked, generates a compressed, URL-encoded string representing my current "Active Plan," which I can then copy to my clipboard to share with others."
        * **Acceptance Criteria (ACs):**
            1. A "Share Plan" UI action is available.
            2. When triggered, the system uses logic from Story 1.5B (takes current Active Plan data including its name, serializes, compresses, URL-encodes).
            3. Resulting shareable URL string presented for easy copying.
            4. User receives feedback on successful generation/copy.
            5. UI is responsive.

## Post-MVP Backlog / Future Enhancements

This section captures features and capabilities deferred from the MVP. Detailed thinking and architectural considerations for many of these were explored during initial planning (related to `architecture-v3.md`) and can be revisited when these are prioritized.

**Future Epic A: Comprehensive Income & Rental Tax Calculation Engine**
* **Goal:** To enable the system to calculate detailed income tax (federal, state) on various income types (employment, business) and rental property income, including support for progressive tax brackets and standard deductions/exemptions.
* **Key Deferred Features/Stories (Summaries):**
    * User ability to input detailed income tax bracket information for custom scenarios or override template-derived brackets.
    * Engine capability to process progressive income tax brackets.
    * Engine capability to calculate rental income tax based on specific rules.
    * Utilization of `ScenarioIncomeSource.overrideEffectiveTaxRate` and `Scenario.defaultEffectiveIncomeTaxRate` (or equivalent bracket structures) for income tax.
    * *Architectural considerations for storing and processing detailed tax bracket arrays within scenarios, and potentially more complex `IncomeSource` attributes, were explored in `architecture-v3.md`.*

**Future Epic B: Property & Consumption Tax Calculations**
* **Goal:** To enable the system to estimate property and consumption taxes based on user-provided effective rates or more detailed inputs for each scenario.
* **Key Deferred Features/Stories:**
    * User input fields for `Scenario.propertyTaxRate` and `Scenario.consumptionTaxRate`.
    * Engine logic to apply these rates to relevant bases (e.g., real estate asset values for property tax, portion of expenses for consumption tax).
    * *Considerations for how these rates are obtained (user input, template defaults) and applied were part of `architecture-v3.md`.*

**Future Epic C: Advanced Plan Management (Multiple Named Saved Plans)**
* **Goal:** To allow users to save, load, name, organize, and manage multiple distinct "Plans" within `localStorage`, including features like locking and cloning.
* **Key Deferred Features/Stories (Summaries from previous Epic 5 draft):**
    * Explicit "Save Active Plan to Named Slot" (Save / Save As with `planUUID`, `userDisplayName`, `createDate`, `lastSavedDate`).
    * UI to View, Load, Delete, Clone, Rename display name for entries in the list of Named Saved Plans.
    * Implement Plan Locking/Unlocking feature (`isLocked` status).
    * Robust overwrite safety prompts when loading named plans if active plan has unsaved *named* changes.
    * *The data structure `SavedPlanEntry[]` and detailed flows for these operations, including UUID management, were explored and are crucial for this epic. These concepts are aligned with thinking in `architecture-v3.md`.*

**Future Epic D: Advanced Multi-Jurisdictional Tax Logic & Expanded Special Tax Features**
* **Goal:** To expand the Special Tax Feature library and core engine capabilities to handle more complex multi-jurisdictional tax rules (e.g., foreign tax credits, tax treaty impacts on standard income types).
* **Key Deferred Features/Stories:**
    * Implementation of a Foreign Tax Credit STF for income taxes.
    * Research and implementation of other significant tax treaties or specific jurisdictional rules.
    * *The STF engine in `architecture-v3.md` was designed to be extensible for such features.*

**Other Deferred Items (from original "Out of Scope Ideas Post MVP"):**
* Advanced Data Input Simplification (bulk edit, etc.).
* Spreadsheet-Like Data Entry.
* Detailed Tax Calculation Explanations (step-by-step by engine).
* Advanced Table Interactions (filtering, column hiding).
* Plan Versioning (multiple versions of a single Named Plan).
* AI-Driven Scenario Builder.
* Full Progressive Tax Bracket Processing by core engine (for all tax types beyond just STFs).
* Detailed Residency/Eligibility Guidance & Validation by the tool.
* Advanced Multi-Scenario Comparison Visualizations (beyond table/cards).
* Digital Nomad Specifics (complex multi-country tax home scenarios).
* Dynamic Data Feeds for `templateScenarios` (real-time tax/cost data).
* User Accounts & Cloud Storage (Backend Migration).
* Monetization Features.
* PDF/Printable Reports.
* Third-Party Financial Tool Integrations.
* Full Internationalization (i18n) / Localization (L10n).
* Server-Side Rendering (SSR) / Static Site Generation (SSG).
* Web Workers for heavy calculations.
* Data Migration logic for `localStorage` structure versions.

## Key Reference Documents

* **Project Brief: Tax Scenarios Analyzer MVP (`productbrief-v2.md`)**
* **Tax Scenarios Analyzer Lean MVP Architecture Document (to be created by Architect based on this PRD)**
* **Tax Scenarios Analyzer Comprehensive Architecture Document (`architecture-v3.md`)** (Used as reference for future enhancements and detailed thinking on deferred features)
* **Tax Scenarios Analyzer MVP Frontend Architecture Document (`frontend-architecture.md`)** (To be reviewed/aligned with Lean MVP scope)
* **UI/UX Specification Document (`front-end-spec.md` - to be created by Design Architect for Lean MVP)**

## Document Purpose and Management

This Product Requirements Document (PRD) outlines the goals, features, and requirements for the Minimum Viable Product (MVP) of the Tax Scenarios Analyzer. It is intended to be a guiding document for development. As this is a personal project driven by the User/Developer, this PRD will be treated as a living document. Updates, revisions, and communication regarding changes will be managed through direct review and iterative refinement of the document by the User/Developer.

## Change Log

| Change                                               | Date       | Version | Description                                                                                                | Author          |
| :--------------------------------------------------- | :--------- | :------ | :--------------------------------------------------------------------------------------------------------- | :-------------- |
| Initial PRD Draft - Sections 1-5                     | 2025-05-29 | 0.1     | Initial draft of Goals, FR, NFR, UI/UX, TechAs for comprehensive scope.                                  | John (PM Agent) |
| Epic Overview Defined (Comprehensive Scope)          | 2025-05-29 | 0.2     | Defined 5 Epics and their high-level goals for comprehensive scope.                                      | John (PM Agent) |
| Epics 1-5 Stories Detailed (Comprehensive Scope)     | 2025-05-29 | 0.8     | Detailed User Stories & ACs for Epics 1-5 for comprehensive scope & completed initial checklist pass.      | John (PM Agent) |
| **PRD Refactored for Lean MVP Scope** | **2025-05-29** | **1.0** | **Major revision: Scope reduced to CGT-focus. FRs, NFRs, Epics, Stories redrafted. Post-MVP section added.** | **John (PM Agent)** |

## Checklist Results Report (`pm-checklist`)

*(This section will be populated after the `pm-checklist` has been re-run against this Lean MVP PRD).*

---
## Prompt for Design Architect (UI/UX Specification Mode - Lean MVP)

**Objective:** To take this **Lean MVP** Product Requirements Document (PRD) for the Tax Scenarios Analyzer and collaboratively develop a focused UI/UX Specification. This specification should detail user flows, wireframes, and UI design for the **capital gains tax estimation and qualitative comparison features** of the MVP, ensuring alignment with the refined product goals.

**Mode:** UI/UX Specification Mode

**Primary Input:** This Lean MVP PRD document for the Tax Scenarios Analyzer.

**Key Tasks for the Design Architect (Jane):**

1.  **Thoroughly Review this Lean MVP PRD:** Understand the focused project goals (CGT estimation), target users, revised functional requirements (especially the simplified scope for tax calculations and plan management), NFRs, and UI/UX goals.
2.  **Map Key User Flows (Lean MVP):** Focus on primary user journeys for:
    * Initial setup (Active Plan naming, global assets).
    * Creating a Baseline Scenario (from CGT-focused template or custom, inputting gross income for context, expenses, *effective CGT rates*).
    * Adding Comparison Scenarios (focused on CGT parameters).
    * Defining Personal Qualitative Goals and customizing Scenario Attributes.
    * Navigating the Comparison Dashboard (displaying CGT results, overall financials, qualitative scores).
    * Accessing the Detailed Scenario View (showing CGT impact, qualitative details).
    * Using the simple "Share Plan" URL generation.
3.  **Create Wireframes/Conceptual Mockups (Lean MVP):** For key screens/views supporting the above flows. Leverage ShadCN UI components.
4.  **Populate or Create the `front-end-spec.md` Document (Lean MVP):** Document the UI/UX specifications for the lean MVP scope.
5.  *(Other tasks like Information Architecture, UI Element States, Accessibility, PRD Enrichment remain relevant but applied to the leaner scope).*

Please guide the user (Vibe CEO) through this process for the **Lean MVP**.

---
## Initial Architect Prompt (for Lean MVP Architecture)

**Objective:** To take this **Lean MVP** Product Requirements Document (PRD) and the forthcoming UI/UX Specification (for Lean MVP) and create a **new, simplified technical architecture document** specifically for this focused MVP. The existing `architecture-v3.md` (comprehensive version) should serve as a reference for how deferred features *could* be architected later, but the new MVP architecture document must strictly reflect the lean scope.

**Primary Inputs:**
1.  This Lean MVP PRD document.
2.  The UI/UX Specification for Lean MVP (`front-end-spec.md` – to be created).
3.  (For Reference Only for deferred items) The comprehensive `architecture-v3.md` document.
4.  The current Frontend Architecture Document (`frontend-architecture.md` – to be reviewed for alignment with lean MVP UI/UX).

**Key Tasks for the Architect (Fred):**

1.  **Create New Lean MVP Architecture Document:** Based on this PRD, develop a new, streamlined architecture document.
2.  **Data Models (Lean MVP):** Define data models (`UserAppState`, `Scenario`, `Asset`, `AppConfig`, etc.) supporting *only* the lean MVP features. For example:
    * `Scenario` model will only require fields for effective Capital Gains Tax rates for MVP engine use. Fields like `defaultEffectiveIncomeTaxRate`, `propertyTaxRate`, `consumptionTaxRate` (for engine calculation) should be omitted from the MVP `Scenario` model if not used by any MVP feature or STF. `IncomeSource` model might be simplified.
    * `AppConfig` will contain simpler `templateScenarios` (CGT-focused) and potentially fewer `globalSpecialTaxFeatures` for MVP.
    * Qualitative models (`GlobalQualitativeConcept`, `UserQualitativeGoal`, `ScenarioAttribute`) are retained.
    * No structures for multiple named saved plan lists in `localStorage` (only single active plan persistence).
3.  **Calculation Engine Logic (Lean MVP):** Document the engine to *only* calculate Capital Gains Tax (using user-provided effective rates) and the Qualitative Fit Score. Detail how STFs (MVP scope) modify CGT.
4.  **Application Data Flow (Lean MVP):** Detail flows for single active plan persistence, URL sharing, and simplified overwrite prompts.
5.  **Align with Frontend Architecture:** Ensure the lean MVP architecture aligns with `frontend-architecture.md` (which may also need minor scope alignment).
6.  *(Other tasks like Error Handling, Security, Deployment remain relevant but applied to the leaner scope).*

The goal is a new, clean architecture document strictly for implementing this focused Capital Gains Tax Estimator MVP.

---
