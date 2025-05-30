## Story 4.4: Integrate Qualitative Scores into Main Comparison Views

**Status:** Draft

**Story**
- As a user, I want the calculated "Qualitative Fit Score" for each scenario to be displayed on its "Scenario Summary Card" and as a sortable column in the "Overview Comparison Table" alongside key financial metrics, so I can have a holistic side-by-side comparison of all my scenarios.

**Acceptance Criteria (ACs)**
1.  The "Scenario Summary Card" UI component (`ScenarioSummaryCard.tsx`, from Story 2.5) for each scenario is updated to clearly and prominently display that scenario's calculated `QualitativeFitScore` (sourced from its `ScenarioResults` object in `AppCalculatedState`).
2.  The `QualitativeFitScore` displayed on the Scenario Summary Card is clearly labeled (e.g., "Qualitative Fit," "Lifestyle Score," or similar).
3.  The "Overview Comparison Table" UI component (in `ScenarioHubView.tsx`, from Story 2.6) is updated to include a new dedicated column (or row, depending on the primary table orientation) that displays the `QualitativeFitScore` for each scenario currently selected for comparison.
4.  This new column/row in the Overview Comparison Table representing the `QualitativeFitScore` is clearly labeled.
5.  Users must be able to sort the scenarios displayed in the "Overview Comparison Table" based on the values in the `QualitativeFitScore` column (allowing both ascending and descending order).
6.  The `QualitativeFitScore` displayed on the Scenario Summary Cards and within the Overview Comparison Table must dynamically update if the score is recalculated for any scenario (due to changes in `UserQualitativeGoals` or a `Scenario`'s `scenarioSpecificAttributes`).
7.  The presentation of the `QualitativeFitScore` in both the summary cards and the comparison table is visually integrated with the existing financial metrics in a clear and easily understandable manner.
8.  The responsiveness of both the Scenario Summary Cards and the Overview Comparison Table is maintained after the addition of this new data point, ensuring usability across different screen sizes.

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The `scenario-hub-view.tsx` mockup is the primary guide for how the Qualitative Fit Score should be integrated into the Scenario Summary Cards and the Overview Comparison Table. Pay attention to its placement, labeling, and how it fits with other financial metrics.

**Mockup File:** `../../v0-mockups/components/scenario-hub-view.tsx`

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [ ] **Task 1: Update `ScenarioSummaryCard.tsx` (AC: 1, 2, 6, 7, 8)**
    - [ ] Modify `ScenarioSummaryCard.tsx` component (from Story 2.5).
    - [ ] Add a new prop to accept the `qualitativeFitScore` (from `ScenarioResults`).
    - [ ] Display the `qualitativeFitScore` prominently on the card with a clear label (e.g., "Qualitative Fit: [score]/100").
    - [ ] Ensure the card's layout remains balanced and responsive, incorporating this new data point guided by `scenario-hub-view.tsx`.
- [ ] **Task 2: Update `ScenarioHubView.tsx` Data Preparation for Comparison Table (AC: 3, 4, 6)**
    - [ ] In `ScenarioHubView.tsx`, when preparing data for the "Overview Comparison Table" (from Story 2.6):
        - [ ] Ensure that for each selected scenario, its `qualitativeFitScore` (from `AppCalculatedState.resultsByScenario[scenarioId].qualitativeFitScore`) is included in the data structure passed to the table rendering logic.
- [ ] **Task 3: Modify Comparison Table Rendering (AC: 3, 4, 7, 8)**
    - [ ] In `ScenarioHubView.tsx`'s table rendering logic:
        - [ ] Add a new row (if metrics are rows) or ensure data for a new column (if scenarios are columns) for "Qualitative Fit Score."
        - [ ] Display the score for each selected scenario.
        - [ ] Clearly label this row/column.
        - [ ] Ensure styling and responsiveness are maintained, guided by `scenario-hub-view.tsx`.
- [ ] **Task 4: Implement Sorting by Qualitative Fit Score in Table (AC: 5)**
    - [ ] Add click handlers to the "Qualitative Fit Score" table header (if it's a column, or to the row label if metrics are rows and scenarios are columns that need sorting).
    - [ ] Extend the existing sorting logic (from Story 2.6) to handle sorting by `qualitativeFitScore` (ascending/descending).
    - [ ] Provide visual indicators for sorting status on this new sortable element.
- [ ] **Task 5: Testing**
    - [ ] Verify qualitative scores appear correctly on summary cards and in the comparison table.
    - [ ] Test sorting by qualitative score in the table.
    - [ ] Test that scores update dynamically in both views when underlying goals or scenario attributes change (relies on Story 4.3's recalculation logic).
    - [ ] Check responsiveness of both updated components.

**Dev Technical Guidance**
-   **Visual Reference:** `scenario-hub-view.tsx` for card and table updates.
-   **Data Source:** `qualitativeFitScore` comes from `AppCalculatedState.resultsByScenario[scenarioId].qualitativeFitScore`, which is populated by the `calculationService` (Story 4.3).
-   **Component Props:** `ScenarioSummaryCard.tsx` will need its props updated. The data structure used by the comparison table in `ScenarioHubView.tsx` will need to include the score.
-   **Sorting:** The existing table sorting mechanism in `ScenarioHubView.tsx` (from Story 2.6) needs to be made generic enough or extended to support sorting by this new numerical metric.
-   **Dynamic Updates:** Reactivity should ensure that if `AppCalculatedState` changes, components reading from it (like the card and table) re-render with the new scores.

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
