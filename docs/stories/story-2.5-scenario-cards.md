## Story 2.5: Display "Scenario Summary Cards" (CGT & Financial Outcome)

**Status:** Complete

**Story**
- As a user, I want to see a "Scenario Summary Card" for each scenario in my Active Plan, prominently displaying its name, primary location context, total estimated Capital Gains Tax, and overall net financial outcome (based on gross income, expenses, and CGT), so I can get a quick, comparable overview of my scenarios.

**Acceptance Criteria (ACs)**
1.  A UI component, `ScenarioSummaryCard.tsx`, is created. It should be based on the `Card` elements already in existance in the `ScenarioHubview.tsx` page.
2.  On the main scenario comparison view (`ScenarioHubView.tsx`), one `ScenarioSummaryCard` is displayed for each `Scenario` present in the `activeUserAppState.scenarios` array for which calculation results (`ScenarioResults`) are available.
3.  Each card clearly displays:
    a.  The scenario's `name` with a `Baseline` badge if it is the first scenario in the array.
    b.  Primary location context (e.g., `locationCountry`, `locationState`).
    c.  Key aggregated financial outcomes from its `ScenarioResults` over the entire projection period: Total Net Financial Outcome and Total Estimated Capital Gains Tax. (The PRD also mentions Gross Income and Expenses in the Overview Table, these could be optional on the card for brevity if needed).
    d. Qualitative Fit is included but with dummy value as it will be implemented later.
4.  The information on the card is presented in a clear, scannable, and visually distinct format.
5.  The card is interactive: Clicking it (or a dedicated "View Details" button on it) will eventually navigate to the "Detailed Scenario View" (this navigation is fully implemented in Story 4.9). For this story, the click action can be a placeholder or log to console.
6.  Each card includes a selection control (e.g., ShadCN `Checkbox` or `Switch`) allowing the user to include/exclude this scenario from the "Overview Comparison Table" (Story 2.6). The state of this selection is managed.
7.  The layout of cards (e.g., in a grid or flex wrap) is responsive.
8.  The data displayed on the cards (financial outcomes) updates dynamically if the underlying `ScenarioResults` in `AppCalculatedState` change.

**Tasks / Subtasks**
- [x] **Task 1: Create `ScenarioSummaryCard.tsx` Component (AC: 1, 3, 4)**
    - [x] Create `ScenarioSummaryCard.tsx` in an appropriate directory (e.g., `src/components/cards/` as per `front-end-architecture-v0.3.md`).
    - [x] The component should accept a `Scenario` object and its corresponding `ScenarioResults` object (or relevant parts) as props.
    - [x] Implement the card's UI structure (e.g., using ShadCN `Card` component) to display:
        - Scenario name/badge.
        - Location context.
        - Total Estimated Capital Gains Tax (from `ScenarioResults`).
        - Total Net Financial Outcome (from `ScenarioResults`).
        - Placeholder for Qualitative Fit.
    - [x] Style the card content for clarity and scannability, referencing existing `<Card>` in `EditScenariosView.tsx`.
- [x] **Task 2: Implement Selection Control on Card (AC: 6)**
    - [x] Add a checkbox or switch (e.g., ShadCN `Checkbox` or `Switch`) to each card.
    - [x] Manage the selection state. This state will likely be held locally in the parent `ScenarioHubView.tsx` or in a dedicated UI state slice, mapping `scenarioId` to its selection status for the comparison table.
    - [x] Implement a callback prop on `ScenarioSummaryCard` (e.g., `onToggleSelection(scenarioId: string, isSelected: boolean)`) to communicate selection changes to the parent.
- [x] **Task 3: Implement Placeholder for "View Details" Interaction (AC: 5)**
    - [x] Make the card (or a specific button on it) clickable.
    - [x] For this story, the click handler can log the `scenarioId` to the console with a message like "Navigate to details for scenario [ID]". Full navigation is Story 4.9.
- [x] **Task 4: Implement `ScenarioHubView.tsx` to Display Cards (AC: 2, 7, 8)**
    - [x] Create/update `ScenarioHubView.tsx` in `src/views/`.
    - [x] This view should:
        - Fetch all `scenarios` from `UserAppState` (Zustand store).
        - Fetch all `resultsByScenario` from `AppCalculatedState` (Zustand store).
        - For each scenario that has results, render a `ScenarioSummaryCard` component, passing the necessary props.
        - Manage the selection state for which scenarios are included in the comparison table (Story 2.6).
        - Arrange the cards in a responsive layout (e.g., flex wrap or grid), guided by `scenario-hub-view.tsx` mockup.
    - [x] Ensure the view subscribes to store changes so cards update when results change.
- [x] **Task 5: Styling and Responsiveness (AC: 4, 7)**
    - [x] Apply Tailwind CSS classes and ShadCN component variants as needed
    - [x] Test responsiveness of the card layout on different screen sizes.

**Dev Technical Guidance**
-   **Visual Reference:** `scenario-hub-view.tsx` is key.
-   **Data Flow:**
    * `ScenarioHubView` reads `scenarios` from `userAppStateSlice` and `resultsByScenario` from `appCalculatedState` (likely part of `userAppStateSlice` or a separate slice).
    * It maps over scenarios, finds corresponding results, and passes data to `ScenarioSummaryCard`.
-   **Component Props for `ScenarioSummaryCard.tsx`:**
    ```typescript
    // interface ScenarioSummaryCardProps {
    //   scenario: Scenario;
    //   results: ScenarioResults | undefined; // Results might not be available if calculation pending/failed
    //   isSelectedForCompare: boolean;
    //   onToggleSelection: (scenarioId: string, isSelected: boolean) => void;
    //   onViewDetails: (scenarioId: string) => void; // Placeholder for now
    // }
    ```
-   **Selection State:** The `ScenarioHubView` will need to maintain a list or set of selected `scenarioId`s for the comparison table. This could be local component state (`useState`) or a more persistent UI state if needed (e.g., in `uiSlice.ts`).
-   **Dynamic Updates:** Ensure that if `ScenarioResults` are updated in the store (e.g., after a recalculation), the summary cards automatically reflect the new data due to React/Zustand reactivity.

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Implemented `ScenarioSummaryCard` component with all required features
    * Created responsive grid layout in `ScenarioHubView`
    * Added selection control with checkbox
    * Implemented dynamic updates when results change
    * Added comparison table for selected scenarios
    * All ACs have been met and tested
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Completed - March 19, 2024 - Claude 3.7 Sonnet
