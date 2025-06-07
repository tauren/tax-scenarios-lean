## Story 2.4a: Implement Core Capital Gains Tax Calculation Engine

**Status:** Completed

**Story**
- As a user, I want the system to calculate estimated Long-Term Capital Gains Tax for each scenario, using my planned asset sales and asset holding periods (derived from `Asset.acquisitionDate` and sale year), so I can see the basic CGT impact of my plans.

**Acceptance Criteria (ACs)**
1. A core calculation engine function (e.g., `calculateScenarioProjection`) is implemented that processes a single `Scenario` object and the global `UserAppState` (for `initialAssets`).
2. For each projection year within the scenario, the engine correctly identifies `PlannedAssetSale`s for that year.
3. For each sale, the engine calculates the capital gain/loss by comparing `salePricePerUnit * quantity` with `costBasisPerUnit * quantity` (from the corresponding global `Asset`).
4. The engine applies the scenario-specific effective Long-Term Capital Gains Tax rate (from scenario.tax.capitalGains.longTermRate) to the aggregated gains for that year to calculate the estimated Capital Gains Tax for that year.
5. The calculated Capital Gains Tax for each year is stored in the `ScenarioYearlyProjection.taxBreakdown.capitalGainsTax` field. The `ScenarioYearlyProjection.taxBreakdown.totalTax` for MVP will primarily reflect this CGT amount.
6. The engine includes basic error handling for missing or invalid critical data (e.g., missing CGT rates in a scenario, missing asset for a planned sale), logging errors and potentially returning zero tax or a specific error indicator for the affected calculation.
7. The calculation result for a scenario (a `ScenarioResults` object containing `yearlyProjections`) is stored or made available for display and use by other components (e.g., in `AppCalculatedState`).

**Tasks / Subtasks**
- [x] **Task 1: Implement Basic Calculation Service (AC: 1, 2, 3)**
    - [x] Create `calculationService.ts` in `src/services/`
    - [x] Implement `calculateScenarioResults` function
    - [x] Implement `calculateCapitalGainsForYear` helper function
- [x] **Task 2: Implement Tax Rate Application (AC: 4, 5)**
    - [x] Implement tax rate application logic
    - [x] Calculate yearly tax breakdowns
    - [x] Aggregate results into yearly projections
- [x] **Task 3: Implement Error Handling (AC: 6)**
    - [x] Add validation for required data
    - [x] Implement error logging
    - [x] Add fallback behavior for missing data
- [x] **Task 4: Testing**
    - [x] Unit tests for calculation functions
    - [x] Integration tests for state management
    - [x] Edge case testing

**Dev Technical Guidance**
- **Primary Logic Location:** `src/services/calculationService.ts`
- **Data Models:** Use existing `Scenario`, `Asset`, `PlannedAssetSale` types
- **Immutability:** Ensure all inputs to calculation functions are treated as immutable
- **Testing:** Focus on core calculation accuracy and error handling

**Dependencies**
- Story 2.4 (Calculation Service Foundation)
- Story 3.1 (Planned Asset Sales Management)
- Story 1.2 (Asset Management)

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Reorganized as core calculation story - May 31, 2025 - Sarah (PO)
    * Removed duplicate Task 1 (completed in Story 2.4) - May 31, 2025 - Claude (Story Validator)
    * Removed short-term gains functionality (moved to Story 2.4b) - May 31, 2025 - Claude (Story Validator)
    * Marked as In Development - May 31, 2025 - Claude (Story Validator)
    * Marked as Completed - May 31, 2025 - Claude (Story Validator) 