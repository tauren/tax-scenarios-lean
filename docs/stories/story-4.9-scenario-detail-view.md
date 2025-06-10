# Story 4.9: Implement Scenario Detail View

## Status: Completed

## Description
As a user, I want to view a detailed breakdown of a single scenario's financial projections and qualitative assessments on a year-by-year basis, so that I can better understand the specific impacts and outcomes of that scenario over time. I also want to be able to easily switch to edit mode when I need to make changes.

## Acceptance Criteria
1. The scenario detail view should be accessible via the "View Details" button on scenario cards in the Scenario Hub.
2. The view should display a comprehensive year-by-year breakdown including:
   - Year number and date range
   - Income sources active in that year with their amounts
   - Planned asset sales for that year with:
     - Asset name
     - Quantity sold
     - Sale price per unit
     - Total sale amount
     - Capital gains/losses
   - Expenses for that year:
     - Annual expenses
     - One-time expenses
   - Tax breakdown:
     - Capital gains tax
     - Income tax
     - Total tax
   - Net financial outcome for the year
3. The view should include a summary section at the top showing:
   - Scenario name and location
   - Total projection period
   - Total net financial outcome over the period
   - Qualitative fit score with goal alignments
4. The view should include a timeline visualization showing:
   - Income trends
   - Expense trends
   - Tax trends
   - Net financial outcome trends
5. The view should include a section for qualitative assessment showing:
   - Goal alignments with their scores
   - Contributing attributes for each goal
   - Visual indicators for alignment status
6. The view should be read-only by default, but include:
   - An "Edit Scenario" button that navigates to the edit view
   - A "Back to Scenarios" button to return to the Scenario Hub
7. The view should be responsive and work well on both desktop and mobile devices

## Technical Notes
1. Create a new `ScenarioDetailView` component in `src/views/ScenarioDetailView.tsx`
2. Add a new route in `src/app/router.tsx` for `/scenarios/:id/view`
3. Update the navigation in `ScenarioSummaryCard` to use the new route
4. Use the existing `ScenarioResults` type from `calculationService` for data
5. Implement the following sub-components:
   - `YearlyBreakdownTable`: Shows detailed financial data for each year
   - `FinancialTimelineChart`: Visualizes trends over time
   - `QualitativeAssessmentPanel`: Shows goal alignments and attributes
   - `ScenarioSummaryHeader`: Shows scenario overview information
   - `ViewActions`: Contains the "Edit Scenario" and "Back to Scenarios" buttons
6. Use ShadCN UI components for consistent styling
7. Implement proper loading states and error handling
8. Ensure all calculations are performed using the existing `calculationService`
9. Add navigation between view and edit modes using React Router

## Tasks
1. [x] Create the `ScenarioDetailView` component and its sub-components
2. [x] Add the new route to the router configuration
3. [x] Update the `ScenarioSummaryCard` navigation
4. [x] Implement the yearly breakdown table
5. [x] Implement the financial timeline chart
6. [x] Implement the qualitative assessment panel
7. [x] Implement the scenario summary header
8. [x] Implement the view actions component with edit and back buttons
9. [x] Add loading states and error handling
10. [x] Add responsive styling (basic implementation)
11. [x] Write unit tests for the new components
12. [x] Add integration tests for the view
13. [x] Update documentation

## Dependencies
- Story 2.5 (Scenario Cards) - For the "View Details" button
- Story 4.4 (Cross-Epic Impacts) - For qualitative assessment data
- Story 4.6 (Qualitative Fit) - For goal alignment calculations

## Progress Notes
- This story implements a detailed view of a single scenario, complementing the summary view in the Scenario Hub
- The view focuses on providing a comprehensive year-by-year breakdown of all financial aspects
- The implementation will leverage existing calculation services and data structures
- The view will be read-only by default but provide easy access to edit mode
- Navigation between view and edit modes will be seamless
- Basic responsive design implemented, with plans for enhanced mobile optimization in a future story

## Change Log
- Created story to implement the scenario detail view
- Defined comprehensive acceptance criteria for the detailed breakdown
- Specified technical requirements and component structure
- Outlined tasks and dependencies
- Added requirement for direct access to edit mode
- Implemented core view components and navigation
- Completed yearly breakdown table with comprehensive financial data
- Added basic responsive design
- Identified need for future story to enhance mobile experience
- Implemented financial timeline chart with Recharts
- Completed testing and documentation

## Completion Notes
- This story provides users with a detailed understanding of each scenario's financial and qualitative aspects
- The year-by-year breakdown helps users make informed decisions about their scenarios
- The implementation maintains consistency with the existing UI design and calculation logic
- Users can easily switch between viewing and editing modes without returning to the Scenario Hub
- Basic responsive design implemented, with plans for enhanced mobile optimization in a future story
- Financial timeline visualization implemented with interactive features and proper styling 