## Story 2.4: Implement Calculation Service Foundation

**Status:** In Progress

**Story**
- As a developer, I want to have a well-defined structure for the calculation service and its types, so I can implement the core capital gains tax calculations in a maintainable and extensible way.

**Acceptance Criteria (ACs)**
1. The following interfaces are defined in `src/types/index.ts`:
   - `ScenarioYearlyProjection` with fields for:
     - `year`: number
     - `taxBreakdown`: { capitalGainsTax: number, totalTax: number }
     - `netFinancialOutcome`: number
   - `ScenarioResults` with fields for:
     - `yearlyProjections`: ScenarioYearlyProjection[]
     - `totalNetFinancialOutcomeOverPeriod`: number
   - `AppCalculatedState` with fields for:
     - `resultsByScenario`: { [scenarioId: string]: ScenarioResults }
2. The calculation service structure is set up in `src/services/calculationService.ts` with:
   - Main function signature: `calculateScenarioResults(scenario: Scenario, globalAssets: Asset[]): ScenarioResults`
   - Helper function signatures for:
     - `calculateCapitalGainsForYear(currentYear: number, scenario: Scenario, globalAssets: Asset[]): CapitalGainsData`
     - `calculateTaxesForYear(capitalGainsData: CapitalGainsData, scenario: Scenario): TaxBreakdown`
3. The Zustand store is updated to include:
   - `AppCalculatedState` in the store type
   - Actions for:
     - `setScenarioResults(scenarioId: string, results: ScenarioResults)`
     - `clearScenarioResults(scenarioId: string)`
     - `clearAllResults()`
4. Basic error handling types are defined:
   - `CalculationError` interface for structured error reporting
   - Error handling utilities for common calculation errors

**Tasks / Subtasks**
- [ ] **Task 1: Define Core Types**
    - [ ] Create `ScenarioYearlyProjection` interface
    - [ ] Create `ScenarioResults` interface
    - [ ] Create `AppCalculatedState` interface
    - [ ] Create `CapitalGainsData` interface
    - [ ] Create `TaxBreakdown` interface
- [ ] **Task 2: Set Up Calculation Service Structure**
    - [ ] Create `calculationService.ts` file
    - [ ] Define main function signatures
    - [ ] Add basic function implementations (returning empty/default values)
    - [ ] Add JSDoc documentation
- [ ] **Task 3: Update State Management**
    - [ ] Add `AppCalculatedState` to store type
    - [ ] Implement store actions
    - [ ] Add action types and creators
- [ ] **Task 4: Implement Error Handling Types**
    - [ ] Define `CalculationError` interface
    - [ ] Create error handling utilities
    - [ ] Add error type constants
- [ ] **Task 5: Testing**
    - [ ] Test type definitions
    - [ ] Test store actions
    - [ ] Test error handling utilities

**Dev Technical Guidance**
- **Type Definitions:** Keep interfaces focused and minimal
- **Service Structure:** Design for future extensibility
- **State Management:** Ensure immutability in store updates
- **Error Handling:** Make errors descriptive and actionable

**Dependencies**
- Story 3.1 (Planned Asset Sales Management)
- Story 1.2 (Asset Management)

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Reorganized as foundational story - May 31, 2025 - Sarah (PO)
    * Started Implementation - May 31, 2025 - Sarah (PO)
