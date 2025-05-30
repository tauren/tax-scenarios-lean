## Story 3.4: Integrate and Apply Selected (CGT-Relevant) `SpecialTaxFeatures` in Calculations

**Status:** Draft

**Story**
- As a user, after I have selected applicable `special_tax_features` for a scenario and provided any necessary inputs (including scenario-specific asset tax details if required by Story 3.3), I want the tax calculation engine to apply the specific logic of these features to accurately adjust my estimated tax liability (e.g., capital gains tax) or overall financial outcome for that scenario, reflecting the benefits or changes introduced by those features.

**Acceptance Criteria (ACs)**
1.  The main tax calculation engine (function `calculateScenarioResults` from Story 2.4, specifically its sub-function `calculateTaxes_MVP`) is enhanced to process `SpecialTaxFeatures` (STFs) after the "basic" Capital Gains Tax (based on scenario effective rates) has been initially calculated for a given year.
2.  For each year of a scenario's projection, after basic CGT is calculated, the engine iterates through each `selectedFeatureEntry` in the `Scenario.selectedSpecialTaxFeatures` array.
3.  For each `selectedFeatureEntry`:
    a.  The engine retrieves the full `SpecialTaxFeature` definition (including `id`, `name`, `appliesTo`, `inputs` schema, `requiresGainBifurcation` flag) from `appConfig.globalSpecialTaxFeatures` using the `selectedFeatureEntry.featureId`.
    b.  If a valid `featureDefinition` is found, a corresponding specific JavaScript handler function for that `SpecialTaxFeature` (e.g., `handleBifurcatedGainsSTF`, `handleFlatRateCGTSTF`) is invoked.
4.  The invoked STF handler function receives all necessary data context: the current year, the `taxBreakdown` object for the current year (which the handler will modify), relevant `capitalGainsData` for the year (including `preResidencyCapitalGains` and `postResidencyCapitalGains` components if `requiresGainBifurcation` was active and data from Story 3.3 was provided), user-provided `inputs` for this STF instance, the parent `Scenario` object, and relevant `AppConfig` parts.
5.  Each STF handler function correctly implements its unique tax rule logic, primarily modifying `taxBreakdown.capitalGainsTax` or other components of `taxBreakdown.totalTax` for the MVP.
6.  For MVP, at least one example STF that `requiresGainBifurcation` (e.g., a simplified rule where pre-residency gains are taxed at 0% and post-residency gains at the scenario's effective rates or a special STF rate) is fully implemented and demonstrably alters `capitalGainsTax` when selected and configured with `ScenarioAssetTaxDetail` data (input via Story 3.3).
7.  (Deferred for MVP as per PRD - AC for STF affecting income tax: For MVP, STFs will primarily target Capital Gains or provide other financial outcome adjustments, not direct income tax calculation, as the base engine doesn't calculate income tax).
8.  The order of application if multiple STFs are selected by the user for a single scenario is predefined and consistently followed (e.g., processed in the order they appear in `Scenario.selectedSpecialTaxFeatures`).
9.  The final `taxBreakdown.totalTax` for the year accurately reflects the sum of all tax components after modifications by all active, selected, and correctly configured STFs.
10. The calculation engine and STF handlers include basic error handling for scenarios where an STF cannot be properly applied due to missing or invalid user `inputs` (beyond `ScenarioAssetTaxDetail` UI prompts from Story 3.3). E.g., log a warning, STF has no effect, or UI (in display stories) might indicate STF was not fully applied.

**Visual & Layout Reference (Conceptual Mockup)**
**Mockup File:** N/A (This story is focused on backend calculation logic; UI display of results is covered in Stories 2.5, 2.6, and 4.5).

**Tasks / Subtasks**
- [ ] **Task 1: Enhance `calculateTaxes_MVP` Function (AC: 1, 2, 8)**
    - [ ] Modify the `calculateTaxes_MVP` function within `calculationService.ts` (from Story 2.4).
    - [ ] After the baseline CGT is calculated using `scenario.capitalGainsTaxRates`, add a loop to iterate through `scenario.selectedSpecialTaxFeatures`.
    - [ ] Implement a predefined order for STF application if multiple are selected (e.g., array order).
- [ ] **Task 2: STF Handler Dispatching Logic (AC: 3)**
    - [ ] Inside the loop (Task 1), for each `selectedFeatureEntry`:
        - [ ] Retrieve the full `featureDefinition` from `appConfigService.getGlobalSpecialTaxFeatures()` using `selectedFeatureEntry.featureId`.
        - [ ] Implement a dispatcher (e.g., a switch statement or a map of `featureId` to handler functions) that calls the appropriate STF handler function based on `featureDefinition.id`.
- [ ] **Task 3: Implement STF Handler Function(s) (AC: 4, 5, 6)**
    - [ ] Create specific handler functions for each STF defined in `AppConfig` that's relevant for MVP (at least one requiring gain bifurcation). For example: `function handleExampleBifurcationSTF(context): taxBreakdown`.
    - [ ] The `context` object passed to handlers should include: `currentYear`, `taxBreakdown` (mutable reference), `capitalGainsData` (output from `calculateCapitalGainsForYear`, including `preResidencyCapitalGains` and `postResidencyCapitalGains` sub-objects), `stfInputs` (from `selectedFeatureEntry.inputs`), `parentScenario` object, and `appConfig`.
    - [ ] **Example Bifurcation STF Logic (AC6):**
        - If `capitalGainsData.preResidencyCapitalGains` exist (from sales of assets with `ScenarioAssetTaxDetail`), this STF might set the tax on these to 0.
        - It might then apply a special flat rate from its `stfInputs` to `capitalGainsData.postResidencyCapitalGains`, or let the scenario's base effective rates apply to post-residency gains if no special STF rate is defined.
        - Update `taxBreakdown.capitalGainsTax` accordingly.
- [ ] **Task 4: Finalize `totalTax` Calculation (AC: 9)**
    - [ ] After all STFs have been processed for the year, ensure `taxBreakdown.totalTax` is correctly summed up from all its components (which for MVP will primarily be the potentially modified `capitalGainsTax`).
- [ ] **Task 5: Implement Error Handling for STF Application (AC: 10)**
    - [ ] Within STF handlers or the dispatcher, add `try-catch` blocks or checks for required `stfInputs`.
    - [ ] If an STF cannot be applied due to missing/invalid inputs not caught by UI validation, log a warning to the console. The STF should then gracefully fail to apply (i.e., not modify `taxBreakdown` or not crash the calculation).
    - [ ] Consider adding a mechanism for the calculation result to carry a list of warnings that the UI could potentially display (post-MVP enhancement, for this story console log is fine).
- [ ] **Task 6: Unit Testing for STF Logic**
    - [ ] Write unit tests for each STF handler function with various inputs and scenarios.
    - [ ] Test the STF dispatcher logic.
    - [ ] Test `calculateTaxes_MVP` with scenarios that have no STFs, one STF, and multiple STFs.
    - [ ] Specifically test the bifurcation STF with and without `ScenarioAssetTaxDetail` provided for relevant assets.

**Dev Technical Guidance**
-   **Modular STF Handlers:** Keep each STF's logic in its own well-named function within `calculationService.ts` or a dedicated `stfHandlers.ts` module. This promotes modularity and testability.
-   **Data Context for Handlers:** Ensure handlers receive all necessary data. The `capitalGainsData` object from `calculateCapitalGainsForYear` (Story 2.4 task 3) is critical, especially its `preResidencyCapitalGains` and `postResidencyCapitalGains` components if gain bifurcation is active.
-   **Immutability within Handlers:** STF handlers should modify the `taxBreakdown` object they receive (or return a new modified one). Other context data should be treated as read-only.
-   **Order of Operations:** The architecture specifies STFs modify taxes *after* baseline calculations. Ensure this order. `architecture-lean-v1.2.md` (Section 6.6.3) details this.
-   **Gain Bifurcation Logic (AC6):** The `calculateCapitalGainsForYear` function (Story 2.4) should already be providing `preResidencyCapitalGains` and `postResidencyCapitalGains` if `ScenarioAssetTaxDetail` is present and an STF `requiresGainBifurcation`. The STF handler then uses these pre-categorized gains. For example, it might zero out tax on `preResidencyCapitalGains` and apply a specific rate (from STF inputs or scenario rates) to `postResidencyCapitalGains`.
-   **Error Logging:** Use `console.warn` for non-critical issues where an STF might not apply as expected due to configuration, to aid debugging.

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
