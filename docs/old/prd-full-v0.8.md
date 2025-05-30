# Tax Scenarios Analyzer MVP Product Requirements Document (PRD)

**Version:** 0.9
**Date:** May 29, 2025
**Author:** John (PM Agent) & Vibe CEO (User)

## Document Purpose and Management

This Product Requirements Document (PRD) outlines the goals, features, and requirements for the Minimum Viable Product (MVP) of the Tax Scenarios Analyzer. It is intended to be a guiding document for development. As this is a personal project driven by the User/Developer, this PRD will be treated as a living document. Updates, revisions, and communication regarding changes will be managed through direct review and iterative refinement of the document by the User/Developer.

## Goal, Objective and Context

The **primary goal** of the Tax Scenarios Analyzer MVP is to provide individuals with a general yet insightful tool to compare the financial and qualitative impacts of changing their tax residency across different US states and international countries. The application will empower users to make more informed decisions about tax residency planning, with a particular emphasis on understanding the potential financial impact of capital gains.

**Key Objectives for the MVP:**

1.  **Scenario Comparison:** Enable users to define a "Baseline Scenario" and compare it against multiple "Comparison Scenarios" by specifying alternative tax residency locations.
2.  **Financial Projections:** Provide approximate year-by-year financial projections, including gross income (from various sources/locales), living expenses, planned asset sales, estimated total tax burden (focusing on capital gains, earned income, and rental property income), additional scenario-specific costs, and the overall net financial outcome.
3.  **Qualitative Assessment:** Integrate qualitative factors by allowing users to define and weigh personal goals, and assess each scenario's "lifestyle fit" based on relevant location attributes.
4.  **Intuitive Interface:** Present a clear, intuitive comparison dashboard highlighting key financial and qualitative metrics, with options for detailed drill-down views.
5.  **Data Management:** Offer robust client-side data persistence via `localStorage` and features to manage named plans and share scenario data via URL encoding.
6.  **Clear Scope & Limitations:** Operate as a simplified estimation tool, explicitly outlining its limitations regarding the complexity of tax laws and the non-provision of professional advice.

**Context:**

The Tax Scenarios Analyzer MVP will be a client-side web application. It is designed for individuals exploring tax residency changes who need a tool to gain a general understanding of potential financial benefits, particularly from a capital gains perspective, and to assess qualitative lifestyle fits before seeking professional advice.

**MVP Success Metrics:**

The success of the Tax Scenarios Analyzer MVP will be evaluated based on the following key metrics:

1.  **Task Completion:** Users can successfully create a baseline scenario and at least one comparison scenario, inputting representative financial and qualitative data.
2.  **Insight Generation:** After using the tool, users can articulate the key financial and qualitative differences between their compared scenarios.
3.  **User-Perceived Utility (Qualitative):** Initial users (primarily the developer in this personal project context) report the tool as understandable and helpful in conceptualizing tax residency impacts.

**Further Context Notes for MVP:**

* **Problem Scope:** While the need for clarity in tax residency planning is significant for affected individuals, detailed quantification of the total addressable market or the monetary impact of the problem solved is not a primary objective for this personal MVP.
* **Competitive Landscape:** A formal competitive analysis against existing financial planning or tax tools is considered out of scope for this MVP, as the project's initial focus is on building a specific set of functionalities envisioned by the developer. The unique value is perceived in its combination of focused tax estimations (capital gains emphasis) and the integrated qualitative assessment.
* **Timeframe for Market Goals:** As a personal project, specific timeframes for achieving broader market or user adoption goals are not defined for this MVP phase.

**MVP Validation Approach & Criteria for Moving Beyond MVP**

The validation of this MVP will primarily involve:
* Confirmation that all defined User Stories meet their Acceptance Criteria through developer testing.
* Evaluation against the "MVP Success Metrics" (Task Completion, Insight Generation, User-Perceived Utility) by the primary developer and potentially a small group of initial volunteer testers.

Consideration for moving beyond the MVP to develop features listed in the "Out of Scope Ideas Post MVP" section will be based on the following criteria:
1.  All defined MVP User Stories are fully implemented, tested, and verifiably meet their Acceptance Criteria.
2.  The MVP demonstrably achieves its defined "MVP Success Metrics" through initial testing and evaluation.
3.  There is an identified interest in, or clear potential for, expanded use cases for the application, or a discernible market interest emerges that would justify investment in a more extensive feature set.

## Functional Requirements (MVP)

The Tax Scenarios Analyzer MVP must provide the following functionalities:

1.  **Scenario Management & Setup:**
    * The system must provide access to a list of pre-configured example scenarios (e.g., via clickable descriptions/links on the application page) that load using the shareable URL mechanism, allowing users to explore the tool's capabilities with sample data.
    * Users must be able to create a "Baseline Scenario" representing their current or default financial and qualitative situation from scratch.
    * Users must be able to add multiple "Comparison Scenarios." When creating a new comparison scenario, users must have the option to:
        * Start with location-specific defaults by selecting a new location (realized by copying a `templateScenario`).
        * Create a copy based on any existing scenario (baseline or another comparison scenario), inheriting its data as a starting point.
    * The system must pre-populate new scenarios (when created from a template) with default data (e.g., tax rates, cost of living, location attributes) sourced from the chosen `templateScenario`. For custom scenarios, these start blank for user input.
    * The system must support intelligent data inheritance (e.g., a global asset list is available to all scenarios within the Active Plan).
    * Users must be able to override inherited or copied data for scenario-specific details (e.g., a custom plan for asset sales within a particular scenario).

2.  **Detailed Financial Projections & Calculations:**
    * The system must perform year-based financial modeling over a user-defined projection period.
    * Users must be able to input multiple income sources per year, specifying amounts, income types, and geographical source locales.
    * Users must be able to input detailed annual expenses, including one-time additional costs and recurring annual additional costs.
    * Users must be able to manage a list of their assets (including name, quantity, cost basis, Fair Market Value).
    * Users must be able to define flexible "Planned Sales Per Year" for assets to enable capital gains calculations, with options for global defaults and scenario-specific overrides.
        * During the input or modification of an individual planned asset sale, the system must provide an immediate, clearly labeled *estimated* capital gain or loss preview for that specific transaction, based on available asset data (e.g., cost basis, acquisition date, relevant residency dates if applicable) and the planned sale details.
    * The system must apply `special_tax_features` (e.g., Puerto Rico Act 60 rules) using pre-built JavaScript functions, based on user inputs required for these features.
    * The system must calculate estimated taxes, specifically for:
        * Capital gains (long-term and short-term).
        * Earned income (salaries/wages).
        * Rental property income.
        * These calculations will be based on the tax rules (user-provided effective rates for MVP) of the scenario's specified location and relevant user inputs.
    * The system must be able to display relevant descriptive notes, short summaries, and any provided non-binding "eligibility hints" associated with `special_tax_features` or location-specific tax rules (e.g., from the static JSON data in `AppConfig`) to help clarify their impact and relevance within the detailed view or relevant input sections.

3.  **Qualitative Comparison:**
    * Users must be able to define and assign weights to their personal `goal_categories` (which are based on `UserQualitativeGoal` definitions linked to `GlobalQualitativeConcept`s).
    * The system must present location-specific qualitative `attributes` (as `ScenarioAttribute`s linked to `GlobalQualitativeConcept`s,) which may be pre-populated from `templateScenarios` with default `userSentiment` and `significanceToUser` values.
    * Users must be able to customize the `userSentiment` and `significanceToUser` of these attributes for each scenario.
    * Users must be able to add their own custom `attributes` to any scenario by selecting from `GlobalQualitativeConcept`s and then defining their perspective.
    * The system must calculate and display a "Qualitative Fit Score" for each scenario, reflecting alignment with user goals and weighted attributes.

4.  **Intuitive Comparison Dashboard & Views:**
    * Users must be able to select a subset of their created scenarios (e.g., up to a defined maximum, like five) for side-by-side comparison.
    * The system must display a persistent "Overview Table" providing side-by-side key financial and qualitative metrics for the **user-selected subset of scenarios** covering the entire projection period.
        * The "Overview Table" must allow users to sort data by its key columns.
    * The system must provide interactive "Scenario Summary Cards" for a quick overview of each created scenario, allowing access to detailed views regardless of whether it's in the active comparison subset.
    * The system must offer a "Detailed View" (e.g., a separate page, expandable section, or modal) for in-depth, year-by-year analysis of any single selected scenario, including comprehensive tax breakdowns, income/expense details, and qualitative attribute specifics.

5.  **Data Input, Feedback, & Plan Management:**
    * The system's data input interfaces (forms) must support clear labeling of fields, logical grouping of related inputs, and provide immediate, contextual feedback for validation errors (e.g., displaying error messages next to the problematic input).
    * The system must provide clear and timely feedback to the user (e.g., success messages, error notifications/toasts) for core data operations, including but not limited to, auto-saving the current active plan, generating an external shareable URL, and loading data.
    * **Named Plan Management:**
        * Users must be able to explicitly save the current Active Plan to `localStorage` under a user-defined name (this involves storing its generated shareable URL string representation).
        * Users must be able to view a list of their named saved plans stored in `localStorage`.
        * When a user chooses to load one of their named saved plans:
            * If the current Active Plan has unsaved changes or as a general precaution, the system should prompt the user if they wish to save the current Active Plan first.
            * The selected named plan must replace the current active working plan (this internal load should bypass the multi-choice prompts typically shown for external URL loads).
        * Users must be able to delete a named saved plan from their list in `localStorage`.
    * **Loading External Shared Data:** Upon loading data from an *external* shared URL (including example scenario links), if an active working plan is present, the system must first automatically preserve the current Active Plan (e.g., by saving it to the list of named saved plans, prompting for a name if untitled and has content) and then offer the user choices for how to proceed with the incoming data (e.g., replace active plan, add to active plan's scenarios, view temporarily, or discard shared data).

6.  **Core Data Persistence & Sharing Mechanisms:**
    * The system must continuously auto-save the *current Active Plan* (all user-entered scenario data) to the browser's `localStorage`.
    * Users must be able to generate an *external* sharable URL ("On-Demand Share") by serializing, compressing, and URL-encoding their current Active Plan.
    * The system must be able to load scenario data from an *external* shared URL.

## Non-Functional Requirements (MVP)

1.  **Performance:**
    * **Responsiveness:** The application UI should remain responsive during user interactions, with minimal lag, especially during data input and scenario navigation.
    * **Calculation Time:** Scenario calculations should complete within a reasonable timeframe (e.g., a few seconds for a moderately complex set of scenarios as defined by the data volume targets below) to avoid frustrating the user. The system should provide feedback (e.g., a loading indicator) if calculations take more than 1-2 seconds.
    * **Load Time:** The initial application load time should be optimized for a good user experience on a typical internet connection.
2.  **Usability:**
    * **Learnability:** New users should be able to understand the basic workflow (creating a baseline, adding a comparison scenario, viewing results) with minimal guidance. The "example scenario links" and clear UI design (e.g., incorporating tooltips for more detailed information on fields or headers) will support this.
    * **Efficiency:** Once familiar, users should be able to efficiently manage scenarios, input data, and compare results.
    * **Clarity:** Information, especially financial projections and qualitative scores, must be presented clearly and be understandable as estimations. All labels, instructions, and feedback messages must be clear and unambiguous.
    * **Error Prevention & Recovery:** The system should guide users to prevent data input errors where possible. Error messages must be clear and help users recover.
3.  **Reliability & Availability:**
    * **Client-Side Stability:** The application must run stably within supported web browsers without frequent crashes or freezes.
    * **Data Persistence:** `localStorage` operations for auto-saving the Active Plan and managing Saved Plans must be robust. The system should handle potential `localStorage` errors gracefully (e.g., if storage is full or disabled).
4.  **Security (Client-Side Focus):**
    * The application must implement measures to prevent common client-side vulnerabilities, such as Cross-Site Scripting (XSS), particularly if any user-generated content (like custom attribute names) is rendered.
    * Data shared via URL encoding should be handled securely on the client-side during parsing to prevent injection attacks.
    * Basic security testing for common client-side vulnerabilities (e.g., XSS through input fields, secure handling of data loaded from URLs) should be performed during development.
5.  **Accuracy & Data Integrity (for an Estimation Tool):**
    * **Calculation Consistency:** Given the same set of inputs and tax rules (from the static JSON or scenario data), the calculation engine must produce consistent and repeatable results.
    * **Transparency of Estimation:** The application must clearly and prominently display disclaimers stating that it provides estimations only, is not professional advice, relies on user input accuracy, and that default data (tax rates, etc.) may not be current and should be verified.
6.  **Maintainability (Developer Focus):**
    * The codebase should be well-organized, following the principles outlined in the architecture documents (e.g., modular components, separation of concerns) to facilitate understanding, debugging, and future enhancements.
    * Code should be commented where necessary to explain complex logic.
7.  **Compatibility:**
    * The application must be compatible with the latest stable versions of major modern web browsers (e.g., Chrome, Firefox, Safari, Edge).
8.  **Data Volume & URL Sharing Constraints (Indicative MVP Targets):**
    * The system should be designed with the following indicative upper limits in mind for a single "Active Plan" to ensure reasonable client-side performance and functional URL sharing:
        * **Scenarios per Plan:** Up to approximately 20 scenarios.
        * **Assets per Plan:** Up to approximately 20 unique assets.
        * **Projection Years:** Up to approximately 20 years.
    * The UI for the comparison dashboard is intended to comfortably display a user-selected subset of scenarios (e.g., 5-7 at a time from the Active Plan).
    * The number of "Named Saved Plans" stored in `localStorage` (as URL-encoded strings) should be targeted around 10, subject to `localStorage` capacity and overall performance.
    * *Note: These are initial targets and may be subject to refinement based on technical testing of URL length limitations and client-side performance.*
    * **Scalability:** The system is designed to handle the indicative data volumes specified for the MVP. Scalability for significantly larger datasets, a substantially higher number of saved plans, or features requiring extensive server-side processing would necessitate architectural changes (e.g., backend integration) and is considered a post-MVP enhancement.
9.  **Accessibility (A11y):**
    * The application should strive for a good level of accessibility, making it usable by people with diverse abilities. Adherence to best practices will be supported by the planned use of ShadCN UI components and clear UX design.
10. **Data Quality & Validation:** The system must enforce basic data validation for all user inputs to maintain data integrity for calculations. This includes checks for data types (e.g., numeric, date), required fields, and reasonable ranges or formats where applicable (e.g., positive numbers for financial amounts).
11. **Data Retention:** User data (Active Plan, Named Saved Plans) is stored in the browser's `localStorage`. Retention of this data is therefore subject to browser limitations, browser-specific `localStorage` eviction policies, and direct user actions such as clearing browser data. Users can manage their 'Named Saved Plans' through the application's delete functionality (as defined in Epic 5).
12. **User Support:** Formal user support channels or dedicated technical support are considered out of scope for this personal project MVP. The application will rely on its inherent usability, clear error messaging, and any provided disclaimers or informational notes to guide the user.
13. **Development Environment:** The project will utilize a standard modern web development environment based on Node.js, Vite, and common front-end tooling (e.g., ESLint, Prettier, as guided by the Frontend Architecture Document).

## User Interaction and Design Goals

This section outlines the high-level vision and goals for the User Experience (UX) and User Interface (UI) of the Tax Scenarios Analyzer MVP. It will serve as a brief for the Design Architect.

* **Overall Vision & Desired User Experience:**
    * The application should have a **modern and minimalist** visual appearance. While it is a data-heavy application, the design should strive to maintain this clean aesthetic, ensuring clarity and avoiding clutter.
    * The primary goal is for users to **quickly understand how to use the application** and feel empowered to explore different tax scenarios to identify potential financial benefits and qualitative fits. The experience should be intuitive and encourage exploration.

* **Key Interaction Paradigms:**
    * For MVP, data entry (e.g., for assets, income sources, expenses) will primarily be **form-based**.
    * For list-based inputs such as assets or income sources, users should be able to easily **add new items sequentially** (e.g., "add a row" or "add another asset" with its details).
    * A key interaction for efficiency will be the ability to **duplicate an existing item** (like an asset or income source) and then tweak its details, rather than entering each new similar item from scratch.
    * (Post-MVP Consideration: More complex spreadsheet-like data entry structures could be explored if form-based input proves limiting for power users).

* **Core Screens/Views (Conceptual - Product Perspective):**
    * **Plan & Scenario Setup Area:** A dedicated interface for creating and editing the details of the Active Plan, its baseline scenario, and multiple comparison scenarios (including financial inputs, asset lists, sales plans, qualitative attributes, and special tax features).
    * **Comparison Dashboard:** The main view for side-by-side comparison, featuring the "Overview Table" (for a selected subset of scenarios) and "Scenario Summary Cards" for all scenarios in the Active Plan.
    * **Detailed Scenario View:** An in-depth view (e.g., separate page, expandable section) for analyzing a single scenario's year-by-year projections and qualitative details.
    * **Saved Plans Management View:** An interface for users to view, load, save, and delete their named "Plans."

* **Accessibility Aspirations:**
    * The application should achieve a **good baseline level of accessibility**, ensuring it is usable by people with diverse abilities. This will be supported by the planned use of accessible UI component libraries (like ShadCN UI, as noted in the Frontend Architecture document).

* **Branding Considerations (High-Level):**
    * For the MVP, no specific branding elements (e.g., logos, custom color palettes beyond a clean, modern theme) are defined. The design should prioritize clarity, professionalism, and ease of use, consistent with a tool handling financial estimations.

* **Target Devices/Platforms:**
    * The primary target platform is **web desktop**, given the data-intensive nature of the application and the common use of tables and detailed forms.
    * However, the application **must be responsive and usable on mobile devices** (tablets and phones). While not necessarily a "mobile-first" optimized experience where every feature is perfectly tailored for small screens in the MVP, users should be able to access key information, perform core tasks, and view comparisons reasonably well on mobile.

## Technical Assumptions

The Tax Scenarios Analyzer MVP will be developed with the following technical assumptions and high-level architectural decisions:

1.  **Core Application Type:** The application is a **client-side only Single-Page Application (SPA)**, with all logic, calculations, and data storage (for the MVP) occurring within the user's web browser. There is **no backend server or database component** for the MVP.
2.  **Primary Technology Stack (Frontend):**
    * Language: **TypeScript**
    * Framework/Library: **React**
    * Build Tool: **Vite**
    * Styling: **Tailwind CSS**
    * UI Components: **ShadCN UI components** will be used extensively.
    * State Management: **Zustand** for global application state, supplemented by React Hooks (`useState`/`useReducer`) for local component state.
    * Routing: **React Router DOM**
    * Data Compression (for sharing): **LZ-String** or a similar library.
    * The selected technology stack reflects the developer's preferred modern frontend development environment for this personal project. A formal evaluation of alternative stacks or detailed trade-off analysis is out of scope for this MVP PRD.
3.  **Data Management:**
    * Default application data (e.g., `templateScenarios`, `globalQualitativeConcepts`, `globalSpecialTaxFeatures`) will be managed via **static JSON files** (or JS objects) bundled with the client-side application, forming the `AppConfig`.
    * User-generated data (Active Plan, Named Saved Plans, scenarios, assets, goals) will be persisted in the user's browser via **`localStorage`**.
4.  **Calculations:** All financial and qualitative calculations are performed **client-side** using JavaScript/TypeScript, driven by internally modularized "basic tax feature" functions applying user-provided effective rates and explicitly selected "Special Tax Features".
5.  **Deployment:** The application will be deployed to a static web hosting platform, with **Cloudflare Pages** being the planned choice.
6.  **Repository & Service Architecture:**
    * **Service Architecture:** Given the client-side only nature of the MVP, the service architecture is effectively a **Monolith (Client-Side SPA)**. All application logic resides and executes within the single frontend application.
    * **Repository Structure:** The project will utilize a **Single Repository (Monorepo)** structure, as it comprises a single, cohesive client-side application for the MVP.
    * **Rationale:** This approach (Client-Side Monolith in a Single Repo) is chosen for MVP due to its simplicity, ease of development and deployment for a solo developer, and alignment with the serverless nature of the application. It minimizes overhead and focuses efforts on delivering the core client-side functionality.
7.  **Technical Debt:** The approach to technical debt for the MVP will be to strive for clean, maintainable code while prioritizing the delivery of core functionality. Known shortcuts or areas identified for future refactoring will be documented internally by the developer for post-MVP consideration.

## Epic Overview

This section details the Epics and their constituent User Stories for the MVP.

**Epic 1: Foundational Setup, Core Data Input & Basic Plan Persistence/Loading**
* **Goal:** Establish the basic application structure, allow users to name their "Active Plan," define global assets, and input core financial data for a "Baseline Scenario." Ensure the "Active Plan" is automatically saved to and reloaded from `localStorage`. Enable loading of externally defined plans via the shareable URL mechanism for initial testing and example scenario access.

    * **Story 1.0: Populate Initial MVP Static Configuration Data**
        * **User Story:** "As the project developer, I need a small, representative initial set of static `AppConfig` data – including a few `templateScenarios` for diverse key locales, a foundational list of `globalQualitativeConcepts`, and core `globalSpecialTaxFeatures` – to be defined and integrated, so that early development and testing of core application functionality (like scenario creation from templates, basic calculations, and qualitative assessment setup) can proceed effectively."
        * **Acceptance Criteria (ACs):**
            1.  A process for identifying and prioritizing a small set (e.g., 2-3) of diverse locales suitable for initial `templateScenarios` is completed. This may involve brief targeted research (potentially guided by the Analyst agent) on common locations considered for tax purposes.
            2.  For each prioritized locale, a complete `templateScenario` JSON object is created and added to the `appConfig.templateScenarios` array. Each such template must include:
                a.  All required scenario identification fields (`displayLocationName`, `locationCountry`, `locationState` (if applicable), `locationCity` (if applicable)).
                b.  A self-contained set of MVP-appropriate effective tax rates (`incomeTaxRates`, `capitalGainsTaxRates`, `propertyTaxRate`, `consumptionTaxRate`). For MVP, `incomeTaxRates` and `capitalGainsTaxRates` will each hold a single object representing user-provided effective rates.
                c.  A representative list of `annualExpenses.categories` with default amounts.
                d.  A representative list of `scenarioSpecificAttributes` (each linked to a `conceptId` from `globalQualitativeConcepts`) with plausible default `userSentiment` and `significanceToUser` values.
            3.  An initial list of approximately 10-15 diverse `globalQualitativeConcepts` is defined and added to `appConfig.globalQualitativeConcepts`. Each concept must include its `id`, `name`, `category`, and optionally `description`.
            4.  At least one to two core `globalSpecialTaxFeatures` (e.g., a simplified "Act 60-like" feature that `requiresGainBifurcation`, and perhaps another simpler feature) are defined and added to `appConfig.globalSpecialTaxFeatures`. Each definition must include its `id`, `name`, `description`, `appliesTo` field, `inputs` schema (if any), and the `requiresGainBifurcation` flag.
            5.  A strategy is acknowledged for using AI assistance (e.g., by tasking the Analyst, Architect, or Design Architect agents with generating specific prompts) to help create the detailed JSON/JavaScript object data for the items in ACs 2, 3, and 4.
            6.  The created initial static data for `templateScenarios`, `globalQualitativeConcepts`, and `globalSpecialTaxFeatures` is successfully integrated into the application's `AppConfig` structure and is verifiably loadable by the application at startup.
            7.  The structure and content of this initial static data fully align with the models defined in the latest version of `architecture-v2.md`.

    * **Story 1.1: Initialize Basic Application Shell & "Active Plan" Concept**
        * **User Story:** "As a user, I want a basic application shell to load in my browser with a clear area to name my current "Active Plan," so that I can start organizing my tax scenario analysis."
        * **Acceptance Criteria (ACs):**
            1.  When the application is loaded in a supported web browser, a basic UI shell is displayed. This shell includes placeholder areas for a header, main content, and footer.
            2.  The UI shell prominently features an input field or dedicated area where the name of the current "Active Plan" can be displayed and edited.
            3.  On initial application load, if no "Active Plan" name is found (e.g., in `localStorage`), the "Active Plan" name input field may display a default placeholder (e.g., "Untitled Plan") or be empty, ready for user input.
            4.  The user can type a custom name into the "Active Plan" name input field.
            5.  The name entered by the user for the "Active Plan" is captured and held in the application's internal state. (Note: Persistent saving of this name to `localStorage` will be covered in Story 1.4).
            6.  The basic application shell demonstrates foundational responsiveness, adapting its layout fluidly to different screen sizes (desktop, tablet, and mobile).
            7.  This story does not include the implementation of any specific financial data input fields, scenario creation logic, or calculation functionalities.

    * **Story 1.2: Implement Global Asset Management**
        * **User Story:** "As a user, I want to define and manage a global list of my financial assets (including essential details like name, quantity, cost basis, and acquisition date) within my Active Plan, so that this core asset information can be used consistently across all scenarios I create."
        * **Acceptance Criteria (ACs):**
            1.  A dedicated User Interface (UI) section exists for managing a global list of financial assets associated with the "Active Plan."
            2.  Users can add a new asset to this global list. The input form for a new asset must allow for the entry of the following details:
                a.  Asset Name (text input, required).
                b.  Quantity (numeric input, required).
                c.  Cost Basis per Unit (numeric input, required, representing original purchase price per unit).
                d.  Acquisition Date (date input, e.g., "YYYY-MM-DD", required).
                e.  Asset Type (optional input, e.g., a dropdown with options like "STOCK," "CRYPTO," "REAL\_ESTATE," "OTHER").
                f.  Fair Market Value (FMV) per Unit (optional numeric input, representing current value per unit).
            3.  The system provides an intuitive way to add multiple assets sequentially (e.g., after saving an asset, the form clears or an "Add Another Asset" option is available).
            4.  The system provides a function to duplicate an existing asset's details into the new asset entry form, allowing the user to then modify only the necessary fields for the new asset.
            5.  All entered global assets are displayed in a clear, readable list or table format, showing their key defined details.
            6.  Users can select an existing asset from the list to view and edit its details.
            7.  Users can delete an asset from the global list. A confirmation step must be included to prevent accidental deletion.
            8.  All asset data (additions, edits, deletions) is stored as part of the current "Active Plan" in the application's internal state. (Persistent saving of the Active Plan to `localStorage` is covered in Story 1.4).
            9.  The UI for asset management is responsive and usable across different screen sizes.
            *(Note: The fields `residencyAcquisitionDate` and `valueAtResidencyAcquisitionDatePerUnit` are no longer part of the global asset definition. They will be captured at the scenario level for specific assets when relevant special tax features are applied, as will be detailed in a story within Epic 3).*

    * **Story 1.3: Create Baseline Scenario & Input Core Financials**
        * **User Story:** "As a user, I want to establish my "Baseline Scenario" within my Active Plan by either selecting a predefined template scenario to customize or by defining a custom location and then inputting its core financial details (like primary income sources and annual expenses), so that I have a foundational scenario representing my current or chosen baseline situation."
        * **Acceptance Criteria (ACs):**
            1.  Within the "Active Plan," the user can initiate the creation or definition of the "Baseline Scenario."
            2.  When establishing the Baseline Scenario, the user must be presented with options to either:
                a.  **Start from a Template:** Select from a list of available `templateScenarios` (sourced from `appConfig.templateScenarios`). Upon selection, a deep copy of the chosen `templateScenario` (including its predefined location name components, tax rates, default expenses, qualitative attributes, etc.) becomes the user's Baseline Scenario within their Active Plan.
                b.  **Create a Custom Scenario:** Opt to create a custom Baseline Scenario. In this case, the user must input the location details: `displayLocationName` (e.g., "My Current US Setup"), `locationCountry`, `locationState` (optional), `locationCity` (optional). This custom scenario will start with empty or minimal default structures for income sources, annual expenses, and all tax parameters (which will be defined by the user in later stories).
            3.  Regardless of the creation method (template or custom), the user can subsequently input and manage a list of `IncomeSource` objects for the Baseline Scenario. For each income source, the UI must allow specifying: Name (text input, required); Type (e.g., a dropdown with options "EMPLOYMENT," "RENTAL\_PROPERTY," "OTHER," as per `IncomeSource` model); Annual Amount (numeric input, required); Start Year (numeric input, required, relative to the projection period); End Year (optional numeric input). *(Note: The `locationId` field for individual `IncomeSource` objects will not have a dedicated UI input in this story. Its data model presence is for future use, to be detailed in a later story focusing on jurisdiction-specific income taxation.)*
            4.  The system provides an intuitive interface to add multiple income sources sequentially, edit existing income sources, and delete income sources for the Baseline Scenario.
            5.  Regardless of the creation method, the user can subsequently input and manage `AnnualExpense` categories for the Baseline Scenario. (If created from a template, these might be pre-populated from the template's `annualExpenses.categories` and be editable). For each expense category, the UI must allow specifying: Name (text input, required); Amount (annual numeric input, required).
            6.  Users can input a value for overall `annualExpenses.additionalCosts` (a lump sum for non-categorized annual costs) for the Baseline Scenario.
            7.  The system provides an intuitive interface to add new expense categories, edit existing expense categories (names and amounts), and delete expense categories for the Baseline Scenario.
            8.  All entered/modified data for the Baseline Scenario (whether derived from a template or custom, including its location name components, income sources, annual expenses) is stored as part of the current "Active Plan" in the application's internal state. (Persistent saving of the Active Plan to `localStorage` is covered in Story 1.4).
            9.  The UI for defining the Baseline Scenario and its core financials is responsive and usable across different screen sizes.
            10. *(Note: For a "custom" Baseline Scenario, the input of its specific tax rates and rules is not covered in this story; it will be handled in a later story when tax calculations are implemented. For a baseline created from a template, the tax rates are copied from the template and are part of the scenario object, editable like any other scenario data in later stories if needed).*

    * **Story 1.4: Implement `localStorage` Persistence for the Active Plan**
        * **User Story:** "As a user, I want my entire "Active Plan" (including its name, global assets, and all scenario data) to be automatically saved to my browser's local storage as I make changes, and reloaded when I revisit the application, so that my work is preserved between sessions without manual save actions."
        * **Acceptance Criteria (ACs):**
            1.  Any modification to the "Active Plan" data (e.g., changes to its name, additions/edits/deletions of global assets, or updates to any scenario data within it like baseline income/expenses) must trigger an automatic save of the entire current "Active Plan" state to the browser's `localStorage`.
            2.  The auto-save mechanism should be efficient, occurring frequently enough (e.g., on significant data changes, or after a short period of inactivity post-change) to minimize potential data loss, without negatively impacting UI responsiveness.
            3.  When the application is launched or refreshed, it must first attempt to load an "Active Plan" state from `localStorage`.
            4.  If a previously saved "Active Plan" (including its name and all associated data like assets and scenarios) is found in `localStorage`, this data must be loaded and become the current "Active Plan," allowing the user to seamlessly resume their prior session.
            5.  If no "Active Plan" data is found in `localStorage` (e.g., on first-time use or if `localStorage` has been cleared), the application must initialize with a new, empty "Active Plan" state as defined in Story 1.1.
            6.  The application must gracefully handle potential errors during `localStorage` write operations (e.g., storage quota exceeded, security restrictions). If an auto-save fails, the user should be discreetly informed (e.g., a status indicator or a non-intrusive notification) that their latest changes might not be persisted locally. The application should continue to function with the in-memory data.
            7.  The application must also gracefully handle potential errors during `localStorage` read operations (e.g., corrupted data). If data cannot be read or parsed correctly, the application should start with a fresh, empty "Active Plan" and inform the user that previous data could not be loaded.
            8.  The data persisted in `localStorage` must be a serialized representation of the "Active Plan" name and the complete `UserAppState` object (which includes `initialAssets` and all `scenarios` belonging to that plan, as defined in `architecture-v2.md`).

    * **Story 1.5: Implement Loading & Generation of Plan Data via Shareable URL Strings**
        * **User Stories:**
            * *(Loading)* "As a user, when I open the application with an external shared URL containing plan data, I want my current Active Plan to be automatically preserved in my list of saved plans, and then the data from the URL loaded as my new Active Plan, so I can explore shared or example data without losing my current work and without unnecessary interruptions."
            * *(Generating - for Dev/Testing initially)* "As a developer (for testing and creating examples), I want a mechanism (e.g., a developer-only UI element or a browser console function) to generate a compressed, URL-encoded string representing the current Active Plan, so I can create shareable links for testing or for use as example scenarios."
        * **Acceptance Criteria (ACs):**
            * **A. Loading Plan Data from an External URL:**
                1.  The application, upon launch, must check for a designated query parameter in the URL that contains a plan data string.
                2.  If such a parameter is found, the system must attempt to: URL-decode the string; Decompress the string (e.g., using LZ-String, as per technical specifications); Deserialize the resulting JSON into the application's "Active Plan" structure (including plan name and `UserAppState`).
                3.  If the data from the URL is successfully parsed into a valid "Active Plan" structure:
                    a.  Before loading the new data, the system must automatically preserve the current (pre-load) "Active Plan" by ensuring it is saved to the list of named saved plans in `localStorage`. If the current Active Plan is "Untitled" (or has a default name like "Untitled Plan") but contains data, it is automatically saved to the list of named saved plans, using its current display name (e.g., "Untitled Plan") possibly appended with a timestamp or a counter if an "Untitled Plan" entry already exists, to ensure it's saved without requiring an immediate user prompt for a name *at this specific moment of loading an external link*. The user can manage (rename, delete) these entries later from their list of saved plans. If the current Active Plan has a user-defined name, its existing entry in the saved plans list is updated with the current state.
                    b.  The plan data loaded from the URL then replaces the current "Active Plan" in the application's active state.
                    c.  The newly loaded "Active Plan" should be assigned a name (e.g., "Loaded from Link - [Timestamp]" or derive from the loaded data if possible, or default to "Untitled Plan"). The user can rename this plan later if they choose to keep and explicitly save it to their list of named plans.
                4.  If the URL parameter data is malformed, cannot be decompressed, or does not parse into a valid "Active Plan" structure, the application must: Gracefully handle the error (e.g., log the error to the console for developers); Inform the user that the shared data could not be loaded; Proceed to load the "Active Plan" from `localStorage` as per Story 1.4, or start with a new "Active Plan" if no local data exists.
                5.  Successfully loading a plan from an external URL updates the application view to reflect the new "Active Plan" data.
            * **B. Generating a Shareable URL String (Developer-Focused Mechanism for this Story):**
                6.  A developer-accessible mechanism (e.g., a function callable from the browser's developer console, or a temporary, non-production UI element) must be implemented to trigger the generation of a shareable URL string from the current "Active Plan."
                7.  When this mechanism is triggered, the system must: Take the current "Active Plan" data (including its name and the full `UserAppState`); Serialize this data to a JSON string; Compress the JSON string (e.g., using LZ-String); URL-encode the compressed string.
                8.  The resulting compressed, URL-encoded string must be made available to the developer (e.g., output to the console, displayed in a temporary text field for easy copying).
                9.  The chosen compression library (e.g., LZ-String) is successfully integrated and functional for both compression and decompression.

    * **Story 1.6: Display Example Scenario Links**
        * **User Story:** "As a user, I want to see a clearly presented list of links to pre-configured example scenarios on the application page, so that I can easily click to load and explore them using the external URL loading mechanism (established in Story 1.5)."
        * **Acceptance Criteria (ACs):**
            1.  A clearly identifiable and accessible section within the application UI (e.g., a panel on the welcome page, a dedicated "Examples" area) is used to display links to pre-configured example scenarios.
            2.  This section lists at least one, and potentially several, example scenarios. Each example must have a descriptive title (e.g., "Exploring US State Tax Differences," "Capital Gains Focused International Move").
            3.  Each listed example scenario must be presented as a clickable UI element (e.g., a hyperlink, a button, or a card).
            4.  Each clickable element for an example scenario must internally be associated with a complete, pre-generated shareable URL string (created using the developer mechanism from Story 1.5, Part B) that represents a full "Active Plan" data set.
            5.  When a user clicks on an example scenario's link/button, the application must trigger the loading mechanism defined in Story 1.5, Part A, using the associated shareable URL string. This includes: Automatically preserving the user's current "Active Plan" to their list of saved plans in `localStorage` (as detailed in Story 1.5, AC 3.a); Loading the data from the example scenario's URL string as the new "Active Plan."
            6.  The list of example scenarios (titles and their corresponding shareable URLs) is defined as static data within the application's frontend code or configuration for the MVP.
            7.  The UI presenting these example scenario links must be responsive and easy to navigate.

**Epic 2: Multi-Scenario Creation & Basic Financial Comparison**
* **Goal:** Enable users to create multiple "Comparison Scenarios" within their Active Plan by selecting different locations (with pre-populated defaults from `templateScenarios` or by copying existing scenarios). Implement core tax calculations (earned income, basic capital gains, rental income using scenario-defined effective rates) and display a basic side-by-side financial comparison.

    * **Story 2.1: Create Comparison Scenario from Template or as Custom**
        * **User Story:** "As a user, I want to add a new "Comparison Scenario" to my Active Plan, either by selecting a predefined `templateScenario` to get a fully configured starting point for a specific location, or by creating a 'custom' scenario where I define the location and will subsequently input all its parameters, so I can model and compare different hypothetical situations."
        * **Acceptance Criteria (ACs):**
            1.  Within the "Active Plan," the user can initiate the creation of a new "Comparison Scenario."
            2.  When creating a new Comparison Scenario, the user must be presented with options to either:
                a.  **Start from a Template:** Select from a list of available `templateScenarios` (sourced from `appConfig.templateScenarios`). Upon selection, a deep copy of the chosen `templateScenario` is created, assigned a new unique scenario ID, and added to the "Active Plan" as a new Comparison Scenario. This copy includes all data from the template (location name components, pre-defined income/expenses if any, tax rates, default qualitative attributes, etc.). The user should be able to give this new scenario a custom display name (e.g., "PR Move Option 1").
                b.  **Create a Custom Scenario:** Opt to create a custom Comparison Scenario. In this case, the user must input the location details: `displayLocationName`, `locationCountry`, `locationState` (optional), `locationCity` (optional). This custom scenario is assigned a new unique scenario ID, added to the Active Plan, and will start with empty or minimal default structures for income sources, annual expenses, and all tax parameters (which will be defined by the user in later stories or in Story 2.3).
            3.  The newly created Comparison Scenario (whether from a template or custom) is added to the list of scenarios within the current "Active Plan" in the application's internal state. (Persistence to `localStorage` is handled by Story 1.4).
            4.  After creation, the user should be able to navigate to an interface to edit the details of this new Comparison Scenario (covered by Story 2.3).
            5.  The UI for these methods of creating a Comparison Scenario is responsive and user-friendly.
            6.  *(Note: The detailed input of financial data like income/expenses for this new Comparison Scenario is covered by Story 2.3. The input of specific tax rates for a "custom" Comparison Scenario is not covered in this story but will be handled later.)*

    * **Story 2.2: Create Comparison Scenario by Copying an Existing Scenario**
        * **User Story:** "As a user, I want to create a new "Comparison Scenario" by duplicating an existing scenario (Baseline or another Comparison Scenario) within my Active Plan, so that I can quickly create variations for comparison without re-entering all common data."
        * **Acceptance Criteria (ACs):**
            1.  The user must be able to select any existing scenario (either the Baseline or any existing Comparison Scenario) within their current "Active Plan" to serve as a source for duplication.
            2.  A clear UI action (e.g., a "Copy Scenario" or "Duplicate Scenario" button/option, likely available on a scenario summary card or in a scenario management view) must be available to initiate the copying process for a selected source scenario.
            3.  When the copy action is triggered:
                a.  The system performs a deep copy of all data from the selected source scenario to create a new scenario object. This includes its location name components (`displayLocationName`, `locationCountry`, etc.), all tax parameters (`incomeTaxRates`, `capitalGainsTaxRates`, etc.), income sources, expenses, planned asset sales, selected special tax features with their inputs, and qualitative attributes.
                b.  The newly created scenario is assigned a new, unique scenario ID.
                c.  The `displayLocationName` for the new scenario initially defaults to a name indicating it's a copy (e.g., "Copy of [Source Scenario's Display Name]") or prompts the user to provide a new `displayLocationName` immediately upon copying.
            4.  The new, copied scenario is added to the list of scenarios within the current "Active Plan" in the application's internal state. (Persistence to `localStorage` is handled by Story 1.4).
            5.  After the copy is created, the user can then edit any details of this new scenario independently (as per Story 2.3).
            6.  The UI for selecting a scenario to copy and for initiating the copy process is responsive and user-friendly.

    * **Story 2.3: Edit Core Financial Details of Comparison Scenarios**
        * **User Story:** "As a user, once I have created a Comparison Scenario, I want to be able to edit its core financial details (such as its identifying name, location components, income sources, and annual expenses) independently from other scenarios, so I can accurately tailor it to the specific hypothetical situation I am exploring."
        * **Acceptance Criteria (ACs):**
            1.  Users must be able to select any existing Comparison Scenario within their "Active Plan" to open it for editing.
            2.  When editing a Comparison Scenario, users must be able to modify the following identifying and setup fields for that specific scenario: `displayLocationName` (text input); `locationCountry` (text input or dropdown); `locationState` (optional text input or dropdown); `locationCity` (optional text input); `projectionPeriodYears` (numeric input); `residencyStartDate` (optional date input).
            3.  If a user modifies the location name components (country, state, city) of a scenario that was originally created from a `templateScenario`, the scenario's previously copied tax rates and other parameters (like default expenses) from the original template remain as they were copied. They are not automatically re-looked up or reset based on the new location name components, as each scenario is self-contained. (The user would need to manually adjust tax rates if desired, which is covered by a later story).
            4.  Users must be able to add, edit, and delete `IncomeSource` objects (including their name, type, annual amount, start year, end year) specifically for the selected Comparison Scenario, using an interface consistent with how income sources are managed for the Baseline Scenario (as defined in Story 1.3).
            5.  Users must be able to add, edit, and delete `AnnualExpense` categories (including name and amount) and edit the overall `annualExpenses.additionalCosts` specifically for the selected Comparison Scenario, using an interface consistent with how expenses are managed for the Baseline Scenario (as defined in Story 1.3).
            6.  All modifications made to a Comparison Scenario's details are saved within that specific scenario object in the "Active Plan's" internal state. (Persistent saving of the Active Plan to `localStorage` is covered by Story 1.4).
            7.  The user interface for editing these core details of a Comparison Scenario must be responsive and user-friendly.
            8.  *(Note: This story focuses on editing the scenario's identifiers, general setup (like projection period), and primary financial inputs (income, expenses). The UI for directly editing detailed tax rate arrays (e.g., `incomeTaxRates`, `capitalGainsTaxRates`) within any scenario will be addressed in a subsequent story, likely in Epic 3 when advanced financial modeling or scenario customization is detailed.)*

    * **Story 2.4: Implement Basic Tax Calculation Engine (Using Scenario-Defined Effective Rates)**
        * **User Story:** "As a user, I want the system to calculate estimated taxes for each of my scenarios by applying the *effective tax rates I have defined within each scenario* for earned income, basic capital gains (differentiating long-term vs. short-term), and rental property income, so I can understand the primary tax implications based on my own rate assumptions for each situation."
        * **Acceptance Criteria (ACs):**
            1.  A set of internal "basic tax feature" JavaScript functions are implemented (e.g., one for income-related taxes, one for capital gains taxes).
            2.  These functions are orchestrated by the main calculation engine to process a given `Scenario` object and the global `UserAppState` (for `initialAssets`).
            3.  For each year within a given `Scenario`'s `projectionPeriodYears`:
                a.  The engine correctly calculates total gross earned income for the year from all `IncomeSource` objects of type "EMPLOYMENT" active in that year.
                b.  The engine correctly calculates total gross rental income for the year from all `IncomeSource` objects of type "RENTAL_PROPERTY" active in that year.
                c.  The engine correctly calculates total capital gains from all `PlannedAssetSale` objects scheduled for that year:
                    i.  For each sale, the gain/loss is calculated as `(SaleQuantity * SalePricePerUnit) - (SaleQuantity * AssetCostBasisPerUnit)`.
                    ii. For each sale, the holding period is determined by comparing the `Asset.acquisitionDate` with the sale year/date.
                    iii.Capital gains are correctly categorized as short-term (e.g., held <= 1 year) or long-term (e.g., held > 1 year) based on standard definitions.
            4.  The "basic tax feature" function for income-related taxes:
                a.  Takes the sum of taxable earned income and taxable rental income for the year as input. (Note: For MVP, "taxable" initially means gross income from these sources, or uses a very simple standard deduction if globally defined/assumed, as this story does not cover complex deduction logic).
                b.  Retrieves the user-defined effective income tax rate(s) directly from the `Scenario.incomeTaxRates` array (for MVP, this array may contain just a single `TaxRate` object representing the user's effective combined federal/state rate, or separate effective rates if the structure supports it and the user provides them).
                c.  Applies this effective rate(s) to the income to calculate the income tax for the year. This function does *not* implement progressive bracket processing itself for MVP; it applies the rate(s) given in the scenario.
            5.  The "basic tax feature" function for capital gains taxes:
                a.  Takes the calculated short-term and long-term capital gains for the year as input.
                b.  Retrieves the user-defined effective short-term and long-term capital gains tax rates from the `Scenario.capitalGainsTaxRates` array (for MVP, this array may contain just one `CapitalGainsTaxRate` object with the ST/LT effective rates).
                c.  Applies these effective rates to the respective gain amounts to calculate the capital gains tax for the year. This function does *not* implement progressive bracket processing itself for MVP.
            6.  The calculated income tax and capital gains tax for each year are made available (e.g., within `ScenarioYearlyProjection.taxBreakdown`).
            7.  The overall calculation engine is structured to first apply these "basic tax feature" functions and then, in a subsequent step (covered by Story 3.4), apply any *explicitly selected* `SpecialTaxFeatures` which might modify these initial tax estimations.
            8.  Basic property tax and consumption tax calculations are *not* required for this story.
            9.  The calculation engine includes basic error handling if essential rate data is missing from a `Scenario` object for these basic calculations (e.g., logs an error, tax component for that year is $0 or calculation is flagged).

    * **Story 2.5: Display Basic "Scenario Summary Cards" with Calculated Outcomes**
        * **User Story:** "As a user, I want to see a "Scenario Summary Card" for each scenario (Baseline and Comparisons) in my Active Plan, displaying key identifying information (like scenario name, location) and high-level calculated financial outcomes (e.g., total estimated tax, net financial outcome after taxes and expenses for the entire projection period), so I can get a quick, comparable overview of each scenario."
        * **Acceptance Criteria (ACs):**
            1.  For every `Scenario` object currently in the user's "Active Plan" for which calculations have been run (as per Story 2.4), a corresponding "Scenario Summary Card" must be displayed in the UI.
            2.  Each Scenario Summary Card must clearly display at least the following identifying information for its respective scenario: The scenario's `displayLocationName` (or user-defined scenario name if that's distinct and preferred as the primary card title); The primary location context (e.g., `locationCountry`, and `locationState` if applicable).
            3.  Each Scenario Summary Card must display key high-level calculated financial outcomes for that scenario, aggregated over its entire `projectionPeriodYears`. This data is sourced from the `ScenarioResults` object for that scenario: Total Net Financial Outcome over the period; Total Estimated Taxes over the period (sum of `totalTax` from all `yearlyProjections`).
            4.  The information on each summary card must be presented in a clear, concise, and easily scannable format to facilitate quick comparison between scenarios.
            5.  Scenario Summary Cards must be visually distinct elements in the UI.
            6.  Each Scenario Summary Card must be interactive, providing a clear UI mechanism (e.g., the card itself being clickable, or a dedicated "View Details" button) that will eventually navigate the user to the "Detailed View" for that specific scenario (the Detailed View itself is implemented in a later story).
            7.  Each Scenario Summary Card must include a UI control (e.g., a checkbox, toggle switch) allowing the user to select or deselect that scenario for inclusion in the main "Overview Comparison Table" (as per FR 4.1).
            8.  The collection of Scenario Summary Cards must be displayed in a responsive layout that adapts well to various screen sizes (desktop, tablet, mobile).
            9.  The data displayed on the Scenario Summary Cards must dynamically update if the underlying scenario data is modified and recalculated.

    * **Story 2.6: Implement Initial "Overview Comparison Table" with Key Financials**
        * **User Story:** "As a user, I want to be able to select a subset of my scenarios to be displayed in an "Overview Comparison Table" that shows key financial metrics (e.g., gross income, total expenses, total estimated taxes, net financial outcome for the entire projection period) side-by-side for these selected scenarios, and I want to be able to sort this table by its key metric columns, so I can directly compare their overall financial implications."
        * **Acceptance Criteria (ACs):**
            1.  An "Overview Comparison Table" UI component is implemented and displayed prominently in the application (e.g., on the main dashboard).
            2.  The table only displays data for the scenarios that the user has actively selected for comparison (using the selection mechanism provided on the Scenario Summary Cards from Story 2.5).
            3.  Each selected scenario is primarily represented as a column (or a distinct set of columns if multiple sub-metrics per scenario are shown per row) in the table. The scenario's `displayLocationName` (or custom scenario name) must be clearly visible as a header for its respective column(s).
            4.  Each row in the table represents a key financial metric, aggregated over the *entire projection period* for each displayed scenario. For this initial implementation, these metrics must include (at a minimum), sourced from each scenario's `ScenarioResults`: Total Gross Income (sum of `grossIncome` from all `yearlyProjections`); Total Annual Expenses (sum of `totalExpenses` from all `yearlyProjections`); Total Estimated Taxes (sum of `totalTax` from the `taxBreakdown` in all `yearlyProjections`, focusing on the tax types calculated in Story 2.4); Total Net Financial Outcome Over Period (`totalNetFinancialOutcomeOverPeriod` from `ScenarioResults`).
            5.  Users must be able to sort the scenarios displayed in the table (i.e., sort the columns, or effectively reorder rows based on values in a chosen column) by clicking on the header of any of the key financial metric rows (e.g., clicking "Total Net Financial Outcome" should sort scenarios by that value in ascending/descending order).
            6.  The data presented in the Overview Comparison Table must dynamically update if: The underlying data or calculations for any of the displayed scenarios change; The user changes the selection of scenarios to be included in the comparison.
            7.  The table must be presented in a clear, readable format. For responsiveness: On wider screens, all selected scenarios and metrics should be easily viewable; On smaller screens (e.g., tablet, mobile), the table must remain usable, potentially by employing horizontal scrolling for scenarios if many are selected, or by adapting the layout (e.g., transposing table, or showing fewer scenarios by default).
            8.  *(Note: This initial version of the Overview Comparison Table focuses on the primary financial outcome metrics calculated in Story 2.4. The inclusion of qualitative metrics in this table will be addressed in Epic 4).*

**Epic 3: Advanced Financial Modeling & Special Tax Features**
* **Goal:** Enhance the financial projections by incorporating detailed asset sales planning (including the "Asset Sale Profit Preview" during input) and the application of `special_tax_features` with their descriptive notes/hints.

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

**Epic 5: Named Plan Management & Enhanced Sharing**
* **Goal:** To implement features for managing multiple *named* "Plans" within `localStorage` (saving the Active Plan under a name, listing, loading, and deleting these named plans, with automatic preservation of current work before switching contexts). Also includes the functionality for users to *generate* their own external shareable URLs from their Active Plan.

    * **Story 5.1: Manage Active Plan Identity (Display Name & Lock Status Indication)**
        * **User Story:** "As a user, I want to be able to assign or change the display name of my current "Active Plan" at any time through a clear UI input. If my Active Plan was loaded from a "locked" Named Saved Plan, I want the application to clearly indicate it's locked and prevent edits until I explicitly unlock it, and I want to be able to toggle this lock status for my active work if it corresponds to a saved plan."
        * **Acceptance Criteria (ACs):**
            1.  The UI clearly displays the `currentPlanDisplayName` of the "Active Plan" being worked on.
            2.  Users can edit the `currentPlanDisplayName` of the Active Plan via a direct and accessible input field. Changes to this name are reflected immediately in the UI and the in-memory Active Plan state. (This name becomes the internal `activePlanName` when the plan is serialized).
            3.  If the Active Plan was loaded from a Named Saved Plan that had its `isLocked` status set to `true`:
                a.  The UI must clearly indicate that the Active Plan is currently "locked" (e.g., via a visual indicator like a lock icon, and/or a status message).
                b.  Most data input fields and editing controls related to scenario content (e.g., for assets, income, expenses, qualitative attributes, scenario structure) must be disabled or read-only.
            4.  If the Active Plan is "locked" (as per AC 3), a clear UI control (e.g., an "Unlock Plan" button or toggle) must be available to unlock it. Activating this control sets an in-memory `isActivePlanLocked` status to `false`, enabling all editing controls.
            5.  If the Active Plan is "unlocked" and corresponds to a Named Saved Plan (i.e., it has an associated `currentPlanUUID`), a clear UI control (e.g., a "Lock Plan" button or toggle) must be available to lock it. Activating this control sets the in-memory `isActivePlanLocked` status to `true`.
            6.  Changes to the Active Plan's lock status (in-memory `isActivePlanLocked`) are persisted to the corresponding Named Saved Plan's `isLocked` property in `localStorage` only when an explicit "Save" action (Story 5.2) is performed for that plan.
            7.  The UI elements for managing the Active Plan's name and lock status are responsive and user-friendly.

    * **Story 5.2: Explicitly Save Active Plan to Named Saved Plan Slots (Save / Save As)**
        * **User Story:** "As a user, I want an explicit "Save" option that: a) if my Active Plan has a `currentPlanUUID` (meaning it was loaded from or previously saved to a specific Named Saved Plan slot), updates that saved plan with my current Active Plan's state (including its display name as the internal name, and its current lock status) and its `lastSavedDate`; b) if my Active Plan is new or "Untitled" (or does not have a `currentPlanUUID`), prompts me for a `userDisplayName` to create a new Named Saved Plan entry. I also want a "Save As" option that always creates a new Named Saved Plan (with a new internal `planUUID`), prompts for a `userDisplayName`, and saves my current Active Plan's state as initially unlocked."
        * **Acceptance Criteria (ACs):**
            * **"Save" Functionality:**
                1.  A "Save" UI action (e.g., button) is prominently available.
                2.  If the current Active Plan has an associated `currentPlanUUID` (identifying an existing entry in the list of Named Saved Plans): The system updates the corresponding entry in the `localStorage` list of Named Saved Plans (matched by `planUUID`); The entry's `compressedPlanDataString` is updated with the current Active Plan's state (which includes its `currentPlanDisplayName` as the internal `activePlanName`); The entry's `userDisplayName` in the list is updated to match the Active Plan's `currentPlanDisplayName`; The entry's `isLocked` status in the list is updated from the Active Plan's current in-memory `isActivePlanLocked` status; The entry's `lastSavedDate` is updated to the current timestamp; User is provided with feedback of successful save.
                3.  If the current Active Plan does *not* have an associated `currentPlanUUID` (e.g., it's a new plan initiated from scratch, an "Untitled Plan," or a plan loaded from an external URL that hasn't been explicitly saved to the named list yet): The system prompts the user to provide a `userDisplayName` for this new Named Saved Plan; A new `planUUID` is generated; A new entry is created in the `localStorage` list of Named Saved Plans with the new `planUUID`, user-provided `userDisplayName`, current timestamp as `createDate` and `lastSavedDate`, the Active Plan's current in-memory `isActivePlanLocked` status (which would typically default to `false` for a first explicit save), and the `compressedPlanDataString` of the Active Plan; The current Active Plan in memory becomes associated with this new `planUUID` and its `currentPlanDisplayName` is confirmed; User is provided with feedback of successful save.
            * **"Save As" Functionality:**
                4.  A "Save As" UI action is available.
                5.  When triggered, the system always creates a *new* Named Saved Plan entry: A new `planUUID` is generated; The system prompts the user for a `userDisplayName` for this new entry (can default to "Copy of [current Active Plan name]" or the current Active Plan name if it's "Untitled"); A new entry is created in the `localStorage` list of Named Saved Plans with the new `planUUID`, user-provided `userDisplayName`, current timestamp as `createDate` and `lastSavedDate`, an `isLocked` status of `false` (new copies/saves-as are initially unlocked), and the `compressedPlanDataString` of the current Active Plan; The current Active Plan in memory becomes associated with this *new* `planUUID`, and its `currentPlanDisplayName` is updated to the name given during the "Save As" process; User is provided with feedback of successful save.
            * The `compressedPlanDataString` generated for saving (in both "Save" and "Save As") is created using the serialization, compression, and encoding logic established in Story 1.5.

    * **Story 5.3: Manage and Load from List of Named Saved Plans (View, Load, Delete, Clone, Rename, Lock/Unlock)**
        * **User Story:** "As a user, I want to be able to view a list of all my "Named Saved Plans" (showing their display name, last saved date, creation date, and lock status). From this list, I want to: a) Load a selected plan as my new "Active Plan" (with my previous active work being appropriately preserved first through a clear prompt if it has unsaved changes). b) Delete a plan (with confirmation). c) Clone a plan (creating a new, unlocked Named Saved Plan, prompting for a name). d) Rename (the display name of) a plan. e) Toggle the lock/unlock status of a plan."
        * **Acceptance Criteria (ACs):**
            1.  A dedicated UI section or view is available that displays a list of all "Named Saved Plans" retrieved from `localStorage`.
            2.  For each Named Saved Plan in the list, the following metadata must be clearly displayed: `userDisplayName`; `lastSavedDate` (formatted for readability); `createDate` (formatted for readability); A clear visual indicator of its `isLocked` status.
            3.  **Loading a Named Saved Plan:** Users can select a plan from the list and trigger a "Load" action; If the current Active Plan has unsaved changes (is "dirty" relative to its last explicit save to a named slot, or is an "Untitled Plan" with significant content not yet explicitly saved to the named list): The system prompts the user: "Your current plan '[Active Plan Name]' has unsaved changes. Would you like to save these changes to '[Active Plan Name]' before loading the new plan?" with options like [Save Current & Load Selected], [Load Selected Without Saving Current Changes to Named Plan], [Cancel Load]; If "[Save Current & Load Selected]" is chosen (and the current active plan needs a name/slot), the save action from Story 5.2 (AC 2 or 3) is performed for the current active plan; The selected Named Saved Plan's `compressedPlanDataString` is then loaded, decompressed, and deserialized to become the new Active Plan's content; The Active Plan's `currentPlanUUID`, `currentPlanDisplayName`, and in-memory `isActivePlanLocked` status are updated to match the metadata of the loaded Named Saved Plan; The application view updates to reflect the newly loaded Active Plan.
            4.  **Deleting a Named Saved Plan:** Users can trigger a "Delete" action for a specific plan in the list; A confirmation prompt (e.g., "Are you sure you want to delete '[userDisplayName]'? This action cannot be undone.") is displayed before deletion; Upon user confirmation, the selected plan entry is permanently removed from the list in `localStorage`.
            5.  **Cloning a Named Saved Plan (from the list):** Users can trigger a "Clone" action for a specific plan in the list; A new unique `planUUID` is generated by the system; The user is prompted to provide a `userDisplayName` for the new cloned plan (e.g., the prompt may default to "Copy of [source plan's `userDisplayName`] "); A new entry is created in the `localStorage` list of Named Saved Plans with the new `planUUID`, the user-provided `userDisplayName`, the current timestamp as both `createDate` and `lastSavedDate`, an `isLocked` status of `false`, and a deep copy of the source plan's `compressedPlanDataString`.
            6.  **Renaming a Named Saved Plan (its `userDisplayName` in the list):** Users can trigger a "Rename" action for a specific plan in the list; The user is prompted to input a new `userDisplayName`; The `userDisplayName` property for the corresponding `planUUID` is updated in the `localStorage` list. The `lastSavedDate` for the entry is *not* changed by this action. This action does *not* alter the `compressedPlanDataString` or its internal `activePlanName`.
            7.  **Toggling Lock/Unlock Status of a Named Saved Plan (in the list):** Users can trigger a "Lock" or "Unlock" action for a specific plan in the list, which toggles its `isLocked` status; The `isLocked` boolean for the corresponding `planUUID` is updated in the `localStorage` list, and its `lastSavedDate` is updated to the current timestamp.
            8.  The displayed list of saved plans dynamically and accurately reflects any changes resulting from these management actions (additions from Save/Save As/Clone, deletions, renames, lock status changes).
            9.  The UI for managing this list of Named Saved Plans is responsive and user-friendly.

    * **Story 5.4: Implement User-Facing "Generate Shareable URL" Feature for Active Plan**
        * **User Story:** "As a user, I want a clear and accessible "Share Plan" button or option in the UI that, when clicked, generates a compressed, URL-encoded string representing my current "Active Plan," which I can then copy to my clipboard to share with others, so they can load my exact set of scenarios and data."
        * **Acceptance Criteria (ACs):**
            1.  A clearly visible and accessible "Share Plan" UI action (e.g., button, menu item) is available to the user, typically when an Active Plan is loaded and being viewed/edited.
            2.  When this "Share Plan" action is triggered by the user: The system takes the current "Active Plan" data (which includes its `currentPlanDisplayName` as the internal `activePlanName`, and the full `UserAppState` containing assets, scenarios, and qualitative goals); This data is serialized to JSON, compressed (e.g., using LZ-String), and then URL-encoded, using the same core logic established in Story 1.5 Part B.
            3.  The resulting complete shareable URL (base application URL + query parameter with the encoded string) is presented to the user in a manner that facilitates easy copying to their clipboard (e.g., displayed in a read-only text field with an adjacent "Copy to Clipboard" button).
            4.  The user receives clear feedback when the link has been generated and is ready for copying (e.g., "Shareable link copied to clipboard!" or "Link ready to copy:").
            5.  The UI for this feature is responsive and straightforward to use.

## Key Reference Documents

* **Project Brief: Tax Scenarios Analyzer MVP (`productbrief-v2.md`)**: The initial document outlining the project's vision, goals, and high-level scope.
* **Tax Scenarios Analyzer MVP Architecture Document (`architecture-v2.md`)**: Details the overall technical architecture, data models, and calculation engine logic.
* **Tax Scenarios Analyzer MVP Frontend Architecture Document (`frontend-architecture.md`)**: Details the specific frontend architecture, technology stack, component strategy, and UI patterns.
* **UI/UX Specification Document (`front-end-spec.md` - to be created by Design Architect)**: This document will detail the user flows, wireframes, mockups, and specific UI/UX design guidelines.
* **(Future) Sharded Documents**: As the project progresses, sections of this PRD (like detailed Epics/Stories) and the Architecture documents may be sharded into more granular documents for easier management and consumption by developer agents. These would also be cataloged here.

## Out of Scope Ideas Post MVP

The following features and capabilities are considered out of scope for the initial Minimum Viable Product (MVP). Items are generally deferred to maintain a lean MVP, focusing on core value delivery, rapid iteration, and validating the fundamental concept. They may be considered for future versions based on feedback and evolving project goals.

* **Advanced Data Input Simplification:** Tools for bulk editing or duplicating entries across multiple years for income/expenses/asset sales.
* **Spreadsheet-Like Data Entry Structures:** More complex grid-based input for financial data.
* **Detailed Tax Calculation Explanations:** Step-by-step breakdowns of *how* every single tax calculation is performed within the UI.
* **Advanced Table Interactions:** Features like filtering or hiding columns in the "Overview Comparison Table" beyond basic sorting.
* **Plan Versioning:** Storing multiple versions of a single Named Saved Plan for rollback.
* **AI-Driven Scenario Builder:** Natural language input to auto-generate scenarios.
* **Expanded Tax Law Specificity:** Incorporating wealth tax, gift tax, estate tax, self-employment tax, detailed deductions, credits, AMT.
* **Full Progressive Tax Bracket Processing by Basic Features:** While the data structures support it, the MVP's basic tax features apply user-provided effective rates. Full bracket processing within these basic features is a future enhancement.
* **Detailed Residency/Eligibility Guidance & Validation:** Providing specific advice or validation on meeting tax residency rules.
* **Advanced Multi-Scenario Comparison Visualizations:** More sophisticated charts and graphs beyond the initial table and summary cards.
* **Digital Nomad Specifics:** Extended support for complex multi-country tax rules for nomads without a fixed tax home.
* **Dynamic Data Feeds for Location Defaults:** Real-time updates for tax rates/cost of living instead of static JSON.
* **User Accounts & Cloud Storage (Backend Migration):** Moving beyond `localStorage` for centralized data storage and user accounts.
* **Monetization Features.**
* **PDF/Printable Reports.**
* **Third-Party Financial Tool Integrations.**
* **Full Internationalization (i18n) / Localization (L10n) beyond basic data handling.**
* **Server-Side Rendering (SSR) / Static Site Generation (SSG).**
* **Web Workers for heavy calculations** (if performance with MVP approach becomes an issue).

## [OPTIONAL: For Simplified PM-to-Development Workflow Only] Core Technical Decisions & Application Structure

This section is **not applicable** to our current project, as we have opted for the "Outcome Focused" PRD workflow, which involves collaboration with dedicated Architect and Design Architect agents for detailed technical design.

## Document Purpose and Management

This Product Requirements Document (PRD) outlines the goals, features, and requirements for the Minimum Viable Product (MVP) of the Tax Scenarios Analyzer. It is intended to be a guiding document for development. As this is a personal project driven by the User/Developer, this PRD will be treated as a living document. Updates, revisions, and communication regarding changes will be managed through direct review and iterative refinement of the document by the User/Developer.

## Change Log

| Change                                               | Date       | Version | Description                                                      | Author          |
| :--------------------------------------------------- | :--------- | :------ | :--------------------------------------------------------------- | :-------------- |
| Initial PRD Draft - Sections 1-5                     | 2025-05-29 | 0.1     | Initial draft of Goals, FR, NFR, UI/UX, TechAs.                  | John (PM Agent) |
| Epic Overview Defined (Epics 1-5 Titles/Goals)          | 2025-05-29 | 0.2     | Defined 5 Epics and their high-level goals.                      | John (PM Agent) |
| Epic 1 Stories Detailed (1.0-1.6)                    | 2025-05-29 | 0.3     | Detailed User Stories & ACs for Epic 1. Revised for data strategy. | John (PM Agent) |
| Epic 2 Stories Detailed (2.1-2.6)                    | 2025-05-29 | 0.4     | Detailed User Stories & ACs for Epic 2. Aligned with Arch v2.    | John (PM Agent) |
| Epic 3 Stories Detailed (3.1-3.4)                    | 2025-05-29 | 0.5     | Detailed User Stories & ACs for Epic 3. Aligned with Arch v2.    | John (PM Agent) |
| Epic 4 Stories Detailed (4.1-4.5)                    | 2025-05-29 | 0.6     | Detailed User Stories & ACs for Epic 4. Aligned with Arch v2.    | John (PM Agent) |
| Epic 5 Stories Detailed (5.1-5.4)                    | 2025-05-29 | 0.7     | Detailed User Stories & ACs for Epic 5. Aligned with Arch v2.    | John (PM Agent) |
| Remaining PRD Sections Initialized & Checklist Notes | 2025-05-29 | 0.8     | Added Out of Scope, Change Log, Prompts, Checklist notes.        | John (PM Agent) |
| Full PRD Assembled                                   | 2025-05-29 | 0.9     | Assembled all sections into final draft for review.              | John (PM Agent) |

*(This log will be updated as the PRD evolves further or is formally versioned).*

## Checklist Results Report (`pm-checklist`)

**Date of Review:** May 29, 2025
**Reviewer:** John (PM Agent) with Vibe CEO (User)

**Overall Assessment:** The Product Requirements Document (PRD) for the Tax Scenarios Analyzer MVP has been iteratively developed and reviewed against the `pm-checklist`. All sections have been addressed, and necessary clarifications or additions have been conceptually incorporated into the PRD content. The PRD is deemed comprehensive and ready for its intended purpose of guiding subsequent design and architectural refinement.

**Summary Table of Checklist Sections:**

| Category                        | Status | Notes / Key Resolutions                                                                                                                               |
| :------------------------------ | :----- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Problem Definition & Context | PASS   | Success metrics defined. Scope notes for quantification, differentiation, and competitive analysis added for MVP context.                             |
| 2. MVP Scope Definition         | PASS   | Rationale for out-of-scope items, feedback mechanisms, and criteria for moving beyond MVP clarified and added.                                      |
| 3. User Experience Requirements | PASS   | High-level UX goals are set. Detailed user flows and UI specifications are correctly deferred to the Design Architect and UI/UX Specification document. |
| 4. Functional Requirements      | PASS   | Comprehensive FRs and detailed User Stories with ACs for all 5 Epics defined and approved.                                                          |
| 5. Non-Functional Requirements  | PASS   | NFRs for scalability, security testing, and dev environment clarified and added.                                                                      |
| 6. Epic & Story Structure       | PASS   | Epics and stories are well-defined, sequenced, and aligned with MVP goals. First epic completeness confirmed.                                         |
| 7. Technical Guidance           | PASS   | Rationale for tech stack choice (developer preference for personal project), tech debt approach, and MVP monitoring scope clarified and added.            |
| 8. Cross-Functional Requirements| PASS   | NFRs for data quality, data retention (localStorage), and MVP support scope clarified and added. Integration requirements are N/A for MVP.            |
| 9. Clarity & Communication      | PASS   | Documentation quality meets standards for PRD. Stakeholder (user) input and approval process consistently followed. Communication plan note added.      |

**Critical Deficiencies Identified:** None. All identified partials or fails during the checklist review were addressed through discussion and agreement to add clarifications or specific content to the PRD.

**Recommendations:**
* Proceed with providing this PRD to the Design Architect (Jane) to develop the UI/UX Specification.
* Subsequently, provide the PRD and the UI/UX Specification to the Architect (Fred) for final architectural validation and refinement based on these comprehensive inputs.

---
## Prompt for Design Architect (UI/UX Specification Mode)

**Objective:** To take this Product Requirements Document (PRD) for the Tax Scenarios Analyzer MVP and collaboratively develop a comprehensive UI/UX Specification. This specification should detail user flows, wireframes (or conceptual mockups/descriptions), information architecture, and overall user experience design, ensuring alignment with the product goals and functional requirements defined herein.

**Mode:** UI/UX Specification Mode

**Primary Input:** This completed PRD document for the Tax Scenarios Analyzer MVP.

**Key Tasks for the Design Architect (Jane):**

1.  **Thoroughly Review this PRD:** Understand the project goals, target users (individuals planning tax residency changes), functional requirements (scenario management, financial projections, qualitative assessment, dashboard views, plan management, sharing), non-functional requirements (usability, clarity, responsiveness), and user interaction/design goals (modern, minimalist, intuitive, data-heavy balance, responsive for desktop and mobile).
2.  **Define User Personas (if not sufficiently detailed):** If needed, further elaborate on or create concise user personas based on the PRD's target audience.
3.  **Map Key User Flows:** Visually map out or describe the primary user journeys for core tasks such as:
    * Initial setup (creating/naming an Active Plan, defining global assets).
    * Creating a Baseline Scenario (from template or custom, inputting financials).
    * Adding and configuring Comparison Scenarios (from template, custom, or by copying).
    * Defining and weighting Personal Qualitative Goals.
    * Customizing Scenario-Specific Qualitative Attributes.
    * Navigating and interpreting the Comparison Dashboard (Overview Table, Scenario Summary Cards).
    * Accessing and understanding the Detailed Scenario View.
    * Saving, loading, managing (including locking/unlocking, cloning, renaming), and sharing Plans.
4.  **Develop Information Architecture:** Define the overall structure and navigation of the application (e.g., site map, main navigation elements, how different views connect).
5.  **Create Wireframes or Conceptual Mockups/Descriptions:** For key screens/views identified (e.g., Scenario Editor, Comparison Dashboard, Detailed View, Plan Management interface), create low-to-mid fidelity wireframes or detailed textual descriptions of the layout, key UI elements, and their interactions. Leverage ShadCN UI components as the primary component library, focusing on their composition and specific application within these views.
6.  **Detail UI Element States and Feedback:** Specify important states for interactive elements (e.g., hover, focused, disabled, loading, locked) and how the system provides feedback to the user (including success/error toasts/messages).
7.  **Specify Usability & Accessibility Considerations:** Ensure design choices actively support the NFRs for usability and accessibility. Document any specific ARIA considerations or keyboard navigation patterns for custom compositions if any are anticipated beyond standard ShadCN behavior.
8.  **Populate or Create the `front-end-spec.md` Document:** Systematically document the UI/UX specifications, ideally by populating a structured document like the `front-end-spec-tmpl`.
9.  **Ensure PRD Enrichment/Linkage:** Confirm that this PRD is either updated with key UI/UX decisions or clearly references the detailed `front-end-spec.md`, so together they provide a comprehensive foundation for subsequent frontend architecture refinement and development.

Please guide the user (Vibe CEO) through this process to develop a detailed and actionable UI/UX Specification for the Tax Scenarios Analyzer MVP.

---
## Initial Architect Prompt

**Objective:** To take this Product Requirements Document (PRD) for the Tax Scenarios Analyzer MVP, along with the forthcoming UI/UX Specification (to be created by the Design Architect), and to review, refine, and confirm the existing technical architecture documents (`architecture-v2.md` and `frontend-architecture.md`), ensuring they fully support all defined requirements and provide a robust technical blueprint for development.

**Primary Inputs:**
1.  This completed PRD document for the Tax Scenarios Analyzer MVP.
2.  The UI/UX Specification (`front-end-spec.md` – to be created by the Design Architect based on this PRD).
3.  The current version of the main Architecture Document (`architecture-v2.md` - noting it has already undergone some iterative updates based on PRD feedback).
4.  The current version of the Frontend Architecture Document (`frontend-architecture.md`).

**Key Tasks for the Architect (Fred):**

1.  **Comprehensive Review:** Thoroughly review this finalized PRD and the upcoming UI/UX Specification to ensure a deep understanding of all functional requirements, non-functional requirements, user interaction goals, data models, and user flows.
2.  **Validate Existing Architecture (`architecture-v2.md` and `frontend-architecture.md`):**
    * Confirm that all data models (e.g., `UserAppState`, `Scenario`, `Asset`, `UserQualitativeGoal`, `ScenarioAttribute`, `AppConfig` structures, and the structure for storing multiple named saved plans with UUIDs, display names, create/last saved dates, lock status, and compressed data strings) fully support the requirements.
    * Verify that the calculation engine logic (including the MVP approach of using user-provided effective rates for basic taxes and the handling of Special Tax Features with gain bifurcation), application data flow (including plan management, auto-save, and sharing), error handling, security, and deployment considerations documented are sufficient and appropriate.
    * Ensure the frontend architecture choices (React, Zustand, ShadCN UI, Tailwind CSS) are well-suited to implement the UI/UX Specification.
3.  **Identify and Address Gaps/Conflicts:** If any discrepancies, gaps, or conflicts are found between the PRD/UI-UX-Spec and the existing architecture documents, propose specific revisions to the architecture documents to resolve them. Ensure all architectural decisions explicitly support the defined repository and service architecture (Client-Side Monolith in a Single Repo).
4.  **Refine Technical Details:** Add any further necessary technical details, diagrams, or sequence flows to the architecture documents to provide complete clarity for the development phase, especially for AI developer agents.
5.  **Confirm Technology Choices:** Re-confirm that all technology choices listed in the "Definitive Tech Stack Selections" (which should be part of `architecture-v2.md`) are appropriate and finalized.
6.  **Finalize Architecture Documents:** Produce updated and finalized versions of `architecture-v2.md` (and by extension, ensure `frontend-architecture.md` is aligned or updated by the Design Architect if major UI-related architectural changes arise) that serve as the definitive technical blueprint for the MVP.
7.  **(Optional but Recommended) Technical Story/Task Identification:** Based on the finalized PRD and architecture, identify any critical technical user stories or enabling tasks that may need to be added to the backlog to support the functional user stories (e.g., "Set up initial project structure with Vite, TypeScript, React, Tailwind, Zustand," "Implement core data serialization/compression utilities," "Develop UI components for Named Plan Management list").

Please work with the user (Vibe CEO) to ensure the technical architecture is fully aligned with the product vision and ready for development.

---

This PRD is now complete based on our extensive collaboration!

**Next Steps Recommendation (as per the `create-prd` task):**

1.  **Engage the Design Architect (Jane):** Use the "Prompt for Design Architect (UI/UX Specification Mode)" embedded above. Jane will take this PRD as primary input to collaboratively define and document the detailed UI/UX specifications in a `front-end-spec.md` document. This is crucial for defining the look, feel, and detailed interaction flows.
2.  **Engage the Architect (Fred) for Final Review & Refinement:** Once the UI/UX Specification is reasonably complete, provide Fred with this PRD, the UI/UX Specification, and the current architecture documents (`architecture-v2.md`, `frontend-architecture.md`). Use the "Initial Architect Prompt" embedded above to guide him in ensuring the technical architecture is fully aligned and finalized.
