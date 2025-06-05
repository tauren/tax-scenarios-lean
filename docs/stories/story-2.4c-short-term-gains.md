## Story 2.4b: Implement Short-Term Capital Gains Tax Support

**Status:** Ready for Development

**Story**
- As a user, I want the system to properly calculate and apply different tax rates for short-term capital gains (assets held for one year or less), so that my tax projections accurately reflect the higher tax rates typically applied to short-term gains.

**Acceptance Criteria (ACs)**
1. The calculation engine is enhanced to accurately determine if an asset sale qualifies as short-term (held for one year or less) by comparing the asset's acquisition date with the sale year.
2. For each sale, the engine correctly categorizes the gain/loss as either Short-Term or Long-Term based on the holding period.
3. The engine applies the scenario-specific effective Short-Term Capital Gains Tax rate (from scenario.tax.capitalGains.shortTermRate) to the aggregated Short-Term gains for that year.
4. The calculated Short-Term Capital Gains Tax is properly reflected in the `ScenarioYearlyProjection.taxBreakdown.capitalGainsTax` field, with clear separation between short-term and long-term components.
5. The UI is updated to display the breakdown between short-term and long-term capital gains tax amounts in the tax breakdown section.

**Tasks / Subtasks**
- [ ] **Task 1: Enhance Holding Period Calculation**
    - [ ] Implement precise holding period calculation using acquisition date
    - [ ] Add logic to determine short-term vs long-term classification
    - [ ] Update calculation service to handle both types
- [ ] **Task 2: Implement Short-Term Tax Rate Application**
    - [ ] Add short-term tax rate application logic
    - [ ] Update yearly tax breakdown calculations
    - [ ] Modify results aggregation to separate short-term and long-term components
- [ ] **Task 3: Update UI Components**
    - [ ] Enhance tax breakdown display to show short-term vs long-term amounts
    - [ ] Add explanatory tooltips for short-term vs long-term classification
    - [ ] Update any relevant charts or visualizations

**Dev Technical Guidance**
- **Primary Logic Location:** `src/services/calculationService.ts`
- **Data Models:** Use existing `Scenario`, `Asset`, `PlannedAssetSale` types
- **Date Handling:** Implement precise date-based holding period calculation
- **Testing:** Focus on accurate short-term vs long-term classification and tax calculations

**Dependencies**
- Story 2.4 (Calculation Service Foundation)
- Story 2.4a (Core Capital Gains Tax Calculation)

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Claude (Story Validator)
    * Extracted from Story 2.4a - May 31, 2025 - Claude (Story Validator) 