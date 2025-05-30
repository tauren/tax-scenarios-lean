
# **Project Brief: Tax Scenarios Analyzer MVP**

## **1. Introduction / Executive Summary**

This project aims to develop a **client-side web application** named the "Tax Scenarios Analyzer." Its primary purpose is to empower individuals to **compare the financial and qualitative impacts of changing their tax residency** across different geographical locations (US states and international countries). The MVP will focus on providing **approximate tax calculations for capital gains, earned income, and rental property income**, alongside a unique **qualitative lifestyle fit assessment**. The tool is designed to offer a general idea of potential benefits, particularly from a capital gains perspective, assisting users in making informed decisions about tax residency planning.

## **2. Project Goals and Objectives**

The primary goal of the Tax Scenarios Analyzer MVP is to provide users with a **general yet insightful comparison of different tax residency scenarios**, with a particular emphasis on the **financial impact of capital gains**.

**Specific Objectives:**

* Enable users to define a "Baseline Scenario" representing their current or default financial and qualitative situation.
* Allow users to create and compare multiple "Comparison Scenarios" by specifying alternative tax residency locations.
* Provide approximate year-by-year financial projections, including:
    * Gross income (from multiple sources and locales).
    * Annual living expenses.
    * Planned asset sales.
    * Estimated total tax burden (income, capital gains, property, consumption components).
    * Additional scenario-specific costs (e.g., program fees).
    * Overall net financial outcome.
* Integrate qualitative factors, allowing users to define and weigh personal goals, and assess each scenario's "lifestyle fit" based on relevant attributes.
* Present a clear, intuitive comparison dashboard with key financial and qualitative metrics.
* Offer detailed drill-down views for in-depth analysis of individual scenarios.
* Provide a robust data persistence mechanism via local storage and a sharing feature via URL encoding for user data.
* Maintain a clear scope as a simplified estimation tool, explicitly outlining its limitations regarding tax law complexity and professional advice.

## **3. Key Features**

The MVP of the Tax Scenarios Analyzer will include the following core features:

* **Scenario Management:**
    * Creation of a "Baseline Scenario" with current financial and qualitative data.
    * Ability to add multiple "Comparison Scenarios" for different potential tax residency locations (US states & international).
    * Pre-population of scenario data (tax rates, cost of living, location attributes) based on selected location defaults from JSON.
    * Intelligent data inheritance from the Baseline Scenario (e.g., income projections carry over) with options for scenario-specific overrides (e.g., customize asset sales plan).
* **Detailed Financial Projections:**
    * Year-based financial modeling over a user-defined projection period.
    * Support for multiple income sources per year (e.g., salary, rental income, pension), each with defined amounts, income types, and geographical source locales, allowing for accurate tax calculation based on origin.
    * Detailed input for `annual_expenses`, including `one_time_additional_costs` (e.g., moving fees) and `annual_additional_costs` (e.g., program fees).
    * Management of user assets (name, quantity, cost basis, FMV) and flexible "Planned Sales Per Year" for capital gains calculations, with global default and scenario-specific override options.
    * Application of `special_tax_features` (e.g., Puerto Rico Act 60 rules) via pre-built JavaScript functions, with required user inputs for these features.
* **Qualitative Comparison:**
    * Ability for users to define and weight their personal `goal_categories`.
    * Presentation of location-specific `attributes` (pros/cons) with default `sentiment` and `significance`.
    * User customization of `attribute.sentiment` and `attribute.significance` for each scenario.
    * Option for users to add custom `attributes` to any scenario.
    * Calculation and display of a "Qualitative Fit Score" for each scenario, reflecting alignment with user goals.
* **Intuitive Comparison Dashboard:**
    * A persistent "Overview Table" providing side-by-side key financial and qualitative metrics for all scenarios over the entire projection period.
    * Interactive "Scenario Summary Cards" for quick overview and access to detailed views.
    * A "Detailed View Modal" for in-depth year-by-year analysis of a single selected scenario, including comprehensive tax breakdowns, income/expense details, and qualitative attribute specifics.
* **Data Persistence & Sharing:**
    * Continuous auto-saving of user data to `localStorage` for seamless local persistence.
    * An "On-Demand Share" feature that generates a sharable URL by serializing, compressing (e.g., LZ-String), and URL-encoding the user's current session data.
    * Ability to load scenarios from a shared URL.

## **4. Scope and Limitations**

The MVP of the Tax Scenarios Analyzer is designed as a simplified estimation tool, with clearly defined boundaries to manage expectations and development complexity.

* **Tax Law Specificity:**
    * **Calculated:** The tool will provide approximate calculations for **capital gains (long-term and short-term), earned income (salaries/wages), and rental property income.** It will focus on **US Federal Income Tax, US State Income Tax, and comparable National Income/Capital Gains Taxes for international locales** (e.g., as defined by `special_tax_features`).
    * **NOT Calculated (for MVP):** The tool will **not** automatically calculate or account for sales taxes, gift taxes, wealth taxes, estate taxes, self-employment taxes, individual deductions (standard or itemized), tax credits, Alternative Minimum Tax (AMT), or highly individualized tax situations (e.g., complex business structures). The focus remains on "gross income to gross taxes."
* **Residency & Eligibility Assumptions:**
    * The tool **assumes the user meets all residency requirements and eligibility criteria** for any chosen tax residency location or special program (e.g., physical presence days, program qualifications).
    * The MVP will **not** provide specific guidance on how to meet these requirements or verify eligibility; this remains the user's responsibility.
* **Data Accuracy & Disclaimers:**
    * The tool will **not** display a "Last Published Date" for its data. Instead, it will include a prominent disclaimer stating: "The default values provided for tax rates, costs of living, and program specifics are based on publicly available data and are subject to change without notice. They may not be accurate as of today. Always verify with official government sources or qualified professionals."
    * Clear warnings will be present: The tool **does not provide professional tax, legal, or financial advice; calculations are estimations** and may contain flaws or miscalculations; and the accuracy of results relies heavily on the accuracy of user input.
* **Quality of Life Factors - Scope:**
    * Qualitative assessment is limited to user-defined `attributes` and `weighted_goals`.
    * The MVP will **not** attempt to quantify or directly provide information on broader quality of life aspects such as job availability, school quality, cultural assimilation challenges, language barriers, or detailed healthcare access (beyond general system quality via attributes).
* **User Segment Nuances:**
    * The tool supports **retired individuals** by accommodating income profiles primarily focused on capital gains and rental income.
    * It supports the **tax home aspect of nomadic lifestyles** by allowing for a primary US state tax home, with other countries primarily impacting `annual_expenses`. More complex multi-country tax rule assessments for short-term residencies without a primary tax home change are outside the MVP scope.

## **5. Technical Considerations**

The Tax Scenarios Analyzer MVP will be implemented as a client-side web application, prioritizing simplicity, performance, and user data privacy.

* **Architecture:** Single-page application (SPA) architecture, running entirely in the user's browser.
* **Technology Stack (Frontend):**
    * **Language:** TypeScript
    * **Framework/Library:** React
    * **Styling:** Tailwind CSS
    * **State Management:** React Hooks, potentially complemented by Zustand for global state.
* **Data Storage (Client-Side):**
    * **Default Data:** Location-specific tax rates, cost of living estimates, and qualitative attributes will be stored as static JSON data directly within the application's client-side bundle.
    * **User Data:** User-specific scenario data (baseline, comparison scenarios, goals, projections) will be stored in `localStorage` for persistence across sessions.
* **Calculations:** All financial and qualitative calculations will be performed client-side using JavaScript/TypeScript.
    * `special_tax_features` will be implemented as discrete JavaScript/TypeScript functions referenced by `feature_id` in the JSON, allowing for modular and extensible handling of complex tax rules.
* **No Backend / Database (MVP):** The MVP will be entirely serverless in terms of data storage and processing; no dedicated backend server or database is required.
* **Data Sharing:**
    * User data will be serialized to a JSON string.
    * **Compression:** A client-side JavaScript library (e.g., LZ-String) will be used to compress the JSON string to optimize URL length.
    * **URL Encoding:** The compressed string will be URL-encoded for safe transmission as a query parameter.
* **Security:** As a client-side application without server-side user accounts or sensitive data transmission, the primary security considerations will revolve around robust client-side validation and preventing XSS. Data is stored on the user's local device, not a central server.

## **6. Key Deliverables**

Upon completion, the MVP of the Tax Scenarios Analyzer project will deliver the following tangible outputs:

* **Fully Functional Client-Side Web Application:** The complete interactive web application, accessible via a web browser, implementing all specified features.
* **Static Location Data (JSON):** A structured JSON file containing default tax rates, cost of living estimates, and qualitative attributes for initial supported locations.
* **Core Calculation Logic (JavaScript/TypeScript):** The client-side code responsible for all financial projections (income, expenses, taxes, capital gains) and qualitative fit scoring, including implementations for `special_tax_features`.
* **User Interface Components:** All necessary React components for scenario creation forms, the comparison dashboard (overview table and scenario cards), detailed view modals, and user goal/attribute management.
* **Local Storage Integration:** Implementation for seamlessly saving and loading user session data to/from `localStorage`.
* **URL Sharing Functionality:** Code for serializing, compressing, and URL-encoding user data for sharing, and for loading data from a shared URL.
* **In-App Disclaimers and User Guidance:** Textual content within the application explicitly stating limitations, accuracy warnings, and the non-advisory nature of the tool.

## **7. Timeline / Phases (High-Level)**

Given this is a personal project, the timeline is iterative and flexible, focusing on logical development phases rather than strict deadlines.

* **Phase 1: Foundation & Core Data (Estimated X weeks)**
    * Define and finalize the core JSON data structure for locations, tax features, and user scenarios.
    * Implement basic UI for inputting baseline data.
    * Develop core calculation engine for income, expenses, and basic capital gains taxes (without special features).
* **Phase 2: Scenario Management & Comparison (Estimated Y weeks)**
    * Implement scenario creation flow (add comparison, pre-population, overrides).
    * Develop the Comparison Dashboard (overview table, scenario cards).
    * Refine financial projections to include multi-source income and `special_tax_features` integration.
* **Phase 3: Qualitative Analysis & Persistence (Estimated Z weeks)**
    * Implement user goal weighting and qualitative attribute management (customization, addition).
    * Develop the qualitative fit scoring logic.
    * Integrate `localStorage` for auto-saving.
    * Implement the URL data sharing mechanism (compression/encoding).
* **Phase 4: Refinement, Testing & Deployment (Estimated W weeks)**
    * Comprehensive testing of all features and calculations.
    * UI/UX polish and responsiveness improvements.
    * Finalize in-app disclaimers and user guidance.
    * Deployment to a web hosting service.

## **8. Stakeholders**

For this personal project, the primary stakeholder is the **User/Developer** (yourself). You will serve as both the product owner and the primary implementer, defining requirements and executing the development.

* **You (User/Developer):** The primary visionary, decision-maker, and implementer responsible for all aspects of the project from conception to deployment.
* **Potential Future Users/Collaborators:** While not direct stakeholders in the MVP definition, their feedback may influence future iterations and enhancements beyond the initial scope.

## **9. Future Enhancements**

Beyond the MVP, several features and capabilities could be considered to enhance the Tax Scenarios Analyzer's utility and depth:

* **AI-Driven Scenario Builder:** Implement an advanced input field allowing users to describe their goals, ambitions, and preferences in natural language. An AI module would then analyze this input to automatically generate and pre-populate initial scenarios, inferring sentiment and significance for qualitative attributes based on user's priorities.
* **Expanded Tax Law Specificity:** Incorporate calculations for additional tax types, such as wealth tax, gift tax, estate tax, and self-employment tax.
* **Individualized Tax Deductions & Credits:** Allow users to input specific deductions and credits relevant to their situation for more precise tax estimations.
* **Detailed Residency Guidance:** Provide more granular information or prompts regarding specific residency requirements for various locations (e.g., minimum days of physical presence, specific application procedures).
* **Advanced Multi-Scenario Comparison Views:** Develop more sophisticated visual comparisons (e.g., interactive charts, graphs) that allow for deeper side-by-side analysis of key metrics across multiple scenarios.
* **Digital Nomad Specifics:** Extend support for more complex tax rules applicable to digital nomads, including scenarios involving multiple short-term residencies without a single fixed tax home.
* **Enhanced Location Data:** Integrate dynamic data feeds for tax rates and cost of living to ensure more up-to-date information, possibly with "Last Updated" timestamps.
* **Scenario Versioning/History:** Allow users to save and revert to previous versions of scenarios or track changes over time.
* **Backend Migration and Monetization:** If usage increases and the product proves monetizable, a significant future enhancement would involve migrating the business logic and data storage to a dedicated backend server. This would enable user login features, centralized data storage for user accounts, and support for various monetization strategies, such as subscription models or one-time payment access.

## **10. Risks and Dependencies**

Identifying potential risks and dependencies helps in proactive planning and mitigation.

* **Data Accuracy & Timeliness:**
    * **Risk:** Default tax rates, cost of living data, and program specifics may become outdated quickly, leading to inaccurate estimations.
    * **Mitigation:** Clear disclaimers within the application; plan for periodic manual updates of static JSON data; explore automated data feeds as a future enhancement.
* **Complexity of Tax Law:**
    * **Risk:** Attempting to simplify complex tax rules could lead to oversimplification, miscalculations, or user misunderstanding.
    * **Mitigation:** Strict adherence to MVP scope; constant reinforcement of the "estimation tool, not advice" disclaimer; careful vetting of `special_tax_features` logic.
* **Performance with Large Datasets:**
    * **Risk:** As a client-side application, performance might degrade with a very large number of scenarios, long projection periods, or highly complex `special_tax_features` calculations.
    * **Mitigation:** Optimize JavaScript calculations; limit the number of comparison scenarios in the MVP; consider Web Workers for heavy computations; monitor performance during development.
* **User Adoption/Engagement:**
    * **Risk:** Users might find the tool too complex, or its limitations might deter usage.
    * **Mitigation:** Prioritize intuitive UI/UX; clear onboarding and guidance; gather early user feedback for iterative improvements.
* **Personal Project Time Commitment:**
    * **Risk:** As a personal project, competing priorities or lack of dedicated time could delay development.
    * **Mitigation:** Break down tasks into small, manageable units; set realistic personal deadlines; leverage modular architecture for easier pick-up/put-down.
* **Browser Compatibility/Local Storage Limitations:**
    * **Risk:** Inconsistent `localStorage` behavior across browsers or user browser settings could lead to data loss or persistence issues.
    * **Mitigation:** Test across major browsers; provide clear guidance on `localStorage` reliance; implement robust error handling for storage operations.
* **External Library Dependencies:**
    * **Risk:** Reliance on third-party libraries (e.g., LZ-String, React) introduces potential for breaking changes, security vulnerabilities, or maintenance issues.
    * **Mitigation:** Keep dependencies updated; monitor security advisories; choose well-maintained and stable libraries.
* **Monetization Complexity (Future):**
    * **Risk (Future):** Transitioning to a monetized model (backend, user accounts, payments) introduces significant complexity, security concerns, and regulatory compliance.
    * **Mitigation (Future):** Plan for a separate, dedicated project phase for monetization; engage with legal/financial experts as needed; conduct thorough market research on pricing models.
