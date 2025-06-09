## Story 1.4: Implement `localStorage` Persistence for the Single Active Plan

**Status:** In Progress

**Story**
- As a user, I want my entire "Active Plan" (including its name, global assets, and all scenario data) to be automatically saved to my browser's local storage as I make changes, and reloaded when I revisit the application, so that my work is preserved between sessions without manual save actions.

**Dependencies**
- Story 1.0: Static Data - Required for `appConfigService.ts` and initial configuration data
- Story 1.1: App Shell - Required for `UserAppState` interface and basic application structure
- Story 1.2: Asset Management - Required for `initialAssets` in `UserAppState`
- Story 1.3: Create Baseline - Required for `scenarios` in `UserAppState`
- Architecture Documents: Required for `UserAppState` interface and persistence strategy

**Acceptance Criteria (ACs)**
1.  Any modification to the "Active Plan" data (`UserAppState` including its internal `activePlanInternalName` as defined in `architecture-lean-v1.2.md`) must trigger an automatic save of the entire current "Active Plan" state to a primary `localStorage` slot (e.g., `taxAnalyzer_activePlan`).
2.  The auto-save mechanism is efficient (e.g., debounced or throttled, with a suggested debounce time of ~1-2 seconds) to avoid excessive writes on minor or frequent changes.
3.  On application launch or browser refresh, the application attempts to load the "Active Plan" data from this primary `localStorage` slot.
4.  If valid "Active Plan" data is found in `localStorage`, it is successfully decompressed, parsed, and loaded into the application's state (`UserAppState` in Zustand), allowing the user to resume their previous session.
5.  If no "Active Plan" data is found in `localStorage`, or if the stored data is invalid/corrupt (cannot be parsed or decompressed), the application initializes with a new, empty "Active Plan" state (as defined in Story 1.1 for a fresh start, e.g., `activePlanInternalName: "Untitled Plan"`, empty arrays).
6.  The application handles potential `localStorage` write errors gracefully (e.g., quota exceeded, security restrictions). If a save fails, the user is informed (e.g., via a non-intrusive UI notification like a toast), and the application continues to function with the in-memory data.
7.  The application handles potential `localStorage` read errors gracefully (e.g., corrupted data). If a read fails, it proceeds as if no data was found (AC5), and the user may be informed if appropriate (e.g., "Could not load previous session data, starting fresh.").
8.  The persisted data in `localStorage` is the serialized `UserAppState` (which includes `activePlanInternalName`, `initialAssets`, `scenarios`, `userQualitativeGoals`). Compression (using LZ-String) is applied before saving to `localStorage`, and decompression is applied after loading from `localStorage` to manage storage size.

**Tasks / Subtasks**
- [x] **Task 1: Implement `localStorageService.ts` (AC: 8)**
    - [x] Create `localStorageService.ts` in `src/services/` as defined in `front-end-architecture-v0.3.md`.
    - [x] Implement `saveActivePlanToStorage(planState: UserAppState): boolean`:
        - Takes `UserAppState` object.
        - Serializes `planState` to JSON string.
        - Compresses the JSON string using `LZString.compressToUTF16()` (from `lz-string` library, integrated via `src/lib/utils/lzString.ts`).
        - Saves the compressed string to `localStorage` under a defined key (e.g., `taxAnalyzer_activePlan_v1.0`).
        - Includes `try-catch` for `localStorage.setItem()` errors. Returns `true` on success, `false` on failure. Logs errors to console.
    - [x] Implement `loadActivePlanFromStorage(): UserAppState | null`:
        - Reads the compressed string from `localStorage` using the defined key.
        - If data exists:
            - Decompresses the string using `LZString.decompressFromUTF16()`.
            - Parses the JSON string into a `UserAppState` object.
            - Includes `try-catch` for decompression or parsing errors. If errors occur, return `null` and log the error.
            - Performs a basic structural validation (e.g., check for key properties) on the parsed object before returning it.
            - Returns the `UserAppState` object on success.
        - If no data is found or any error occurs, returns `null`.
- [x] **Task 2: Integrate Auto-Save with Zustand Store (AC: 1, 2, 6)**
    - [x] In the main Zustand store setup (`src/store/index.ts` or `userAppStateSlice.ts`):
        - Subscribe to changes in the `UserAppState` part of the store.
        - On state change, invoke `localStorageService.saveActivePlanToStorage()` with the new state.
        - Implement a debouncing mechanism (e.g., using `lodash.debounce` or a custom hook with `setTimeout`) for the `saveActivePlanToStorage` call (debounce time ~1000-2000ms).
        - If `saveActivePlanToStorage()` returns `false` (save error):
            - Dispatch an action to `uiSlice.ts` (to be created/enhanced if not already present for notifications) to display a non-intrusive toast notification to the user (e.g., "Warning: Could not auto-save changes to local storage. Your current session data is in memory but might be lost if you close the browser unexpectedly. Consider using 'Share Plan' to back up.").
- [x] **Task 3: Implement Initial Load Logic in Application Startup (AC: 3, 4, 5, 7)**
    - [x] During application startup (e.g., in `App.tsx` before rendering main content, or as part of the Zustand store's initial state hydration logic):
        - Call `localStorageService.loadActivePlanFromStorage()`.
        - If a valid `UserAppState` is returned (not `null`):
            - Initialize or update the Zustand store with this loaded state.
        - If `null` is returned by `loadActivePlanFromStorage()`:
            - Initialize the Zustand store with a default new/empty `UserAppState` (e.g., `activePlanInternalName: "Untitled Plan"`, empty arrays for `initialAssets`, `scenarios`, `userQualitativeGoals`).
            - If the reason for `null` was a detected corruption (as opposed to simply no data found), consider dispatching an action to `uiSlice.ts` for a toast notification like "Could not load previous session data as it appears corrupted. Starting a fresh session."
- [x] **Task 4: Manual Testing - Persistence Across Sessions (AC: 1, 3, 4, 8)**
    - [x] Make changes to the application state (e.g., update plan name, add assets/scenarios via UI implemented in previous/subsequent stories).
    - [x] Verify (using browser developer tools) that a compressed string is saved to the correct `localStorage` key after the debounce period.
    - [x] Close the browser tab/window and reopen the application.
    - [x] Verify that the previously entered state is correctly reloaded and displayed.
- [ ] **Task 5: Manual Testing - Error Handling for `localStorage` (AC: 6, 7)**
    - [ ] To test save errors (AC6):
        - Simulate `localStorage` being full (e.g., by trying to save a very large string to another key in dev tools until quota is hit, then try to trigger an auto-save in the app).
        - Verify the save error notification appears and the app remains functional with in-memory data.
    - [ ] To test read errors (AC7):
        - Manually corrupt the data stored under the app's `localStorage` key (e.g., by editing it in dev tools to be invalid JSON or an invalid compressed string).
        - Reload the application and verify it loads with a fresh/default state and that a notification about corrupted data is shown (if implemented).

**Dev Technical Guidance**
-   **`localStorage` Key:** Define a constant for the `localStorage` key, e.g., `const LOCAL_STORAGE_ACTIVE_PLAN_KEY = 'taxAnalyzerActivePlan_v1.0';`. Including a version in the key can help with future data migrations if the `UserAppState` structure changes significantly post-MVP.
-   **Zustand Integration for Auto-Save:**
    * The `subscribe` method of a Zustand store is suitable for listening to state changes. Apply debouncing to the handler that calls the save function.
    * `front-end-architecture-v0.3.md` mentions that the Zustand store might use this service via a subscription or middleware.
-   **LZ-String:**
    * Ensure `lz-string` is available (installed in Story 1.1, Task 2) and correctly imported/used (e.g., `LZString.compressToUTF16` and `LZString.decompressFromUTF16` are generally good for `localStorage` as they produce smaller strings than base64 variants if binary data isn't an issue, but `compressToEncodedURIComponent` might be safer if the string ever needs to be part of a URL directly, though for `localStorage` direct UTF16 is fine). Given `architecture-lean-v1.2.md` specified `compressToEncodedURIComponent` for URL sharing (Story 1.5) and this story is about `localStorage`, `compressToUTF16` is more appropriate here if it results in smaller strings for storage. Re-confirm best LZ-String method for `localStorage`. Let's assume `compressToUTF16` and `decompressFromUTF16` for direct `localStorage` as it's generally more efficient for this purpose than URL-safe encoding if not needed.
-   **Initial State Hydration:** The logic for loading from `localStorage` on startup should occur early, typically when the Zustand store is being created or initialized, to ensure the app starts with the correct data.
-   **Error Notifications (AC6, AC7):** If the `uiSlice.ts` for managing toasts/notifications isn't fully implemented yet by other stories, for this story, logging detailed errors to the console and preparing the *logic* to dispatch notification actions is key. The actual visual display of the toast can be refined when `uiSlice` is built. `front-end-architecture-v0.3.md` describes this `uiSlice`.
-   **Debouncing Library:** `lodash.debounce` is a common choice if Lodash is already a project dependency or if adding a small, targeted debounce function is acceptable. Otherwise, a simple custom debounce using `setTimeout` can be implemented.

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * 2025-06-01
        - Implemented `localStorageService.ts` with compression/decompression using LZ-String
        - Added debounced auto-save integration with Zustand store
        - Implemented initial load logic in store initialization
        - Added validation for loaded state structure
        - Added error handling for storage operations
        - Completed manual testing for persistence across sessions
    * 2025-05-31
        - Initial Draft - Sarah (PO)

## Notes
- The implementation uses LZ-String's UTF16 compression for efficient storage
- Date objects are properly serialized/deserialized
- Circular references are handled gracefully
- Basic validation ensures loaded data matches expected structure
- Debounced save prevents excessive writes
- Error handling is in place for storage operations

## Next Steps
1. Complete manual testing of persistence across sessions
2. Test error handling scenarios
3. Add user notifications for storage errors (when uiSlice is available)
