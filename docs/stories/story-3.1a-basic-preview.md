## Story 3.1a: Implement Basic Gain/Loss Preview for Planned Asset Sales

**Status:** Draft

**Story**
- As a user, I want to see an immediate estimated capital gain/loss preview for each individual planned asset sale transaction as I input it, so I can understand the basic tax implications of my planned sales before finalizing them.

**Acceptance Criteria (ACs)**
1. As the user inputs or modifies the details for an individual planned asset sale (`assetId`, `quantity`, `salePricePerUnit`, `year`):
   a. The system must immediately calculate and display an *estimated* capital gain or loss preview specifically for *that single transaction*.
   b. This preview calculation must use the selected `Asset`'s `costBasisPerUnit` and `acquisitionDate`.
   c. The preview must attempt to differentiate between estimated short-term and long-term capital gains based on the holding period (calculated from `Asset.acquisitionDate` to the sale year).
   f. All previews must be explicitly labeled as "Estimated gain/loss for this transaction only" and state that it may not reflect the final overall tax liability for the scenario.

**Tasks / Subtasks**
- [ ] **Task 1: Implement Basic Gain/Loss Preview Logic**
    - [ ] Create a utility function or hook `calculateTransactionPreview(saleDetails, asset)`.
    - [ ] `saleDetails`: Contains `assetId`, `quantity`, `salePricePerUnit`, `year`.
    - [ ] `asset`: The full `Asset` object from `initialAssets`.
    - [ ] This function should calculate:
        - Total gain/loss for the transaction.
        - Differentiate ST/LT based on `Asset.acquisitionDate` and sale `year`.
    - [ ] Return an object with these preview values.
- [ ] **Task 2: Integrate Preview into UI**
    - [ ] Add preview display section to the planned asset sale form.
    - [ ] Implement real-time preview updates as user inputs data.
    - [ ] Add clear labeling and disclaimers about the preview being an estimate.
- [ ] **Task 3: Testing**
    - [ ] Test preview calculations for various inputs (ST, LT, losses).
    - [ ] Verify preview updates correctly with user input changes.
    - [ ] Test edge cases (e.g., very short holding periods, losses).

**Dev Technical Guidance**
- **Preview Calculation:** This is a key part. The logic should mirror parts of `calculateCapitalGainsForYear` (from Story 2.4) but for a single transaction and without applying tax rates (just calculating gain/loss components).
- **Holding Period for Preview (AC1c):** Use `Asset.acquisitionDate` and the sale `year`. A simple year difference can determine if holding period is <=1 year or >1 year for ST/LT distinction in the preview. More precise date math can be used if `acquisitionDate` is a full date.
- **UI Integration:** The preview should be prominently displayed in the add/edit planned sale form, with clear labeling about its estimated nature.

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO) 