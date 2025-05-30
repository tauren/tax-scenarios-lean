## Story 3.2: Display Descriptive Notes & Hints for (CGT-Relevant) Special Tax Features

**Status:** Draft

**Story**
- As a user, when I am considering or selecting a `special_tax_feature` (relevant to my CGT or overall financial planning for MVP) for one of my scenarios, I want to see its official name, a clear description, short summaries, and any available non-binding "eligibility hints" (all sourced from `appConfig.globalSpecialTaxFeatures`), so I can better understand what each feature entails and determine if it might be relevant to my situation before applying it.

**Acceptance Criteria (ACs)**
1.  Within the editing interface for any given `Scenario` (`ScenarioEditorView.tsx`), a dedicated UI section or mechanism allows users to browse and select available `SpecialTaxFeatures` (STFs).
2.  The list of available STFs presented to the user is sourced from `appConfig.globalSpecialTaxFeatures` (loaded via `appConfigService`).
3.  For each STF visible in the selection UI (or when a user interacts to get more details, e.g., hover, click an info icon): Its official `name` is clearly displayed; Its `description` is displayed or easily accessible; Any additional short summaries or non-binding "eligibility hints" (if defined within the `SpecialTaxFeature` object in `AppConfig`) are also displayed.
4.  Users can select one or more STFs from the available list to apply them to the current `Scenario`.
5.  When an STF is selected: Its `featureId` is added to the `Scenario.selectedSpecialTaxFeatures` array; If the STF definition in `appConfig.globalSpecialTaxFeatures` specifies `inputs` (e.g., for dates, amounts, specific choices related to that feature), the UI must present appropriate input fields for the user to provide these values *for that instance of the feature within the current scenario*. These user-provided values are stored in the `inputs` object for that selected feature in `Scenario.selectedSpecialTaxFeatures`.
6.  Users can deselect or remove a previously applied STF from the current `Scenario`. This action also removes its associated `featureId` and user-provided `inputs` from `Scenario.selectedSpecialTaxFeatures`.
7.  The information about each STF (name, description, hints, required inputs) is presented in a clear, understandable, and easily accessible manner (e.g., using tooltips for hints, clearly labeled input fields within an expandable section for each selected STF).
8.  The UI for Browse, selecting, providing inputs for, and deselecting STFs is responsive and user-friendly.
9.  (Note: The specific UI flow and data input for `ScenarioAssetTaxDetail` when a feature `requiresGainBifurcation` is true, is explicitly handled in Story 3.3. This current story ensures the display of general STF information and the capture of their direct `inputs` as defined in `appConfig.globalSpecialTaxFeatures.inputs`.)

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The `scenario-editor-view.tsx` mockup should guide the layout for the section where Special Tax Features are displayed, selected, and configured. This might involve a list of available STFs, with details shown on hover/click, and forms for inputting STF-specific parameters when an STF is activated for the scenario.

**Mockup File:** `../../v0-mockups/components/scenario-editor-view.tsx`

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [ ] **Task 1: Design UI for STF Selection and Configuration (AC: 1, 3, 7, 8)**
    - [ ] Within `ScenarioEditorView.tsx`, create a dedicated section for "Special Tax Features."
    - [ ] This section should allow users to:
        - View a list of available STFs (from `appConfigService.getGlobalSpecialTaxFeatures()`). Each item should display STF `name` and provide access to its `description` and hints (e.g., via ShadCN `Tooltip` or `Popover` on an info icon).
        - Select/deselect STFs for the current scenario (e.g., using ShadCN `Checkbox` or `Switch` next to each STF, or an "Add/Remove" mechanism).
    - [ ] For each STF *selected* by the user for the current scenario:
        - Display its name prominently.
        - If the STF definition (`appConfig.globalSpecialTaxFeatures[].inputs`) includes input fields, dynamically render these input fields (e.g., text, number, date, boolean as per `SpecialTaxFeature.inputs.type`).
    - [ ] Ensure layout and styling are guided by `scenario-editor-view.tsx` mockup.
- [ ] **Task 2: Implement State Management for Selected STFs and Inputs (AC: 4, 5, 6)**
    - [ ] Ensure the `Scenario` model in `src/types/index.ts` includes `selectedSpecialTaxFeatures: { featureId: string; inputs: { [key: string]: any }; }[]` as per `architecture-lean-v1.2.md`.
    - [ ] In `userAppStateSlice.ts` (Zustand store), implement actions to:
        - `addStfToScenario(scenarioId: string, featureId: string, initialInputs?: any)`: Adds an STF to the scenario's `selectedSpecialTaxFeatures` array. Initializes `inputs` from STF definition if possible, or as empty object.
        - `removeStfFromScenario(scenarioId: string, featureId: string)`: Removes an STF.
        - `updateStfInputForScenario(scenarioId: string, featureId: string, inputKey: string, inputValue: any)`: Updates a specific input value for a selected STF.
- [ ] **Task 3: Populate Available STFs and Display Information (AC: 2, 3)**
    - [ ] The STF selection UI should fetch the list of `globalSpecialTaxFeatures` from `appConfigService`.
    - [ ] Render each available STF with its name. Implement hover/click to show description and hints.
- [ ] **Task 4: Handle STF Selection/Deselection (AC: 4, 6)**
    - [ ] When an STF is selected (e.g., checkbox checked):
        - Call `addStfToScenario` store action.
        - Dynamically render input fields if defined in `SpecialTaxFeature.inputs`.
    - [ ] When an STF is deselected:
        - Call `removeStfFromScenario` store action.
        - Remove its associated input fields from the UI.
- [ ] **Task 5: Handle STF Input Values (AC: 5)**
    - [ ] For each rendered input field for a selected STF, ensure its value is bound to the corresponding `inputs` object in the `Scenario.selectedSpecialTaxFeatures` array in the store.
    - [ ] On input change, dispatch `updateStfInputForScenario` to update the store.
- [ ] **Task 6: Testing**
    - [ ] Test displaying available STFs with their descriptions/hints.
    - [ ] Test selecting and deselecting STFs.
    - [ ] Test inputting and saving data for STF-specific inputs.
    - [ ] Verify state in Zustand store is correctly updated.
    - [ ] Verify UI responsiveness.

**Dev Technical Guidance**
-   **Visual Reference:** `scenario-editor-view.tsx` for the STF management section.
-   **Dynamic Forms for STF Inputs:** When an STF is selected, its `inputs` schema (from `appConfig.globalSpecialTaxFeatures[].inputs`) needs to be used to dynamically render the correct type of input fields (text, number, date, boolean).
-   **Data Source:** `appConfigService.getGlobalSpecialTaxFeatures()` provides the master list of STFs.
-   **State Management:** All modifications (selecting STFs, changing their input values) update the `selectedSpecialTaxFeatures` array within the specific `Scenario` object in the Zustand store. Ensure immutability.
-   **UX for STF Details:** Using ShadCN `Tooltip` for hints and `Collapsible` or `Accordion` for displaying inputs of selected STFs might be good UX patterns.
-   **Relationship to Story 3.3:** This story sets up the general STF selection and input mechanism. Story 3.3 specifically handles the UI for `ScenarioAssetTaxDetail` when an STF has `requiresGainBifurcation: true`. The UI implemented here should smoothly integrate with or lead to the UI for Story 3.3 if such an STF is selected.

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
