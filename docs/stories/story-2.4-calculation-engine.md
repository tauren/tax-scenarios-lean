## Story 2.4: Implement Calculation Service Foundation

**Status:** Complete

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
- [x] **Task 1: Define Core Types**
    - [x] Create `ScenarioYearlyProjection` interface
    - [x] Create `ScenarioResults` interface
    - [x] Create `AppCalculatedState` interface
    - [x] Create `CapitalGainsData` interface
    - [x] Create `TaxBreakdown` interface
- [x] **Task 2: Set Up Calculation Service Structure**
    - [x] Create `calculationService.ts` file
    - [x] Define main function signatures
    - [x] Add basic function implementations (returning empty/default values)
    - [x] Add JSDoc documentation
- [x] **Task 3: Update State Management**
    - [x] Add `AppCalculatedState` to store type
    - [x] Implement store actions
    - [x] Add action types and creators
- [x] **Task 4: Implement Error Handling Types**
    - [x] Define `CalculationError` interface
    - [x] Create error handling utilities
    - [x] Add error type constants
- [x] **Task 5: Testing**
    - [x] Test type definitions
    - [x] Test store actions
    - [x] Test error handling utilities

**Dev Technical Guidance**
- **Type Definitions:** Keep interfaces focused and minimal
- **Service Structure:** Design for future extensibility
- **State Management:** Ensure immutability in store updates
- **Error Handling:** Make errors descriptive and actionable

**Dependencies**
- Story 3.1 (Planned Asset Sales Management)
- Story 1.2 (Asset Management)

**Story Progress Notes**
* **Agent Model Used:** `Claude-3-Sonnet-20240229`
* **Completion Notes List:**
    * Implemented all core types in `src/types/index.ts`
    * Created calculation service with basic structure in `src/services/calculationService.ts`
    * Added calculation state slice in `src/store/calculationStateSlice.ts`
    * Implemented error handling utilities in `src/utils/calculationErrors.ts`
    * Added tests for calculation service and error utilities
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Reorganized as foundational story - May 31, 2025 - Sarah (PO)
    * Started Implementation - May 31, 2025 - Sarah (PO)
    * Completed Implementation - May 31, 2025 - Claude (Dev Agent)
    * Marked as Complete - May 31, 2025 - Claude (Story Validator)
