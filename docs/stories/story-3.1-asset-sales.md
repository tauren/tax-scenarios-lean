## Story 3.1: Implement Detailed "Planned Asset Sales" Management per Scenario (with Preview)

**Status:** Draft

**Story**
- As a user, I want to define a detailed plan of asset sales (specifying which of my global assets to sell, the quantity, and the expected sale price) for each year within each of my scenarios, independently from other scenarios, and receive an immediate estimated capital gain/loss preview for each individual sale transaction as I input it, so I can model different liquidation strategies and understand their initial tax implications effectively.

**Acceptance Criteria (ACs)**
1.  Within the editing interface for any given `Scenario` (Baseline or Comparison) (`ScenarioEditorView.tsx`), a dedicated section allows users to manage "Planned Asset Sales" specific to that scenario.
2.  Users can add a new planned asset sale entry. The input form for this must allow the user to: Select which of their globally defined `Assets` is being sold (e.g., via a dropdown list populated with names of assets from `UserAppState.initialAssets`); Specify the `year` of the planned sale (must be within the `Scenario`'s `projectionPeriodYears`); Input the `quantity` of the asset to be sold in that transaction (numeric input, validated against available quantity of the selected global asset); Input the expected `salePricePerUnit` for that transaction (numeric input).
3.  As the user inputs or modifies the details for an individual planned asset sale (`assetId`, `quantity`, `salePricePerUnit`, `year`):
    a.  The system must immediately calculate and display an *estimated* capital gain or loss preview specifically for *that single transaction*.
    b.  This preview calculation must use the selected `Asset`'s `costBasisPerUnit` and `acquisitionDate`.
    c.  The preview must attempt to differentiate between estimated short-term and long-term capital gains based on the holding period (calculated from `Asset.acquisitionDate` to the sale year).
    d.  If the current `Scenario` has an active `SpecialTaxFeature` that `requiresGainBifurcation`, and if `ScenarioAssetTaxDetail` (containing `residencyAcquisitionDate` and `valueAtResidencyAcquisitionDatePerUnit`) has been entered for the selected asset within this scenario (as per Story 3.3), the preview should endeavor to show an estimated gain breakdown (e.g., pre-residency vs. post-residency portions).
    e.  If details for gain bifurcation (per AC 3.d) are required by an active STF but not yet entered for the asset in the scenario, the preview should clearly indicate that the displayed gain is a simple calculation and that full accuracy under the STF requires further asset-specific date/value inputs for that scenario.
    f.  All previews must be explicitly labeled as "Estimated gain/loss for this transaction only" and state that it may not reflect the final overall tax liability for the scenario.
4.  Users can view a list of all `PlannedAssetSale` entries defined for the current scenario, ideally grouped or sortable by year, showing key details (e.g., asset name, year, quantity, sale price, estimated transaction gain/loss).
5.  Users can select any existing planned asset sale entry to edit its details.
6.  Users can delete a planned asset sale entry from the scenario, with a confirmation prompt to prevent accidental deletion.
7.  All defined `PlannedAssetSale` objects are stored as part of their specific `Scenario` object within the "Active Plan" in the application's internal state.
8.  The UI for managing planned asset sales, including the preview display, must be responsive and user-friendly.
9.  Validation must be in place to prevent a user from planning to sell more of an asset (in total across all planned sales for that asset within a scenario, considering sales across all years for that asset in that scenario) than the globally defined `Asset.quantity`.

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The `scenario-editor-view.tsx` mockup is the primary guide for the UI where users will manage "Planned Asset Sales" for a scenario. This includes the form for adding/editing sales, the list display, and the gain/loss preview area. Adhere to its layout, component styling, and overall appearance.

**Mockup File:** `../../v0-mockups/components/scenario-editor-view.tsx`

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [ ] **Task 1: Design UI for Planned Asset Sales Section (AC: 1, 4, 8)**
    - [ ] Within `ScenarioEditorView.tsx`, create a dedicated, clearly labeled section for "Planned Asset Sales".
    - [ ] This section should include:
        - A button to "Add Planned Sale".
        - A list/table to display existing planned sales for the current scenario, showing key details (Asset Name, Year, Quantity, Sale Price, Estimated Transaction Gain/Loss Preview).
        - Action buttons (Edit, Delete) for each listed sale.
    - [ ] Ensure the layout is guided by `scenario-editor-view.tsx` mockup and is responsive.
- [ ] **Task 2: Implement Form for Adding/Editing Planned Asset Sale (AC: 2, 5)**
    - [ ] Develop a form (e.g., in a ShadCN `Dialog` or inline section) for adding/editing a `PlannedAssetSale`.
    - [ ] Fields:
        - Asset Selection: Dropdown (ShadCN `Select` or `Combobox`) populated with `name` and `id` from `UserAppState.initialAssets`.
        - Year of Sale: Numeric input (validated against `scenario.projectionPeriodYears`).
        - Quantity to Sell: Numeric input.
        - Sale Price Per Unit: Numeric input.
    - [ ] Form should have "Save" and "Cancel" actions.
- [ ] **Task 3: Implement State Management for Planned Asset Sales (AC: 7)**
    - [ ] Define the `PlannedAssetSale` interface in `src/types/index.ts` as per `architecture-lean-v1.2.md`.
    - [ ] In `userAppStateSlice.ts` (Zustand store), ensure `Scenario.plannedAssetSales: PlannedAssetSale[]` exists.
    - [ ] Implement store actions to:
        - `addPlannedSaleToScenario(scenarioId: string, sale: PlannedAssetSale)`
        - `updatePlannedSaleInScenario(scenarioId: string, saleId: string, updatedSale: Partial<PlannedAssetSale>)`
        - `deletePlannedSaleFromScenario(scenarioId: string, saleId: string)`
    - [ ] Ensure unique IDs are generated for new `PlannedAssetSale` objects.
- [ ] **Task 4: Implement Live Gain/Loss Preview Logic (AC: 3a, 3b, 3c, 3d, 3e, 3f)**
    - [ ] Create a utility function or hook `calculateTransactionPreview(saleDetails, asset, scenarioAssetTaxDetails?, activeSTFs?)`.
    - [ ] `saleDetails`: Contains `assetId`, `quantity`, `salePricePerUnit`, `year`.
    - [ ] `asset`: The full `Asset` object from `initialAssets`.
    - [ ] `scenarioAssetTaxDetails`: Optional `ScenarioAssetTaxDetail` for the asset in the current scenario (from Story 3.3).
    - [ ] `activeSTFs`: Optional list of active STFs in the current scenario to check for `requiresGainBifurcation`.
    - [ ] This function should calculate:
        - Total gain/loss for the transaction.
        - Differentiate ST/LT based on `Asset.acquisitionDate` and sale `year`.
        - If bifurcation is applicable and details provided, calculate pre/post residency portions.
        - Return an object with these preview values and any necessary warning flags (e.g., if bifurcation details are missing but an STF requires them).
    - [ ] Display this preview dynamically in the add/edit planned sale form as user inputs data. Include disclaimer (AC3f).
- [ ] **Task 5: Implement Quantity Validation (AC: 9)**
    - [ ] When adding or updating a `PlannedAssetSale`, validate that the total quantity planned to be sold for a specific asset (sum across all years for that asset in the current scenario) does not exceed `Asset.quantity` from `initialAssets`.
    - [ ] Provide clear user feedback if validation fails, preventing the invalid sale plan.
- [ ] **Task 6: Testing**
    - [ ] Test adding, editing, and deleting planned sales.
    - [ ] Verify gain/loss preview calculations for various inputs (ST, LT, losses).
    - [ ] Test bifurcation preview logic (once Story 3.3 and relevant STF are notionally in place for testing this preview).
    - [ ] Test quantity validation.

**Dev Technical Guidance**
-   **Visual Reference:** `scenario-editor-view.tsx` for the entire section's look and feel.
-   **Preview Calculation:** This is a key part. The logic should mirror parts of `calculateCapitalGainsForYear` (from Story 2.4) but for a single transaction and without applying tax rates (just calculating gain/loss components).
-   **Holding Period for Preview (AC3c):** Use `Asset.acquisitionDate` and the sale `year`. A simple year difference can determine if holding period is <=1 year or >1 year for ST/LT distinction in the preview. More precise date math can be used if `acquisitionDate` is a full date.
-   **Bifurcation Preview (AC3d, 3e):** This depends on `ScenarioAssetTaxDetail` (from Story 3.3) and knowing if an active STF `requiresGainBifurcation` (from STF definitions in `AppConfig`). The preview should attempt this if possible or show a note.
-   **State Updates:** Ensure granular updates to the `plannedAssetSales` array within the correct `Scenario` object in the Zustand store, maintaining immutability.
-   **UI for List of Sales:** ShadCN `Table` is suitable. Each row should clearly map to a `PlannedAssetSale`.

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
