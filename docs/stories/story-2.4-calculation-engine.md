## Story 2.4: Implement Capital Gains Tax Calculation Engine

**Status:** Draft

**Story**
- As a user, I want the system to calculate estimated Capital Gains Tax for each scenario, using my planned asset sales, asset holding periods (derived from `Asset.acquisitionDate` and sale year), and the effective Short-Term/Long-Term Capital Gains Tax rates I've defined for that scenario, so I can see the primary CGT impact of my plans.

**Acceptance Criteria (ACs)**
1.  A core calculation engine function (e.g., `calculateScenarioProjection` as detailed in `architecture-lean-v1.2.md`) is implemented that processes a single `Scenario` object and the global `UserAppState` (for `initialAssets`).
2.  For each projection year within the scenario, the engine correctly identifies `PlannedAssetSale`s for that year.
3.  For each sale, the engine calculates the capital gain/loss by comparing `salePricePerUnit * quantity` with `costBasisPerUnit * quantity` (from the corresponding global `Asset`).
4.  The engine correctly determines the holding period for each sold asset (from `Asset.acquisitionDate` to the `year` of the `PlannedAssetSale`) and categorizes the gain/loss as either Short-Term or Long-Term based on standard thresholds (e.g., <=1 year for Short-Term, >1 year for Long-Term).
5.  The engine applies the scenario-specific effective Short-Term and Long-Term Capital Gains Tax rates (from the first entry in `Scenario.capitalGainsTaxRates`) to the respective aggregated Short-Term and Long-Term gains for that year to calculate the estimated Capital Gains Tax for that year.
6.  The calculated Capital Gains Tax for each year is stored in the `ScenarioYearlyProjection.taxBreakdown.capitalGainsTax` field. The `ScenarioYearlyProjection.taxBreakdown.totalTax` for MVP will primarily reflect this CGT amount (plus any STF impacts from Story 3.4).
7.  The engine structure is designed to accommodate the future integration of `SpecialTaxFeatures` (as per Story 3.4) which may modify how gains are categorized or how tax rates are applied. For this story, the engine uses the direct scenario-level effective CGT rates.
8.  The engine includes basic error handling for missing or invalid critical data (e.g., missing CGT rates in a scenario, missing asset for a planned sale), logging errors and potentially returning zero tax or a specific error indicator for the affected calculation.
9.  The calculation result for a scenario (a `ScenarioResults` object containing `yearlyProjections`) is stored or made available for display and use by other components (e.g., in `AppCalculatedState` as per `architecture-lean-v1.2.md`).

**Visual & Layout Reference (Conceptual Mockup)**
**Mockup File:** N/A (This story is focused on backend calculation logic; UI display of results is covered in Stories 2.5, 2.6, and 4.5).

**Tasks / Subtasks**
- [ ] **Task 1: Implement Core `calculationService.ts` Structure (AC: 1, 9)**
    - [ ] Create/update `calculationService.ts` in `src/services/` as per `front-end-architecture-v0.3.md`.
    - [ ] Define the main function signature, e.g., `calculateScenarioResults(scenario: Scenario, globalAssets: Asset[], appConfig: AppConfig): ScenarioResults`. (Note: `userQualitativeGoals` might not be strictly needed for *this* story's CGT focus but is part of the full function signature in architecture for overall results).
    - [ ] Define `ScenarioResults` and `ScenarioYearlyProjection` interfaces in `src/types/index.ts` according to `architecture-lean-v1.2.md` (ensuring `taxBreakdown` includes `capitalGainsTax` and `totalTax`).
- [ ] **Task 2: Implement Yearly Iteration and Financial Context Aggregation (AC: 1)**
    - [ ] Inside `calculateScenarioResults`, loop from year 1 to `scenario.projectionPeriodYears`.
    - [ ] For each year, aggregate `grossIncome` (from `scenario.incomeSources`) and `totalExpenses` (from `scenario.annualExpenses`) as per logic in `architecture-lean-v1.2.md` sections 6.2 & 6.3. These are for context in `ScenarioYearlyProjection`.
- [ ] **Task 3: Implement Capital Gain/Loss Calculation for Asset Sales (AC: 2, 3, 4)**
    - [ ] Create a helper function `calculateCapitalGainsForYear(currentYear, scenario, globalAssets)` as described in `architecture-lean-v1.2.md` (Section 6.4).
    - [ ] This function should:
        - Filter `scenario.plannedAssetSales` for the `currentYear`.
        - For each sale, find the corresponding asset in `globalAssets` using `assetId`.
        - Calculate gain/loss: `(salePricePerUnit - costBasisPerUnit) * quantity`.
        - Determine holding period (sale year - `Asset.acquisitionDate` year). For simplicity in MVP, assume full years or use a more precise date diff if `Asset.acquisitionDate` includes month/day.
        - Categorize gain/loss as Short-Term (<= 1 year holding) or Long-Term (> 1 year holding).
        - Aggregate total ST gains, LT gains, and total capital gains income for the year.
        - Return an object like `{ totalCapitalGainsIncome, shortTermGains, longTermGains }`. (Note: `architecture-lean-v1.2.md` section 6.4 output includes pre/post residency distinction, but for this story without STFs active, all gains are effectively "post-residency" or total).
- [ ] **Task 4: Implement CGT Application (AC: 5, 6)**
    - [ ] Create a helper function `calculateTaxes_MVP_CGT_Only(capitalGainsData, scenario)` as a simplified version of `calculateTaxes_MVP` from `architecture-lean-v1.2.md` (Section 6.6), focusing only on applying `scenario.capitalGainsTaxRates`.
    - [ ] Retrieve `effectiveST_Rate` and `effectiveLT_Rate` from `scenario.capitalGainsTaxRates[0]`. Handle cases where rates might be missing or zero (default to 0 tax).
    - [ ] Calculate `capitalGainsTax = (capitalGainsData.shortTermGains * effectiveST_Rate) + (capitalGainsData.longTermGains * effectiveLT_Rate)`.
    - [ ] Set `taxBreakdown.capitalGainsTax` and `taxBreakdown.totalTax = taxBreakdown.capitalGainsTax` for MVP.
- [ ] **Task 5: Assemble `ScenarioYearlyProjection` and `ScenarioResults` (AC: 1, 6, 9)**
    - [ ] In the main loop of `calculateScenarioResults`, for each year:
        - Calculate `netFinancialOutcome` as per `architecture-lean-v1.2.md` (Section 6.7), using the contextual income, expenses, and calculated `totalTax`.
        - Populate the `ScenarioYearlyProjection` object.
    - [ ] After the loop, calculate `totalNetFinancialOutcomeOverPeriod`.
    - [ ] The `qualitativeFitScore` part of `ScenarioResults` will be handled in Story 4.3; for now, it can be a placeholder (e.g., 0 or null).
    - [ ] Return the complete `ScenarioResults` object.
- [ ] **Task 6: Integrate Calculation Service and Store Results (AC: 9)**
    - [ ] Create a mechanism (e.g., a Zustand store action or a thunk/async action if calculations were hypothetically async) that triggers `calculationService.calculateScenarioResults` for a given scenario ID when its data changes.
    - [ ] Store the returned `ScenarioResults` in an `AppCalculatedState` object within the Zustand store, keyed by `scenarioId`, as per `architecture-lean-v1.2.md`. Example: `resultsByScenario: { [scenarioId: string]: ScenarioResults }`.
- [ ] **Task 7: Basic Error Handling and Placeholder for STFs (AC: 7, 8)**
    - [ ] Implement basic checks in calculation functions for missing critical data (e.g., an asset not found for a planned sale, missing CGT rates for a scenario) and log console errors. For MVP, calculation might proceed with zero values for the problematic part.
    - [ ] Ensure the `calculateTaxes_MVP_CGT_Only` function is structured so that in Story 3.4, the STF application logic can be inserted *after* this baseline CGT calculation.

**Dev Technical Guidance**
-   **Primary Logic Location:** `src/services/calculationService.ts`.
-   **Data Models:** Strictly adhere to `Scenario`, `Asset`, `PlannedAssetSale`, `CapitalGainsTaxRate`, `ScenarioYearlyProjection`, `ScenarioResults`, `AppCalculatedState` as defined in `architecture-lean-v1.2.md`.
-   **Immutability:** Ensure all inputs to calculation functions are treated as immutable. The service should return new result objects.
-   **Date Handling for Holding Periods:** Be precise. A simple year-difference might suffice for MVP's "greater than 1 year" ST/LT distinction, but if `Asset.acquisitionDate` includes month/day, a more accurate calculation of "days held" or "months held" would be better. For MVP, clarify with user if year-only diff is acceptable for ST/LT. (PRD AC4 for this story mentions "holding periods derived from Asset.acquisitionDate and sale year").
-   **No UI in this Story:** This story is purely about the calculation logic and storing results in state. Displaying these results is for stories 2.5, 2.6, and 4.5.
-   **Testing:** This service is critical and should be heavily unit-tested with various inputs, including edge cases (zero values, empty arrays, scenarios with/without sales, etc.).
-   **Placeholder for STF:** The `calculateTaxes_MVP` function in `architecture-lean-v1.2.md` shows where STFs apply. For this story, the tax calculation will be simpler, only applying the scenario's direct CGT rates. Story 3.4 will enhance this.

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
