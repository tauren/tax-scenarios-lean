## Story 3.1: Implement Core Planned Asset Sales Management per Scenario

**Status:** Completed

**Story**
- As a user, I want to define a detailed plan of asset sales (specifying which of my global assets to sell, the quantity, and the expected sale price) for each year within each of my scenarios, independently from other scenarios, so I can model different liquidation strategies.

**Acceptance Criteria (ACs)**
1. Within the editing interface for any given `Scenario` (Baseline or Comparison) (`ScenarioEditorView.tsx`), a dedicated section allows users to manage "Planned Asset Sales" specific to that scenario.
2. Users can add a new planned asset sale entry. The input form for this must allow the user to:
   - Select which of their globally defined `Assets` is being sold (e.g., via a dropdown list populated with names of assets from `UserAppState.initialAssets`)
   - Specify the `year` of the planned sale (must be within the `Scenario`'s `projectionPeriodYears`)
   - Input the `quantity` of the asset to be sold in that transaction (numeric input, validated against available quantity of the selected global asset)
   - Input the expected `salePricePerUnit` for that transaction (numeric input)
4. Users can view a list of all `PlannedAssetSale` entries defined for the current scenario, ideally grouped or sortable by year, showing key details (e.g., asset name, year, quantity, sale price).
5. Users can select any existing planned asset sale entry to edit its details.
6. Users can delete a planned asset sale entry from the scenario, with a confirmation prompt to prevent accidental deletion.
7. All defined `PlannedAssetSale` objects are stored as part of their specific `Scenario` object within the "Active Plan" in the application's internal state.
8. The UI for managing planned asset sales must be responsive and user-friendly.
9. Basic validation must be in place to prevent a user from planning to sell more of an asset (in total across all planned sales for that asset within a scenario, considering sales across all years for that asset in that scenario) than the globally defined `Asset.quantity`.

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The `scenario-editor-view.tsx` mockup is the primary guide for the UI where users will manage "Planned Asset Sales" for a scenario. This includes the form for adding/editing sales and the list display. Adhere to its layout, component styling, and overall appearance.

**Mockup File:** `../../v0-mockups/components/scenario-editor-view.tsx`

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [x] **Task 1: Design UI for Planned Asset Sales Section (AC: 1, 4, 8)**
    - [x] Within `ScenarioEditorView.tsx`, create a dedicated, clearly labeled section for "Planned Asset Sales".
    - [x] This section should include:
        - A button to "Add Planned Sale".
        - A list/table to display existing planned sales for the current scenario, showing key details (Asset Name, Year, Quantity, Sale Price).
        - Action buttons (Edit, Delete) for each listed sale.
    - [x] Ensure the layout is guided by `scenario-editor-view.tsx` mockup and is responsive.
- [x] **Task 2: Implement Form for Adding/Editing Planned Asset Sale (AC: 2, 5)**
    - [x] Develop a form (e.g., in a ShadCN `Dialog` or inline section) for adding/editing a `PlannedAssetSale`.
    - [x] Fields:
        - Asset Selection: Dropdown (ShadCN `Select` or `Combobox`) populated with `name` and `id` from `UserAppState.initialAssets`.
        - Year of Sale: Numeric input (validated against `scenario.projectionPeriodYears`).
        - Quantity to Sell: Numeric input.
        - Sale Price Per Unit: Numeric input.
    - [x] Form should have "Save" and "Cancel" actions.
- [x] **Task 3: Implement State Management for Planned Asset Sales (AC: 7)**
    - [x] Define the `PlannedAssetSale` interface in `src/types/index.ts` as per `architecture-lean-v1.2.md`.
    - [x] In `userAppStateSlice.ts` (Zustand store), ensure `Scenario.plannedAssetSales: PlannedAssetSale[]` exists.
    - [x] Implement store actions to:
        - `addPlannedSaleToScenario(scenarioId: string, sale: PlannedAssetSale)`
        - `updatePlannedSaleInScenario(scenarioId: string, saleId: string, updatedSale: Partial<PlannedAssetSale>)`
        - `deletePlannedSaleFromScenario(scenarioId: string, saleId: string)`
    - [x] Ensure unique IDs are generated for new `PlannedAssetSale` objects.
- [x] **Task 4: Implement Basic Quantity Validation (AC: 9)**
    - [x] Basic validation for positive quantities
    - [x] Note: Advanced validation across years moved to Story 3.1c
- [x] **Task 5: Testing**
    - [x] Test adding, editing, and deleting planned sales.
    - [x] Test basic quantity validation.
    - [x] Test UI responsiveness and user experience.

**Dev Technical Guidance**
- **Visual Reference:** `scenario-editor-view.tsx` for the entire section's look and feel.
- **State Updates:** Ensure granular updates to the `plannedAssetSales` array within the correct `Scenario` object in the Zustand store, maintaining immutability.
- **UI for List of Sales:** ShadCN `Table` is suitable. Each row should clearly map to a `PlannedAssetSale`.

**Dependencies**
- Story 2.3 (Edit Scenario) - for `ScenarioEditorView.tsx`
- Story 1.2 (Asset Management) - for `UserAppState.initialAssets`

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * Core functionality implemented and tested
    * Advanced quantity validation moved to Story 3.1c
    * UI components and state management working as expected
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Split into 3.1, 3.1a, and 3.1b - May 31, 2025 - Sarah (PO)
    * Moved advanced quantity validation to Story 3.1c - May 31, 2025 - Sarah (PO)
    * Marked as Completed - May 31, 2025 - Sarah (PO)
