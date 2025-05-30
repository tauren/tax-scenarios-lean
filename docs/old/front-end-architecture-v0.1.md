# Tax Scenarios Analyzer MVP Frontend Architecture Document

**Version:** 0.1
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
      - [Key Actions / Setters](https://www.google.com/search?q=%23key-actions--setters)
  - [Data Interaction Layer (Client-Side Focus)](https://www.google.com/search?q=%23data-interaction-layer-client-side-focus)
      - [`localStorage` Service](https://www.google.com/search?q=%23localstorage-service)
      - [`AppConfig` Service](https://www.google.com/search?q=%23appconfig-service)
      - [Data Service (Serialization/Deserialization)](https://www.google.com/search?q=%23url-data-service-serializationdeserialization)
      - [Calculation Engine Integration](https://www.google.com/search?q=%23calculation-engine-integration)
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

This document details the technical architecture specifically for the frontend of the Tax Scenarios Analyzer MVP. It complements the main Tax Scenarios Analyzer MVP Product Requirements Document (PRD) (`prd-lean-v1.0.md`) [cite: 1] and the UI/UX Specification (`front-end-spec.md`). This document builds upon the foundational decisions (e.g., overall tech stack, CI/CD concepts, primary testing tools) defined in the PRD[cite: 1]. The goal is to provide a clear blueprint for frontend development, ensuring consistency, maintainability, and alignment with the overall system design and user experience goals for this client-side focused MVP.

  * **Link to Main System Overview (PRD - Technical Assumptions):** `prd-lean-v1.0.md#technical-assumptions`
  * **Link to UI/UX Specification:** `front-end-spec.md`
  * **Link to Primary Design Files (Figma, Sketch, etc.):** *{To be added if/when a dedicated visual design file is created}*
  * **Link to Deployed Storybook / Component Showcase:** *N/A for initial MVP, but placeholder for future.*

## Overall Frontend Philosophy & Patterns

The frontend architecture for the Tax Scenarios Analyzer MVP will adhere to modern, pragmatic principles, emphasizing a clean user experience and maintainable code for this client-side single-page application.

  * **Framework & Core Libraries:**
      * **Primary Framework:** React (v18.x or latest stable)[cite: 1].
      * **Build Tool/Environment:** Vite[cite: 1].
      * **Language:** TypeScript[cite: 1].
      * **UI Component Library:** ShadCN UI[cite: 1]. This library will be the primary source for UI elements, providing accessible and stylable components.
      * **Styling Approach:** Tailwind CSS [cite: 1] (as utilized by ShadCN UI and for custom styling). Utility-first approach for Tailwind. Custom component styles will be co-located or organized logically.
  * **Component Architecture:**
      * A feature-based or view-based component organization will be adopted.
      * Emphasis on creating reusable, well-defined components.
      * Distinction between presentational (UI-focused) and container (logic-focused) components where beneficial for clarity, though React Hooks often blur this line effectively.
  * **State Management Strategy:**
      * **Zustand** will be used for global and complex local state management[cite: 1]. Its simplicity, small bundle size, and hook-based API make it suitable for this MVP. This is detailed further in the "State Management In-Depth" section.
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
│   ├── qualitativeGoals/
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
│   ├── appConfigService.ts    # Handles loading and accessing AppConfig (templateScenarios, globalQualitativeConcepts etc.), sourced from src/data
│   ├── calculationService.ts  # Wraps and orchestrates the core calculation engine.
│   └── planSharingService.ts  # Handles URL encoding/decoding logic using LZ-String.
├── hooks/                  # Global/sharable custom React Hooks.
│   └── useLocalStorage.ts
├── lib/ / utils/           # Utility functions, helpers, constants.
│   └── lzString.ts         # LZ-String library integration[cite: 1].
│   └── helpers.ts
├── config/                 # Application configuration files (e.g., static data like AppConfig).
│   └── appConfig.json      # Static configuration including templateScenarios, globalQualitativeConcepts, etc. [cite: 1]
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

  * **Chosen Solution: Zustand** [cite: 1]
      * Zustand is chosen for its simplicity, small bundle size, and unopinionated nature, making it easy to integrate and use with React hooks. It avoids boilerplate often associated with other state management libraries.
  * **Decision Guide for State Location:**
      * **Global Store (Zustand):**
          * The entire `UserAppState` (which includes the `ActivePlan` - scenarios, assets, goals, etc.) will be managed in the Zustand store. This is necessary because many components across different views need to access and modify this shared state.
          * UI-specific global state (e.g., active modal, global notifications/toasts) can also reside here or in a separate UI-focused store slice.
      * **React Context API:** May be used for very localized, static configuration or theme data if needed, but Zustand will be the primary mechanism for dynamic shared state.
      * **Local Component State (`useState`, `useReducer`):** For UI-specific state not needed outside the component or its direct children (e.g., form input values before submission to the global store, dropdown open/close status, simple UI toggles). This MUST be the default choice unless criteria for global state are met.

### Store Structure / Slices

A single primary store slice will manage the `UserAppState`. Additional slices can be created for UI state if the complexity grows.

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
          // Potentially other app-level state like settings, lastLoadedFromURL, etc.
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
          * `updateScenario(scenarioId: string, updatedScenario: Partial<Scenario>): void` // For deep updates, might need more specific setters or immer integration.
          * `deleteScenario(scenarioId: string): void`
          * `updatePlannedAssetSale(scenarioId: string, saleId: string, updatedSale: Partial<PlannedAssetSale>): void` // Example of a more granular update
          * *And many more specific setters for deep modifications within the `ActivePlan` structure to ensure fine-grained updates and prevent unnecessary re-renders. Immer can be integrated with Zustand for easier immutable updates if the state becomes deeply nested and complex to manage.*

### Key Actions / Setters

Actions will be functions defined within the Zustand store that update the state. Components will call these actions to modify the global `UserAppState`. All state modifications MUST be immutable. For deep updates within the `ActivePlan` (e.g., modifying a specific property of a specific asset in a specific scenario), dedicated setter functions will be created in the store slice to handle the path to the data immutably.

## Data Interaction Layer (Client-Side Focus)

Since the MVP is a client-side only application[cite: 1], the data interaction layer will not involve typical backend API calls. Instead, it will focus on:

### `localStorage` Service (`src/services/localStorageService.ts`)

  * **Purpose:** To handle saving and loading the entire `UserAppState` (specifically the `ActivePlan` and its `activePlanName`) to and from the browser's `localStorage`.
  * **Functions:**
      * `saveActivePlan(planName: string, plan: ActivePlan): void` - Serializes and saves the plan. Includes error handling for `localStorage` write limits/errors.
      * `loadActivePlan(): { planName: string; plan: ActivePlan } | null` - Loads and deserializes the plan. Handles cases where no plan is found or data is corrupt.
  * **Usage:** The Zustand store will likely use this service within its actions or via a subscription/middleware to persist changes automatically.

### `AppConfig` Service (`src/services/appConfigService.ts`)

  * **Purpose:** To load and provide type-safe access to static application configuration data, sourced from individual TypeScript data modules within the `src/data/` directory.
  * **Functions (conceptual change):**
      * Instead of fetching and parsing a single JSON, it would import the data arrays/objects directly from the `.data.ts` files.
      * `getTemplateScenarios(): TemplateScenario[]` (imports from `templateScenarios.data.ts`)
      * `getGlobalQualitativeConcepts(): GlobalQualitativeConcept[]` (imports from `globalQualitativeConcepts.data.ts`)
      * `getGlobalSpecialTaxFeatures(): SpecialTaxFeature[]` (imports from `globalSpecialTaxFeatures.data.ts`)
      * It might still provide a method like `getAppConfig(): AppConfig` that returns an aggregated object if that's convenient, or components can import data getters individually.
  * **Usage:** Various parts of the application (e.g., scenario creation, qualitative goal setup) will use this service to get template data and global definitions.


### URL Data Service (Serialization/Deserialization) (`src/services/planSharingService.ts`)

  * **Purpose:** To handle the serialization, compression (using LZ-String [cite: 1]), URL-encoding of the `ActivePlan` for sharing, and the reverse process for loading a plan from a URL.
  * **Functions:**
      * `generateShareableString(planName: string, plan: ActivePlan): string`
      * `parseShareableString(urlString: string): { planName: string; plan: ActivePlan } | null` - Includes decompression and deserialization, with error handling.
  * **Usage:** Used by the "Share Plan" feature and when the app detects plan data in the URL on load[cite: 1].

### Calculation Engine Integration (`src/services/calculationService.ts`)

  * **Purpose:** To encapsulate and provide an interface to the core calculation logic (Capital Gains Tax and Qualitative Fit Score)[cite: 1]. This service will take the current `ActivePlan` (or a specific scenario) and relevant `AppConfig` data as input.
  * **Functions:**
      * `calculateScenarioResults(scenario: Scenario, globalAssets: Asset[], userGoals: UserQualitativeGoal[], appConfig: AppConfig): ScenarioResults` - Performs all financial (CGT for MVP) and qualitative calculations for a single scenario.
      * `recalculateAllScenarioResults(activePlan: ActivePlan, appConfig: AppConfig): ActivePlanWithResults` - Iterates through all scenarios in the plan and updates their results.
  * **Usage:** Called whenever underlying data that affects calculations changes (e.g., modifications to assets, sales, STFs, qualitative goals/attributes). Results are then typically updated in the Zustand store.

## Routing Strategy

A simple client-side routing strategy will be implemented using a library like `react-router-dom`.

  * **Routing Library:** `react-router-dom` (latest stable version).
  * **Philosophy:** The application is a Single-Page Application (SPA)[cite: 1]. Routing will manage transitions between the main views identified in the `front-end-spec.md`.

### Route Definitions

The `front-end-spec.md` outlines the key views. The routes might look something like this (conceptual):

| Path Pattern                     | Component/Page (`src/views/...`)         | Protection | Notes                                                                 |
| :------------------------------- | :--------------------------------------- | :--------- | :-------------------------------------------------------------------- |
| `/`                              | `ActivePlanDashboardView.tsx`            | Public     | Or redirects to `/get-started` if no active plan.                     |
| `/get-started`                   | `GetStartedView.tsx`                     | Public     | Shown if no plan in `localStorage`.                                     |
| `/plan/assets`                   | `AssetManagementView.tsx`                | Public     | Manages assets for the active plan.                                   |
| `/plan/goals`                    | `PersonalGoalsManagementView.tsx`        | Public     | Manages personal goals for the active plan.                           |
| `/plan/scenarios`                | `ScenarioHubView.tsx`                    | Public     | Main dashboard for scenarios & comparison.                            |
| `/plan/scenarios/new`            | `ScenarioEditorView.tsx` (in 'create' mode) | Public     | Could also be a sub-route or modal from `/plan/scenarios`.          |
| `/plan/scenarios/:scenarioId/edit` | `ScenarioEditorView.tsx` (in 'edit' mode)   | Public     |                                                                       |
| `/plan/scenarios/:scenarioId`    | `DetailedScenarioView.tsx`               | Public     |                                                                       |

*Protection is "Public" as the MVP is entirely client-side with no user authentication.* Route guards are not applicable for MVP in this context.

## Build, Bundling, and Deployment

  * **Build Tool:** Vite[cite: 1].

### Build Process & Scripts

  * **Key Build Scripts (from `package.json`):**
      * `"dev": "vite"` - Starts the development server with HMR.
      * `"build": "tsc && vite build"` - Type checks and produces optimized static assets for production in the `dist/` folder.
      * `"preview": "vite preview"` - Serves the production build locally for testing.
  * **Environment Configuration Management:**
      * Vite uses `.env` files (`.env`, `.env.development`, `.env.production`) for environment variables. Variables prefixed with `VITE_` are exposed to client-side code. For this MVP, most configuration will be in `appConfig.json` rather than numerous environment variables.

### Key Bundling Optimizations

  * **Code Splitting:** Vite handles route-based code splitting automatically via dynamic imports. Further splitting for large components can be done using `React.lazy()`.
  * **Tree Shaking:** Ensured by Vite/Rollup during the production build, especially with ES Modules.
  * **Lazy Loading:**
      * **Components:** `React.lazy` with `Suspense` for components not immediately visible or very large.
      * **Images:** Standard `<img>` tag with `loading="lazy"` attribute where appropriate.
  * **Minification & Compression:** Handled by Vite (using esbuild/terser) for JS/CSS in production builds. Compression (Gzip, Brotli) will be handled by the static hosting platform (Cloudflare Pages [cite: 1]).

### Deployment to Static Hosting

  * **Target Platform:** Cloudflare Pages [cite: 1] (or similar static web hosting like Vercel, Netlify).
  * **Deployment Trigger:** Manual deployment of the `dist/` folder initially. CI/CD pipeline via GitHub Actions can be set up to auto-deploy on pushes to the `main` branch.
  * **Asset Caching Strategy:**
      * Vite produces assets with content hashes in their filenames, enabling long-term caching (`Cache-Control: public, max-age=31536000, immutable`).
      * `index.html` will have `Cache-Control: no-cache` or short max-age to ensure users get the latest version. This is typically configured at the hosting platform level.

## Frontend Testing Strategy

Testing will focus on ensuring the reliability of core calculations, state management, and component interactions. The main architecture document (PRD) implies a need for robust testing.

  * **Tools:**
      * **Test Runner/Framework:** Vitest (Vite's native test runner, Jest-compatible API).
      * **Testing Library:** React Testing Library for component interaction testing.
  * **Link to Main Overall Testing Strategy:** *N/A for this client-side MVP; this document defines the FE testing strategy.*

### Component Testing

  * **Scope:** Testing individual React components in isolation.
  * **Tools:** Vitest, React Testing Library.
  * **Focus:** Rendering with various props, user interactions (clicks, input changes using `@testing-library/user-event`), event emission, basic internal state changes. Snapshot testing will be used sparingly, preferring explicit assertions.
  * **Location:** `*.test.tsx` or `*.spec.tsx` co-located alongside components, or in a `__tests__` subdirectory.

### UI Integration/Flow Testing

  * **Scope:** Testing how multiple components interact to fulfill a small user flow or feature within a page, potentially mocking services (`localStorageService`, `appConfigService`) or global state (Zustand store).
  * **Tools:** Vitest, React Testing Library, Zustand testing utilities.
  * **Focus:** Data flow between components, conditional rendering, navigation stubs, integration with mocked services/state. For example, testing the flow of adding an asset and seeing it appear in a list, with `localStorageService` mocked.

### End-to-End UI Testing (Conceptual for MVP)

  * **Tools:** Playwright or Cypress could be considered post-MVP.
  * **Scope (MVP):** Manual E2E testing of key user journeys as defined in `front-end-spec.md` will be sufficient for the initial MVP. This includes:
    1.  Creating a new plan (blank and from example).
    2.  Adding assets and personal goals.
    3.  Creating and editing a baseline and a comparison scenario with CGT rates, expenses, income, planned sales, and STFs.
    4.  Verifying the comparison dashboard and detailed view reflect inputs and calculations correctly.
    5.  Testing the share plan URL generation and loading.
  * **Test Data Management for UI:** For MVP, manual input and use of example templates. For automated E2E (post-MVP), strategies like API mocking (if a backend is added) or pre-defined JSON state for `localStorage` would be needed.

## Accessibility (AX) Implementation Details

Accessibility will be an ongoing consideration, leveraging the strengths of ShadCN UI.

  * **Semantic HTML:** Prioritize semantic HTML5 elements (`<nav>`, `<button>`, `<article>`, etc.) over generic `<div>`/`<span>` with ARIA roles where native elements suffice.
  * **ARIA Implementation:** Use ARIA attributes as needed for custom components or to enhance the semantics of ShadCN UI components if their default implementation is insufficient for specific complex interactions. Refer to ARIA Authoring Practices Guide (APG).
  * **Keyboard Navigation:** Ensure all interactive elements are focusable and operable via keyboard. Focus order MUST be logical.
  * **Focus Management:** For modals (ShadCN `Dialog`) and dynamic content changes, ensure focus is managed appropriately (e.g., trapped in modals, returned to trigger on close).
  * **Testing Tools for AX:**
      * Manual testing with keyboard-only navigation.
      * Browser extensions like Axe DevTools during development.
      * Lighthouse accessibility audits.
      * (Automated `jest-axe` checks in component tests could be added post-MVP).

## Performance Considerations

Performance will be monitored throughout development to ensure a responsive user experience.

  * **Image Optimization:** Use optimized image formats (e.g., WebP where appropriate, SVG for icons). Native lazy loading (`loading="lazy"`) for offscreen images.
  * **Code Splitting & Lazy Loading:** As detailed in the Build section (Vite's route-based splitting, `React.lazy` for components).
  * **Minimizing Re-renders (React):**
      * Use `React.memo` for components that render frequently with the same props.
      * Optimize Zustand store selectors to prevent unnecessary re-renders if state structure becomes complex (though Zustand is generally quite optimized).
      * Avoid passing new object/array literals or inline functions as props directly in render methods where it can cause unnecessary re-renders of memoized components.
  * **Debouncing/Throttling:** Consider for event handlers tied to frequent events (e.g., window resize, potentially some input fields if they trigger heavy computations, though calculations are generally on-demand for MVP). Lodash `debounce`/`throttle` or custom hooks can be used.
  * **Virtualization:** If lists of assets, goals, or scenarios become very long (beyond MVP targets [cite: 1]), libraries like `TanStack Virtual` will be considered.
  * **Calculation Performance:** The core calculation engine must be designed efficiently. For MVP, calculations are primarily for CGT and qualitative scores [cite: 1] and should be quick. If future tax calculations become complex, offloading to web workers might be explored post-MVP.
  * **Performance Monitoring Tools:** Browser DevTools (Performance tab, Lighthouse), `React DevTools Profiler`.

## Internationalization (i18n) and Localization (l10n) Strategy

  * **Requirement Level:** Internationalization is **not a requirement for this Lean MVP**. All UI text will be in English.
  * **Future Considerations:** If i18n becomes a requirement post-MVP, a library like `react-i18next` would be evaluated. Code should be structured to make future i18n efforts easier (e.g., avoiding hardcoded strings directly in JSX where possible, though for MVP this is acceptable).

## Feature Flag Management

  * **Requirement Level:** Feature flags are **not a primary architectural concern for this Lean MVP**.
  * **Future Considerations:** If complex features are rolled out incrementally post-MVP, a simple environment variable based approach or a library like `Flagsmith` (if a backend is introduced) could be used.

## Frontend Security Considerations

Security for this client-side MVP focuses on protecting against common web vulnerabilities and ensuring user data (in `localStorage` and URLs) is handled appropriately.

  * **Cross-Site Scripting (XSS) Prevention:**
      * React's JSX auto-escaping will be relied upon for rendering dynamic content.
      * Explicit sanitization (e.g., using DOMPurify) will be implemented if any content is rendered using `dangerouslySetInnerHTML` (which should be avoided).
  * **Cross-Site Request Forgery (CSRF) Protection:** Not directly applicable to this client-side only MVP as there are no state-changing server-side requests tied to user sessions.
  * **Secure Data Handling (Client-Side):**
      * **`localStorage`:** While not inherently secure against sophisticated XSS or physical access, it's suitable for non-critically sensitive planning data for this personal MVP[cite: 1]. No passwords or payment information are stored.
      * **URL Sharing:** Plan data in URLs is compressed and encoded but not encrypted. Users should be implicitly aware that sharing a URL means sharing the plan data within it. The data is for estimation and planning, not highly sensitive PII beyond what the user inputs for their own use.
  * **Third-Party Script Security:** Minimize third-party scripts. If any are added (e.g., analytics post-MVP), use Subresource Integrity (SRI) where possible.
  * **Client-Side Data Validation:**
      * Implement thorough client-side validation for all user inputs (types, required fields, reasonable ranges for financial data) to improve UX and data integrity before it hits the store or calculations[cite: 1]. This is for UX, not a replacement for server-side validation if a backend were present.
  * **API Key Exposure:** Not applicable for MVP as there are no client-side consumed third-party APIs requiring keys.
  * **Secure Communication (HTTPS):** The application will be deployed via Cloudflare Pages, which enforces HTTPS.
  * **Dependency Vulnerabilities:** Regularly run `npm audit` (or `yarn audit`) during development and address high/critical vulnerabilities.

## Browser Support and Progressive Enhancement

  * **Target Browsers:** Latest 2 stable versions of Chrome, Firefox, Safari, and Edge. Internet Explorer is NOT supported.
  * **Polyfill Strategy:**
      * Modern browsers largely support ES6+ features used. Vite/Babel (`@vitejs/plugin-react`) will handle necessary transpilation.
      * Specific polyfills (e.g., via `core-js`) will be added only if a critical feature relies on something not broadly supported by the target browsers.
  * **JavaScript Requirement & Progressive Enhancement:**
      * Core application functionality REQUIRES JavaScript enabled in the browser. This is an SPA.
      * No specific progressive enhancement strategy for no-JS environments is planned for this interactive application.

## Change Log

| Change        | Date       | Version | Description                                          | Author                         |
| :------------ | :--------- | :------ | :--------------------------------------------------- | :----------------------------- |
| Initial Draft | May 29, 2025 | 0.1     | First draft based on PRD Lean MVP and UI/UX Spec. | Jane (Design Architect) & Vibe CEO |
