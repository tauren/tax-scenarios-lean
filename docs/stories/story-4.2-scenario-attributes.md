## Story 4.2: Manage Scenario-Specific Qualitative Attributes & User Perspectives

**Status:** Draft

**Story**
- As a user, for each of my scenarios, I want to see a list of relevant qualitative attributes (which are based on global qualitative concepts and may be pre-populated if the scenario was created from a `templateScenario`) and be able to customize my perceived `userSentiment` (e.g., Positive, Neutral, Negative) and `significanceToUser` (None, Low, Medium, High) for each attribute specifically for that scenario, so I can tailor the qualitative assessment to my personal perspective on that location. I also want to be able to add new attributes to my scenario by selecting from the master list of qualitative concepts and then defining my perspective on them for that scenario.

**Acceptance Criteria (ACs)**
1.  Within the editing interface for any given `Scenario` (`ScenarioEditorView.tsx`), a dedicated UI section exists for managing its "Scenario-Specific Qualitative Attributes" (`Scenario.scenarioSpecificAttributes`).
2.  If the `Scenario` was created by copying a `templateScenario`, this section is pre-populated with the `ScenarioAttribute` entries from that template, including their template-defined default `userSentiment` and `significanceToUser` values.
3.  For each `ScenarioAttribute` displayed for the current scenario, the UI must show: The `name` and `category` of the underlying `GlobalQualitativeConcept` (looked up from `appConfig.globalQualitativeConcepts` via `ScenarioAttribute.conceptId`); Controls allowing the user to set/modify their `userSentiment` for this attribute specifically within this scenario (e.g., selectable options: "Positive," "Neutral," "Negative"); Controls allowing the user to set/modify their `significanceToUser` for this attribute specifically within this scenario (e.g., selectable options: "None," "Low," "Medium," "High"); An optional text input for users to add or edit personal `notes` related to this attribute in this scenario.
4.  Users must be able to add a new qualitative attribute to the current `Scenario`'s list: This process involves the user selecting a base `GlobalQualitativeConcept` from the master list provided in `appConfig.globalQualitativeConcepts` (e.g., via a searchable or categorized list); Upon selection, a new `ScenarioAttribute` object linked to the chosen `conceptId` is created and added to `Scenario.scenarioSpecificAttributes`; The user must then define their initial `userSentiment` and `significanceToUser` (and optionally `notes`) for this newly added attribute within the current scenario. Default values for a newly added attribute might be `userSentiment: "Neutral"` and `significanceToUser: "None"`.
5.  Users must be able to remove a `ScenarioAttribute` (whether originally from a template or added manually) from the current scenario's list, with a confirmation prompt.
6.  All modifications (edits to `userSentiment`, `significanceToUser`, `notes`; additions; deletions) to the `Scenario.scenarioSpecificAttributes` list are stored as part of that specific `Scenario` object within the "Active Plan" in the application's internal state.
7.  The UI for managing scenario-specific qualitative attributes must be responsive and user-friendly.

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The `scenario-editor-view.tsx` mockup should guide the UI for the section where users manage scenario-specific qualitative attributes. This could be a tab or a distinct sub-section within the editor, listing attributes with controls for sentiment, significance, and notes.

**Mockup File:** `../../v0-mockups/components/scenario-editor-view.tsx`

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [ ] **Task 1: Design UI for Scenario Qualitative Attributes Section (AC: 1, 3, 7)**
    - [ ] Within `ScenarioEditorView.tsx`, create a dedicated section/tab for "Qualitative Attributes" or "Personal Goal Alignment."
    - [ ] This section will display a list/table of `ScenarioAttribute`s for the current scenario.
    - [ ] For each attribute: Display `GlobalQualitativeConcept.name` & `category` (looked up via `conceptId`). Provide controls (e.g., ShadCN `Select` or `RadioGroup`) for `userSentiment` and `significanceToUser`. Provide an `Input` for `notes`.
    - [ ] Include an "Add Attribute" button.
    - [ ] Style guided by `scenario-editor-view.tsx` mockup.
- [ ] **Task 2: Pre-populate Attributes from Template (AC: 2)**
    - [ ] When a scenario is created from a `templateScenario` (Story 1.3/2.1), ensure its `scenarioSpecificAttributes` are deep copied from the template into the new `Scenario` object.
- [ ] **Task 3: Implement State Management for Scenario Attributes (AC: 6)**
    - [ ] Define `ScenarioAttribute` interface in `src/types/index.ts` as per `architecture-lean-v1.2.md`.
    - [ ] Ensure `Scenario.scenarioSpecificAttributes: ScenarioAttribute[]` exists in the `Scenario` model.
    - [ ] Implement Zustand store actions (in `userAppStateSlice.ts`) to manage attributes within a scenario:
        - `addOrUpdateScenarioAttribute(scenarioId: string, attribute: ScenarioAttribute)` (adds if new by `conceptId`, else updates).
        - `removeScenarioAttribute(scenarioId: string, conceptId: string)`.
- [ ] **Task 4: Implement "Add New Attribute" Functionality (AC: 4)**
    - [ ] "Add Attribute" button opens a selector (e.g., ShadCN `Dialog` with `Combobox`) listing `GlobalQualitativeConcept`s from `appConfigService` (excluding those already in the current scenario's `scenarioSpecificAttributes`).
    - [ ] On selection, create a new `ScenarioAttribute` object with the chosen `conceptId`, default sentiment/significance (e.g., Neutral/None), and add it to the scenario via store action. The user can then edit these defaults.
- [ ] **Task 5: Implement Editing and Removing Attributes (AC: 3, 5)**
    - [ ] Allow users to modify `userSentiment`, `significanceToUser`, and `notes` for each listed attribute, dispatching updates to the store.
    - [ ] Provide a "Remove" button for each attribute, triggering `removeScenarioAttribute` action with confirmation.
- [ ] **Task 6: Testing**
    - [ ] Test pre-population from templates.
    - [ ] Test adding, editing, and removing scenario attributes.
    - [ ] Verify data is correctly stored in `Scenario.scenarioSpecificAttributes`.
    - [ ] Test UI responsiveness.

**Dev Technical Guidance**
-   **Visual Reference:** `scenario-editor-view.tsx` for the layout of this section.
-   **Data Models:** `ScenarioAttribute`, `GlobalQualitativeConcept` from `architecture-lean-v1.2.md`.
-   **Data Source for Concepts:** `appConfigService.getGlobalQualitativeConcepts()`.
-   **State Management:** Updates are made to the `scenarioSpecificAttributes` array within a specific `Scenario` object in the Zustand store. Ensure immutability.
-   **UI for Selection:** A `Combobox` allowing search/filter of `GlobalQualitativeConcept`s would be user-friendly for adding new attributes.

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
