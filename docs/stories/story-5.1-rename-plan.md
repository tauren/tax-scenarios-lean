## Story 5.1: Name/Rename the Active Plan

**Status:** Draft

**Story**
- As a user, I want to be able to assign or change the name of my current "Active Plan" at any time through a clear UI input, so I can identify my current work session and this name can be used when the plan is shared or auto-saved.

**Acceptance Criteria (ACs)**
1.  The UI (specifically the application Header, as per Story 1.1) displays the name of the current "Active Plan" (e.g., `activeUserAppState.activePlanInternalName`).
2.  If no name is set (e.g., on initial fresh load before any user interaction), a default name like "Untitled Plan" is displayed.
3.  The user can edit this displayed Active Plan name via a direct input mechanism (e.g., click-to-edit on the displayed name, turning it into an input field).
4.  Changes to the Active Plan name made by the user are reflected immediately in the UI where the name is displayed.
5.  The updated Active Plan name is stored in the in-memory `UserAppState` (specifically `activeUserAppState.activePlanInternalName`).
6.  This Active Plan name (`activeUserAppState.activePlanInternalName`) is part of the data that is automatically saved to `localStorage` by the persistence mechanism (implemented in Story 1.4).
7.  This Active Plan name is included as the internal `activePlanInternalName` when generating a shareable URL (as per Story 1.5 and for the user-facing feature in Story 5.2).
8.  (Note: Management of multiple named saved plan *slots* with distinct display names, locking, etc., is deferred to post-MVP. This story concerns the name of the *single active working plan*).

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The `main-application-layout.tsx` mockup, which includes the Header, should guide the appearance and placement of the Active Plan name display and its edit-in-place mechanism. The goal is a clean, unobtrusive way to view and modify this name.

**Mockup File:** `../../v0-mockups/components/main-application-layout.tsx`

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [ ] **Task 1: Verify/Refine Active Plan Name Display in Header (AC: 1, 2)**
    - [ ] Ensure `Header.tsx` (from Story 1.1) correctly subscribes to `activeUserAppState.activePlanInternalName` from the Zustand store.
    - [ ] If `activePlanInternalName` is empty or null from the store, display "Untitled Plan". Otherwise, display the stored name.
    - [ ] Style the display text as per `main-application-layout.tsx` mockup.
- [ ] **Task 2: Implement Click-to-Edit Functionality for Plan Name (AC: 3, 4)**
    - [ ] Enhance the displayed plan name in `Header.tsx` to be editable.
    - [ ] On click (or click of an associated edit icon):
        - Replace the text display with an HTML `<input type="text">` field, pre-filled with the current name.
        - The input field should be focused automatically.
    - [ ] When the input field loses focus (on blur) or the user presses 'Enter':
        - Get the new value from the input field.
        - Perform basic validation (e.g., not empty, trim whitespace).
        - If valid, dispatch an action to the Zustand store to update `activeUserAppState.activePlanInternalName`.
        - Revert the UI from input field back to text display showing the new (or original if unchanged/invalid) name.
- [ ] **Task 3: Ensure State Update and Persistence (AC: 5, 6)**
    - [ ] Confirm the Zustand store action correctly updates `activeUserAppState.activePlanInternalName`.
    - [ ] Verify that this change in the store triggers the auto-save mechanism (from Story 1.4), so the new plan name is persisted to `localStorage`.
- [ ] **Task 4: Verify Name Inclusion in URL Sharing (AC: 7 - for awareness, full feature in 5.2)**
    - [ ] Conceptually verify (or note for Story 5.2) that the `planSharingService.generateShareableString()` (from Story 1.5) correctly includes the `activePlanInternalName` as part of the `UserAppState` it serializes.
- [ ] **Task 5: Testing**
    - [ ] Test displaying the default plan name.
    - [ ] Test editing the plan name through the UI.
    - [ ] Verify the name updates in the UI and is persisted to `localStorage` (check after reload).
    - [ ] Test edge cases for input validation (e.g., empty name attempt).

**Dev Technical Guidance**
-   **Visual Reference:** `main-application-layout.tsx` for the header where this name is displayed and edited.
-   **Component:** This functionality resides primarily within `Header.tsx` (created in Story 1.1).
-   **State Management:** The `activePlanInternalName` is part of `UserAppState` in the Zustand store. A dedicated action like `updateActivePlanInternalName(newName: string)` in `userAppStateSlice.ts` should handle its update.
-   **Input Validation:** Keep it simple for MVP (e.g., prevent empty names, trim whitespace).
-   **UX of Click-to-Edit:** Ensure it's intuitive. An edit icon (e.g., from `lucide-react`) next to the name can improve discoverability. Provide clear visual distinction between display mode and edit mode.

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
