## Story 3.1b: Implement Advanced Gain/Loss Preview with Bifurcation for Planned Asset Sales

**Status:** Draft

**Story**
- As a user, I want to see a detailed gain/loss preview that includes bifurcation (pre-residency vs. post-residency portions) for my planned asset sales when applicable, so I can better understand the tax implications under special tax features that require gain bifurcation.

**Acceptance Criteria (ACs)**
1. As the user inputs or modifies the details for an individual planned asset sale (`assetId`, `quantity`, `salePricePerUnit`, `year`):
   d. If the current `Scenario` has an active `SpecialTaxFeature` that `requiresGainBifurcation`, and if `ScenarioAssetTaxDetail` (containing `residencyAcquisitionDate` and `valueAtResidencyAcquisitionDatePerUnit`) has been entered for the selected asset within this scenario (as per Story 3.3), the preview should endeavor to show an estimated gain breakdown (e.g., pre-residency vs. post-residency portions).
   e. If details for gain bifurcation (per AC 1.d) are required by an active STF but not yet entered for the asset in the scenario, the preview should clearly indicate that the displayed gain is a simple calculation and that full accuracy under the STF requires further asset-specific date/value inputs for that scenario.

**Tasks / Subtasks**
- [ ] **Task 1: Enhance Preview Logic for Bifurcation**
    - [ ] Extend the `calculateTransactionPreview` function to handle bifurcation:
        - Add parameters for `scenarioAssetTaxDetails` and `activeSTFs`
        - Implement logic to check for `requiresGainBifurcation` in active STFs
        - Calculate pre/post residency portions when bifurcation details are available
    - [ ] Add validation to check if required bifurcation details are present
    - [ ] Implement warning system for missing bifurcation details
- [ ] **Task 2: Update UI for Bifurcation Display**
    - [ ] Enhance preview display to show bifurcated gain/loss components
    - [ ] Add clear visual indicators when bifurcation is required but details are missing
    - [ ] Implement tooltips or help text explaining bifurcation requirements
- [ ] **Task 3: Testing**
    - [ ] Test bifurcation calculations with various scenarios
    - [ ] Verify correct display of warnings when bifurcation details are missing
    - [ ] Test integration with Story 3.3's `ScenarioAssetTaxDetail` functionality

**Dev Technical Guidance**
- **Bifurcation Logic:** This depends on `ScenarioAssetTaxDetail` (from Story 3.3) and knowing if an active STF `requiresGainBifurcation` (from STF definitions in `AppConfig`).
- **Integration Points:**
    - Must work with the basic preview from Story 3.1a
    - Depends on Story 3.3 for `ScenarioAssetTaxDetail` data
    - Must check STF configurations from `AppConfig`
- **UI Considerations:** The bifurcated preview should be clearly separated from the basic preview, with appropriate visual hierarchy and explanatory text.

**Dependencies**
- Story 3.1a (Basic Gain/Loss Preview)
- Story 3.3 (Gain Bifurcation)
- Special Tax Features (STFs) implementation

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO) 