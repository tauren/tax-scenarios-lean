## Story 4.3: Calculate and Initially Display Qualitative Fit Score

**Status:** Draft

**Story**
- As a user, after defining my goals and customizing scenario attributes, I want the system to calculate a "Qualitative Fit Score" for each scenario by comparing its attributes (with my sentiments and significances) against my weighted personal goals, and display this score clearly when I am viewing or editing a scenario, so I can get a quantifiable measure of its lifestyle alignment.

**Acceptance Criteria (ACs)**
1.  A function `calculateQualitativeFitScore` is implemented as outlined in the `architecture-lean-v1.2.md` document (Section 6.8).
2.  This function correctly takes a `Scenario` object (containing `scenarioSpecificAttributes`), the `UserAppState` (for `userQualitativeGoals`), and `AppConfig` (for `globalQualitativeConcepts` lookup if needed) as inputs.
3.  The calculation logic iterates through each `UserQualitativeGoal` defined by the user: It correctly retrieves the numerical value for the goal's `weight` (e.g., using the `goalWeightMap`); It correctly identifies the corresponding `ScenarioAttribute`(s) in the current `Scenario` by matching `ScenarioAttribute.conceptId` with `UserQualitativeGoal.conceptId`.
4.  For each matched pair of `UserQualitativeGoal` and `ScenarioAttribute`: If the `ScenarioAttribute.userSentiment` is "Neutral" OR its `significanceToUser` is "None", this attribute's specific contribution to the score for that goal category is zero (or a neutral base value); Otherwise, the `ScenarioAttribute.userSentiment` and `ScenarioAttribute.significanceToUser` are converted to numerical values (e.g., using `sentimentMap` and `significanceMap`) to determine an "attribute effect"; This "attribute effect" is then multiplied by the numerical `goalWeightNumeric` of the `UserQualitativeGoal` to determine the weighted score contribution for that pairing.
5.  The function correctly sums all weighted contributions from all goal-attribute pairings and normalizes this sum to a consistent output scale (e.g., 0-100) as described in `architecture-lean-v1.2.md` (Section 6.8, point 4, "Normalization").
6.  If there are no `UserQualitativeGoals` with a weight that would result in a non-zero `sumOfMaxPossibleGoalContributions`, the `qualitativeFitScore` defaults to a predefined neutral value (e.g., 50, as per `architecture-lean-v1.2.md`).
7.  The calculated `qualitativeFitScore` for each scenario is stored in its corresponding `ScenarioResults` object within the `AppCalculatedState` (e.g., `AppCalculatedState.resultsByScenario[scenarioId].qualitativeFitScore`).
8.  The `qualitativeFitScore` for all affected scenarios is automatically recalculated whenever: The user's list of `userQualitativeGoals` (or their weights) is modified (as per Story 4.1); A `Scenario`'s `scenarioSpecificAttributes` (their sentiment or significance) are modified (as per Story 4.2).
9.  For this story, the calculated `qualitativeFitScore` for the currently active/viewed `Scenario` must be clearly displayed to the user within the UI section where they are viewing or editing that scenario's details (e.g., near the qualitative attributes input area or in a summary section for that scenario within `ScenarioEditorView.tsx`).
10. The UI element displaying this initial score must be responsive.

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The `scenario-editor-view.tsx` mockup should guide where and how the Qualitative Fit Score is displayed within the scenario editing interface. It might be in a summary panel or near the qualitative attributes section.

**Mockup File:** `../../v0-mockups/components/scenario-editor-view.tsx`

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [ ] **Task 1: Implement `calculateQualitativeFitScore` Function (AC: 1-6)**
    - [ ] In `calculationService.ts`, implement `calculateQualitativeFitScore(scenario: Scenario, userQualitativeGoals: UserQualitativeGoal[], globalQualitativeConcepts: GlobalQualitativeConcept[]): number` as per logic in `architecture-lean-v1.2.md` (Section 6.8).
    - [ ] Define and use `goalWeightMap`, `significanceMap`, and `sentimentMap`.
    - [ ] Implement the summation and normalization logic correctly.
    - [ ] Handle the default score case (AC6).
- [ ] **Task 2: Enhance `calculateScenarioResults` to Include Qualitative Score (AC: 7)**
    - [ ] Modify the main `calculateScenarioResults` function in `calculationService.ts` (from Story 2.4).
    - [ ] After financial projections, call `calculateQualitativeFitScore`, passing the current scenario, `userAppState.userQualitativeGoals`, and `appConfig.globalQualitativeConcepts`.
    - [ ] Store the returned score in the `ScenarioResults.qualitativeFitScore` field.
- [ ] **Task 3: Trigger Recalculation on Relevant State Changes (AC: 8)**
    - [ ] Ensure that whenever `userQualitativeGoals` (from Story 4.1 actions) or a `Scenario.scenarioSpecificAttributes` (from Story 4.2 actions) are modified in the Zustand store, the `calculateScenarioResults` function (or at least the qualitative score part and its effect on overall results if any) is re-triggered for all affected scenarios.
    - [ ] The `AppCalculatedState.resultsByScenario` in the store must be updated.
- [ ] **Task 4: Display Qualitative Fit Score in Scenario Editor (AC: 9, 10)**
    - [ ] In `ScenarioEditorView.tsx`:
        - [ ] Subscribe to the `AppCalculatedState.resultsByScenario` from the Zustand store.
        - [ ] For the currently edited scenario, retrieve its `qualitativeFitScore`.
        - [ ] Display this score clearly, for example, in a summary panel or near the qualitative attributes section, guided by `scenario-editor-view.tsx` mockup.
        - [ ] Ensure the display is responsive.
- [ ] **Task 5: Unit Testing for `calculateQualitativeFitScore`**
    - [ ] Write comprehensive unit tests for `calculateQualitativeFitScore` covering:
        - Various combinations of goals, weights, attributes, sentiments, and significances.
        - Edge cases (no goals, no attributes, neutral/none values).
        - Normalization logic.
        - Default score when no weighted goals.
- [ ] **Task 6: Integration Testing for Recalculation**
    - [ ] Test that changing a goal's weight or a scenario's attribute correctly triggers recalculation and updates the displayed score in the editor.

**Dev Technical Guidance**
-   **Calculation Logic:** Strictly follow `architecture-lean-v1.2.md`, Section 6.8, for the `calculateQualitativeFitScore` formula, including maps and normalization.
-   **Data Sources for Calculation:** The function needs `scenario.scenarioSpecificAttributes`, `userAppState.userQualitativeGoals`, and `appConfig.globalQualitativeConcepts` (if concept details like category are used within the scoring logic beyond matching `conceptId`).
-   **State Management:**
    * Results are stored in `AppCalculatedState.resultsByScenario[scenarioId].qualitativeFitScore`.
    * Recalculations should be triggered by changes in the *inputs* to the qualitative score: `UserQualitativeGoal[]` or `ScenarioAttribute[]`. This typically means that after actions in `userAppStateSlice.ts` modify these inputs, a subsequent action or effect should trigger the update of `AppCalculatedState`.
-   **UI Display:** The score display in `ScenarioEditorView.tsx` should be read-only. Consider using a ShadCN `Badge` or a prominent text display.
-   **No Circular Dependencies:** Be mindful that `calculationService` might be used by store actions/effects. Avoid circular dependencies between services and the store.

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
