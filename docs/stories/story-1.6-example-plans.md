Okay, here is the draft for Story 1.6, which will reference your `get-started-view.tsx` mockup.

---

## Story 1.6: Display Example Scenario Links (CGT Focused)

**Status:** Ready for Development

**Story**
- As a user, I want to see a list of links to pre-configured example plans (focused on CGT planning), which I can click to easily load and explore them, so I can quickly understand the tool's capabilities or start from a meaningful example.

**Dependencies**
- Story 1.0: Static Data - Required for `appConfigService.ts` and `templateScenarios` data
- Story 1.1: App Shell - Required for `UserAppState` interface and basic application structure
- Story 1.2: Asset Management - Required for `initialAssets` in `UserAppState`
- Story 1.3: Create Baseline - Required for `scenarios` in `UserAppState`
- Story 1.4: LocalStorage - Required for persistence strategy
- Story 1.5: Load from URL - Required for URL loading mechanism
- Architecture Documents: Required for `UserAppState` interface and example plan structure

**Acceptance Criteria (ACs)**
1.  A dedicated UI section or component (e.g., on the "Get Started" screen - `GetStartedView.tsx` as per `front-end-spec-v0.1.md`, or a similar entry point if no active plan exists) displays a list of available example plans.
2.  The list includes at least one (>=1) example plan, each presented with a descriptive title/name (e.g., "Example: CGT in Portugal," "Sample: Low Tax Jurisdiction Plan") clearly indicating its focus on CGT planning for the MVP.
3.  Each example scenario in the list is presented as a clickable element (e.g., a link, button, or card).
4.  The clickable elements are associated with pre-generated shareable URL strings. These URL strings represent complete `UserAppState` objects containing one or more scenarios, possibly from the CGT-focused `templateScenarios` defined in `AppConfig` (Story 1.0).
5.  Clicking an example plan link/button triggers the application's URL loading mechanism (as implemented in Story 1.5). This includes prompting the user to discard current work if the active session is "dirty" or has significant data, before loading the example plan data.
6.  The list of example plans (their display names and corresponding shareable URL strings) is sourced from static data within `AppConfig` or which comes from `AppConfig.examplePlans`.
7.  The UI displaying the example plan links is responsive and user-friendly.

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The following TSX mockup file (`get-started-view.tsx`) provides a conceptual visual layout, component positioning, sizing, and styling guide for the UI elements relevant to this story (specifically the "Get Started" screen/view, which displays example plan links/cards). You should use this as a strong reference for the UI's appearance. However, implement the actual functionality, component structure, state management, and data flow strictly according to the detailed tasks in this story, the `front-end-architecture-v0.3.md`, `front-end-spec-v0.1.md`, and `architecture-lean-v1.2.md`.

**Mockup File:** `../../v0-mockups/components/get-started-view.tsx`

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [ ] **Task 1: Prepare Example Plan URL Strings (AC: 4, 6)**
    - [ ] For each `examplePlan` in `AppConfig.examplePlans`:
        - [ ] Create a complete `UserAppState` object (including a suitable `activePlanInternalName` like "Example: [Template Scenario Name]").
        - [ ] Use example data `examplePlans.data.ts` to get the plan object including the compressed, URL-encoded string.
    - [ ] Store these pre-generated URL strings with display names/descriptions in a new structure within `AppConfig` (e.g., `appConfig.examplePlans: { name: string, description: string, planDataParam: string }[]`).
- [ ] **Task 2: Implement `GetStartedView.tsx` Component (AC: 1, 2, 3, 7)**
    - [ ] Create/update `GetStartedView.tsx` in `src/views/` (or `src/pages/`), referencing `../../v0-mockups/components/get-started-view.tsx` for visual layout, styling, and component structure (e.g., cards for examples).
    - [ ] This view should be conditionally rendered when no active plan is loaded from `localStorage` or URL (logic in `App.tsx` or router).
    - [ ] Fetch the list of example scenarios (name, description, planDataParam string) from `appConfigService`.
    - [ ] Dynamically render clickable elements (e.g., ShadCN `Card` components) for each example, displaying its name and description, based on the mockup.
    - [ ] The first example plan should be for a plan plan, "Start with a Blank Plan". No special handling is required as the URL embedded in this object will initialize a default empty `UserAppState`.
    - [ ] Ensure the view is responsive.
- [ ] **Task 3: Implement Click Handling for Example Plans (AC: 5)**
    - [ ] When a user clicks an example plan card/button in `GetStartedView.tsx`:
        - Retrieve the associated `planDataParam` string for that example.
        - Trigger the application's URL loading mechanism. The preferred method is to construct the application's root URL with `?planData=[planDataParam]` and navigate to it (e.g., using `router.push('/?planData=' + planDataParam)` if using `react-router-dom` and the app is set up to parse this on any route, or `window.location.href = '/?planData=' + planDataParam` if a full reload is acceptable for simplicity).
        - This will invoke the URL loading logic from Story 1.5, including any "dirty check" prompts.
- [ ] **Task 4: Conditional Rendering of `GetStartedView` (AC: 1)**
    - [ ] In `App.tsx` or the main router configuration:
        - Check if an `activePlan` exists in the Zustand store after initial load attempts (from `localStorage` or URL, as per Stories 1.4 & 1.5).
        - If no `activePlan` exists (i.e., it's `null` or the default empty state), render/navigate to the `GetStartedView`.
        - If an `activePlan` *does* exist, render/navigate to the main application view (e.g., `ActivePlanDashboardView.tsx` - to be created in a later Epic).
- [ ] **Task 5: Testing Example Scenario Loading (AC: 2, 4, 5)**
    - [ ] Verify `GetStartedView.tsx` displays example plans correctly, matching the `get-started-view.tsx` mockup's layout.
    - [ ] Test clicking each example link:
        - Confirm the overwrite prompt (from Story 1.5) appears if a "dirty" plan exists in `localStorage`.
        - Confirm the example plan data loads correctly into `UserAppState` and the UI (even if rudimentary UI for plan details at this stage) reflects the loaded example's name.

**Dev Technical Guidance**
-   **Visual Reference:** `../../v0-mockups/components/get-started-view.tsx` is the primary guide for the layout and styling of this screen.
-   **`AppConfig` for Examples:** The `appConfigService.ts` (from Story 1.0) should provide a method to get the list of example plans, including their display names, descriptions, and the pre-generated `planData` strings.
    ```typescript
    // Example structure in AppConfig:
    interface ExamplePlan {
       id: string;
       name: string;         // e.g., "CGT Planning - Portugal NHR"
       description: string;  // "Explore a scenario focused on Portugal's NHR scheme."
       planDataParam: string; // The compressed, URL-encoded string for this UserAppState
    }
    // appConfig.exampleLinks: ExampleLink[];
    ```
-   **Routing/Navigation:**
    * If using `react-router-dom`, clicking an example might use `Maps('/?planData=ENCODED_STRING')`. The root route component (`/`) would then need to handle the `planData` query parameter on load.
    * The `GetStartedView.tsx` itself might be a route (e.g., `/get-started`). The app's main logic in `App.tsx` would redirect to `/get-started` if no plan is loaded, or to `/dashboard` (future story) if a plan is loaded.
-   **State Interaction:** Clicking an example triggers a load process that ultimately updates the `UserAppState` in Zustand.
-   **"Start with Blank Plan" option:** This should also be present on the `GetStartedView.tsx`. Clicking it would initialize a default empty `UserAppState` in the store and navigate the user to the main dashboard view (to be built). This part might be a simple placeholder or fully implemented if the dashboard view exists.

**Story Progress Notes**
* **Agent Model Used:** `<To be filled by Dev Agent>`
* **Completion Notes List:**
    * `{Dev Agent notes here}`
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Added Visual Reference - May 31, 2025 - Sarah (PO)
