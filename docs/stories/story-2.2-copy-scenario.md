## Story 2.2: Create Comparison Scenario by Copying an Existing Scenario

**Status:** Draft

**Story**
- As a user, I want to create a new "Comparison Scenario" by duplicating an existing scenario (Baseline or another Comparison) within my Active Plan, so I can quickly create variations for comparison with minimal re-entry of common data.

**Acceptance Criteria (ACs)**
1.  The user can select any existing scenario (Baseline or Comparison) in their Active Plan to serve as the source for duplication.
2.  A clear UI action (e.g., a "Duplicate" or "Copy Scenario" button/icon associated with each scenario summary card or in a scenario action menu) is available to initiate the copy process.
3.  When a scenario is duplicated, a deep copy of the entire source `Scenario` object is created. This includes its name, location details, effective Capital Gains Tax rates, all `incomeSources`, `annualExpenses` (including categories and additional costs), `plannedAssetSales`, selected `specialTaxFeatures` (with their user-provided inputs), and `scenarioSpecificAttributes`.
4.  The newly created (copied) scenario is assigned a new, unique `id`.
5.  The user is prompted to provide a new `name` (or `displayLocationName`) for the copied scenario, which might default to something like "Copy of [Source Scenario Name]".
6.  The copied scenario is added to the `scenarios` array within the `UserAppState.activePlan` in the Zustand store.
7.  After duplication, the user can then edit the copied scenario independently (as per Story 2.3) without affecting the original source scenario.
8.  The UI for initiating a duplication and naming the new scenario is responsive and user-friendly.

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The action to initiate duplicating a scenario might originate from the `scenario-hub-view.tsx` (e.g., an option on a scenario card). The subsequent step of naming the new (copied) scenario could occur within the `scenario-editor-view.tsx` if the user is taken there directly, or via a simple modal dialog. Use these mockups as a strong reference for UI appearance. However, implement functionality and structure per architectural documents and story tasks.

**Mockup Files:**
* `../../v0-mockups/components/scenario-hub-view.tsx` (for initiating the copy action)
* `../../v0-mockups/components/scenario-editor-view.tsx` (potentially for naming/confirming the new copy if user lands here)

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [ ] **Task 1: Implement UI for Initiating Scenario Duplication (AC: 1, 2, 8)**
    - [ ] On the "Scenario Summary Cards" (displayed in `ScenarioHubView.tsx` - see Story 2.5) or within a scenario's action menu, add a "Duplicate" or "Copy Scenario" button/icon.
    - [ ] Style this action consistently with other scenario actions, guided by `scenario-hub-view.tsx`.
- [ ] **Task 2: Implement Scenario Deep Copy Logic (AC: 3, 4)**
    - [ ] When the "Duplicate" action is triggered for a source scenario:
        - [ ] Retrieve the full `Scenario` object for the source scenario from the Zustand store.
        - [ ] Perform a deep copy of this object. Ensure all nested arrays and objects (like `incomeSources`, `plannedAssetSales`, `capitalGainsTaxRates`, `selectedSpecialTaxFeatures`, `scenarioSpecificAttributes`) are also deeply copied.
        - [ ] Generate a new unique `id` for the copied `Scenario` object.
- [ ] **Task 3: Implement Naming and Saving of Duplicated Scenario (AC: 5, 6)**
    - [ ] After the deep copy, prompt the user to name the new scenario. This could be via a simple modal (e.g., ShadCN `Dialog` with an `Input`) or by navigating to the `ScenarioEditorView.tsx` for the new copy with the name field in focus.
    - [ ] Default the name to "Copy of [Source Scenario Name]".
    - [ ] Once the name is confirmed, add the new (copied and named) `Scenario` object to the `activeUserAppState.scenarios` array in the Zustand store using the `addScenario` action.
- [ ] **Task 4: Navigation (Optional - AC: 7 implicitly)**
    - [ ] Consider whether, after duplicating and naming, the user should be automatically navigated to the `ScenarioEditorView.tsx` for the newly copied scenario to allow immediate editing, or if they should remain on the `ScenarioHubView.tsx`. (User preference or `front-end-spec.md` might guide this).
- [ ] **Task 5: Testing Duplication (AC: 3, 6, 7)**
    - [ ] Create a scenario, then duplicate it. Verify the new scenario appears in the list.
    - [ ] Verify the new scenario has a unique ID and the correct (default or user-provided) name.
    - [ ] Edit the duplicated scenario and confirm the original source scenario remains unchanged.
    - [ ] Verify all nested data structures were deeply copied.

**Dev Technical Guidance**
-   **Deep Copy Mechanism:** `JSON.parse(JSON.stringify(sourceScenario))` is a common and effective method for deep copying if all scenario data is JSON-serializable. If not (e.g., contains functions, `Date` objects that need careful handling), a more robust custom deep copy utility might be needed. `architecture-lean-v1.2.md` models are JSON-serializable.
-   **State Management:** Use the existing `addScenario(newScenario: Scenario)` action in `userAppStateSlice.ts`.
-   **UI for Naming:** A simple ShadCN `Dialog` with an `Input` field and Save/Cancel buttons is likely sufficient for naming the copied scenario if not directly navigating to the editor.
-   **User Experience:** Ensure the duplication process feels quick and provides clear feedback (e.g., "Scenario '[Source Name]' duplicated as '[New Name]'.").

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
