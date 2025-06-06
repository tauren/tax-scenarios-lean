## Story 4.1: Define and Weight Personal Qualitative Goals

**Status:** Ready for Development

**Story**
- As a user, I want to define a list of my personal qualitative goals by selecting from a master list of qualitative concepts (e.g., "Good Weather," "Low Crime Rate," "Access to Healthcare"), give them my own descriptive names if desired, and assign a weight (e.g., Low, Medium, High, Critical) to each goal, so the system understands what lifestyle factors are most important to me overall.

**Acceptance Criteria (ACs)**
1.  A dedicated User Interface (UI) section or view (e.g., `PersonalGoalsManagementView.tsx`) must be available where users can manage their "Personal Qualitative Goals" for the Active Plan.
2.  Users must be able to add a new Personal Qualitative Goal to their list.
3.  When adding a new goal, the system must present the user with a way to select a base qualitative concept from the `appConfig.globalQualitativeConcepts` list (e.g., via a searchable or categorized dropdown menu showing `GlobalQualitativeConcept.name`).
4.  Upon selection of a `GlobalQualitativeConcept`: A new `UserQualitativeGoal` object is created and associated with the user's `UserAppState`; The `UserQualitativeGoal.conceptId` is set to the `id` of the selected `GlobalQualitativeConcept`; The `UserQualitativeGoal.name`, `UserQualitativeGoal.category`, and `UserQualitativeGoal.description` are initially populated (copied) from the corresponding fields of the selected `GlobalQualitativeConcept`.
5.  After a `UserQualitativeGoal` is created, the user must be able to edit its `name` and `description` fields to personalize them. The `category` should ideally remain linked to the original concept for consistency.
6.  For each `UserQualitativeGoal` in their list, the user must be able to select and assign a `weight` from a predefined set of options (e.g., "Low," "Medium," "High," "Critical").
7.  The UI must display the user's list of Personal Qualitative Goals, showing for each goal: its (potentially personalized) `name`, its `category`, its (potentially personalized) `description`, and its assigned `weight`.
8.  Users must be able to edit an existing `UserQualitativeGoal` in their list, specifically to change its personalized `name`, `description`, and its assigned `weight`. (The underlying `conceptId` should remain unchanged after initial selection).
9.  Users must be able to delete a `UserQualitativeGoal` from their list, with a confirmation prompt to prevent accidental deletion.
10. All defined `UserQualitativeGoal` objects are stored within the `UserAppState.userQualitativeGoals` array and are persisted as part of the Active Plan's auto-save mechanism (Story 1.4).
11. The UI for managing Personal Qualitative Goals must be responsive and user-friendly.

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The `personal-goals-management-view.tsx` mockup is the primary guide for the UI where users will define, view, edit, and weight their personal qualitative goals. This includes the list of goals and the form/modal for adding or editing a goal. Adhere to its layout, component styling, and overall appearance.

**Mockup File:** `../../v0-mockups/components/personal-goals-management-view.tsx`

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [x] **Task 1: Create `PersonalGoalsManagementView.tsx` Component (AC: 1, 7, 11)**
    - [x] Create `PersonalGoalsManagementView.tsx` in `src/views/` (or `src/pages/`).
    - [x] Implement the basic layout for this view referencing `../../v0-mockups/components/personal-goals-management-view.tsx`. Include a clear title (e.g., "My Personal Goals").
    - [x] Add a prominent "Add New Goal" button.
    - [x] Design a list/table (e.g., ShadCN `Table` or `Card` list) to display goals, showing name, category, description (perhaps truncated with full view on hover/click), and weight. Include Edit/Delete actions per goal.
- [x] **Task 2: Implement State Management for User Qualitative Goals (AC: 10)**
    - [x] Define `UserQualitativeGoal` interface in `src/types/index.ts` as per `architecture-lean-v1.2.md`.
    - [x] Ensure `UserAppState` in `userAppStateSlice.ts` includes `userQualitativeGoals: UserQualitativeGoal[]`.
    - [x] Implement Zustand store actions: `addQualitativeGoal(goal: UserQualitativeGoal)`, `updateQualitativeGoal(goalId: string, updatedGoal: Partial<UserQualitativeGoal>)`, `deleteQualitativeGoal(goalId: string)`. Ensure unique IDs for new goals.
- [ ] **Task 3: Implement "Add New Goal" Functionality (AC: 2, 3, 4, 5, 6)**
    - [x] Clicking "Add New Goal" opens a form (e.g., ShadCN `Dialog`).
    - [x] Form fields:
        - Select Base Concept: Dropdown/Combobox (ShadCN `Select`/`Combobox`) populated from `appConfigService.getGlobalQualitativeConcepts()`.
        - Personalized Name: Text input, pre-fills from selected concept, editable.
        - Personalized Description: Text area, pre-fills, editable.
        - Assign Weight: Dropdown/RadioGroup (ShadCN `Select`/`RadioGroup`) for "Low", "Medium", "High", "Critical".
    - [ ] On save, create `UserQualitativeGoal` object (copying category from concept, generating ID), dispatch `addQualitativeGoal`.
- [x] **Task 4: Display List of Personal Goals (AC: 7)**
    - [x] `PersonalGoalsManagementView.tsx` subscribes to `userQualitativeGoals` from the store.
    - [x] Render the list/table dynamically.
- [ ] **Task 5: Implement "Edit Goal" Functionality (AC: 5, 6, 8)**
    - [x] "Edit" button on each goal opens the form (Task 3), pre-filled with existing goal data.
    - [x] User can edit personalized name, description, and weight. `conceptId` and `category` remain linked to original concept.
    - [ ] On save, dispatch `updateQualitativeGoal`.
- [ ] **Task 6: Implement "Delete Goal" Functionality (AC: 9)**
    - [x] "Delete" button on each goal triggers confirmation (ShadCN `AlertDialog`).
    - [ ] If confirmed, dispatch `deleteQualitativeGoal`.
- [ ] **Task 7: Navigation & Responsiveness (AC: 1, 11)**
    - [ ] Ensure clear navigation from this view back to a main dashboard (e.g., "Active Plan Dashboard" - to be built).
    - [ ] Verify responsiveness of the view and forms.

**Dev Technical Guidance**
-   **Visual Reference:** `personal-goals-management-view.tsx` for overall look and feel.
-   **Data Source for Concepts:** `appConfigService.getGlobalQualitativeConcepts()` (from Story 1.0).
-   **Data Model:** The following interfaces need to be added to `src/types/index.ts`:
    ```typescript
    export interface UserQualitativeGoal {
      id: string;
      conceptId: string;
      name: string;
      category: string;
      description: string;
      weight: "Low" | "Medium" | "High" | "Critical";
    }
    ```
    And update `UserAppState` to include:
    ```typescript
    userQualitativeGoals: UserQualitativeGoal[];
    ```
-   **State Management:** All `userQualitativeGoals` are part of `UserAppState` in Zustand.
-   **Forms:** Use ShadCN UI components. Client-side validation for required fields.
-   **Unique IDs:** Client-generate UUIDs for each `UserQualitativeGoal` instance.

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Created basic component structure and UI
    * Implemented state management for qualitative goals
    * Added required UI components
    * TODO: Need to integrate with appConfigService for global concepts
    * TODO: Need to implement proper navigation
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Updated to Ready for Development - Added required type definitions
    * Implemented basic component structure and state management
