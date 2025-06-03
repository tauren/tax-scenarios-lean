## Story 2.1: Create Comparison Scenario (from Template or Custom - CGT Focus)

**Status:** Complete

**Story**
- As a user, I want to add a new scenario to my Active Plan, either by selecting a CGT-focused `templateScenario` or by creating a 'custom' scenario where I define the location and my effective Capital Gains Tax rates, so I can model different situations.

**Dependencies**
- Story 1.0: Static Data - Required for `appConfigService.ts` and `templateScenarios` data
- Story 1.1: App Shell - Required for `UserAppState` interface and basic application structure
- Story 1.2: Asset Management - Required for `initialAssets` in `UserAppState`
- Story 1.3: Create Baseline - Required for `scenarios` in `UserAppState`
- Story 1.4: LocalStorage - Required for persistence strategy
- Story 1.5: Load from URL - Required for URL loading mechanism
- Story 1.6: Example Plans - Required for template scenario handling
- Story 1.7: CI/CD Pipeline - Required for deployment
- Architecture Documents: Required for `UserAppState` interface and scenario structure

**Acceptance Criteria (ACs)**
1.  User can initiate the creation of a new "Comparison Scenario" within their Active Plan (e.g., from the "Scenario Hub / Comparison Dashboard" - to be built).
2.  When creating a Comparison Scenario, the user is presented with options to either:
    a.  **Start from a Template:** Select from a list of available `templateScenarios` (sourced from `AppConfig.templateScenarios`). Upon selection, a deep copy of the chosen `templateScenario` (including its predefined location, effective CGT rates, expenses, etc.) is used as the basis for the new Comparison Scenario.
    b.  **Create a Custom Scenario:** Opt to create a custom Comparison Scenario. The user must then input location details (`displayLocationName`, `locationCountry`, etc.). This custom scenario will start with empty/default structures for income, expenses, and require user input for effective CGT rates (as per Story 2.3 or this story).
3.  The newly created Comparison Scenario is added to the `scenarios` array within the `UserAppState.activePlan` in the Zustand store.
4.  The user can assign or edit a custom `name` (or `displayLocationName`) for this new Comparison Scenario. If created from a template, it might default to a name like "[Template Name] - Comparison".
5.  The UI for selecting a starting point and for initial custom scenario input (location) is responsive and user-friendly.
6.  (Note: Detailed input of income, expenses, and specific CGT rates for this new comparison scenario is primarily handled in Story 2.3: "Edit Core Data of Comparison Scenarios". This story focuses on the creation and initial setup with location and choice of template/custom).

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The following TSX mockup file (`scenario-editor-view.tsx`) likely contains the UI elements and layout for creating/editing a scenario, including selecting a starting point (template/custom) and inputting initial details like location. Use this as a strong reference for the UI's appearance. However, implement the actual functionality, component structure, state management, and data flow strictly according to the detailed tasks in this story, the `front-end-architecture-v0.3.md`, `front-end-spec-v0.1.md`, and `architecture-lean-v1.2.md`.

**Mockup File:** `../../v0-mockups/components/scenario-editor-view.tsx` (and potentially `../../v0-mockups/components/scenario-hub-view.tsx` for the "Add New Scenario" initiation point)

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [x] **Task 1: Implement UI for Initiating Comparison Scenario Creation (AC: 1)**
    - [x] On the "Scenario Hub / Comparison Dashboard" view (`ScenarioHubView.tsx` - to be primarily built in Story 2.5/2.6, but a placeholder button can be added now), implement an "Add New Scenario" button.
    - [x] This button should be visually distinct and styled according to the `scenario-hub-view.tsx` mockup.
- [x] **Task 2: Implement "Select Starting Point" UI for Comparison Scenario (AC: 2, 5)**
    - [x] Clicking "Add New Scenario" should trigger a modal or dedicated UI section (e.g., part of `ScenarioEditorView.tsx` if it handles creation flow, or a separate selection modal).
    - [x] This UI must present options:
        - List available `templateScenarios` from `AppConfig.templateScenarios` (fetched via `appConfigService`).
        - Option to "Create a Custom Scenario".
    - [x] Ensure this selection UI is responsive and user-friendly, taking cues from `scenario-editor-view.tsx` if applicable.
- [x] **Task 3: Implement Comparison Scenario Object Creation Logic (AC: 2, 3, 4)**
    - [x] If a `templateScenario` is selected:
        - [x] Perform a deep copy of the template. Assign a new unique `id`.
        - [x] Set a default `name` (e.g., "[Template Name] - Comparison") or prompt user for a name.
        - [x] Add to `activeUserAppState.scenarios` via a Zustand store action (e.g., `addScenario(newScenario)`).
    - [x] If "Create Custom Scenario" is selected:
        - [x] Create a new `Scenario` object with a unique `id`.
        - [x] Initialize with default/empty structures for financials and require user input for location and CGT rates (initial location input in Task 4, detailed financials in Story 2.3).
        - [x] Prompt user for `displayLocationName` and other location components. Set scenario `name` (can be same as `displayLocationName` initially).
        - [x] Add to the store.
    - [x] After creation, the application should likely navigate to the `ScenarioEditorView.tsx` for this new scenario (see Task 4).
- [x] **Task 4: Implement Initial Input for Custom Comparison Scenario (AC: 2b, 4, 5)**
    - [x] If "Create Custom Scenario" was chosen, the `ScenarioEditorView.tsx` (or a part of it) should allow immediate input for:
        - `displayLocationName` (required).
        - `locationCountry` (required).
        - `locationState` (optional).
        - `locationCity` (optional).
    - [x] These details update the newly created scenario object in the store.
    - [x] The scenario's effective CGT rates for a custom scenario will be empty/default initially and set in Story 2.3. Templates will carry over their pre-defined CGT rates.
- [x] **Task 5: Navigation to Scenario Editor (AC: 1, implicitly)**
    - [x] Upon successful creation of a new comparison scenario (either from template or custom with initial details), the user should be navigated to the main `ScenarioEditorView.tsx` for that new scenario, allowing further refinement (as per Story 2.3).

**Dev Technical Guidance**
-   **Visual Reference:** `scenario-editor-view.tsx` is the main guide for forms related to scenario details. `scenario-hub-view.tsx` will guide the initiation point ("Add New Scenario" button).
-   **Data Models:** Refer to `Scenario` and `AppConfig` (for `templateScenarios`) in `architecture-lean-v1.2.md`.
-   **State Management (Zustand):** Use an `addScenario(newScenario: Scenario)` action in `userAppStateSlice.ts`. Ensure unique IDs are generated for new scenarios. The new scenario is added to the `UserAppState.scenarios` array.
-   **Deep Copy:** For creating from templates, use `JSON.parse(JSON.stringify(template))` or a similar robust method.
-   **Workflow:** The flow is: User clicks "Add New" -> Chooses template/custom -> If custom, inputs basic location -> Scenario object created in store -> User is taken to `ScenarioEditorView` for this new scenario to fill in more details (covered in Story 2.3).
-   **Focus of this Story:** This story is about *creating the scenario shell* and getting its basic identity (name, location, origin - template/custom) into the system. Detailed financial input for this newly created comparison scenario is covered in Story 2.3.

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Story prepared for development
    * All prerequisites (Stories 1.0 through 1.7) are completed
    * Implementation of scenario creation functionality is complete
    * Note: Some properties mentioned in the story are computed properties and not part of the model
    * Note: The distinction between baseline and comparison scenarios has been removed
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Updated Status - June 1, 2025 - Claude (Dev Agent)
        - Marked as Ready for Development
        - Added completion notes
        - Verified all prerequisites are met
    * Updated Status - June 2, 2025 - Claude (Dev Agent)
        - Marked story as Complete
        - Marked all tasks as completed
        - Added notes about computed properties and removal of baseline/comparison distinction
        - Updated completion notes to reflect current state
