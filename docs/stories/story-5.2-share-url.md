## Story 5.2: Implement User-Facing "Generate Shareable URL" Feature for Active Plan

**Status:** Complete

**Story**
- As a user, I want a clear "Share Plan" button or option in the UI that, when clicked, generates a compressed, URL-encoded string representing my current "Active Plan," which I can then copy to my clipboard to share with others or for my own backup/transfer purposes.

**Acceptance Criteria (ACs)**
1.  A clearly identifiable "Share Plan" UI action (e.g., a button with text/icon) is available in a persistent location, such as the main application header.
2.  When the user clicks the "Share Plan" action:
    a.  The system retrieves the current `UserAppState` (including the `activePlanInternalName`) from the Zustand store.
    b.  It uses the `planSharingService.generateShareableString()` function (implemented in Story 1.5) to serialize, compress (LZ-String), and URL-encode this `UserAppState`.
3.  The resulting shareable URL string (e.g., `https://[app-domain]/?planData=[encodedString]`) is presented to the user in a way that is easy to copy to their clipboard (e.g., displayed in a read-only text field within a modal, with a "Copy to Clipboard" button).
4.  The user receives clear feedback that the shareable link has been generated and/or copied successfully (e.g., a toast notification or a message within the share modal).
5.  The UI for initiating sharing and displaying the shareable link is responsive and user-friendly.

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The `main-application-layout.tsx` mockup should guide the placement and styling of the "Share Plan" button/icon within the application header. The modal/dialog used to display the generated URL and "Copy" button should adhere to the general modal styling of the application (e.g., using ShadCN UI `Dialog` and `Input`/`Button`).

**Mockup File:** `../../v0-mockups/components/main-application-layout.tsx` (for button placement in header); general modal/dialog styling principles from ShadCN UI.

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [x] **Task 1: Implement "Share Plan" Button in UI (AC: 1, 5)**
    - [x] In `Header.tsx` (from Story 1.1, visually guided by `main-application-layout.tsx`), add a "Share Plan" button or icon button (e.g., using ShadCN `Button` and a `Share` icon from `lucide-react`).
    - [x] Ensure it's styled consistently and is clearly identifiable.
- [x] **Task 2: Implement Share URL Generation Logic on Click (AC: 2)**
    - [x] When the "Share Plan" button is clicked:
        - [x] Retrieve the current `UserAppState` from the Zustand store.
        - [x] Call `planSharingService.generateShareableString(currentUserAppState)`.
        - [x] Handle potential errors if the service returns `null` (e.g., display an error toast "Could not generate share link").
- [x] **Task 3: Implement UI for Displaying and Copying Shareable URL (AC: 3, 5)**
    - [x] On successful generation of the shareable string (from Task 2):
        - [x] Display a modal (e.g., ShadCN `Dialog`).
        - [x] Inside the modal:
            - Show a descriptive title (e.g., "Share Your Plan").
            - Display the full shareable URL (e.g., `window.location.origin + '/?planData=' + encodedString`) in a read-only text input field (ShadCN `Input` with `readOnly` prop).
            - Add a "Copy to Clipboard" button (ShadCN `Button`).
                - Implement clipboard copy functionality (e.g., using `navigator.clipboard.writeText()`).
- [x] **Task 4: Implement User Feedback for Share Action (AC: 4)**
    - [x] On successful copy to clipboard (from Task 3), provide feedback (e.g., change button text to "Copied!", show a small success message in the modal, or a toast notification like "Link copied to clipboard!").
    - [x] Ensure the share modal can be closed by the user.
- [x] **Task 5: Testing**
    - [x] Test clicking the "Share Plan" button.
    - [x] Verify the modal appears with a correctly formatted URL.
    - [x] Test the "Copy to Clipboard" functionality.
    - [x] Paste the copied URL into a new browser tab/incognito window and verify the plan loads correctly (leveraging Story 1.5 load logic).
    - [x] Test responsiveness of the share modal.

**Dev Technical Guidance**
-   **Visual Reference:** `main-application-layout.tsx` for the "Share Plan" button in the header. Standard ShadCN UI `Dialog`, `Input`, and `Button` components for the modal, styled consistently with the application theme.
-   **Service Usage:** This story directly uses `planSharingService.generateShareableString()` implemented in Story 1.5.
-   **Clipboard API:** Use `navigator.clipboard.writeText()` for the "Copy to Clipboard" feature. Ensure to handle potential errors or browser compatibility if targeting older browsers (though MVP targets modern ones).
-   **URL Construction:** The shareable URL should be the application's base URL (e.g., `window.location.origin`) followed by the query parameter (e.g., `/?planData=[encodedString]`).
-   **Modal State:** The visibility of the share modal can be managed using local component state within `Header.tsx` or via the `uiSlice.ts` if a more global modal management system is preferred.

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Implemented SharePlanDialog component with auto-copy on open
    * Added Sonner toast notifications for copy success/failure
    * Manual copy button available as backup
    * Follows existing UI patterns and component structure
    * Tested and verified all functionality including URL generation and loading
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Completed - March 19, 2024 - Claude (Dev Agent)
