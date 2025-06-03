## Story 5.1: Plan Overview and Management Screen

**Status:** Draft

**Story**
- As a user, I want to have a central plan overview screen that displays and allows me to manage all aspects of my current plan, including its name, scenarios, assets, and other properties, so I can easily navigate and manage all components of my plan.

**Acceptance Criteria (ACs)**
1. When a new plan is created (either blank or from a template), the user is automatically navigated to the plan overview screen.
2. The plan overview screen displays:
   - The current plan name in an editable field at the top
   - A clear visual hierarchy showing the plan's main components:
     - Scenarios section with a count and link to ScenarioHub
     - Assets section with a count and link to asset management
     - (Future) Other plan properties as they are added
3. The plan name can be edited directly on this screen:
   - If no name is set, a default name like "Untitled Plan" is displayed
   - The name is editable via a direct input mechanism
   - Changes are reflected immediately in the UI
   - The updated name is stored in `activeUserAppState.activePlanInternalName`
4. The plan overview screen provides clear navigation to:
   - ScenarioHub (for managing scenarios)
   - Asset management interface
   - (Future) Other plan components as they are added
5. The plan overview screen maintains a consistent layout with the application header (from Story 1.1)
6. All plan data (name, scenarios, assets, etc.) is automatically saved to `localStorage` by the persistence mechanism (implemented in Story 1.4)
7. The plan name is included as the internal `activePlanInternalName` when generating a shareable URL (as per Story 1.5 and for the user-facing feature in Story 5.2)



**Tasks / Subtasks**
- [ ] **Task 1: Create Plan Overview Screen Component**
    - [ ] Create new `PlanOverview.tsx` component
    - [ ] Implement basic layout structure with sections for plan name, scenarios, and assets
    - [ ] Add navigation links to ScenarioHub and asset management
    - [ ] Style according to application design system
- [ ] **Task 2: Implement Plan Name Management (AC: 3)**
    - [ ] Create editable plan name field at the top of the overview screen
    - [ ] Implement click-to-edit functionality
    - [ ] Add validation for plan name input
    - [ ] Connect to Zustand store for state management
- [ ] **Task 3: Add Navigation and Component Integration**
    - [ ] Implement navigation links to ScenarioHub and asset management
    - [ ] Add component counts for scenarios and assets
    - [ ] Ensure proper routing setup for navigation
- [ ] **Task 4: State Management and Persistence**
    - [ ] Connect to Zustand store for plan data
    - [ ] Implement auto-save functionality
    - [ ] Ensure proper state updates trigger UI refreshes
- [ ] **Task 5: Testing**
    - [ ] Test plan name editing functionality
    - [ ] Verify navigation to different plan components
    - [ ] Test state persistence and loading
    - [ ] Verify component counts update correctly
    - [ ] Test edge cases for input validation

**Dev Technical Guidance**
- **New Component:** Create `PlanOverview.tsx` as the main container for plan management
- **State Management:** 
  - Use existing `UserAppState` in Zustand store
  - Add any necessary new state properties for plan management
- **Routing:** 
  - Set up as the default view after plan creation
  - Implement proper navigation to/from other plan components
- **Styling:**
  - Follow application design system
  - Ensure responsive layout
  - Use consistent spacing and typography
- **Component Structure:**
  - Plan name section at top
  - Grid or card-based layout for plan components
  - Clear visual hierarchy
  - Consistent navigation patterns

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Updated - June 1, 2025 - Added plan overview screen functionality
