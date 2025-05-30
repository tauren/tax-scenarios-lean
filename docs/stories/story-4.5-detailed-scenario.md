## Story 4.5: Implement Comprehensive "Detailed Scenario View" for Scenarios

**Status:** Draft

**Story**
- As a user, I want to access a "Detailed View" for any selected scenario, which provides a comprehensive year-by-year breakdown of its financial projections (income, expenses, taxes with CGT focus, net outcomes) AND a detailed listing of its qualitative attributes (showing their underlying concept, my customized sentiments/significance) and an indication of how they contributed to the scenario's Qualitative Fit Score, so I can perform an in-depth analysis of all aspects of that scenario in one place.

**Acceptance Criteria (ACs)**
1.  A "Detailed Scenario View" UI component (e.g., `DetailedScenarioView.tsx`) is implemented and can be accessed for any individual `Scenario` (e.g., by clicking its "Scenario Summary Card" or a dedicated "details" link/button associated with it from `ScenarioHubView.tsx`).
2.  The Detailed View clearly displays the `name` (or `displayLocationName`) of the `Scenario` being viewed.
3.  **Financial Projections Display:**
    a.  The view must present a year-by-year breakdown of the financial projections for the selected `Scenario`, using data from its `ScenarioResults.yearlyProjections` array.
    b.  For each `year` in the `projectionPeriodYears`, the following financial details must be clearly displayed: Gross Income; Total Annual Expenses (sum of categorized expenses and `additionalCosts`); Capital Gains Income; A detailed Tax Breakdown, showing at least: Estimated Capital Gains Tax. (Note: Other taxes like Federal/State Income Tax are not calculated by MVP engine, so should show 0 or "N/A for MVP". Property and Consumption tax estimates are also N/A by engine for MVP). The Total Tax should primarily reflect CGT + STF impacts.
    c.  Net Financial Outcome for the year.
    d.  This year-by-year financial data should be presented in an easily understandable format (e.g., a clear table - ShadCN `Table`, or structured list).
4.  **Qualitative Assessment Display:**
    a.  The view must display a detailed breakdown of the qualitative assessment for the selected `Scenario`.
    b.  It must list each `ScenarioAttribute` associated with the scenario (from `Scenario.scenarioSpecificAttributes`).
    c.  For each listed `ScenarioAttribute`, the display must include: The `name` and `category` of the underlying `GlobalQualitativeConcept` (looked up via `conceptId` from `AppConfig`); The user's customized `userSentiment` ("Positive," "Neutral," "Negative") for that attribute in this scenario; The user's customized `significanceToUser` ("None," "Low," "Medium," "High") for that attribute in this scenario; Any user-provided `notes` for that attribute in this scenario.
    d.  The view must display the scenario's overall `QualitativeFitScore` (from `ScenarioResults`).
    e.  The view should provide an intuitive summary or indication of how these `ScenarioAttributes` (with their sentiments and significances), in conjunction with the `UserQualitativeGoal` weights, contributed to the scenario's overall `QualitativeFitScore`. (This does not require displaying the exact mathematical formula but should give the user a qualitative understanding of the score's composition, e.g., highlighting attributes that had strong positive/negative impacts based on goal weights).
5.  The Detailed View must provide a clear way for the user to navigate back to the main scenario comparison view (`ScenarioHubView.tsx`).
6.  The UI for the Detailed View must be responsive, ensuring that all information is presented clearly and is usable across different screen sizes (desktop, tablet, mobile).
7.  The data displayed within the Detailed View must dynamically update if the underlying scenario data or its calculations change while the view is active or when it is subsequently reopened for that scenario.

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The `detailed-scenario-view.tsx` mockup is the primary guide for the layout, structure (e.g., tabs, sections), component styling, and overall appearance of this comprehensive view. Pay close attention to how financial projections and qualitative assessments are presented.

**Mockup File:** `../../v0-mockups/components/detailed-scenario-view.tsx`

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [ ] **Task 1: Create `DetailedScenarioView.tsx` Component (AC: 1, 2, 6)**
    - [ ] Create `DetailedScenarioView.tsx` in `src/views/` (or `src/pages/`).
    - [ ] This component will take a `scenarioId` as a prop or route parameter.
    - [ ] Implement the main layout (e.g., two-column or tabbed interface as suggested by `front-end-spec-v0.1.md` and guided by `detailed-scenario-view.tsx` mockup).
    - [ ] Display the scenario's `name` (or `displayLocationName`).
    - [ ] Add a "Back to Scenarios" navigation button/link.
- [ ] **Task 2: Implement Financial Projections Display (AC: 3)**
    - [ ] Fetch the `Scenario` and its `ScenarioResults` from the Zustand store using `scenarioId`.
    - [ ] Create a sub-component or section to display the year-by-year financial projections from `ScenarioResults.yearlyProjections`.
    - [ ] Use a ShadCN `Table` or a well-structured list for clarity. Columns/items per year: Year #, Gross Income, Total Expenses, Capital Gains Income, Tax Breakdown (displaying only "Estimated Capital Gains Tax" and "Total Tax" prominently for MVP), Net Financial Outcome.
    - [ ] Ensure formatting of numbers (currency, percentages) is clear.
    - [ ] Style guided by `detailed-scenario-view.tsx`.
- [ ] **Task 3: Implement Qualitative Assessment Display (AC: 4)**
    - [ ] Create a sub-component or section to display the detailed qualitative assessment.
    - [ ] Display the overall `QualitativeFitScore` for the scenario.
    - [ ] List each `ScenarioAttribute` from `scenario.scenarioSpecificAttributes`. For each:
        - Look up and display `GlobalQualitativeConcept.name` and `category` (from `appConfigService`).
        - Display user's `userSentiment`, `significanceToUser`, and `notes`.
    - [ ] Implement a visual way to hint at score contribution (AC4e). This could be as simple as color-coding attributes (green for positive contribution, red for negative, based on sentiment and goal weight) or showing a small bar indicating impact magnitude.
    - [ ] Style guided by `detailed-scenario-view.tsx`.
- [ ] **Task 4: Implement Navigation (AC: 1, 5)**
    - [ ] Update `ScenarioHubView.tsx` (from Story 2.5): The "View Details" action on `ScenarioSummaryCard`s should now navigate to this `DetailedScenarioView.tsx`, passing the `scenarioId`.
    - [ ] Implement the "Back to Scenarios" navigation link/button in `DetailedScenarioView.tsx` to return to `ScenarioHubView.tsx`.
- [ ] **Task 5: Ensure Dynamic Updates and Responsiveness (AC: 6, 7)**
    - [ ] Verify the view correctly subscribes to store changes and updates if scenario data or results change.
    - [ ] Thoroughly test responsiveness of the entire view, especially tables and lists of attributes.
- [ ] **Task 6: Testing**
    - [ ] Test navigation to and from the view.
    - [ ] Verify correct display of financial data for multiple years.
    - [ ] Verify correct display of qualitative attributes and overall score.
    - [ ] Test the "contribution hints" for qualitative scores.
    - [ ] Test responsiveness.

**Dev Technical Guidance**
-   **Visual Reference:** `detailed-scenario-view.tsx` mockup is key.
-   **Data Fetching:** The view will get `scenarioId` (e.g., from route params if it's a separate route, or props if a modal) and then select the specific `Scenario` from `UserAppState.scenarios` and its `ScenarioResults` from `AppCalculatedState.resultsByScenario` from the Zustand store.
-   **Component Structure:** Consider breaking down the financial projections table and the qualitative assessment list into their own sub-components for better organization.
-   **Qualitative Contribution Hints (AC4e):** This is a UX feature. The implementation could involve:
    * In the `calculationService.calculateQualitativeFitScore`, also return the per-goal or per-attribute weighted contribution.
    * The UI component then uses these contribution values to apply styling (e.g., color, icon, small bar chart) to each attribute listed.
-   **Tax Breakdown Display (AC3b):** For MVP, clearly label that "Total Tax" primarily reflects "Estimated Capital Gains Tax". Other tax lines not calculated by the MVP engine should explicitly state "N/A for MVP" or "0 (not calculated by MVP)" to avoid misleading the user.
-   **Routing:** This view will likely be a distinct route, e.g., `/plan/scenarios/:scenarioId/details`.

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
