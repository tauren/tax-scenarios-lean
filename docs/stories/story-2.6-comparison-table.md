## Story 2.6: Implement "Overview Comparison Table" (CGT & Financial Outcome)

**Status:** Done

**Story**
- As a user, I want to select scenarios for an "Overview Comparison Table" that shows key financial metrics like gross income (for context), expenses, total estimated Capital Gains Tax, and net financial outcome side-by-side for those selected scenarios, and I want this table to be sortable by these metrics, so I can effectively compare different planning options.

**Acceptance Criteria (ACs)**
1.  An "Overview Comparison Table" UI component (e.g., using ShadCN `Table`) is implemented within the `ScenarioHubView.tsx`.
2.  The table displays data *only* for the scenarios that the user has selected (e.g., via the selection controls on `ScenarioSummaryCard`s from Story 2.5).
3.  Each selected scenario is represented as a column (or a distinct group of columns if preferred for layout) in the table, headed by its `name` (or `displayLocationName`).
4.  The rows of the table (or primary data points per scenario) represent key aggregated financial metrics over the entire projection period. For MVP, these must include: Total Gross Income (for context), Total Expenses, Total Estimated Capital Gains Tax, and Total Net Financial Outcome. (These are derived from the sum of yearly values in `ScenarioResults`).
5.  The table is sortable by each of these key financial metric columns (e.g., user can click a column header to sort scenarios by that metric in ascending/descending order).
6.  The data in the table updates dynamically if the underlying `ScenarioResults` for any selected scenario change, or if the user's selection of scenarios for comparison changes.
7.  The table is presented in a clear, readable, and responsive format, capable of handling multiple selected scenarios gracefully (e.g., with horizontal scrolling if many scenarios are selected and columns are fixed).
8.  (Note: Integration of the Qualitative Fit Score into this table is handled in Story 4.4).

**Tasks / Subtasks**
- [x] **Task 1: Design Data Structure for Table Rows/Columns (AC: 3, 4)**
    - [x] Determine the data structure needed to populate the table. Likely an array of objects where each object represents a row (metric) and has properties for each selected scenario. Or, an array where each object is a scenario, and columns are metrics. The PRD (AC3, AC4) suggests scenarios as columns.
    - [x] Metrics to aggregate from `ScenarioResults.yearlyProjections`: Total Gross Income, Total Expenses, Total Estimated CGT (sum of `taxBreakdown.capitalGainsTax`), Total Net Financial Outcome.
- [x] **Task 2: Implement Table UI in `ScenarioHubView.tsx` (AC: 1, 7)**
    - [x] Within `ScenarioHubView.tsx`, an initial mock-up of this table is already in existence. Use it as a starting point. It is in the section for the Overview Comparison Table.
    - [x] Use ShadCN `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell` components.
    - [x] Dynamically generate columns based on the scenarios selected by the user (via the state managed from Story 2.5 AC6).
    - [x] Dynamically generate rows for each financial metric.
    - [x] Ensure responsive behavior (e.g., horizontal scroll for the table on smaller screens if many scenarios are selected).
- [x] **Task 3: Populate Table with Data from Selected Scenarios (AC: 2, 4, 6)**
    - [x] In `ScenarioHubView.tsx`, filter `UserAppState.scenarios` based on the current selection state.
    - [x] For each selected scenario, fetch its `ScenarioResults` from `AppCalculatedState.resultsByScenario`.
    - [x] Aggregate the required metrics (Total Gross Income, Total Expenses, Total Estimated CGT, Total Net Financial Outcome) by summing the relevant fields from the `yearlyProjections` within each scenario's `ScenarioResults`.
    - [x] Pass this processed data to the table component for rendering.
    - [x] Ensure the table updates when selections or underlying results change.
- [x] **Task 4: Implement Table Sorting Functionality (AC: 5)**
    - [x] Add click handlers to table headers for the financial metric columns.
    - [x] Implement sorting logic (ascending/descending) for the displayed scenarios based on the selected metric. This will involve reordering the array of selected scenarios before rendering the table columns.
    - [x] Provide visual indicators for the currently sorted column and direction (e.g., up/down arrows next to header text).
- [x] **Task 5: Styling and Final Review (AC: 7)**
    - [x] Apply styling using Tailwind CSS and ShadCN conventions to match `scenario-hub-view.tsx` mockup.
    - [x] Ensure readability, proper alignment of numbers, and overall professional appearance.
    - [x] Test with varying numbers of selected scenarios to confirm responsiveness and usability.

**Dev Technical Guidance**
-   **Data Aggregation:** Logic will be needed in `ScenarioHubView.tsx` (or a custom hook) to take the `ScenarioResults` for selected scenarios and aggregate the totals for the comparison table rows.
    ```typescript
    // Example aggregated data structure for one scenario column:
    // interface ComparisonColumnData {
    //   scenarioId: string;
    //   scenarioName: string;
    //   totalGrossIncome: number;
    //   totalExpenses: number;
    //   totalEstimatedCGT: number;
    //   totalNetFinancialOutcome: number;
    //   // qualitativeFitScore: number; // Added in Story 4.4
    // }
    ```
-   **ShadCN Table:** Leverage the `shadcn/ui/table` component. Refer to its documentation for structure and styling.
-   **Sorting Logic:**
    * Maintain sorting state (column key, direction) in `ScenarioHubView.tsx`'s local state or UI store.
    * When sorting, create a sorted copy of the selected scenarios' data before passing it to the table rendering logic.
-   **Performance:** For a small number of selected scenarios (e.g., up to 5-7 as per PRD NFR 8 data volume), direct rendering should be performant. If many scenarios could be selected, virtualization might be a post-MVP consideration for the table.
-   **State Dependencies:** The table depends on the scenario selection state (from Story 2.5) and the `AppCalculatedState.resultsByScenario` (from Story 2.4).

**Story Progress Notes**
* **Agent Model Used:** GPT-4.1 (Dev Agent)
* **Completion Notes List:**
    * All acceptance criteria and tasks are complete.
    * Table is fully functional, responsive, and matches the story requirements.
    * Sorting, selection, and dynamic updates are all implemented and tested.
    * Baseline scenario indicator is compact and consistent with scenario cards.
    * No outstanding issues or TODOs for this story.

**Change Log:**
- 2024-06-09:
    - Final QA and UX review by Dev Agent.
    - Ensured table and selection state are robust to all edge cases (phantom IDs, empty state, etc.).
    - Confirmed all tasks and acceptance criteria are fully met.
- 2024-06-08:
    - Final implementation and review by Dev Agent.
    - Added compact baseline indicator with icon and tooltip.
    - Improved table layout for responsive, proportional column sizing.
    - Verified sorting, selection, and dynamic updates.
    - Marked all tasks and ACs as complete.
- 2024-06-07:
    - Implemented sorting for all columns, including scenario name.
    - Refined table styling and responsiveness.
- 2024-06-06:
    - Initial implementation of Overview Comparison Table in `ScenarioHubView.tsx`.
