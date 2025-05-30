## Story 1.5: Implement Loading & Generation of Plan Data via Shareable URL Strings (Active Plan)

**Status:** Draft

**Story**
- *(Loading)* "As a user, when I open the application with an external shared URL containing plan data, if my current Active Plan contains significant data, I want to be prompted to [Load New & Discard Current Work] or [Cancel], and then if I proceed, have the URL data loaded as my new Active Plan, so I can explore shared data."
- *(Generating - Dev/Testing)* "As a developer... I want a mechanism... to generate a compressed, URL-encoded string representing the current Active Plan..."

**Acceptance Criteria (ACs)**

* **A. Loading Plan Data from an External URL:**
    1.  On initial application load, the app checks for a specific URL query parameter (e.g., `planData`) containing the plan data string.
    2.  If the `planData` parameter is present, the system attempts to URL-decode its value, then decompress it using LZ-String, and finally deserialize the resulting JSON string into a `UserAppState` object (which includes `activePlanInternalName`).
    3.  If the URL data is successfully parsed into a valid `UserAppState` object:
        a.  The application checks if the current in-memory `ActivePlan` (which might have been loaded from `localStorage` or is a new/empty session) contains "significant user-entered data" (e.g., a runtime `isDirty` flag is true, or it's not the default empty "Untitled Plan" state). If so, the user is prompted with a clear UI message (e.g., in a modal): "You have unsaved changes in your current plan. Loading data from this link will discard your current work. Do you want to proceed? [Load from Link & Discard] [Cancel]".
        b.  If the user chooses to "Load from Link & Discard" (or if no prompt was needed because the current plan was empty/default/not dirty), the `UserAppState` data parsed from the URL becomes the new Active Plan in the Zustand store.
        c.  The `activePlanInternalName` from the loaded data is used. If not present in the loaded data, a default name like "Loaded Plan" is assigned. This newly loaded state is then subject to auto-save to `localStorage` as per Story 1.4's logic.
    4.  If the URL data is invalid at any stage (URL decoding, decompression, JSON parsing, or if the deserialized object doesn't structurally match `UserAppState`): The system logs an error to the console, displays a user-friendly error message (e.g., "Could not load plan from URL: The link appears to be invalid or corrupted."), and then proceeds to load any existing plan from `localStorage` or initializes a fresh "Untitled Plan" (as per Story 1.4 logic).
    5.  A successful load of plan data from the URL correctly updates the UI to reflect the content of this newly loaded Active Plan.
* **B. Generating a Shareable URL String (Developer-Focused Initially, User-Facing Button is Story 5.2):**
    6.  A developer-accessible mechanism (e.g., a function callable from the browser console, or a temporary UI button not part of the final user UI for *this specific story*) is implemented to trigger the generation of a shareable URL string.
    7.  When triggered, this mechanism retrieves the current `UserAppState` from the Zustand store. It then serializes this `UserAppState` object to a JSON string, compresses the JSON string using LZ-String, and finally URL-encodes the compressed string.
    8.  The resulting URL-encoded string is made available to the developer (e.g., logged to the console or displayed in a temporary UI element). The format should be suitable for appending as a query parameter like `?planData=[encodedString]`.
    9.  The LZ-String compression library is correctly integrated (as per `front-end-architecture-v0.3.md` and `architecture-lean-v1.2.md`) and functions as expected for both compression and decompression.

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** This story involves a UI prompt (e.g., an alert dialog for confirming overwrite when loading a plan from a URL with existing dirty data - AC A3a). While there isn't a dedicated v0 mockup for this specific prompt, its styling should be consistent with the overall application theme and utilize standard modal/dialog components (e.g., ShadCN UI `AlertDialog`). Visual cues for general modal/dialog styling can be taken from `../../v0-mockups/components/main-application-layout.tsx` if it defines or implies such styles, or from default ShadCN UI component styling.

**Mockup File:** N/A (Refer to general modal/dialog styling principles from the project's UI library and `main-application-layout.tsx` context if applicable).

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [ ] **Task 1: Implement `planSharingService.ts` (AC: A2, B7, B9)**
    - [ ] Create/update `planSharingService.ts` in `src/services/` as per `front-end-architecture-v0.3.md`.
    - [ ] Implement `generateShareableString(planState: UserAppState): string | null`:
        - Takes `UserAppState`. Serializes to JSON. Compresses with `LZString.compressToEncodedURIComponent()`. Returns URL-safe string or `null` on error (log error).
    - [ ] Implement `parseShareableString(encodedString: string): UserAppState | null`:
        - Takes URL-safe compressed string. Decompresses with `LZString.decompressFromEncodedURIComponent()`. Parses JSON to `UserAppState`. Includes robust `try-catch`; returns `null` on any error (log error). Performs basic structural validation.
- [ ] **Task 2: Implement URL Parsing Logic on App Load (AC: A1, A2, A4)**
    - [ ] In app startup sequence (e.g., `App.tsx` or initialization hook): Check `window.location.search` for `planData`. If found, parse using `planSharingService.parseShareableString()`. Store result temporarily.
- [ ] **Task 3: Implement "Dirty Check" and Overwrite Prompt Logic (AC: A3a)**
    - [ ] Introduce/use an `isDirty` flag in the Zustand store (set to `true` on state modifications, `false` after explicit load/new).
    - [ ] If URL parsing (Task 2) yields valid `UserAppState` AND current session state `isDirty` (or not default empty): Trigger UI confirmation prompt (e.g., ShadCN `AlertDialog` via `uiSlice`) as per AC A3a, styled consistently.
- [ ] **Task 4: Update Zustand Store with Loaded URL Data (AC: A3b, A3c, A5)**
    - [ ] If user confirms "Load from Link & Discard" (or no prompt needed): Use Zustand store action (e.g., `setActivePlanFromLoadedData(loadedState: UserAppState)`) to update `UserAppState`, set `isDirty` to `false`, handle `activePlanInternalName`. Trigger auto-save (Story 1.4).
    - [ ] Ensure UI re-renders to reflect new plan data.
- [ ] **Task 5: Fallback Loading and Error Reporting for URL Load (AC: A4)**
    - [ ] If URL parsing fails or user cancels overwrite: Proceed with normal load (Story 1.4: `localStorage` or fresh plan).
    - [ ] If URL parsing/decompression/deserialization fails: Display user-friendly error message (e.g., via `uiSlice` toast) as per AC A4.
- [ ] **Task 6: Implement Developer Mechanism for Generating Shareable String (AC: B6, B7, B8)**
    - [ ] In `planSharingService.ts`, ensure `generateShareableString` is robust.
    - [ ] Expose `planSharingService.generateShareableString(useAppStore.getState().userAppState)` to browser console (e.g., via `window.generateShareUrl = ...`) or a temporary dev UI button.
    - [ ] Verify output string format.
- [ ] **Task 7: Testing (AC: A, B)**
    - [ ] Manually test loading valid and corrupted/invalid URL strings.
    - [ ] Test overwrite prompt logic with "dirty" data.
    - [ ] Test generating a string and loading it in a new session. Verify data integrity.

**Dev Technical Guidance**
-   **URL Parsing:** Use `URLSearchParams(window.location.search).get('planData')`.
-   **LZ-String:** Use `LZString.compressToEncodedURIComponent()` and `LZString.decompressFromEncodedURIComponent()` for URL safety. Refer to `lzString.ts` location in `front-end-architecture-v0.3.md`.
-   **`isDirty` Flag:** Manage this flag carefully in the Zustand store. It's key for the overwrite prompt logic.
-   **Zustand Store Actions:** The `setActivePlanFromLoadedData` action should fully replace the relevant state and trigger `localStorage` persistence.
-   **UI for Prompt (AC A3a):** Use ShadCN `AlertDialog`. Manage its state (visibility, callbacks) via `uiSlice.ts` (as described in `front-end-architecture-v0.3.md`). Style should be consistent with the application's theme (possibly guided by `main-application-layout.tsx` for general modal appearances).
-   **Error Handling:** Robust `try-catch` in service functions. User-facing errors for failed URL loads should be clear.
-   **Developer Mechanism for Generation (AC B6):** A console function is sufficient for this story's scope.

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Added Visual Reference Guidance - May 31, 2025 - Sarah (PO)
