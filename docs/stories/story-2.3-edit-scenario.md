## Story 2.3: Edit Core Data of Comparison Scenarios (CGT Focus)

**Status:** Complete

**Story**
- As a user, I want to edit the core data of my Comparison Scenarios (name, location, gross income for context, expenses, effective CGT rates, and planned asset sales which are covered in Epic 3), so I can refine and tailor each scenario to the specific situation I am modeling.

**Acceptance Criteria (ACs)**
1.  The user can select any existing Comparison Scenario from their Active Plan (e.g., from the "Scenario Hub / Comparison Dashboard") to open it for editing.
2.  When editing a Comparison Scenario, the following fields must be modifiable via a suitable UI (e.g., within `ScenarioEditorView.tsx`): `name` (or `displayLocationName`), location components (`locationCountry`, `locationState`, `locationCity`), `projectionPeriodYears`, and `residencyStartDate` (optional).
3.  If the `displayLocationName` of a scenario that was originally derived from a `templateScenario` is changed by the user, its previously copied tax rates (including CGT rates) and other financial data are *not* automatically reset or re-fetched from a template; they remain as copied or subsequently edited by the user.
4.  The user can add, edit, and delete `IncomeSource` objects (for gross income context: Name, Type, Annual Amount, Start Year, End Year) specifically for the Comparison Scenario being edited.
5.  The user can add, edit, and delete `AnnualExpense` categories (Name, Amount) and update `additionalCosts` specifically for the Comparison Scenario being edited.
6.  The user can input or edit the effective Short-Term and Long-Term Capital Gains Tax rates (the first entry in the `Scenario.capitalGainsTaxRates` array) specifically for the Comparison Scenario being edited.
7.  All changes made to the Comparison Scenario's data are saved to that specific `Scenario` object within the `activeUserAppState.scenarios` array in the Zustand store.
8.  The UI for editing these core data elements of a Comparison Scenario is responsive and user-friendly.
9.  (Note: UI for editing detailed tax rate arrays for *other tax types* like income, property, or consumption, beyond the single effective CGT rate entry, is deferred from MVP. Planned Asset Sales editing is Story 3.1. Special Tax Features editing is Story 3.2/3.3. Qualitative Attributes editing is Story 4.2).

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The `scenario-editor-view.tsx` mockup is the primary guide for the UI where users will edit all core data for a comparison scenario. This includes forms/sections for scenario name, location, income sources, expenses, and CGT rates. Adhere to its layout, component styling, and overall appearance.

**Mockup File:** `../../v0-mockups/components/scenario-editor-view.tsx`

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [x] **Task 1: Implement Navigation to Scenario Editor for Existing Scenarios (AC: 1)**
    - [x] Ensure that from the `ScenarioHubView.tsx` (or wherever scenarios are listed, e.g., on summary cards from Story 2.5), an "Edit" action/button exists for each Comparison Scenario.
    - [x] Clicking "Edit" navigates the user to `ScenarioEditorView.tsx`, loading the selected scenario's data for editing. This might involve passing the `scenarioId` as a route parameter or prop.
- [x] **Task 2: Develop/Enhance `ScenarioEditorView.tsx` for Editing (AC: 2, 3, 8)**
    - [x] Ensure `ScenarioEditorView.tsx` can load and display data for an existing `Scenario` object fetched from the Zustand store based on its ID.
    - [x] Implement form sections (visually guided by the mockup) for editing:
        - Scenario `name` (or `displayLocationName`).
        - Location components: `locationCountry`, `locationState`, `locationCity`.
        - `projectionPeriodYears` (numeric input).
        - `residencyStartDate` (optional date picker).
    - [x] Ensure changes to these fields trigger updates to the specific scenario in the Zustand store via `updateScenario` action.
- [x] **Task 3: Implement Editing of Income Sources within Scenario Editor (AC: 4, 8)**
    - [x] Re-use or adapt the UI components/logic from Story 1.3 (Task 5) for managing `incomeSources` (list, add, edit, delete forms).
    - [x] Ensure these operations now target the specific Comparison Scenario being edited in the `scenarios` array in the store.
    - [x] Style and layout should align with `scenario-editor-view.tsx` mockup.
- [x] **Task 4: Implement Editing of Annual Expenses within Scenario Editor (AC: 5, 8)**
    - [x] Re-use or adapt the UI components/logic from Story 1.3 (Task 6) for managing `annualExpenses` (categories and `additionalCosts`).
    - [x] Ensure these operations target the specific Comparison Scenario being edited.
    - [x] Style and layout should align with `scenario-editor-view.tsx` mockup.
- [x] **Task 5: Implement Editing of Effective CGT Rates within Scenario Editor (AC: 6, 8)**
    - [x] Re-use or adapt the UI components/logic from Story 1.3 (Task 4) for inputting/editing the effective Short-Term and Long-Term Capital Gains Tax rates (the first entry in `Scenario.capitalGainsTaxRates`).
    - [x] Ensure these operations target the specific Comparison Scenario being edited.
    - [x] Style and layout should align with `scenario-editor-view.tsx` mockup.
- [x] **Task 6: Ensure Data Persistence and UI Responsiveness (AC: 7, 8)**
    - [x] Verify all edits correctly update the corresponding `Scenario` object in the Zustand store and are persisted by the auto-save mechanism (Story 1.4).
    - [x] Thoroughly test the responsiveness of all forms and sections within `ScenarioEditorView.tsx`.

**Dev Technical Guidance**
-   **Visual Reference:** `scenario-editor-view.tsx` is paramount.
-   **Component Reusability:** The `ScenarioEditorView.tsx` should be designed to handle both creating new scenarios (from Story 1.3 and 2.1) and editing existing ones. It will need to fetch the correct scenario data from the store based on a passed `scenarioId` when in "edit" mode.
-   **State Management:** Use a specific `updateScenario(scenarioId: string, updatedData: Partial<Scenario>)` action (or more granular actions like `updateScenarioIncomeSource`, `updateScenarioExpense`) in `userAppStateSlice.ts`. Ensure immutable updates.
-   **Forms & Validation:** Use controlled components for forms. Implement client-side validation for required fields, data types, etc. Refer to `front-end-architecture-v0.3.md` for form handling approaches.
-   **Data Integrity (AC3):** When a template-derived scenario's name/location is changed, the system should *not* re-fetch or reset other data (like tax rates) from the original template. The copied data becomes independent.

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Implemented all required fields in ScenarioEditorView
    * Added comprehensive validation for all fields
    * Ensured data persistence through Zustand store
    * Verified template-derived scenarios maintain their data when edited
    * All ACs have been met and tested
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Completed - March 19, 2024 - Claude 3.7 Sonnet
