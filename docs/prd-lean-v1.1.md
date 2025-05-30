# Tax Scenarios Analyzer MVP Product Requirements Document (PRD)

**Version:** 1.1 (Lean MVP Focus - PO Checklist Addressed)
**Date:** May 31, 2025
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
    * **Learnability:** New users should be able to understand the basic workflow (creating a baseline, adding a comparison scenario, viewing results) with minimal formal guidance. This will be primarily supported by the availability of example scenario links, an intuitive UI design, and contextual help elements such as tooltips for complex inputs or features where appropriate. The detailed specification and implementation of these UI elements (like tooltips) will be part of the UI/UX design phase (led by the Design Architect) and integrated into relevant functional stories during development, rather than constituting a separate user guide document for MVP.
    * **Efficiency:** Users should efficiently manage scenarios, input data for CGT planning, and compare results.
    * **Clarity:** Information (CGT estimations, qualitative scores) must be presented clearly. Disclaimers about the estimation nature are crucial.
    * **Error Prevention & Recovery:** Guide users to prevent errors; error messages must be clear.
3.  **Reliability & Availability:**
    * **Client-Side Stability:** Stable operation in supported web browsers.
    * **Data Persistence:** Robust `localStorage` auto-save for the single Active Plan. Graceful handling of `localStorage` errors.
4.  **Security (Client-Side Focus):**
    * Implement measures against common client-side vulnerabilities (e.g., XSS).
    * Secure handling of URL parameter data.
    * Basic security testing for common client-side vulnerabilities (e.g., XSS through input fields, secure handling of data loaded from URLs) should be performed during development.
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
        * **Acceptance Criteria (ACs):**
            1.  When the application is loaded in a supported web browser, a basic UI shell is displayed. This shell includes placeholder areas for a header, main content, and footer.
            2.  The UI shell prominently features an input field or dedicated area where the name of the current "Active Plan" can be displayed and edited.
            3.  On initial application load, if no "Active Plan" name is found (e.g., in `localStorage`), the "Active Plan" name input field may display a default placeholder (e.g., "Untitled Plan") or be empty, ready for user input.
            4.  The user can type a custom name into the "Active Plan" name input field.
            5.  The name entered by the user for the "Active Plan" is captured and held in the application's internal state. (Note: Persistent saving of this name to `localStorage` will be covered in Story 1.4).
            6.  An initial `README.md` file is created at the project root, containing a project overview, basic setup instructions for developers, and high-level usage guidelines for the MVP.
            7.  A basic `docs/` folder structure is established in the repository to house project documentation (such as this PRD, architecture documents, etc.).
            8.  A Git repository for the project is initialized (e.g., on a platform like GitHub), and the initial project scaffolding (including base configuration files and the `README.md`) is committed.
            9.  The basic application shell demonstrates foundational responsiveness, adapting its layout fluidly to different screen sizes (desktop, tablet, and mobile).
            10. This story does not include the implementation of any specific financial data input fields (beyond plan name), scenario creation logic, or calculation functionalities.

    * **Story 1.2: Implement Global Asset Management**
        * **User Story:** "As a user, I want to define and manage a global list of my financial assets (name, quantity, cost basis, acquisition date, optional type/FMV) within my Active Plan, so that this core asset information can be used consistently across all scenarios I create."
        * **Acceptance Criteria (ACs):**
            1.  A dedicated User Interface (UI) section exists for managing a global list of financial assets associated with the "Active Plan."
            2.  Users can add a new asset to this global list. The input form for a new asset must allow for the entry of the following details: Asset Name (text input, required); Quantity (numeric input, required); Cost Basis per Unit (numeric input, required, representing original purchase price per unit); Acquisition Date (date input, e.g., "YYYY-MM-DD", required); Asset Type (optional input, e.g., a dropdown with options like "STOCK," "CRYPTO," "REAL\_ESTATE," "OTHER"); Fair Market Value (FMV) per Unit (optional numeric input, representing current value per unit).
            3.  The system provides an intuitive way to add multiple assets sequentially (e.g., after saving an asset, the form clears or an "Add Another Asset" option is available).
            4.  The system provides a function to duplicate an existing asset's details into the new asset entry form, allowing the user to then modify only the necessary fields for the new asset.
            5.  All entered global assets are displayed in a clear, readable list or table format, showing their key defined details.
            6.  Users can select an existing asset from the list to view and edit its details.
            7.  Users can delete an asset from the global list. A confirmation step must be included to prevent accidental deletion.
            8.  All asset data (additions, edits, deletions) is stored as part of the current "Active Plan" in the application's internal state. (Persistent saving of the Active Plan to `localStorage` is covered in Story 1.4).
            9.  The UI for asset management is responsive and usable across different screen sizes.
            *(Note: The fields `residencyAcquisitionDate` and `valueAtResidencyAcquisitionDatePerUnit` are no longer part of the global asset definition. They will be captured at the scenario level for specific assets when relevant special tax features are applied, as will be detailed in a story within Epic 3).*

    * **Story 1.3: Create Baseline Scenario & Input Core Data (CGT Focus)**
        * **User Story:** "As a user, I want to establish my "Baseline Scenario" within my Active Plan (from a CGT-focused template or custom), define its location, input gross income (for context), annual expenses, and my effective Capital Gains Tax rates for this baseline, so I have a foundational scenario."
        * **Acceptance Criteria (ACs):**
            1.  Within the "Active Plan," the user can initiate the creation or definition of the "Baseline Scenario."
            2.  When establishing the Baseline Scenario, the user must be presented with options to either:
                a.  **Start from a Template:** Select from a list of available `templateScenarios` (sourced from `appConfig.templateScenarios`). Upon selection, a deep copy of the chosen `templateScenario` (including its predefined location name components, effective CGT rates, default expenses, qualitative attributes, etc.) becomes the user's Baseline Scenario within their Active Plan.
                b.  **Create a Custom Scenario:** Opt to create a custom Baseline Scenario. In this case, the user must input the location details: `displayLocationName` (e.g., "My Current US Setup"), `locationCountry`, `locationState` (optional), `locationCity` (optional). This custom scenario will start with empty or minimal default structures for income sources, annual expenses, and requires user input for effective CGT tax rates (as per AC.6 below).
            3.  Regardless of the creation method (template or custom), the user can subsequently input and manage a list of `IncomeSource` objects for the Baseline Scenario. For each income source, the UI must allow specifying: Name (text input, required); Type (e.g., a dropdown with options "EMPLOYMENT," "RENTAL\_PROPERTY," "OTHER," as per `ScenarioIncomeSource` model); Annual Amount (numeric input, required); Start Year (numeric input, required, relative to the projection period); End Year (optional numeric input). (Note: `overrideEffectiveTaxRate` and `sourceJurisdictionInfo` on `ScenarioIncomeSource` are not utilized for MVP tax calculations by the core engine and may not have dedicated UI inputs in this story).
            4.  The system provides an intuitive interface to add multiple income sources sequentially, edit existing income sources, and delete income sources for the Baseline Scenario.
            5.  Regardless of the creation method, the user can subsequently input and manage `AnnualExpense` categories for the Baseline Scenario. (If created from a template, these might be pre-populated from the template's `annualExpenses.categories` and be editable). For each expense category, the UI must allow specifying: Name (text input, required); Amount (annual numeric input, required).
            6.  Users can input a value for overall `annualExpenses.additionalCosts` (a lump sum for non-categorized annual costs) for the Baseline Scenario.
            7.  The system provides an intuitive interface to add new expense categories, edit existing expense categories (names and amounts), and delete expense categories for the Baseline Scenario.
            8.  For this Baseline Scenario, the user must be able to input their effective Short-Term and Long-Term Capital Gains Tax rates (e.g., into the `Scenario.capitalGainsTaxRates` array, which for MVP will hold a single object with these two rates).
            9.  All entered/modified data for the Baseline Scenario is stored as part of the current "Active Plan" in the application's internal state.
            10. The UI for defining the Baseline Scenario and its core financials is responsive.
            11. (Note: For a "custom" Baseline Scenario, fields for income tax rates, property tax, consumption tax are not used by the MVP engine. For a template-derived baseline, these rates are copied but also unused by the MVP engine).

    * **Story 1.4: Implement `localStorage` Persistence for the Single Active Plan**
        * **User Story:** "As a user, I want my entire "Active Plan" (including its name, global assets, and all scenario data) to be automatically saved to my browser's local storage as I make changes, and reloaded when I revisit the application, so that my work is preserved between sessions without manual save actions."
        * **Acceptance Criteria (ACs):**
            1.  Any modification to the "Active Plan" data must trigger an automatic save of the entire current "Active Plan" state (serialized `UserAppState` including its internal `activePlanInternalName`) to a primary `localStorage` slot (e.g., `taxAnalyzer_activePlan`).
            2.  Auto-save is efficient (e.g., debounced/throttled).
            3.  On launch/refresh, app attempts to load Active Plan from this primary `localStorage` slot.
            4.  If found and valid, Active Plan is loaded.
            5.  If not found or invalid, app starts with a new, empty Active Plan.
            6.  Graceful error handling for `localStorage` write errors (user informed).
            7.  Graceful error handling for `localStorage` read errors (start fresh, user informed).

    * **Story 1.5: Implement Loading & Generation of Plan Data via Shareable URL Strings (Active Plan)**
        * **User Stories:**
            * *(Loading)* "As a user, when I open the application with an external shared URL containing plan data, if my current Active Plan contains significant data, I want to be prompted to [Load New & Discard Current Work] or [Cancel], and then if I proceed, have the URL data loaded as my new Active Plan, so I can explore shared data."
            * *(Generating - Dev/Testing)* "As a developer... I want a mechanism... to generate a compressed, URL-encoded string representing the current Active Plan..."
        * **Acceptance Criteria (ACs):**
            * **A. Loading Plan Data from an External URL:**
                1. App checks for URL query parameter with plan data.
                2. System attempts to decode, decompress (LZ-String), and deserialize string into "Active Plan" structure (`UserAppState` including `activePlanInternalName`).
                3. If URL data parsed successfully:
                    a. If current Active Plan has significant data (is not new/empty/default), prompt user: "[Load New & Discard Current Work] or [Cancel Load]."
                    b. If user proceeds (or no prompt needed), URL data becomes the new Active Plan.
                    c. New Active Plan named (e.g., "Loaded from Link - [Timestamp]" or from its internal `activePlanInternalName`, user can rename later via Story 5.1).
                4. If URL data invalid: Handle error gracefully, inform user, load local or start fresh.
                5. Successful load updates UI.
            * **B. Generating a Shareable URL String (Developer-Focused):**
                6. Developer-accessible mechanism to trigger shareable URL string generation.
                7. System takes current Active Plan, serializes (including `activePlanInternalName` and `UserAppState`), compresses, URL-encodes.
                8. Resulting string made available to developer.
                9. Compression library integrated and functional.

    * **Story 1.6: Display Example Scenario Links (CGT Focused)**
        * **User Story:** "As a user, I want to see a list of links to pre-configured example scenarios (focused on CGT planning)... so I can easily load and explore them..."
        * **Acceptance Criteria (ACs):**
            1. UI section displays links to example scenarios.
            2. List includes >=1 example with descriptive title (CGT-focused).
            3. Examples are clickable.
            4. Clickable elements use pre-generated shareable URL strings derived from CGT-focused `templateScenarios`.
            5. Clicking an example triggers Story 1.5 (Loading) mechanism (including prompt if current work exists).
            6. Example list/URLs are static data in `AppConfig`.
            7. UI is responsive.

    * **Story 1.7: Set Up CI/CD Pipeline for Automated Deployments**
        * **User Story:** "As the project developer, I want a CI/CD pipeline configured (e.g., with Cloudflare Pages and GitHub Actions) so that automated builds and deployments of the application are triggered from the `main` branch, ensuring efficient and consistent releases."
        * **Acceptance Criteria (ACs):**
            1.  Project repository linked to Cloudflare Pages (or chosen static hosting CI/CD).
            2.  CI/CD workflow (e.g., GitHub Actions YAML) configured.
            3.  Pipeline automatically triggers build process upon commits/merges to `main`.
            4.  Successful build automatically deploys static assets to production on Cloudflare Pages.
            5.  Basic deployment success/failure notifications configured for developer.
            6.  CI/CD setup aligns with deployment strategy in Architecture Document (lean MVP version).

**Epic 2: Scenario Creation & Capital Gains Tax Comparison**
* **Goal:** Enable users to create multiple "Comparison Scenarios" (from CGT-focused templates or custom) within their Active Plan, input their effective Capital Gains Tax rates for these, and see a side-by-side comparison of estimated CGT and resulting net financial outcomes.

    * **Story 2.1: Create Comparison Scenario (from Template or Custom - CGT Focus)**
        * **User Story:** "As a user, I want to add a "Comparison Scenario" to my Active Plan, either by selecting a CGT-focused `templateScenario` or by creating a 'custom' scenario where I define the location and my effective Capital Gains Tax rates, so I can model different situations."
        * **Acceptance Criteria (ACs):**
            1. User can create a new Comparison Scenario in Active Plan.
            2. Options: Start from `templateScenario` (deep copy, gets its CGT rates from template) or Create Custom.
            3. Custom Scenario: User inputs location components; starts with empty/default structures for income, expenses, and requires user input for effective CGT rates (as per Story 2.3 or this story).
            4. New scenario added to Active Plan. User can give it a custom display name.
            5. UI is responsive.
            6. (Note: Detailed input of income/expenses is Story 2.3. Input of CGT rates for custom scenario is handled here or 2.3).

    * **Story 2.2: Create Comparison Scenario by Copying an Existing Scenario**
        * **User Story:** "As a user, I want to create a new "Comparison Scenario" by duplicating an existing scenario... so I can quickly create variations..."
        * **Acceptance Criteria (ACs):**
            1. User can select any existing scenario in Active Plan to duplicate.
            2. UI action to initiate copy.
            3. Deep copy performed (location, tax parameters including CGT rates, income, expenses, etc.).
            4. New scenario gets unique ID, user prompted for (or system defaults) display name.
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
            6. **User can input/edit effective Short-Term and Long-Term Capital Gains Tax rates for this scenario** (into `Scenario.capitalGainsTaxRates`).
            7. Changes saved to specific scenario in Active Plan. UI responsive.

    * **Story 2.4: Implement Capital Gains Tax Calculation Engine**
        * **User Story:** "As a user, I want the system to calculate estimated Capital Gains Tax for each scenario, using my planned asset sales, asset holding periods, and the effective Short-Term/Long-Term Capital Gains Tax rates I've defined for that scenario, so I can see the primary CGT impact."
        * **Acceptance Criteria (ACs):**
            1. Core calculation engine function processes a `Scenario` and `UserAppState`.
            2. For each projection year: Calculates ST/LT capital gains from `PlannedAssetSales` (using `Asset.acquisitionDate`).
            3. Applies `Scenario.capitalGainsTaxRates` (user-provided effective ST/LT rates) to categorized gains to calculate CGT for the year. **No other taxes (income, rental, property, consumption) are calculated by this core engine for MVP.**
            4. Calculated CGT for each year available in `ScenarioYearlyProjection.taxBreakdown.capitalGainsTax`. Total tax for MVP in this structure will primarily be this CGT.
            5. Engine structured for future STF integration (Story 3.4).
            6. Basic error handling for missing CGT rates in scenario.

    * **Story 2.5: Display "Scenario Summary Cards" (CGT & Financial Outcome)**
        * **User Story:** "As a user, I want to see a "Scenario Summary Card" for each scenario... displaying its name, location, total estimated Capital Gains Tax, and overall net financial outcome (based on gross income, expenses, and CGT)..."
        * **Acceptance Criteria (ACs):**
            1. One card per scenario in Active Plan (if calculated).
            2. Card displays: Scenario `displayLocationName`, primary location context.
            3. Card displays key aggregated financial outcomes from `ScenarioResults`: Total Net Financial Outcome, Total Estimated Capital Gains Tax.
            4. Clear, scannable format. Visually distinct.
            5. Card is interactive (leads to Detailed View - Story 4.5).
            6. Card has control to select/deselect for Overview Comparison Table.
            7. Responsive layout. Data updates dynamically.

    * **Story 2.6: Implement "Overview Comparison Table" (CGT & Financial Outcome)**
        * **User Story:** "As a user, I want to select scenarios for an "Overview Comparison Table" showing key metrics like gross income, expenses, total estimated Capital Gains Tax, and net financial outcome side-by-side, sortable by these metrics..."
        * **Acceptance Criteria (ACs):**
            1. Overview Comparison Table UI implemented.
            2. Displays data only for user-selected scenarios.
            3. Each scenario is a column with `displayLocationName` header.
            4. Rows are key financial metrics aggregated over projection period (Total Gross Income, Total Expenses, Total Estimated Capital Gains Tax, Total Net Financial Outcome).
            5. Table sortable by these key financial metric columns.
            6. Data updates dynamically.
            7. Clear, readable, responsive format.
            8. (Note: Qualitative metrics integration is Epic 4).

**Epic 3: Advanced Capital Gains Modeling & Special Tax Features (CGT Focus)**
* **Goal:** Enhance capital gains tax projections by incorporating detailed asset sales planning (with preview) and the application of `SpecialTaxFeatures` relevant to capital gains or overall financial outcomes for MVP.

    * **Story 3.1: Implement Detailed "Planned Asset Sales" Management per Scenario (with Preview)**
        * **User Story:** "As a user, I want to define a detailed plan of asset sales (specifying which of my global assets to sell, the quantity, and the expected sale price) for each year within each of my scenarios, independently from other scenarios, and receive an immediate estimated capital gain/loss preview for each individual sale transaction as I input it, so I can model different liquidation strategies and understand their initial tax implications effectively."
        * **Acceptance Criteria (ACs):** (As previously finalized)

    * **Story 3.2: Display Descriptive Notes & Hints for (CGT-Relevant) Special Tax Features**
        * **User Story:** "As a user, when I am considering or selecting a `special_tax_feature` (relevant to my CGT or overall financial planning for MVP) for one of my scenarios, I want to see its official name, a clear description, short summaries, and any available non-binding "eligibility hints" (all sourced from `appConfig.globalSpecialTaxFeatures`), so I can better understand what each feature entails and determine if it might be relevant to my situation before applying it."
        * **Acceptance Criteria (ACs):** (As previously finalized)

    * **Story 3.3: Input Scenario-Specific Asset Tax Details for Gain Bifurcation (if STF requires)**
        * **User Story:** "As a user, after I have selected a `special_tax_feature` for my scenario that `requiresGainBifurcation` (as defined in its global configuration), I want to be clearly prompted and able to input (or confirm/edit) the `residencyAcquisitionDate` and `valueAtResidencyAcquisitionDatePerUnit` for each of my relevant global assets *specifically for that scenario*, so that capital gains can be accurately bifurcated for tax calculations under that feature."
        * **Acceptance Criteria (ACs):** (As previously finalized)

    * **Story 3.4: Integrate and Apply Selected (CGT-Relevant) `SpecialTaxFeatures` in Calculations**
        * **User Story:** "As a user, after I have selected applicable `special_tax_features` for a scenario and provided any necessary inputs (including scenario-specific asset tax details if required by Story 3.3), I want the tax calculation engine to apply their logic to adjust my estimated Capital Gains Tax or overall financial outcome for that scenario, reflecting the benefits or changes introduced by those features."
        * **Acceptance Criteria (ACs):** (As previously finalized, focusing on STFs modifying CGT or overall financials).

**Epic 4: Qualitative Assessment & Holistic Comparison View (Retained)**
* **Goal:** To integrate the qualitative comparison features, allowing users to define personal goals and assign weights, customize how pre-defined location attributes apply to them, and see a "Qualitative Fit Score" for each scenario. This Epic also aims to complete the "Comparison Dashboard" by incorporating these qualitative scores into the "Overview Table" and "Scenario Summary Cards," and implementing the full "Detailed View" which will show comprehensive breakdowns of both financial projections (now CGT-focused) and qualitative assessments for individual scenarios.
    * **Stories 4.1 - 4.5:** (Remain exactly as previously finalized).

**Epic 5: Active Plan Naming & Sharing (Lean MVP)**
* **Goal:** Allow users to name their single "Active Plan" and provide a user-facing way to generate a shareable URL for this Active Plan.

    * **Story 5.1: Name/Rename the Active Plan**
        * **User Story:** "As a user, I want to be able to assign or change the name of my current "Active Plan" at any time through a clear UI input, so I can identify my current work session and this name can be used when the plan is shared or auto-saved."
        * **Acceptance Criteria (ACs):**
            1. The UI displays the name of the Active Plan (defaulting to "Untitled Plan" or similar if new).
            2. User can edit this name via a direct input field.
            3. Changes to the Active Plan name are reflected immediately in the UI and stored in the in-memory Active Plan state (specifically in `activeUserAppState.activePlanInternalName`).
            4. This Active Plan name is part of the data saved by the continuous auto-save mechanism (Story 1.4) and is included as the `activePlanInternalName` when generating a shareable URL.
            5. (Note: Locking functionality and management of multiple named saved plan slots are deferred to post-MVP).

    * **Story 5.2: Implement User-Facing "Generate Shareable URL" Feature for Active Plan**
        * **User Story:** "As a user, I want a clear "Share Plan" button or option in the UI that, when clicked, generates a compressed, URL-encoded string representing my current "Active Plan," which I can then copy to my clipboard to share with others."
        * **Acceptance Criteria (ACs):**
            1. A "Share Plan" UI action is available.
            2. When triggered, the system uses logic from Story 1.5B (takes current Active Plan data including its `activePlanInternalName` and `UserAppState`, serializes, compresses, URL-encodes).
            3. Resulting shareable URL string presented for easy copying.
            4. User receives feedback on successful generation/copy.
            5. UI is responsive.

## Post-MVP Backlog / Future Enhancements

This section captures features and capabilities deferred from the Lean MVP. Detailed thinking and architectural considerations for many of these were explored during initial planning (related to the comprehensive `architecture-v3.md` document) and can be revisited when these are prioritized.

**Future Epic A: Comprehensive Income & Rental Tax Calculation Engine**
* **Goal:** To enable the system to calculate detailed income tax (federal, state) on various income types (employment, business) and rental property income, including support for progressive tax brackets and standard deductions/exemptions.
* **Key Deferred Features/Stories (Summaries):**
    * User ability to input detailed income tax bracket information for custom scenarios or override template-derived brackets (`Scenario.incomeTaxRates` supporting full bracket arrays).
    * Engine capability to process progressive income tax brackets.
    * Engine capability to calculate rental income tax based on specific rules.
    * Utilization of `ScenarioIncomeSource.overrideEffectiveTaxRate` and `Scenario.defaultEffectiveIncomeTaxRate` (or equivalent bracket structures) for income tax.
    * *Summary of previous thinking on data models for `TaxRate` arrays for brackets, calculation logic, etc. from `architecture-v3.md` is relevant here.*

**Future Epic B: Property & Consumption Tax Calculations by Engine**
* **Goal:** To enable the system to estimate property and consumption taxes based on user-provided effective rates (stored in `Scenario.propertyTaxRate`, `Scenario.consumptionTaxRate`) and relevant financial bases within each scenario.
* **Key Deferred Features/Stories:**
    * User input fields (if not already present for informational purposes) for `Scenario.propertyTaxRate` and `Scenario.consumptionTaxRate`.
    * Engine logic to apply these rates to relevant bases (e.g., estimated real estate asset values for property tax, a portion of expenses for consumption tax).
    * *Considerations for how these rates are obtained and applied were part of `architecture-v3.md`.*

**Future Epic C: Advanced Plan Management (Multiple Named Saved Plans)**
* **Goal:** To allow users to save, load, name, organize, and manage multiple distinct "Plans" within `localStorage`, including features like locking and cloning.
* **Key Deferred Features/Stories (Summaries from previous comprehensive Epic 5 discussion):**
    * Explicit "Save Active Plan to Named Slot" (Save / Save As with `planUUID`, `userDisplayName`, `createDate`, `lastSavedDate`).
    * UI to View, Load, Delete, Clone, Rename display name for entries in the list of Named Saved Plans (`SavedPlanEntry[]` structure).
    * Implement Plan Locking/Unlocking feature (`isLocked` status).
    * Robust overwrite safety prompts when loading named plans if active plan has unsaved *named* changes.
    * *The `SavedPlanEntry` data structure and detailed flows for these operations, including UUID management, were explored and are crucial for this epic. These concepts align with thinking in `architecture-v3.md`.*

**Future Epic D: Advanced Multi-Jurisdictional Tax Logic & Expanded Special Tax Features**
* **Goal:** To expand the Special Tax Feature library and core engine capabilities to handle more complex multi-jurisdictional tax rules (e.g., foreign tax credits, tax treaty impacts on standard income types if/when income tax is added).
* **Key Deferred Features/Stories:**
    * Implementation of a Foreign Tax Credit STF for income taxes.
    * Research and implementation of other significant tax treaties or specific jurisdictional rules.
    * *The STF engine in `architecture-v3.md` was designed to be extensible.*

**Other Deferred Items (from original "Out of Scope Ideas Post MVP" section):**
* Advanced Data Input Simplification (bulk edit, etc.).
* Spreadsheet-Like Data Entry.
* Detailed Tax Calculation Explanations (step-by-step by engine).
* Advanced Table Interactions (filtering, column hiding).
* AI-Driven Scenario Builder.
* Full Progressive Tax Bracket Processing by core engine (for all tax types beyond just STFs, expanding on Future Epic A).
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
* Data Migration logic for `localStorage` structure versions (especially for `SavedPlanEntry[]` list).

## Key Reference Documents

* **Project Brief: Tax Scenarios Analyzer MVP (`productbrief-v2.md`)**
* **Tax Scenarios Analyzer Lean MVP Architecture Document (to be created by Architect based on this PRD)**
* **Tax Scenarios Analyzer Comprehensive Architecture Document (`architecture-v3.md`)** (Serves as reference for future enhancements and detailed architectural thinking on deferred features)
* **Tax Scenarios Analyzer MVP Frontend Architecture Document (`frontend-architecture.md`)** (To be reviewed/aligned with this Lean MVP scope)
* **UI/UX Specification Document (`front-end-spec.md` - to be created by Design Architect for this Lean MVP)**

## Change Log

| Change                                               | Date       | Version | Description                                                                                                             | Author          |
| :--------------------------------------------------- | :--------- | :------ | :---------------------------------------------------------------------------------------------------------------------- | :-------------- |
| Initial PRD Draft - Comprehensive Scope              | 2025-05-29 | 0.8     | Drafted Goals, FRs, NFRs, UI/UX, TechAs, Epics 1-5 (detailed stories/ACs) for a comprehensive initial scope.          | John (PM Agent) |
| **PRD Refactored for Lean MVP Scope** | **2025-05-31** | **1.0** | **Major revision: Scope refocused to CGT. FRs, NFRs, Epics, Stories redrafted/simplified. Post-MVP section added.** | **John (PM Agent)** |
| PO Checklist Feedback Incorporated                   | 2025-05-31 | 1.1     | Added stories/ACs for README, repo setup, CI/CD. Clarified NFRs on usability/tooltips.                         | John (PM Agent) |

## Checklist Results Report (`pm-checklist`)

**Date of Review:** May 31, 2025 (Post Lean MVP Scope Refinement)
**Reviewer:** John (PM Agent) with Vibe CEO (User)

**Overall Assessment:** This PRD (Version 1.1 - Lean MVP Focus) has been reviewed against the `pm-checklist`. All sections are now aligned with the refined lean MVP scope. The document is deemed comprehensive for its purpose of guiding the Design Architect and Architect in creating specifications for this focused MVP.

**Summary Table of Checklist Sections:**

| Category                        | Status | Notes / Key Resolutions (for Lean MVP Scope)                                                                                          |
| :------------------------------ | :----- | :------------------------------------------------------------------------------------------------------------------------------------ |
| 1. Problem Definition & Context | PASS   | Success metrics defined. Scope notes for quantification, differentiation, and competitive analysis appropriate for MVP.                 |
| 2. MVP Scope Definition         | PASS   | Rationale for out-of-scope items, feedback mechanisms, and criteria for moving beyond MVP clarified. Scope is lean & focused.         |
| 3. User Experience Requirements | PASS   | High-level UX goals for lean MVP are set. Detailed flows deferred to UI/UX Spec.                                                      |
| 4. Functional Requirements      | PASS   | Comprehensive FRs and detailed User Stories with ACs for all Lean MVP Epics defined and approved.                                   |
| 5. Non-Functional Requirements  | PASS   | NFRs for scalability, security testing, and dev environment aligned with lean MVP.                                                    |
| 6. Epic & Story Structure       | PASS   | Epics and stories well-defined, sequenced for lean MVP. First epic includes README, repo, CI/CD setup.                               |
| 7. Technical Guidance           | PASS   | Tech stack preference noted. Tech debt & MVP monitoring scope clarified.                                                              |
| 8. Cross-Functional Requirements| PASS   | NFRs for data quality, retention, and MVP support scope clarified. Integration N/A.                                                 |
| 9. Clarity & Communication      | PASS   | Documentation quality meets PRD standards. Stakeholder input & approval consistent. Communication plan note for personal project added. |

**Critical Deficiencies Identified:** None.

**Recommendations:**
* Proceed with providing this Lean MVP PRD to the Design Architect (Jane).
* Subsequently, provide this Lean MVP PRD and the UI/UX Specification to the Architect (Fred) for creation of a *new, simplified Lean MVP Architecture Document*.

---
## Prompt for Design Architect (UI/UX Specification Mode - Lean MVP)

**Objective:** To take this **Lean MVP** Product Requirements Document (PRD) for the Tax Scenarios Analyzer and collaboratively develop a focused UI/UX Specification. This specification should detail user flows, wireframes, and UI design for the **capital gains tax estimation and qualitative comparison features** of the MVP, ensuring alignment with the refined product goals.

**Mode:** UI/UX Specification Mode

**Primary Input:** This Lean MVP PRD document (Version 1.1) for the Tax Scenarios Analyzer.

**Key Tasks for the Design Architect (Jane):**

1.  **Thoroughly Review this Lean MVP PRD:** Understand the focused project goals (CGT estimation), target users, revised functional requirements (especially the simplified scope for tax calculations and plan management – only a single active plan, no named save slots UI for MVP), NFRs, and UI/UX goals.
2.  **Map Key User Flows (Lean MVP):** Focus on primary user journeys for:
    * Initial setup (Active Plan naming, global assets).
    * Creating a Baseline Scenario (from CGT-focused template or custom, inputting gross income for context, expenses, *effective CGT rates*).
    * Adding and configuring Comparison Scenarios (focused on CGT parameters).
    * Defining Personal Qualitative Goals and customizing Scenario Attributes.
    * Navigating the Comparison Dashboard (Overview Table, Scenario Summary Cards – displaying CGT results, overall financials, qualitative scores).
    * Accessing and understanding the Detailed Scenario View (showing CGT impact, qualitative details).
    * Using the simple "Share Plan" URL generation for the Active Plan.
    * Handling the simplified overwrite prompt when loading external URLs.
3.  **Create Wireframes or Conceptual Mockups/Descriptions (Lean MVP):** For key screens/views supporting the above flows. Leverage ShadCN UI components as the primary component library.
4.  **Detail UI Element States and Feedback:** Specify important states for interactive elements and how the system provides feedback (including for the simplified overwrite prompt and basic auto-save status).
5.  **Specify Usability & Accessibility Considerations:** Ensure design choices actively support NFRs. Document any specific considerations for UI elements like tooltips (as mentioned in NFR 2).
6.  **Populate or Create the `front-end-spec.md` Document (Lean MVP):** Systematically document the UI/UX specifications for the lean MVP scope.
7.  **Ensure PRD Enrichment/Linkage:** Confirm that this PRD is either updated with key UI/UX decisions or clearly references the detailed `front-end-spec.md`.

Please guide the user (Vibe CEO) through this process for the **Lean MVP**.

---
## Initial Architect Prompt (for New Lean MVP Architecture Document)

**Objective:** To take this **Lean MVP** Product Requirements Document (PRD) and the forthcoming UI/UX Specification (for Lean MVP) and create a **new, simplified technical architecture document** specifically for this focused MVP. The existing comprehensive `architecture-v3.md` document should serve as a reference for how deferred features *could* be architected later, but the new MVP architecture document must strictly reflect only the lean scope defined in this PRD.

**Primary Inputs:**
1.  This Lean MVP PRD document (Version 1.1).
2.  The UI/UX Specification for Lean MVP (`front-end-spec.md` – to be created by the Design Architect based on this PRD).
3.  (For Reference Only for deferred items) The comprehensive `architecture-v3.md` document.
4.  The current Frontend Architecture Document (`frontend-architecture.md` – to be reviewed for alignment with lean MVP UI/UX, and potentially simplified by the Design Architect/Architect).

**Key Tasks for the Architect (Fred):**

1.  **Create New Lean MVP Architecture Document:** Based on this PRD, develop a new, streamlined architecture document (e.g., `architecture-lean-mvp.md`).
2.  **Data Models (Lean MVP):** Define data models (`UserAppState`, `Scenario`, `Asset`, `AppConfig`, etc.) supporting *only* the lean MVP features. For example:
    * `Scenario` model will only require fields for effective Capital Gains Tax rates for MVP engine use. Fields like `defaultEffectiveIncomeTaxRate`, and direct `propertyTaxRate`, `consumptionTaxRate` fields (for engine calculation by scenario rates) should be omitted from the MVP `Scenario` model if not used by any MVP feature or STF. The `IncomeSource` model may be simplified (e.g., `overrideEffectiveTaxRate` not used by MVP engine).
    * `AppConfig` will contain simpler `templateScenarios` (CGT-focused) and potentially fewer `globalSpecialTaxFeatures` for MVP.
    * Qualitative models (`GlobalQualitativeConcept`, `UserQualitativeGoal`, `ScenarioAttribute`) are retained.
    * No structures for multiple named saved plan lists in `localStorage` (only single active plan persistence to a primary slot, e.g., `taxAnalyzer_activePlan`). The detailed `SavedPlanEntry[]` structure is for post-MVP.
3.  **Calculation Engine Logic (Lean MVP):** Document the engine to *only* calculate Capital Gains Tax (using user-provided effective rates from the `Scenario` object) and the Qualitative Fit Score. Detail how STFs (MVP scope, CGT-focused) modify CGT.
4.  **Application Data Flow (Lean MVP):** Detail flows for single active plan persistence (auto-save to primary slot), URL sharing, and the simplified overwrite prompt mechanism.
5.  **Align with Frontend Architecture:** Ensure the lean MVP architecture aligns with `frontend-architecture.md` (which may also need minor scope alignment by Design Architect/Architect if it currently reflects the more comprehensive `architecture-v3.md`).
6.  *(Other tasks like Error Handling, Security, Deployment from `architecture-v3.md` remain relevant but should be reviewed and applied/documented appropriately for the leaner scope).*

The goal is a new, clean architecture document strictly for implementing this focused Capital Gains Tax Estimator MVP, distinct from the more comprehensive `architecture-v3.md`.
