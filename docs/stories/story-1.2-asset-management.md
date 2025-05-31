## Story 1.2: Implement Global Asset Management

**Status:** Complete

**Story**
- As a user, I want to define and manage a global list of my financial assets (name, quantity, cost basis, acquisition date, optional type/FMV) within my Active Plan, so that this core asset information can be used consistently across all scenarios I create.

**Dependencies**
- Story 1.0: Static Data - Required for `appConfigService.ts` and initial configuration data
- Story 1.1: App Shell - Required for `UserAppState` interface and basic application structure
- Architecture Documents: Required for `Asset` interface and other data models

**Acceptance Criteria (ACs)**
1.  A dedicated User Interface (UI) section exists for managing a global list of financial assets associated with the "Active Plan."
2.  Users can add a new asset to this global list. The input form for a new asset must allow for the entry of the following details: Asset Name (text input, required); Quantity (numeric input, required); Cost Basis per Unit (numeric input, required, representing original purchase price per unit); Acquisition Date (date input, e.g., "YYYY-MM-DD", required); Asset Type (optional input, e.g., a dropdown with options like "STOCK," "CRYPTO," "REAL\_ESTATE," "OTHER"); Fair Market Value (FMV) per Unit (optional numeric input, representing current value per unit).
3.  The system provides an intuitive way to add multiple assets sequentially (e.g., after saving an asset, the form clears or an "Add Another Asset" option is available).
4.  The system provides a function to duplicate an existing asset's details into the new asset entry form, allowing the user to then modify only the necessary fields for the new asset.
5.  All entered global assets are displayed in a clear, readable list or table format, showing their key defined details.
6.  Users can select an existing asset from the list to view and edit its details.
7.  Users can delete an asset from the global list. A confirmation step must be included to prevent accidental deletion.
8.  All asset data (additions, edits, deletions) is stored as part of the current "Active Plan" in the application's internal state (specifically in `UserAppState.initialAssets`). (Persistent saving of the Active Plan to `localStorage` is covered in Story 1.4).
9.  The UI for asset management is responsive and usable across different screen sizes.

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The following TSX mockup file provides a conceptual visual layout, component positioning, sizing, and styling guide for the UI elements relevant to this story (specifically the Asset Management view, including the asset list/table and the add/edit asset form). You should use this as a strong reference for the UI's appearance. However, implement the actual functionality, component structure, state management, and data flow strictly according to the detailed tasks in this story, the `front-end-architecture-v0.3.md`, `front-end-spec-v0.1.md`, and `architecture-lean-v1.2.md`.

**Mockup File:** `../../v0-mockups/components/asset-management-view.tsx`

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [x] **Task 1: Create Asset Management View Component (AC: 1, 5, 9)**
    - [x] Create a new view component `AssetManagementView.tsx` in `src/views/` (or `src/pages/` as per final structure in `front-end-architecture-v0.3.md`).
    - [x] Implement the basic layout for this view referencing `../../v0-mockups/components/asset-management-view.tsx` for visual guidance. This should include a clear title (e.g., "My Assets" or "Manage Plan Assets").
    - [x] Add a prominent "Add New Asset" button (e.g., ShadCN `Button`), styled as per the mockup.
    - [x] Implement a table (e.g., ShadCN `Table`) or a list structure to display assets, visually guided by the mockup. Columns should include: Name, Quantity, Cost Basis/Unit, Acquisition Date, Type (opt), FMV/Unit (opt), and placeholders for Action buttons (Edit, Delete, Duplicate).
    - [x] Ensure the view's layout is responsive.
- [x] **Task 2: Implement Asset Data Model and State Management (AC: 8)**
    - [x] Ensure the `Asset` interface is defined in `src/types/index.ts` according to `architecture-lean-v1.2.md`.
    - [x] In the `userAppStateSlice.ts` (Zustand store), ensure the state includes `initialAssets: Asset[]`.
    - [x] Implement or verify existing store actions: `addAsset(asset: Asset)`, `updateAsset(assetId: string, updatedAsset: Partial<Asset>)`, `deleteAsset(assetId: string)`. These actions must handle immutable updates to the `initialAssets` array. Ensure new assets get a unique `id` (e.g., UUID).
- [x] **Task 3: Implement "Add New Asset" Functionality (AC: 2, 3)**
    - [x] Clicking the "Add New Asset" button should open a form, visually guided by `asset-management-view.tsx` (e.g., in a ShadCN `Dialog` or `Sheet` if the mockup suggests this).
    - [x] The form should contain input fields (e.g., ShadCN `Input`, `DatePicker` from `shadcn/ui`) for all `Asset` properties as per AC2.
    - [x] Implement client-side validation for required fields and correct data types.
    - [x] On form submission (Save), create a new `Asset` object, generate a unique ID, and dispatch the `addAsset` action to the store.
    - [x] If specified in `front-end-spec-v0.1.md` or mockup, implement "Save and Add Another" functionality.
    - [x] Close the form/dialog after saving.
- [x] **Task 4: Display List of Assets (AC: 5)**
    - [x] The `AssetManagementView.tsx` should subscribe to the `initialAssets` array from the Zustand store.
    - [x] Render the list/table of assets dynamically based on the store's state, matching the layout in `asset-management-view.tsx`.
    - [x] Format data appropriately for display (e.g., dates, currency).
- [x] **Task 5: Implement "Edit Asset" Functionality (AC: 6)**
    - [x] Each asset row in the list/table should have an "Edit" button, styled as per the mockup.
    - [x] Clicking "Edit" should open the asset form (similar to Add New, but pre-filled with the selected asset's data), visually guided by the mockup.
    - [x] On form submission (Save), dispatch the `updateAsset` action to the store with the asset's ID and the updated data.
    - [x] Close the form/dialog after saving.
- [x] **Task 6: Implement "Delete Asset" Functionality (AC: 7)**
    - [x] Each asset row should have a "Delete" button, styled as per the mockup.
    - [x] Clicking "Delete" should trigger a confirmation dialog (e.g., ShadCN `AlertDialog`) asking "Are you sure you want to delete [Asset Name]?".
    - [x] If confirmed, dispatch the `deleteAsset` action to the store with the asset's ID.
- [x] **Task 7: Implement "Duplicate Asset" Functionality (AC: 4)**
    - [x] Each asset row should have a "Duplicate" button/icon, styled as per the mockup.
    - [x] Clicking "Duplicate" should open the "Add New Asset" form, pre-filled with the details of the selected asset, allowing the user to make modifications before saving it as a *new* asset (which will receive a new unique ID).
- [x] **Task 8: Navigation (Contextual)**
    - [x] Ensure there's a clear way to navigate from the `AssetManagementView.tsx` back to a main dashboard or previous view (e.g., a "Back" button or breadcrumb, as suggested by overall navigation patterns in `front-end-spec-v0.1.md` and potentially visible in `asset-management-view.tsx` or `main-application-layout.tsx`). This will be fully connected via the router in a later story.

**Dev Technical Guidance**
-   **Visual Reference:** The `../../v0-mockups/components/asset-management-view.tsx` is the primary guide for the appearance, layout, and styling of this view and its forms.
-   **UI Components:** Heavily leverage ShadCN UI components (`Button`, `Table`, `Dialog`, `Input`, `DatePicker`, `AlertDialog` etc.) as potentially shown or implied by the mockup.
-   **State Management:** All asset data is global within the `ActivePlan` and managed via the `userAppStateSlice` in Zustand.
-   **Unique IDs:** Use a client-side UUID generation function for new `Asset` IDs.
-   **Forms:** Use controlled components. Consider a simple custom hook or a lightweight library if form logic (state, validation, submission) becomes complex, guided by `front-end-architecture-v0.3.md`.
-   **Data Validation:** Implement client-side validation for required fields, numeric types, and valid dates.
-   **Responsiveness:** Ensure the asset table and forms are responsive, as guided by the mockup and `front-end-architecture-v0.3.md`.
-   **Refer to Models:** `Asset` model is defined in `architecture-lean-v1.2.md`.

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Implemented Asset Management view with all core functionality
    * Added proper form validation and data handling
    * Implemented responsive design with theme colors
    * Added click-outside-to-close functionality for dialogs
    * Improved empty state with clickable "Add Asset" link
    * Added high precision decimal support for quantities and prices
    * Added duplicate asset functionality with proper UI feedback
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Updated with Visual Reference - May 31, 2025 - Sarah (PO)
    * Implementation Complete - March 19, 2024 - Claude (Dev Agent)
