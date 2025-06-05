## Story 2.4a: Implement Core Capital Gains Tax Calculation Engine

**Status:** Draft

**Story**
- As a user, I want the system to calculate estimated Capital Gains Tax for each scenario, using my planned asset sales and asset holding periods (derived from `Asset.acquisitionDate` and sale year), so I can see the basic CGT impact of my plans before considering special tax features.

**Acceptance Criteria (ACs)**
1. A core calculation engine function (e.g., `calculateScenarioProjection`) is implemented that processes a single `Scenario` object and the global `UserAppState` (for `initialAssets`).
2. For each projection year within the scenario, the engine correctly identifies `PlannedAssetSale`s for that year.
3. For each sale, the engine calculates the capital gain/loss by comparing `salePricePerUnit * quantity` with `costBasisPerUnit * quantity` (from the corresponding global `Asset`).
4. The engine correctly determines the holding period for each sold asset (from `Asset.acquisitionDate` to the `year` of the `PlannedAssetSale`) and categorizes the gain/loss as either Short-Term or Long-Term based on standard thresholds (e.g., <=1 year for Short-Term, >1 year for Long-Term).
5. The engine applies the scenario-specific effective Short-Term and Long-Term Capital Gains Tax rates (from scenario.tax.capitalGains.shortTermRate and scenario.tax.capitalGains.longTermRate) to the respective aggregated Short-Term and Long-Term gains for that year to calculate the estimated Capital Gains Tax for that year.
6. The calculated Capital Gains Tax for each year is stored in the `ScenarioYearlyProjection.taxBreakdown.capitalGainsTax` field. The `ScenarioYearlyProjection.taxBreakdown.totalTax` for MVP will primarily reflect this CGT amount.
7. The engine includes basic error handling for missing or invalid critical data (e.g., missing CGT rates in a scenario, missing asset for a planned sale), logging errors and potentially returning zero tax or a specific error indicator for the affected calculation.
8. The calculation result for a scenario (a `ScenarioResults` object containing `yearlyProjections`) is stored or made available for display and use by other components (e.g., in `AppCalculatedState`).

**Tasks / Subtasks**
- [ ] **Task 1: Implement Core Calculation Types (AC: 1, 8)**
    - [ ] Define `ScenarioYearlyProjection` interface in `src/types/index.ts`
    - [ ] Define `ScenarioResults` interface in `src/types/index.ts`
    - [ ] Define `AppCalculatedState` interface in `src/types/index.ts`
    - [ ] Update Zustand store to include calculation results state
- [ ] **Task 2: Implement Basic Calculation Service (AC: 1, 2, 3, 4)**
    - [ ] Create `calculationService.ts` in `src/services/`
    - [ ] Implement `calculateScenarioResults` function
    - [ ] Implement `calculateCapitalGainsForYear` helper function
    - [ ] Implement basic holding period calculation
- [ ] **Task 3: Implement Tax Rate Application (AC: 5, 6)**
    - [ ] Implement tax rate application logic
    - [ ] Calculate yearly tax breakdowns
    - [ ] Aggregate results into yearly projections
- [ ] **Task 4: Implement Error Handling (AC: 7)**
    - [ ] Add validation for required data
    - [ ] Implement error logging
    - [ ] Add fallback behavior for missing data
- [ ] **Task 5: Testing**
    - [ ] Unit tests for calculation functions
    - [ ] Integration tests for state management
    - [ ] Edge case testing

**Dev Technical Guidance**
- **Primary Logic Location:** `src/services/calculationService.ts`
- **Data Models:** Use existing `Scenario`, `Asset`, `PlannedAssetSale` types
- **Immutability:** Ensure all inputs to calculation functions are treated as immutable
- **Date Handling:** Use simple year-difference for holding period calculation
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