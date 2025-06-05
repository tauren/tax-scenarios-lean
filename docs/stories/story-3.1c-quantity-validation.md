## Story 3.1c: Enhance Quantity Validation for Planned Asset Sales

**Status:** Draft

**Story**
- As a user, I want the system to validate that I cannot plan to sell more of an asset than I actually own, even when planning sales across multiple years, so I can avoid creating invalid scenarios.

**Acceptance Criteria (ACs)**
1. When adding or updating a `PlannedAssetSale`, the system must validate that the total quantity planned to be sold for a specific asset (sum across all years for that asset in the current scenario) does not exceed `Asset.quantity` from `initialAssets`.
2. If a user attempts to add or update a planned sale that would exceed the total available quantity, the system must:
   - Prevent the invalid sale from being saved
   - Display a clear error message explaining why the sale cannot be saved
   - Show the current total planned quantity and the maximum available quantity
3. The validation must consider:
   - All existing planned sales for the asset in the current scenario
   - The quantity being added or updated
   - The total available quantity from the global asset definition

**Tasks / Subtasks**
- [ ] **Task 1: Implement Quantity Sum Calculation**
    - [ ] Create a utility function to calculate total planned quantity for an asset
    - [ ] Function should sum quantities across all years in the current scenario
    - [ ] Exclude the current sale being edited from the sum when updating
- [ ] **Task 2: Enhance Form Validation**
    - [ ] Add quantity validation to `PlannedAssetSaleDialog`
    - [ ] Implement real-time validation as user inputs quantity
    - [ ] Add clear error messaging for validation failures
- [ ] **Task 3: Update UI for Validation Feedback**
    - [ ] Add visual indicators for available quantity
    - [ ] Implement tooltips or help text explaining quantity limits
    - [ ] Show running total of planned quantities

**Dev Technical Guidance**
- **Validation Logic:** Should be implemented in the `PlannedAssetSaleDialog` component
- **State Management:** May need to access scenario state to calculate totals
- **UI Considerations:** Clear feedback is crucial for user understanding
- **Performance:** Consider caching total calculations for frequently edited scenarios

**Dependencies**
- Story 3.1 (Core Planned Asset Sales Management)
- Story 1.2 (Asset Management) - for access to `Asset.quantity`

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO) 