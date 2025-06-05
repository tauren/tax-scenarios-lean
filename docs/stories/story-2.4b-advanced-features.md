## Story 2.4b: Implement Advanced Capital Gains Features

**Status:** Draft

**Story**
- As a user, I want the system to handle advanced capital gains tax scenarios, including gain bifurcation and special tax features, so I can accurately model complex tax situations.

**Acceptance Criteria (ACs)**
1. Gain Bifurcation:
   - The system correctly identifies and splits gains into:
     - Short-term gains (held ≤ 12 months)
     - Long-term gains (held > 12 months)
   - Different tax rates are applied to each category
   - The UI displays bifurcated gains separately
   - The calculation service handles partial year holdings

2. Special Tax Features:
   - The system supports:
     - Capital loss carryover between years
     - Netting of gains and losses within the same year
     - Special tax rates for specific asset types
     - Tax-free thresholds and exemptions
   - All special features are configurable per scenario
   - The UI clearly indicates when special features are applied

3. Enhanced Reporting:
   - Yearly projections include:
     - Breakdown of short-term vs long-term gains
     - Special tax feature impacts
     - Carryover amounts
   - Summary views show:
     - Total tax savings from special features
     - Impact of gain bifurcation on overall tax liability

**Tasks / Subtasks**
- [ ] **Task 1: Implement Gain Bifurcation**
    - [ ] Add holding period calculation logic
    - [ ] Implement gain splitting algorithm
    - [ ] Add tax rate differentiation
    - [ ] Update UI to show bifurcated gains
- [ ] **Task 2: Add Special Tax Features**
    - [ ] Implement loss carryover logic
    - [ ] Add gain/loss netting functionality
    - [ ] Create special tax rate system
    - [ ] Add tax-free threshold handling
- [ ] **Task 3: Enhance Reporting**
    - [ ] Update projection data structure
    - [ ] Add special feature impact tracking
    - [ ] Create enhanced summary views
    - [ ] Implement detailed breakdown displays
- [ ] **Task 4: Testing**
    - [ ] Test bifurcation logic
    - [ ] Test special features
    - [ ] Test reporting accuracy
    - [ ] Test edge cases

**Dev Technical Guidance**
- **Bifurcation Logic:** Consider partial year holdings carefully
- **Special Features:** Make features configurable and extensible
- **Reporting:** Ensure clear separation of concerns
- **Performance:** Optimize for large datasets

**Dependencies**
- Story 2.4 (Core Capital Gains Calculation)
- Story 2.4a (Calculation Service Types)

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO) 