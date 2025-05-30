# Tax Scenarios Analyzer MVP Frontend Architecture Document

**Version:** 0.2 *(Updated after checklist review)*
**Date:** May 29, 2025
**Author:** Jane (Design Architect) & Vibe CEO (User)

## Table of Contents

  - [Introduction](https://www.google.com/search?q=%23introduction)
  - [Overall Frontend Philosophy & Patterns](https://www.google.com/search?q=%23overall-frontend-philosophy--patterns)
  - [Detailed Frontend Directory Structure](https://www.google.com/search?q=%23detailed-frontend-directory-structure)
  - [Component Breakdown & Implementation Details](https://www.google.com/search?q=%23component-breakdown--implementation-details)
      - [Component Naming & Organization](https://www.google.com/search?q=%23component-naming--organization)
      - [Template for Component Specification](https://www.google.com/search?q=%23template-for-component-specification)
  - [State Management In-Depth](https://www.google.com/search?q=%23state-management-in-depth)
      - [Chosen Solution: Zustand](https://www.google.com/search?q=%23chosen-solution-zustand)
      - [Store Structure / Slices](https://www.google.com/search?q=%23store-structure--slices)
      - [Selectors in Zustand](https://www.google.com/search?q=%23selectors-in-zustand)
      - [Key Actions / Setters](https://www.google.com/search?q=%23key-actions--setters)
  - [Data Interaction Layer (Client-Side Focus)](https://www.google.com/search?q=%23data-interaction-layer-client-side-focus)
      - [`localStorage` Service](https://www.google.com/search?q=%23localstorage-service)
      - [`AppConfig` Service](https://www.google.com/search?q=%23appconfig-service)
      - [Data Service (Serialization/Deserialization)](https://www.google.com/search?q=%23url-data-service-serializationdeserialization)
      - [Calculation Engine Integration](https://www.google.com/search?q=%23calculation-engine-integration)
      - [Error Handling and Feedback to UI Components](https://www.google.com/search?q=%23error-handling-and-feedback-to-ui-components)
  - [Routing Strategy](https://www.google.com/search?q=%23routing-strategy)
      - [Route Definitions](https://www.google.com/search?q=%23route-definitions)
  - [Build, Bundling, and Deployment](https://www.google.com/search?q=%23build-bundling-and-deployment)
      - [Build Process & Scripts](https://www.google.com/search?q=%23build-process--scripts)
      - [Key Bundling Optimizations](https://www.google.com/search?q=%23key-bundling-optimizations)
      - [Deployment to Static Hosting](https://www.google.com/search?q=%23deployment-to-static-hosting)
  - [Frontend Testing Strategy](https://www.google.com/search?q=%23frontend-testing-strategy)
      - [Component Testing](https://www.google.com/search?q=%23component-testing)
      - [UI Integration/Flow Testing](https://www.google.com/search?q=%23ui-integrationflow-testing)
      - [End-to-End UI Testing (Conceptual for MVP)](https://www.google.com/search?q=%23end-to-end-ui-testing-conceptual-for-mvp)
  - [Accessibility (AX) Implementation Details](https://www.google.com/search?q=%23accessibility-ax-implementation-details)
  - [Performance Considerations](https://www.google.com/search?q=%23performance-considerations)
  - [Internationalization (i18n) and Localization (l10n) Strategy](https://www.google.com/search?q=%23internationalization-i18n-and-localization-l10n-strategy)
  - [Feature Flag Management](https://www.google.com/search?q=%23feature-flag-management)
  - [Frontend Security Considerations](https://www.google.com/search?q=%23frontend-security-considerations)
  - [Browser Support and Progressive Enhancement](https://www.google.com/search?q=%23browser-support-and-progressive-enhancement)
  - [Change Log](https://www.google.com/search?q=%23change-log)

## Introduction

This document details the technical architecture specifically for the frontend of the Tax Scenarios Analyzer MVP. It complements the main Tax Scenarios Analyzer MVP Product Requirements Document (PRD) (`prd-lean-v1.0.md`) and the UI/UX Specification (`front-end-spec.md`). This document builds upon the foundational decisions (e.g., overall tech stack, CI/CD concepts, primary testing tools) defined in the PRD. The goal is to provide a clear blueprint for frontend development, ensuring consistency, maintainability, and alignment with the overall system design and user experience goals for this client-side focused MVP.

  * **Link to Main System Overview (PRD - Technical Assumptions):** `prd-lean-v1.0.md#technical-assumptions`
  * **Link to UI/UX Specification:** `front-end-spec.md`
  * **Link to Primary Design Files (Figma, Sketch, etc.):** *{To be added if/when a dedicated visual design file is created}*
  * **Link to Deployed Storybook / Component Showcase:** *N/A for initial MVP, but placeholder for future.*

## Overall Frontend Philosophy & Patterns

The frontend architecture for the Tax Scenarios Analyzer MVP will adhere to modern, pragmatic principles, emphasizing a clean user experience and maintainable code for this client-side single-page application.

  * **Framework & Core Libraries:**
      * **Primary Framework:** React (v18.x or latest stable).
      * **Build Tool/Environment:** Vite.
      * **Language:** TypeScript.
      * **UI Component Library:** ShadCN UI. This library will be the primary source for UI elements, providing accessible and stylable components.
      * **Styling Approach:** Tailwind CSS (as utilized by ShadCN UI and for custom styling). Utility-first approach for Tailwind. Custom component styles will be co-located or organized logically.
  * **Component Architecture:**
      * A feature-based or view-based component organization will be adopted.
      * Emphasis on creating reusable, well-defined components.
      * Distinction between presentational (UI-focused) and container (logic-focused) components where beneficial for clarity, though React Hooks often blur this line effectively.
  * **State Management Strategy:**
      * **Zustand** will be used for global and complex local state management. Its simplicity, small bundle size, and hook-based API make it suitable for this MVP. This is detailed further in the "State Management In-Depth" section.
  * **Data Flow:**
      * Primarily unidirectional data flow, typical of React applications. State changes trigger re-renders. Zustand will manage shared state, and props will be passed down to child components.
  * **Key Design Patterns Used:**
      * **Hooks:** Extensive use of React Hooks for state, side effects, and context. Custom hooks will be created for reusable logic (e.g., interacting with `localStorage`, managing form state).
      * **Provider Pattern:** For making global state (via Zustand store) and potentially other contexts (like application configuration) available throughout the component tree.
      * **Modular Design:** Code will be organized into modules by feature or type for better maintainability and separation of concerns.

## Detailed Frontend Directory Structure

The frontend application's specific folder structure within the `src/` directory will be organized to promote modularity and align with common React/TypeScript best practices.

```plaintext
src/
├── app/                    # Core application setup, main component, routing.
│   ├── App.tsx             # Main application component.
│   ├── main.tsx            # Application entry point.
│   ├── router.tsx          # Routing configuration.
│   └── vite-env.d.ts       # Vite TypeScript environment types.
├── components/             # Shared/reusable UI components.
│   ├── ui/                 # Generic UI elements (e.g., custom wrappers around ShadCN or pure custom elements).
│   │   ├── Button.tsx
│   │   └── ...
│   └── layout/             # Layout components (Header, Footer, PageShell).
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── PageShell.tsx   # Wrapper for main content views.
├── views/ / pages/       # Top-level page/view components.
│   ├── GetStartedView.tsx
│   ├── ActivePlanDashboardView.tsx
│   ├── AssetManagementView.tsx
│   ├── PersonalGoalsManagementView.tsx
│   ├── ScenarioHubView.tsx       # Scenario Hub / Comparison Dashboard
│   ├── ScenarioEditorView.tsx
│   └── DetailedScenarioView.tsx
├── features/               # Feature-specific modules, each containing components, hooks, services, types related to that feature.
│   ├── scenarioManagement/
│   │   ├── components/     # Components specific to scenario management (e.g., ScenarioCard, ScenarioFormSection).
│   │   ├── hooks/          # Hooks for scenario logic.
│   │   └── types.ts        # Types specific to scenarios.
│   ├── assetManagement/
│   │   └── ...
│   ├── personalGoals/      # Feature module for "My Personal Goals"
│   │   └── ...
│   └── planSharing/
│       ├── services/       # Logic for URL encoding/decoding.
│       └── hooks/
├── store/                  # Zustand state management setup.
│   ├── index.ts            # Main store configuration and export.
│   ├── userAppStateSlice.ts # Slice for the main UserAppState.
│   └── uiSlice.ts          # Slice for UI state (e.g., open modals, notifications).
├── services/               # Application-wide services (non-UI logic).
│   ├── localStorageService.ts # Handles interaction with localStorage.
│   ├── appConfigService.ts    # Handles loading and accessing AppConfig from src/data/.
│   ├── calculationService.ts  # Wraps and orchestrates the core calculation engine.
│   └── planSharingService.ts  # Handles URL encoding/decoding logic using LZ-String.
├── hooks/                  # Global/sharable custom React Hooks.
│   └── useLocalStorage.ts
├── lib/ / utils/           # Utility functions, helpers, constants.
│   └── lzString.ts         # LZ-String library integration.
│   └── helpers.ts
├── data/                   # For static application data.
│   ├── templateScenarios.data.ts
│   ├── globalQualitativeConcepts.data.ts
│   ├── globalSpecialTaxFeatures.data.ts
│   └── index.ts            # Optional: to re-export all data for easier import
├── styles/                 # Global styles, Tailwind CSS base configuration.
│   └── index.css           # Main CSS file for Tailwind directives and global styles.
└── types/                  # Global TypeScript type definitions/interfaces.
    └── index.ts            # Shared types across the application (e.g., UserAppState, Scenario, Asset).
```

**Notes on Frontend Structure:**

  * Components will be co-located with their feature if not globally reusable to improve modularity.
  * AI Agent MUST adhere to this defined structure strictly. New files MUST be placed in the appropriate directory based on these descriptions.

## Component Breakdown & Implementation Details

Component specifications will primarily follow the detailed descriptions and conceptual mockups outlined in the `front-end-spec.md`. This section establishes the general approach.

### Component Naming & Organization

  * **Component Naming Convention:** PascalCase for files and component names (e.g., `UserProfileCard.tsx`). All component files MUST follow this convention.
  * **Organization:** Globally reusable components in `src/components/ui/` or `src/components/layout/`. Feature-specific components co-located within their feature directory (e.g., `src/features/scenarioManagement/components/`).

### Template for Component Specification

For each significant UI component identified (many are already conceptualized in `front-end-spec.md`), the following details MUST be provided during development. The AI agent MUST follow this template when a new component is identified for development.

#### Component: `{ComponentName}` (e.g., `ScenarioCard`, `AssetForm`)

  * **Purpose:** {Briefly describe what this component does and its role in the UI. MUST be clear and concise.}
  * **Source File(s):** {e.g., `src/features/scenarioManagement/components/ScenarioCard.tsx`. MUST be the exact path.}
  * **Visual Reference:** {Link to specific section in `front-end-spec.md` or Figma frame if available.}
  * **Props (Properties):**
    | Prop Name | Type | Required? | Default Value | Description |
    | :-------------- | :---------------------------------------- | :-------- | :------------ | :--------------------------------------------------------------------------------------------------------- |
    | `{propName}` | `{Type}` | {Yes/No}  | {If any}    | {MUST clearly state the prop’s purpose and any constraints.} |
  * **Internal State (if any, using `useState` or `useReducer`):**
    | State Variable | Type      | Initial Value | Description |
    | :-------------- | :-------- | :------------ | :----------------------------------------------------------------------------- |
    | `{stateName}` | `{Type}`  | `{Value}`     | {Description of state variable and its purpose.} |
  * **Key UI Elements / Structure (Conceptual JSX):**
    ```tsx
    // Pseudo-JSX representing the component's DOM structure.
    // Include key conditional rendering logic if applicable.
    // Reference ShadCN UI components used (e.g., <Card>, <Button>, <Input>).
    ```
  * **Events Handled / Emitted:**
      * **Handles:** {e.g., `onClick` on a button, `onChange` on an input.}
      * **Emits (Callbacks):** {e.g., `onSave: (data: MyFormData) => void`. Describe custom events/callbacks passed as props.}
  * **Actions Triggered (Side Effects):**
      * **State Management:** {e.g., "Calls `userAppStore.getState().updateAssetName(id, newName)`."}
      * **Service Calls:** {e.g., "Calls `localStorageService.saveActivePlan(updatedPlan)`."}
  * **Styling Notes:**
      * {Reference specific ShadCN UI component usage and variants. List primary Tailwind CSS utility classes or custom classes applied. Describe any dynamic styling logic.}
  * **Accessibility Notes:**
      * {List specific ARIA attributes and their values, keyboard navigation behavior, focus management requirements.}

*(This template will guide the emergent, detailed design of components during development).*

## State Management In-Depth

  * **Chosen Solution: Zustand**
      * Zustand is chosen for its simplicity, small bundle size, and unopinionated nature, making it easy to integrate and use with React hooks. It avoids boilerplate often associated with other state management libraries.
  * **Decision Guide for State Location:**
      * **Global Store (Zustand):**
          * The entire `UserAppState` (which includes the `ActivePlan` - scenarios, assets, goals, etc.) will be managed in the Zustand store. This is necessary because many components across different views need to access and modify this shared state.
          * UI-specific global state (e.g., active modal, global notifications/toasts via the `uiSlice`) can also reside here.
      * **React Context API:** May be used for very localized, static configuration or theme data if needed, but Zustand will be the primary mechanism for dynamic shared state.
      * **Local Component State (`useState`, `useReducer`):** For UI-specific state not needed outside the component or its direct children (e.g., form input values before submission to the global store, dropdown open/close status, simple UI toggles). This MUST be the default choice unless criteria for global state are met.

### Store Structure / Slices

A single primary store slice will manage the `UserAppState`. An additional slice, `uiSlice.ts`, will handle UI-specific global state like notifications.

  * **`userAppStateSlice.ts` (in `src/store/`):**
      * **Purpose:** Manages the entire `UserAppState` object, including the `activePlanName`, `activePlan` (which contains `initialAssets`, `userQualitativeGoals`, `scenarios` array), and potentially other global application settings relevant to the user's session.
      * **State Shape (Interface/Type - from `src/types/index.ts`):**
        ```typescript
        // Simplified example from types/index.ts
        interface UserQualitativeGoal { /* ... */ }
        interface Asset { /* ... */ }
        interface Scenario { /* ... */ } // Includes all its data like planned sales, STFs, attributes
        interface ActivePlan {
          id: string; // UUID for the plan
          name: string;
          initialAssets: Asset[];
          userQualitativeGoals: UserQualitativeGoal[];
          scenarios: Scenario[]; // Baseline is typically scenarios[0]
          // other plan-wide settings
        }
        interface UserAppState {
          activePlanName: string; // User-defined name for the overall plan session
          activePlan: ActivePlan | null; // Holds all data for the current plan being worked on
        }
        ```
      * **Initial State:** When the app loads, it will attempt to initialize this state from `localStorage`. If no data is found, it will initialize with a `null` or default `ActivePlan`.
      * **Key Actions / Setters (within the Zustand store creator):**
          * `setActivePlan(plan: ActivePlan | null): void` - Replaces the entire active plan.
          * `updateActivePlanName(name: string): void`
          * `addAsset(asset: Asset): void`
          * `updateAsset(assetId: string, updatedAsset: Partial<Asset>): void`
          * `deleteAsset(assetId: string): void`
          * `addQualitativeGoal(goal: UserQualitativeGoal): void`
          * `updateQualitativeGoal(goalId: string, updatedGoal: Partial<UserQualitativeGoal>): void`
          * `deleteQualitativeGoal(goalId: string): void`
          * `addScenario(scenario: Scenario): void`
          * `updateScenario(scenarioId: string, updatedScenario: Partial<Scenario>): void`
          * `deleteScenario(scenarioId: string): void`
          * *And other specific setters as needed for granular updates.*
  * **`uiSlice.ts` (in `src/store/`):**
      * **Purpose:** Manages global UI state, such as notifications, active modals (if globally controlled), or global loading indicators.
      * **State Shape (Example):**
        ```typescript
        interface ToastMessage {
          id: string;
          type: 'success' | 'error' | 'info';
          message: string;
          duration?: number;
        }
        interface UIState {
          toasts: ToastMessage[];
          // other UI states
        }
        ```
      * **Key Actions / Setters:**
          * `addToast(toast: Omit<ToastMessage, 'id'>): void`
          * `removeToast(toastId: string): void`

### Selectors in Zustand:

Zustand selectors are typically direct state access functions passed to the hook, for example: `state => state.userAppState.activePlan?.name`. This is often sufficient and very performant.

For more complex, derived data that might be computationally intensive or frequently reused across multiple components, selectors can be defined outside the component. If performance profiling later indicates a need for memoization for such complex selectors, libraries like `reselect` can be integrated, or custom memoization hooks can be employed. However, for the MVP, direct access selectors are expected to be the primary approach.

**Example of Selector Usage:**

```typescript
import { useAppStore } from '@/store'; // Assuming useAppStore combines all slices
import { UserAppState } from '@/types';

// Simple inline selector within a component:
// const activePlanName = useAppStore(state => state.userAppState.activePlan?.name);

// Example of a more structured selector (if needed for complexity/reuse):
// export const selectCurrentActivePlanName = (state: UserAppState) => state.activePlan?.name;
// // Then in a component:
// // const activePlanName = useAppStore(selectCurrentActivePlanName);
```

### Key Actions / Setters

Actions will be functions defined within the Zustand store creator that update the state. Components will call these actions to modify the global `UserAppState` or `UIState`. All state modifications MUST be immutable. For deep updates within the `ActivePlan`, dedicated setter functions will handle the path to the data immutably. Immer can be integrated with Zustand for easier immutable updates if state management becomes overly complex.

## Data Interaction Layer (Client-Side Focus)

Since the MVP is a client-side only application, the data interaction layer will not involve typical backend API calls. Instead, it will focus on:

### `localStorage` Service (`src/services/localStorageService.ts`)

  * **Purpose:** To handle saving and loading the entire `UserAppState` (specifically the `ActivePlan` and its `activePlanName`) to and from the browser's `localStorage`.
  * **Functions:**
      * `saveActivePlan(planName: string, plan: ActivePlan): void` - Serializes and saves the plan. Includes error handling for `localStorage` write limits/errors.
      * `loadActivePlan(): { planName: string; plan: ActivePlan } | null` - Loads and deserializes the plan. Handles cases where no plan is found or data is corrupt.
  * **Usage:** The Zustand store will likely use this service within its actions or via a subscription/middleware to persist changes automatically.

### `AppConfig` Service (`src/services/appConfigService.ts`)

  * **Purpose:** To load and provide type-safe access to static application configuration data, sourced from individual TypeScript data modules within the `src/data/` directory (e.g., `templateScenarios.data.ts`, `globalQualitativeConcepts.data.ts`).
  * **Functions:**
      * `getTemplateScenarios(): TemplateScenario[]` (imports from `src/data/templateScenarios.data.ts`)
      * `getGlobalQualitativeConcepts(): GlobalQualitativeConcept[]` (imports from `src/data/globalQualitativeConcepts.data.ts`)
      * `getGlobalSpecialTaxFeatures(): SpecialTaxFeature[]` (imports from `src/data/globalSpecialTaxFeatures.data.ts`)
      * (May also provide an aggregated `getAppConfig(): AppConfig` if needed).
  * **Usage:** Various parts of the application (e.g., scenario creation, qualitative goal setup) will use this service to get template data and global definitions.

### URL Data Service (Serialization/Deserialization) (`src/services/planSharingService.ts`)

  * **Purpose:** To handle the serialization, compression (using LZ-String), URL-encoding of the `ActivePlan` for sharing, and the reverse process for loading a plan from a URL.
  * **Functions:**
      * `generateShareableString(planName: string, plan: ActivePlan): string`
      * `parseShareableString(urlString: string): { planName: string; plan: ActivePlan } | null` - Includes decompression and deserialization, with error handling.
  * **Usage:** Used by the "Share Plan" feature and when the app detects plan data in the URL on load.

### Calculation Engine Integration (`src/services/calculationService.ts`)

  * **Purpose:** To encapsulate and provide an interface to the core calculation logic (Capital Gains Tax and Qualitative Fit Score). This service will take the current `ActivePlan` (or a specific scenario) and relevant `AppConfig` data as input.
  * **Functions:**
      * `calculateScenarioResults(scenario: Scenario, globalAssets: Asset[], userGoals: UserQualitativeGoal[], appConfigData: { /* relevant parts */ }): ScenarioResults` - Performs all financial (CGT for MVP) and qualitative calculations for a single scenario.
      * `recalculateAllScenarioResults(activePlan: ActivePlan, appConfigData: { /* relevant parts */ }): ActivePlanWithResults` - Iterates through all scenarios in the plan and updates their results.
  * **Usage:** Called whenever underlying data that affects calculations changes. Results are then typically updated in the Zustand store.

### Error Handling and Feedback to UI Components

While individual services (`localStorageService`, `planSharingService`, `appConfigService`) will handle their internal errors (e.g., parsing issues, `localStorage` quota errors), it's crucial that errors relevant to the user are communicated effectively through the UI.

  * **Error Propagation:** Services should be designed to return or throw meaningful errors when operations fail in a way that impacts the user or data integrity.
  * **State Management for UI Feedback:** A dedicated slice within the Zustand store (e.g., `uiSlice.ts` as outlined in the store structure) will be utilized to manage global UI feedback states, such as current error messages or codes. This allows any component to display global notifications.
  * **Component-Level Error Display Strategy:**
      * Components that trigger service operations (e.g., saving to `localStorage`, loading from a URL) MUST catch potential errors propagated by these services.
      * **Global Notifications (Toasts):** For errors that are general or non-blocking to the immediate component's function but important for the user to know (e.g., "Could not auto-save plan, `localStorage` might be full"), an action should be dispatched to the `uiSlice` to trigger a global notification. This will be implemented using a ShadCN `Toast` component displayed in a consistent location, as per user preference.
      * **Inline/Contextual Messages:** For errors directly related to a specific user input or action within a component (e.g., "Invalid characters in Plan Name," "Failed to parse shared URL - format incorrect"), inline error messages displayed near the relevant input field or UI element are preferred for immediate contextual feedback.
      * The objective is to provide clear, user-friendly, and actionable feedback when issues arise, guiding the user appropriately.

## Routing Strategy

A simple client-side routing strategy will be implemented using `react-router-dom`.

  * **Routing Library:** `react-router-dom` (latest stable version).
  * **Philosophy:** The application is a Single-Page Application (SPA). Routing will manage transitions between the main views identified in the `front-end-spec.md`.

### Route Definitions

The `front-end-spec.md` outlines the key views. The routes might look something like this (conceptual):

| Path Pattern                     | Component/Page (`src/views/...`)         | Protection | Notes                                                                 |
| :------------------------------- | :--------------------------------------- | :--------- | :-------------------------------------------------------------------- |
| `/`                              | `ActivePlanDashboardView.tsx`            | Public     | Or redirects to `/get-started` if no active plan.                     |
| `/get-started`                   | `GetStartedView.tsx`                     | Public     | Shown if no plan in `localStorage`.                                     |
| `/plan/assets`                   | `AssetManagementView.tsx`                | Public     | Manages assets for the active plan.                                   |
| `/plan/goals`                    | `PersonalGoalsManagementView.tsx`        | Public     | Manages "My Personal Goals" for the active plan.                      |
| `/plan/scenarios`                | `ScenarioHubView.tsx`                    | Public     | Main dashboard for scenarios & comparison.                            |
| `/plan/scenarios/new`            | `ScenarioEditorView.tsx` (in 'create' mode) | Public     | Could also be a state managed within `/plan/scenarios` leading to editor. |
| `/plan/scenarios/:scenarioId/edit` | `ScenarioEditorView.tsx` (in 'edit' mode)   | Public     |                                                                       |
| `/plan/scenarios/:scenarioId`    | `DetailedScenarioView.tsx`               | Public     |                                                                       |

*Protection is "Public" as the MVP is entirely client-side with no user authentication. Route guards are not applicable for MVP.*

## Build, Bundling, and Deployment

  * **Build Tool:** Vite.

### Build Process & Scripts

  * **Key Build Scripts (from `package.json`):**
      * `"dev": "vite"` - Starts the development server with HMR.
      * `"build": "tsc && vite build"` - Type checks and produces optimized static assets for production in the `dist/` folder.
      * `"preview": "vite preview"` - Serves the production build locally for testing.
  * **Environment Configuration Management:**
      * Vite uses `.env` files for environment variables. Variables prefixed with `VITE_` are exposed to client-side code. For this MVP, most configuration will reside in the `src/data/` files rather than numerous environment variables.

### Key Bundling Optimizations

  * **Code Splitting:** Vite handles route-based code splitting automatically. Further splitting for large components can be done using `React.lazy()`.
  * **Tree Shaking:** Ensured by Vite/Rollup.
  * **Lazy Loading:**
      * **Components:** `React.lazy` with `Suspense`.
      * **Images:** Standard `<img>` tag with `loading="lazy"`.
  * **Minification & Compression:** Handled by Vite. Compression (Gzip, Brotli) by the hosting platform (Cloudflare Pages).

### Deployment to Static Hosting

  * **Target Platform:** Cloudflare Pages.
  * **Deployment Trigger:** Manual deployment of `dist/` initially. CI/CD via GitHub Actions for `main` branch pushes can be set up.
  * **Asset Caching Strategy:** Vite produces assets with content hashes for long-term caching. `index.html` with `Cache-Control: no-cache`.

## Frontend Testing Strategy

Testing will focus on reliability of core calculations, state management, and component interactions.

  * **Tools:**
      * **Test Runner/Framework:** Vitest.
      * **Testing Library:** React Testing Library.

### Component Testing

  * **Scope:** Individual React components.
  * **Tools:** Vitest, React Testing Library.
  * **Focus:** Rendering, props, user interactions, event emission, basic state. Snapshots sparingly.
  * **Location:** `*.test.tsx` or `*.spec.tsx` co-located or in `__tests__`.

### UI Integration/Flow Testing

  * **Scope:** Multiple components interacting for a small user flow, mocking services/state.
  * **Tools:** Vitest, React Testing Library, Zustand testing utilities.
  * **Focus:** Data flow, conditional rendering, navigation stubs, mocked service/state integration.

### End-to-End UI Testing (Conceptual for MVP)

  * **Tools (Future):** Playwright or Cypress.
  * **Scope (MVP):** Manual E2E testing of key user journeys from `front-end-spec.md`.
  * **Test Data Management (MVP):** Manual input, example templates.

## Accessibility (AX) Implementation Details

Leveraging ShadCN UI's strengths.

  * **Semantic HTML:** Prioritized.
  * **ARIA Implementation:** As needed for custom components or to enhance ShadCN UI.
  * **Keyboard Navigation:** All interactive elements focusable/operable. Logical focus order.
  * **Focus Management:** Modals (ShadCN `Dialog`) trap focus, return on close.
  * **Testing Tools for AX:** Manual keyboard testing, Axe DevTools, Lighthouse audits.

## Performance Considerations

Monitoring throughout development.

  * **Image Optimization:** Optimized formats, SVGs, native lazy loading.
  * **Code Splitting & Lazy Loading:** Vite route-splitting, `React.lazy`.
  * **Minimizing Re-renders (React):** `React.memo`, optimized Zustand selectors if needed, avoid new object/array literals in props.
  * **Debouncing/Throttling:** Consider for frequent event handlers.
  * **Virtualization:** For very long lists (beyond MVP targets), consider `TanStack Virtual`.
  * **Calculation Performance:** Engine designed efficiently. Web workers post-MVP if needed.
  * **Performance Monitoring Tools:** Browser DevTools, `React DevTools Profiler`.

## Internationalization (i18n) and Localization (l10n) Strategy

  * **Requirement Level:** Not a requirement for this Lean MVP. UI in English.
  * **Future Considerations:** `react-i18next` if needed.

## Feature Flag Management

  * **Requirement Level:** Not a primary architectural concern for this Lean MVP.
  * **Future Considerations:** Simple environment variable approach or library if needed.

## Frontend Security Considerations

Focus on common web vulnerabilities and client-side data handling.

  * **XSS Prevention:** React JSX auto-escaping. DOMPurify if `dangerouslySetInnerHTML` used (avoid).
  * **CSRF Protection:** N/A for client-side only MVP.
  * **Secure Data Handling (Client-Side):**
      * **`localStorage`:** Suitable for non-critically sensitive planning data for this personal MVP.
      * **URL Sharing:** Data encoded but not encrypted. Users share at their discretion.
  * **Third-Party Script Security:** Minimize. SRI if any added post-MVP.
  * **Client-Side Data Validation:** Thorough validation for UX and data integrity before store updates.
  * **API Key Exposure:** N/A for MVP.
  * **Secure Communication (HTTPS):** Enforced by Cloudflare Pages deployment.
  * **Dependency Vulnerabilities:** Regular `npm audit` / `yarn audit`.

## Browser Support and Progressive Enhancement

  * **Target Browsers:** Latest 2 stable versions of Chrome, Firefox, Safari, Edge. IE NOT supported.
  * **Polyfill Strategy:** Vite/Babel handle transpilation. `core-js` if critical features require it.
  * **JavaScript Requirement:** Core functionality REQUIRES JavaScript. No specific no-JS progressive enhancement.

## Change Log

**Process for Updates:**
This change log is intended to track the evolution of this Frontend Architecture Document. It will be updated with each significant architectural decision, structural revision to the frontend design, or version update made to this document. Each new entry should include the date of the change, an incremented version number (e.g., 0.1, 0.2, 1.0), a concise description of the modifications, and the author(s) responsible for or making the change.

| Change                                                      | Date       | Version | Description                                                                          | Author                         |
| :---------------------------------------------------------- | :--------- | :------ | :----------------------------------------------------------------------------------- | :----------------------------- |
| Initial Draft                                               | May 29, 2025 | 0.1     | First draft based on PRD Lean MVP and UI/UX Spec (YOLO mode).                        | Jane (Design Architect) & Vibe CEO |
| Revisions after Checklist Review (Data Org, Selectors, Error Handling, CL Process) | May 29, 2025 | 0.2     | Updated data organization, state selector guidance, component error handling, CL process. | Jane (Design Architect) & Vibe CEO |
