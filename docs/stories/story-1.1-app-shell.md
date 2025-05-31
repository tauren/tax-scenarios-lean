## Story 1.1: Initialize Basic Application Shell & "Active Plan" Naming

**Status:** Complete

**Story**
- As a user, I want a basic application shell to load in my browser, with a clear way to see the name of my current "Active Plan," so I can identify my work session.

**Dependencies**
- Story 1.0: Static Data - Required for `appConfigService.ts` and initial configuration data
- Architecture Documents: Required for `UserAppState` interface and other data models

**Acceptance Criteria (ACs)**
1.  When the application is loaded in a supported web browser, a basic UI shell is displayed. This shell includes placeholder areas for a header, main content, and footer.
2.  The UI shell prominently features an area where the name of the current "Active Plan" can be displayed.
3.  On initial application load, if no "Active Plan" name is found (e.g., in `localStorage`), the "Active Plan" name area may display a default placeholder (e.g., "Untitled Plan").
4.  The name for the "Active Plan" is held in the application's internal state (specifically in `activeUserAppState.activePlanInternalName` as defined in `architecture-lean-v1.2.md`). (Note: Persistent saving of this name to `localStorage` will be covered in Story 1.4).
5.  An initial `README.md` file is created at the project root, containing a project overview, basic setup instructions for developers, and high-level usage guidelines for the MVP.
6.  A basic `docs/` folder structure is established in the repository to house project documentation (such as this PRD, architecture documents, etc.).
7.  A Git repository for the project is initialized (e.g., on a platform like GitHub), and the initial project scaffolding (including base configuration files and the `README.md`) is committed.
8.  The basic application shell demonstrates foundational responsiveness, adapting its layout fluidly to different screen sizes (desktop, tablet, and mobile).
9.  This story does not include the implementation of any specific financial data input fields (beyond plan name), scenario creation logic, or calculation functionalities.

**Visual & Layout Reference (Conceptual Mockup)**

**Important Visual Reference:** The following TSX mockup file provides a conceptual visual layout, component positioning, sizing, and styling guide for the UI elements relevant to this story (specifically the main application shell, header, and footer). You should use this as a strong reference for the UI's appearance. However, implement the actual functionality, component structure, state management, and data flow strictly according to the detailed tasks in this story, the `front-end-architecture-v0.3.md`, `front-end-spec-v0.1.md`, and `architecture-lean-v1.2.md`.

**Mockup File:** `../../v0-mockups/components/main-application-layout.tsx`

**Critical Point:** The mockup designs provided may not contain every visual element described in this story. The mockups are not guarranteed to be feature complete. They should be used as a guideline and reference only. If this story specifies something is required that isn't in the mockup design, it still must be implmented.

**Tasks / Subtasks**
- [x] **Task 1: Set up Project Structure & Initial Files (AC: 5, 6, 7)**
    - [x] Create the main project directory.
    - [x] Initialize a Git repository (`git init`).
    - [x] Create a `README.md` file at the project root. Populate with: Project Title (Tax Scenarios Analyzer MVP), Brief Description (from PRD), Instructions for Developer Setup (Node.js version - e.g., latest LTS, Vite, **Package Manager: `npm`**, **Install command: `npm install`**), How to Run Dev Server (**`npm run dev`**), How to Build for Production (**`npm run build`**).
    - [x] Create a `docs/` directory at the project root. (Placeholders for PRD, Arch docs if not already there).
    - [x] Create a `.gitignore` file (e.g., for `node_modules/`, `dist/`, `.env.local`, common OS files).
    - [x] Make an initial Git commit of these files (e.g., "Initial project structure with README and docs folder").
- [x] **Task 2: Initialize Vite + React + TypeScript Project with Tailwind CSS & Shadcn UI following Official Guide (AC: 1, 8)**
    - [x] **Subtask 2.1: Follow Official Shadcn UI Vite Installation Guide:**
        - [x] Carefully follow all steps outlined in the official Shadcn UI documentation for Vite projects: **[https://ui.shadcn.com/docs/installation/vite](https://ui.shadcn.com/docs/installation/vite)**.
        - [x] This process will include:
            - Creating a Vite project with React and TypeScript (e.g., using `npm create vite@latest my-project -- --template react-ts`).
            - Adding and configuring Tailwind CSS (typically via PostCSS as per the guide, e.g., `npm install -D tailwindcss postcss autoprefixer` then `npx tailwindcss init -p`).
            - Configuring TypeScript paths (`baseUrl`, `paths` in `tsconfig.json`).
            - Updating `vite.config.ts` for path aliases.
            - Initializing Shadcn UI using `npx shadcn@latest init` and configuring `components.json`.
    - [x] **Subtask 2.2: Install Other Core Application Dependencies:**
        - [x] After completing the Shadcn UI setup, install the remaining core dependencies for our application using `npm`: `npm install react-router-dom zustand lz-string`. (Note: `lucide-react` is typically installed as part of `npx shadcn@latest init`).
    - [x] **Subtask 2.3: Set up Basic Project-Specific `src/` Directory Structure:**
        - [x] Create the initial `src/` directory subfolders as defined in `front-end-architecture-v0.3.md`: `app/`, `components/ui/`, `components/layout/`, `views/` (or `pages/`), `store/`, `services/`, `hooks/`, `lib/` (or `utils/`), `styles/` (ensure `index.css` from Tailwind setup is here), `types/`.
- [x] **Task 3: Create Basic Application Shell UI (AC: 1, 2, 8)**
    - [x] Create `App.tsx` in `src/app/` as the main application component.
    - [x] Implement a basic layout structure within `App.tsx` or using dedicated layout components from `../../v0-mockups/components/main-application-layout.tsx` as a strong visual guide for structure and styling:
        - Create `Header.tsx` in `src/components/layout/`.
        - Create `Footer.tsx` in `src/components/layout/`.
        - The `App.tsx` should render this Header, a main content area (e.g., using `<Outlet />` from `react-router-dom`), and the Footer. Refer to "Main Application Layout/Shell" in `front-end-spec-v0.1.md` for conceptual layout goals.
    - [x] Ensure the shell is responsive using Tailwind CSS utility classes, taking cues from the mockup.
    - [x] Set up basic routing using `react-router-dom` in `src/app/router.tsx` (define routes) and `src/app/main.tsx` (render `RouterProvider`). For this story, a single root route displaying `App.tsx` or a placeholder home view is sufficient.
- [x] **Task 4: Implement "Active Plan" Name Display in Header (AC: 2, 3, 4)**
    - [x] Create `userAppStateSlice.ts` in `src/store/` as per `front-end-architecture-v0.3.md`.
    - [x] Define the `UserAppState` interface (subset needed for this story: `activePlanInternalName: string`) in `src/types/index.ts`, aligning with `architecture-lean-v1.2.md`.
    - [x] Initialize a Zustand store in `src/store/index.ts` that uses this slice. The initial state for `activePlanInternalName` should be "Untitled Plan".
    - [x] In the `Header.tsx` component (visuals guided by `main-application-layout.tsx`):
        - Use the Zustand store to read `activePlanInternalName`.
        - Display this name prominently in the header.
- [x] **Task 5: Basic Styling and Application Entry Point (AC: 1, 8)**
    - [x] Ensure `src/app/main.tsx` correctly renders the `RouterProvider` (with the router from `router.tsx`) into the DOM's root element.
    - [x] Ensure Tailwind CSS base directives are in `src/styles/index.css` (or `src/index.css` if that's the Vite default) and that this CSS file is imported in `main.tsx`.
- [x] **Task 6: Verify Responsiveness and Basic Load (AC: 1, 8, 9)**
    - [x] Run the development server (e.g., `npm run dev`).
    - [x] Verify the basic application shell (Header, Content Area, Footer), based on `main-application-layout.tsx`, loads correctly.
    - [x] Test displaying the "Active Plan" name in the header.
    - [x] Check basic responsiveness of the shell layout using browser developer tools.
    - [x] Confirm that no financial data inputs or complex calculation logic are part of this story's output.

**Dev Technical Guidance**
-   **Focus:** This story is about establishing the project's skeleton: file structure, core dependencies, build setup, basic responsive shell (layout, header, footer), and the UI for displaying the active plan name.
-   **Visual Reference:** The `../../v0-mockups/components/main-application-layout.tsx` file is a key visual guide for the shell's layout, header, and footer appearance. Implement functional components based on this visual structure.
-   **Tech Stack:** Vite, React 19, TypeScript, Tailwind CSS, ShadCN UI (for setup and potentially simple UI elements), Zustand.
-   **Package Manager:** `npm` is to be used for all package management operations (e.g., `npm install`, `npm run dev`).
-   **Directory Structure:** Strictly follow `front-end-architecture-v0.3.md` for `src/` folder organization.
-   **State Management for Plan Name:** The `activePlanInternalName` should be managed in a Zustand store slice (`userAppStateSlice.ts`).
-   **`README.md` Content:**
    * Project Title: Tax Scenarios Analyzer MVP
    * Brief Description: (from PRD)
    * Developer Setup: Node.js (e.g., v20.x or LTS), Package Manager: `npm`, Install command: `npm install`.
    * Scripts: How to run dev server (`npm run dev`), How to build (`npm run build`).

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Created and updated project structure
    * Installed required dependencies
    * Created basic application shell components
    * Implemented Active Plan name display functionality
    * Set up routing and state management
    * Verified responsive layout and functionality
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Updated with Visual Reference - May 31, 2025 - Sarah (PO)
    * Implementation Started - May 31, 2025 - Dev Agent
    * Updated to remove editable name requirement - May 31, 2025 - Dev Agent
    * Implementation Completed - May 31, 2025 - Dev Agent
