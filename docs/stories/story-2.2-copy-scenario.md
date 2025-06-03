## Story 2.2: Add Scenario Duplication to New Scenario Dialog

**Status:** Complete

**Story**
- As a user, I want to be able to create a new scenario by duplicating an existing scenario from my plan, so I can quickly create variations with minimal re-entry of common data.

**Acceptance Criteria (ACs)**
1. The "Add New Scenario" dialog (currently showing template scenarios) should be enhanced to include two sections:
   a. "Template Scenarios" - existing template scenarios from `AppConfig.templateScenarios`
   b. "My Scenarios" - scenarios from the current plan that can be used as templates
2. Each scenario card in the Scenario Hub should have a duplicate action, either:
   a. As a visible button on the card, or
   b. Within a three-dot options menu on the card
3. When a user selects an existing scenario (either from the "Add New Scenario" dialog or via the duplicate button), the behavior should be identical to selecting a template scenario:
   a. A deep copy of the selected scenario is created
   b. The user is taken to the scenario editor screen
   c. The new scenario is saved when the user completes the edit
4. The UI for both the "Add New Scenario" dialog sections and the duplicate action should be consistent with the existing design patterns.

**Tasks / Subtasks**
- [x] **Task 1: Enhance Add New Scenario Dialog (AC: 1)**
    - [x] Modify the "Add New Scenario" dialog to include two sections:
        - [x] "Template Scenarios" section showing existing template scenarios
        - [x] "My Scenarios" section showing scenarios from the current plan
    - [x] Style the sections consistently with the existing dialog design
    - [x] Ensure proper spacing and visual separation between sections
- [x] **Task 2: Add Duplicate Action to Scenario Cards (AC: 2)**
    - [x] Design and implement the duplicate action UI:
        - [x] Option A: Add a visible duplicate button to scenario cards
        - [x] Option B: Add a three-dot menu with duplicate option
    - [x] Style the duplicate action consistently with other card actions
- [x] **Task 3: Implement Scenario Duplication Logic (AC: 3)**
    - [x] Create a function to handle scenario duplication that:
        - [x] Creates a deep copy of the selected scenario
        - [x] Generates a new unique ID
        - [x] Sets a default name (e.g., "Copy of [Original Name]")
    - [x] Integrate this function with both:
        - [x] The "Add New Scenario" dialog selection
        - [x] The duplicate action from scenario cards
- [x] **Task 4: Navigation and Save Flow (AC: 3)**
    - [x] Ensure the flow after duplication matches the template scenario flow:
        - [x] Navigate to scenario editor
        - [x] Allow user to modify the copied scenario
        - [x] Save the new scenario when editing is complete
- [x] **Task 5: Testing**
    - [x] Test duplication from both the dialog and card action
    - [x] Verify deep copy creates independent scenario
    - [x] Verify navigation and save flow works correctly
    - [x] Test UI responsiveness and consistency

**Dev Technical Guidance**
- **Dialog Enhancement:** The existing "Add New Scenario" dialog should be modified to include the new sections while maintaining its current look and feel.
- **Deep Copy:** Use `JSON.parse(JSON.stringify(sourceScenario))` for creating the scenario copy, as all scenario data is JSON-serializable.
- **State Management:** Use the existing scenario creation and navigation patterns.
- **UI Components:** Follow existing ShadCN patterns for dialogs, cards, and menus.

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Story prepared for development
    * Note: The distinction between baseline and comparison scenarios has been removed
    * Note: Some properties mentioned in the story are computed properties and not part of the model
    * Implementation complete - all ACs met
    * Added duplicate action to three-dot menu in scenario cards
    * Enhanced dialog with tabs for template and user scenarios
    * Verified deep copy and navigation flow
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Updated Status - June 2, 2025 - Claude (Dev Agent)
        - Updated story to reflect actual requirements
        - Removed outdated baseline/comparison terminology
        - Added specific tasks for dialog enhancement and duplicate action
        - Added notes about computed properties
    * Completed - June 3, 2025 - Claude (Dev Agent)
        - Marked all tasks as complete
        - Updated status to Complete
        - Added implementation details to completion notes
