## Story 1.3: Create Baseline Scenario & Input Core Data (CGT Focus)

**Status:** In Progress

**Story**
- As a user, I want to establish my "Baseline Scenario" within my Active Plan (from a CGT-focused template or custom), define its location, input gross income (for context), annual expenses, and my effective Capital Gains Tax rates for this baseline, so I have a foundational scenario.

**Dependencies**
- Story 1.0: Static Data - Required for `appConfigService.ts` and `templateScenarios` data
- Story 1.1: App Shell - Required for `UserAppState` interface and basic application structure
- Story 1.2: Asset Management - Required for `initialAssets` in `UserAppState`
- Architecture Documents: Required for `Scenario`, `ScenarioIncomeSource`, `AnnualExpense`, and `CapitalGainsTaxRate` interfaces

**Acceptance Criteria (ACs)**
1.  Within the "Active Plan," the user can initiate the creation or definition of the "Baseline Scenario."
2.  When establishing the Baseline Scenario, the user must be presented with options to either:
    a.  **Start from a Template:** Select from a list of available `templateScenarios` (sourced from `appConfig.templateScenarios`). Upon selection, a deep copy of the chosen `templateScenario` (including its predefined location name components, effective CGT rates, default expenses, qualitative attributes, etc.) becomes the user's Baseline Scenario within their Active Plan.
    b.  **Create a Custom Scenario:** Opt to create a custom Baseline Scenario. In this case, the user must input the location details: `displayLocationName` (e.g., "My Current US Setup"), `locationCountry`, `locationState` (optional), `locationCity` (optional). This custom scenario will start with empty or minimal default structures for income sources, annual expenses, and requires user input for effective CGT tax rates (as per AC.8 below).
3.  Regardless of the creation method (template or custom), the user can subsequently input and manage a list of `IncomeSource` objects for the Baseline Scenario. For each income source, the UI must allow specifying: Name (text input, required); Type (e.g., a dropdown with options "EMPLOYMENT," "RENTAL\_PROPERTY," "OTHER," as per `ScenarioIncomeSource` model in `architecture-lean-v1.2.md`); Annual Amount (numeric input, required); Start Year (numeric input, required, relative to the projection period); End Year (optional numeric input). (Note: `sourceJurisdictionInfo` on `ScenarioIncomeSource` is not utilized for MVP tax calculations by the core engine and may not have dedicated UI inputs in this story).
4.  The system provides an intuitive interface to add multiple income sources sequentially, edit existing income sources, and delete income sources for the Baseline Scenario.
5.  Regardless of the creation method, the user can subsequently input and manage `AnnualExpense` categories for the Baseline Scenario. (If created from a template, these might be pre-populated from the template's `annualExpenses.categories` and be editable). For each expense category, the UI must allow specifying: Name (text input, required); Amount (annual numeric input, required).
6.  Users can input a value for overall `annualExpenses.additionalCosts` (a lump sum for non-categorized annual costs) for the Baseline Scenario.
7.  The system provides an intuitive interface to add new expense categories, edit existing expense categories (names and amounts), and delete expense categories for the Baseline Scenario.
8.  For this Baseline Scenario, the user must be able to input their effective Short-Term and Long-Term Capital Gains Tax rates (e.g., into the `Scenario.capitalGainsTaxRates` array, which for MVP will hold a single object with these two rates, as per `architecture-lean-v1.2.md`).
9.  All entered/modified data for the Baseline Scenario is stored as part of the current "Active Plan" in the application's internal state (specifically, as the first element in `UserAppState.scenarios` if it's the first scenario, or clearly identifiable as baseline).
10. The UI for defining the Baseline Scenario and its core financials is responsive.
11. (Note: For a "custom" Baseline Scenario, fields for income tax rates, property tax, consumption tax are not used by the MVP engine. For a template-derived baseline, these rates are copied but also unused by the MVP engine).

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The following TSX mockup file (`scenario-editor-view.tsx`) provides a conceptual visual layout, component positioning, sizing, and styling guide for the UI elements relevant to this story (specifically for inputting baseline scenario details like location, income, expenses, and CGT rates, likely within a scenario editor interface). You should use this as a strong reference for the UI's appearance. However, implement the actual functionality, component structure, state management, and data flow strictly according to the detailed tasks in this story, the `front-end-architecture-v0.3.md`, `front-end-spec-v0.1.md`, and `architecture-lean-v1.2.md`.

**Mockup File:** `../../v0-mockups/components/scenario-editor-view.tsx`

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [ ] **Task 1: UI for Initiating Baseline Scenario Creation (AC: 1)**
    - [x] Design and implement a UI element on an appropriate entry view (e.g., a "Define Baseline Scenario" button/section on the `GetStartedView.tsx` if no scenarios exist, or on a main `ActivePlanDashboardView.tsx` - to be created later). This action should be clear if it's for the first/baseline scenario.
    - [x] Create the necessary UI components (Button, Card) using Shadcn UI
    - [x] Implement the GetStartedView component with a prominent "Create Baseline Scenario" button
    - [x] Set up basic routing for the view
- [x] **Task 2: Implement "Select Starting Point" UI for Baseline
    - [x] Create dialog component for template selection
    - [x] Implement template scenario list UI
    - [x] Add custom baseline option
    - [x] Set up navigation to scenario editor
    - [ ] Add loading states
    - [ ] Add error handling

### Implementation Details
- Created `BaselineScenarioDialog` component using ShadCN UI Dialog
- Implemented template scenario selection with mock data
- Added custom baseline option
- Set up navigation to scenario editor with template/custom state
- TODO: Add loading states and error handling

### Change Log
- 2024-03-21: Started Task 2 implementation
  - Created BaselineScenarioDialog component
  - Implemented template selection UI
  - Added custom baseline option
  - Set up navigation to scenario editor
- [ ] **Task 3: Implement Baseline Scenario Object Creation Logic (AC: 2, 9)**
    - [ ] If a `templateScenario` is selected: Perform a deep copy, assign a new unique `id`, set a default `name` (e.g., "Baseline: [Template Name]"), and add to `activeUserAppState.scenarios` in the Zustand store via an action (e.g., `addScenario(scenario, {isBaseline: true})`).
    - [ ] If "Create Custom Scenario" is selected: Create a new `Scenario` object with a unique `id`, initialize with defaults (empty arrays for sub-objects, 0 rates), set a default `name` (e.g., "Custom Baseline"), and add to store.
    - [ ] The first scenario added to `UserAppState.scenarios` is considered the Baseline.
- [ ] **Task 4: Implement UI Form for Baseline Scenario Core Details (AC: 2b, 8, 10)**
    - [ ] Develop/utilize a `ScenarioEditorView.tsx` component (as per `front-end-architecture-v0.3.md` and referenced mockup). For this story, focus on the sections for core details.
    - [ ] Form section for `displayLocationName` (required), `locationCountry` (required), `locationState` (optional), `locationCity` (optional). These are editable.
    - [ ] Form section for `capitalGainsTaxRates`: inputs for one `shortTermRate` and one `longTermRate` (numeric, percentages). Store as the first element in the `capitalGainsTaxRates` array of the `Scenario` object.
    - [ ] Ensure changes are dispatched to Zustand store to update the correct `Scenario` object in the `scenarios` array.
    - [ ] Visually align with `scenario-editor-view.tsx` mockup.
- [ ] **Task 5: Implement UI for Managing Income Sources (AC: 3, 4, 10)**
    - [ ] Within the `ScenarioEditorView.tsx` (for the Baseline Scenario), create a section for managing `incomeSources`.
    - [ ] UI to list existing income sources (editable list/table).
    - [ ] "Add Income Source" button.
    - [ ] Form (e.g., inline, dialog) for `IncomeSource` fields: Name, Type (dropdown), Annual Amount, Start Year, End Year.
    - [ ] Store actions to add, update, delete income sources within the specific Baseline Scenario object.
    - [ ] Visually align with `scenario-editor-view.tsx` mockup if it details this section.
- [ ] **Task 6: Implement UI for Managing Annual Expenses (AC: 5, 6, 7, 10)**
    - [ ] Within `ScenarioEditorView.tsx`, create a section for `annualExpenses`.
    - [ ] UI to list expense `categories` (name, amount).
    - [ ] "Add Expense Category" button. Form for adding/editing.
    - [ ] Input field for `annualExpenses.additionalCosts`.
    - [ ] Store actions to manage expense categories and `additionalCosts` within the Baseline Scenario.
    - [ ] Visually align with `scenario-editor-view.tsx` mockup if it details this section.
- [ ] **Task 7: Data Validation and Responsiveness (AC: 10)**
    - [ ] Implement client-side validation for all input fields.
    - [ ] Ensure the `ScenarioEditorView.tsx` and its sub-forms are responsive.

**Dev Technical Guidance**
-   **Visual Reference:** The `../../v0-mockups/components/scenario-editor-view.tsx` is the key visual guide for the forms and layout involved in editing scenario details.
-   **Data Models:** Refer to `Scenario`, `ScenarioIncomeSource`, `AnnualExpense`, `CapitalGainsTaxRate` interfaces in `architecture-lean-v1.2.md`.
-   **State Management (Zustand):**
    * The `UserAppState.scenarios` array will hold the `Scenario` objects. The Baseline is typically `scenarios[0]`.
    * Implement actions like `addScenario(scenario: Scenario, options?: {isBaseline?: boolean})`, `updateScenario(scenarioId: string, updatedData: Partial<Scenario>)`, and more granular actions like `updateIncomeSourceInScenario(scenarioId, incomeSourceId, updatedIncomeSource)`.
-   **UI Components:**
    * The `ScenarioEditorView.tsx` will be a significant component. Use ShadCN UI components extensively, guided by the mockup.
    * Consider how to structure `ScenarioEditorView.tsx` – perhaps with tabs or collapsible sections for Core Details, Income, Expenses, etc., as suggested by `front-end-spec-v0.1.md`.
-   **Deep Copy for Templates:** Use `JSON.parse(JSON.stringify(template))` or a similar robust deep copy method.
-   **Unique IDs:** Generate unique client-side IDs (UUIDs) for new Scenarios, IncomeSources, ExpenseCategories.
-   **CGT Rates:** For MVP, the `capitalGainsTaxRates` array in the `Scenario` model will hold one object with `shortTermRate` and `longTermRate`. The UI should reflect this simplicity for input.

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Story prepared for development
    * All prerequisites (Stories 1.0, 1.1, and 1.2) are completed
    * Ready for implementation of baseline scenario creation functionality
    * Started Task 1: Created GetStartedView component and necessary UI components
    * Implemented basic routing with placeholder for Task 2
    * Fixed routing structure to properly nest GetStartedView under App component
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Added Visual Reference - May 31, 2025 - Sarah (PO)
    * Prepared for Development - May 31, 2025 - Story Agent
    * Development Started - May 31, 2025 - Dev Agent
    * Task 1 Implementation Started - May 31, 2025 - Dev Agent
    * Task 1 UI Components and Routing Completed - May 31, 2025 - Dev Agent
    * Fixed Routing Structure - May 31, 2025 - Dev Agent
