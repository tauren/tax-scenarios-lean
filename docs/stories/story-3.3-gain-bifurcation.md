## Story 3.3: Input Scenario-Specific Asset Tax Details for Gain Bifurcation (if STF requires)

**Status:** Draft

**Story**
- As a user, after I have selected a `special_tax_feature` for my scenario that `requiresGainBifurcation` (as defined in its global configuration), I want to be clearly prompted and able to input (or confirm/edit) the `residencyAcquisitionDate` and `valueAtResidencyAcquisitionDatePerUnit` for each of my relevant global assets *specifically for that scenario*, so that capital gains can be accurately bifurcated for tax calculations under that feature.

**Acceptance Criteria (ACs)**
1.  If a user selects or has active one or more `SpecialTaxFeature`(s) for a given `Scenario`, and any of those selected features have their `requiresGainBifurcation` property set to `true` in their `appConfig.globalSpecialTaxFeatures` definition:
    a.  The system must provide a clear and accessible UI section or prompt within that `Scenario`'s editing interface (`ScenarioEditorView.tsx`) for managing `ScenarioAssetTaxDetail` entries.
    b.  This UI should clearly indicate that these details are necessary for accurately calculating capital gains under the selected special tax feature(s) for that scenario.
2.  Within this UI section for the current scenario, for each `Asset` listed in the global `UserAppState.initialAssets`, the user must be able to input or edit: A scenario-specific `residencyAcquisitionDate` (date input, YYYY-MM-DD); A scenario-specific `valueAtResidencyAcquisitionDatePerUnit` (numeric input).
3.  The UI may suggest the `Scenario.residencyStartDate` as a default for the `residencyAcquisitionDate` for assets, but the user must be able to override this on a per-asset, per-scenario basis.
4.  If `ScenarioAssetTaxDetail` values for an asset have been previously entered for this scenario, those existing values must be displayed and be editable.
5.  The UI should clearly associate each `residencyAcquisitionDate` and `valueAtResidencyAcquisitionDatePerUnit` input with the specific global asset (e.g., by displaying the asset's name alongside the inputs).
6.  The system allows the user to provide these details for any subset of their global assets; it is not mandatory to fill these for every asset if the user deems them irrelevant for certain assets under the active STF(s) for that scenario. (Note: The calculation engine, as per `architecture-lean-v1.2.md` Section 6.4, will handle cases where these details are missing for a sold asset when bifurcation is active).
7.  The entered data for each asset (the `assetId` from the global asset, the scenario-specific `residencyAcquisitionDate`, and `valueAtResidencyAcquisitionDatePerUnit`) is stored as an object within the `Scenario.scenarioAssetTaxDetails` array for the current scenario.
8.  The UI for managing these scenario-specific asset tax details must be responsive and user-friendly.

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The `scenario-editor-view.tsx` mockup should guide the layout for the section where these scenario-specific asset tax details are input. This might be a sub-section that appears when a relevant Special Tax Feature requiring gain bifurcation is active. It could involve a list of global assets with input fields next to each for the bifurcation-specific dates and values.

**Mockup File:** `../../v0-mockups/components/scenario-editor-view.tsx`

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [ ] **Task 1: Design UI for Scenario-Specific Asset Tax Details (AC: 1, 5, 8)**
    - [ ] Within `ScenarioEditorView.tsx`, design a sub-section that becomes visible/active only if one or more selected STFs for the current scenario have `requiresGainBifurcation: true`.
    - [ ] This section should list all assets from `UserAppState.initialAssets`.
    - [ ] Next to each asset, provide input fields for:
        - `residencyAcquisitionDate` (ShadCN `DatePicker`).
        - `valueAtResidencyAcquisitionDatePerUnit` (ShadCN `Input` type number).
    - [ ] Clearly label this section and its purpose (AC1b).
    - [ ] Style guided by `scenario-editor-view.tsx` mockup.
- [ ] **Task 2: Implement Conditional Visibility of the UI Section (AC: 1a)**
    - [ ] In `ScenarioEditorView.tsx`, check the `selectedSpecialTaxFeatures` of the current scenario.
    - [ ] If any selected STF (looked up from `appConfigService.getGlobalSpecialTaxFeatures()`) has `requiresGainBifurcation: true`, then display the UI section from Task 1. Otherwise, hide it.
- [ ] **Task 3: Implement Data Binding and State Management (AC: 2, 4, 7)**
    - [ ] Ensure the `Scenario` model in `src/types/index.ts` includes `scenarioAssetTaxDetails?: ScenarioAssetTaxDetail[]` as per `architecture-lean-v1.2.md`.
    - [ ] For each asset listed in the UI (Task 1), bind the input fields to the corresponding entry in `Scenario.scenarioAssetTaxDetails` (if one exists for that `assetId`) or to temporary state before saving.
    - [ ] Implement Zustand store actions (in `userAppStateSlice.ts`) to:
        - `setScenarioAssetTaxDetail(scenarioId: string, detail: ScenarioAssetTaxDetail)`: Adds or updates a specific asset's tax detail for a scenario. This action will find an existing entry by `assetId` or add a new one.
- [ ] **Task 4: Implement Default Value Suggestion (AC: 3)**
    - [ ] When rendering the input for `residencyAcquisitionDate` for an asset, if no value is set yet for that asset in `Scenario.scenarioAssetTaxDetails`, and if `Scenario.residencyStartDate` is set, pre-fill or suggest the `Scenario.residencyStartDate` as a default. The user must be able to override it.
- [ ] **Task 5: Handling Subset of Assets (AC: 6)**
    - [ ] The user is not forced to enter details for all assets. The system should gracefully handle cases where `ScenarioAssetTaxDetails` are provided for some assets but not others.
- [ ] **Task 6: Testing**
    - [ ] Test conditional visibility of the section based on STF selection.
    - [ ] Test inputting and saving `residencyAcquisitionDate` and `valueAtResidencyAcquisitionDatePerUnit` for various assets.
    - [ ] Verify data is correctly stored in `Scenario.scenarioAssetTaxDetails` in the Zustand store.
    - [ ] Test default value suggestion for `residencyAcquisitionDate`.
    - [ ] Test editing existing details.

**Dev Technical Guidance**
-   **Visual Reference:** `scenario-editor-view.tsx` for the section's appearance.
-   **Conditional Rendering:** The core of this UI is conditional based on the properties of selected STFs.
-   **Data Structure for Storage:** `Scenario.scenarioAssetTaxDetails` is an array of objects, each linking an `assetId` to its scenario-specific tax details.
    ```typescript
    // From architecture-lean-v1.2.md
    // interface ScenarioAssetTaxDetail {
    //   assetId: string; // References Asset.id
    //   residencyAcquisitionDate: string; 
    //   valueAtResidencyAcquisitionDatePerUnit: number;
    // }
    ```
-   **State Management:** Updates should modify the `scenarioAssetTaxDetails` array within the specific `Scenario` object in the Zustand store, ensuring immutability.
-   **Interaction with STF Selection (Story 3.2):** Changes in selected STFs (adding/removing one that `requiresGainBifurcation`) should correctly show/hide this input section.
-   **Default Values:** Providing `Scenario.residencyStartDate` as a default for `residencyAcquisitionDate` is a UX enhancement.

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
