# Tax Scenarios Analyzer MVP UI/UX Specification

**Version:** 0.1
**Date:** May 29, 2025
**Author:** Jane (Design Architect) & Vibe CEO (User)

## Introduction

This document defines the user experience (UX) goals, information architecture, user flows, and conceptual visual design specifications for the Minimum Viable Product (MVP) of the Tax Scenarios Analyzer. It is based on the "Tax Scenarios Analyzer MVP Product Requirements Document (PRD) v1.0."

* **Link to Primary Design Files:** *{To be added if/when a dedicated visual design file (e.g., Figma) is created}*
* **Link to PRD:** `prd-lean-v1.0.md`

## Overall UX Goals & Principles

* **Target User Personas:**
    * Individuals exploring tax residency changes who need a tool to gain a general understanding of potential financial benefits (particularly from a capital gains perspective) and to assess qualitative lifestyle fits before seeking professional advice[cite: 1].
    * Users are expected to be comfortable with inputting financial data and navigating web applications. For the MVP, the primary user is the developer themself, which allows for a focus on core functionality and usability from that perspective initially[cite: 1].

* **Usability Goals:**
    * **Intuitive & Learnable:** The application should be easy to understand and use with minimal guidance. New users should be able to grasp the basic workflow of creating scenarios, inputting data for capital gains planning, and comparing results effectively. The inclusion of example scenarios will support this[cite: 1].
    * **Efficient:** Users should be able to efficiently manage scenarios and input data, especially for capital gains tax planning and qualitative assessments. Interaction paradigms like form-based input and item duplication in lists should enhance efficiency[cite: 1].
    * **Clarity:** Information, especially capital gains estimations, financial outcomes, and qualitative scores, must be presented clearly and unambiguously. Prominent disclaimers regarding the estimation nature of the tool are crucial[cite: 1].
    * **Empowering:** The tool should empower users to explore different tax residency options and make more informed initial decisions regarding capital gains and lifestyle impacts[cite: 1].
    * **Error Prevention & Guidance:** The UI should guide users to prevent common input errors, and any error messages must be clear and helpful[cite: 1].

* **Design Principles:**
    1.  **Modern & Minimalist:** The user interface should have a clean, contemporary aesthetic, avoiding unnecessary clutter to keep the focus on data input and analysis[cite: 1].
    2.  **Intuitive Exploration:** The design must facilitate easy exploration of different scenarios and their financial (CGT-focused) and qualitative outcomes[cite: 1].
    3.  **Clarity & Transparency:** Prioritize clear presentation of complex information. Be transparent about the tool's scope, its focus on capital gains estimations for MVP, and its limitations (e.g., not providing professional advice or calculating other tax types)[cite: 1].
    4.  **Responsive & Accessible:** Ensure a good user experience primarily on web desktops, with responsive design for usability on mobile devices. Strive for a good baseline level of accessibility[cite: 1].
    5.  **Focused on Core Value:** For the MVP, every design choice should support the core value proposition: comparing capital gains tax estimations and qualitative lifestyle factors[cite: 1].

## Information Architecture (IA)

* **Site Map / Screen Inventory:**

    The following are the key screens/views identified for the Tax Scenarios Analyzer MVP:

    1.  **"Get Started" Screen:** Initial landing page for new users (if no plan in `localStorage`), offering choices to start with an example or blank plan template.
    2.  **"Active Plan Dashboard" / Main View:** The central hub after a plan is loaded. Displays the editable plan name and provides primary navigation to global settings and scenario management.
    3.  **"Asset Management" View:** Dedicated screen for users to define, view, edit, and delete financial assets for the Active Plan.
    4.  **"My Personal Goals" Management View:** Dedicated screen for users to define, weight, and manage their personal goals for qualitative assessment.
    5.  **"Scenario Hub / Comparison Dashboard" View:** Displays Scenario Summary Cards and the Overview Comparison Table; allows users to initiate adding new scenarios or select existing ones for editing or detailed viewing.
    6.  **"Scenario Editor View":** A detailed, multi-section (possibly tabbed) view for defining and modifying all aspects of a single scenario (core details, financials including CGT rates, planned asset sales, special tax features, qualitative attributes).
    7.  **"Detailed Scenario View":** A read-only view providing an in-depth breakdown of a single selected scenario's year-by-year financial projections and its detailed qualitative assessment.

    Conceptually, the flow can be visualized as:

    ```mermaid
    graph TD
        A["App Launch"] --> B{"Plan in localStorage?"};
        B -- No --> C["Get Started Screen"];
        B -- Yes --> D["Active Plan Dashboard"];
        C -- "Select Example/Blank Plan" --> D;
        D --- E["Asset Management View"];
        D --- F["'My Personal Goals' Management View"];
        D --- G["Scenario Hub / Comparison Dashboard"];
        G -- "Add/Edit Scenario" --> H["Scenario Editor View"];
        G -- "View Scenario Details" --> I["Detailed Scenario View"];
        H -- "Done Editing" --> G;
        I -- "Back" --> G;
    ```

* **Navigation Structure:**
    * **Main Application Shell:** Contains a persistent header.
        * The header displays the application title and the *non-editable* name of the "Active Plan".
        * The header includes a "Share Plan" button/icon.
        * There is no persistent global navigation sidebar in the MVP.
    * **Primary Navigation:**
        * **Onboarding:** If no plan exists in `localStorage`, the user is presented with the "Get Started" screen, from which they navigate by choosing a plan template.
        * **Main Hub:** Once a plan is active, the **"Active Plan Dashboard"** serves as the primary navigation hub. From here, users navigate to:
            * "Asset Management" view (e.g., via a dedicated card/button).
            * "My Personal Goals" Management view (e.g., via a dedicated card/button).
            * "Scenario Hub / Comparison Dashboard" view (e.g., via a dedicated card/button).
        * The **"Active Plan Dashboard"** is also where the Active Plan name is viewed and made editable (click-to-edit mechanism).
    * **Contextual Navigation:**
        * Within the "Scenario Hub / Comparison Dashboard," users can:
            * Initiate adding a new scenario (which leads to the "Select a Starting Point" interface, then to the "Scenario Editor View").
            * Select an existing scenario to edit (leading to the "Scenario Editor View").
            * Select an existing scenario to view its details (leading to the "Detailed Scenario View").
        * Within the "Scenario Editor View" and "Detailed Scenario View," clear "Back" buttons or similar mechanisms will allow users to return to the "Scenario Hub / Comparison Dashboard."
        * Similarly, the "Asset Management" and "My Personal Goals" Management views will have clear navigation back to the "Active Plan Dashboard."

## User Flows

This section details the key user tasks and interaction sequences within the Tax Scenarios Analyzer MVP.

### 1. User Flow: Initial Setup & First Use

* **Goal:** To launch the application, either seamlessly resume a previous session, or if it's a new session, to choose between exploring pre-configured example scenarios (focused on Capital Gains Tax) or starting a new plan from a clean template. Subsequently, establish an identifiable working session by naming their "Active Plan" and define their initial financial assets.

* **Steps / Diagram:**

    ```mermaid
    graph TD
        A[App Launch] --> B{Plan in localStorage?};
        B -- Yes --> C[Load Active Plan from localStorage];
        C --> F[Edit Active Plan Name (on Dashboard)];
        B -- No --> D["Display 'Get Started' Screen"];
        D --> E1["Select Example Scenario"];
        D --> E2["Select 'Blank Plan' Template"];
        E1 --> C2[Load Plan from Example Template];
        E2 --> C3[Load Plan from Blank Template];
        C2 --> F;
        C3 --> F;
        F --> G[Navigate to Asset Management];
        G --> H[Add/Edit Assets];
        H --> D2["Return to Active Plan Dashboard"];
    ```

    **Summary of Steps:**
    1.  User launches the application.
    2.  System checks `localStorage` for an existing "Active Plan."
        * If found, loads it, and the user resumes their session (proceeds to step 4 or other activities).
        * If not found, the "Get Started" screen is displayed.
    3.  From the "Get Started" screen (if shown), the user selects either an "Example Scenario" or the "Start with a Blank Plan" option. The selected template data is loaded as the new Active Plan.
    4.  User is effectively on the "Active Plan Dashboard." They can edit the Active Plan name (if desired, via click-to-edit on the dashboard).
    5.  User navigates to the "Asset Management" view.
    6.  User adds/edits their assets.
    7.  User can then navigate back to the "Active Plan Dashboard" or other sections.

### 2. User Flow: Baseline Scenario Creation & Core Data Input

* **Goal:** To establish their primary "Baseline Scenario" within the Active Plan by selecting a starting point (from a list including pre-configured global example templates or a global "blank" template – noting that the option to copy an existing scenario won't be practically available if this is truly the first scenario), then defining its location, and inputting essential financial context such as gross income (for overview, not taxed by the MVP engine), annual expenses, and the effective Capital Gains Tax rates specifically for this baseline.

* **Steps / Diagram:**

    ```mermaid
    graph TD
        A[From "Active Plan Dashboard"] --> B["User Initiates 'Create Baseline Scenario' (or 'Add New Scenario' if Baseline already exists and they want another)"];
        B --> C["Display 'Select a Starting Point' Interface"];
        C --> D{"Choose Source:"};
        D -- "Global Example Template" --> E[Deep-copy Example];
        D -- "Global 'Blank' Template" --> F[Deep-copy Blank Template];
        D -- "Existing Scenario in Plan (if any exist)" --> G[Deep-copy Existing Scenario];
        E --> H["New Scenario Created (Designated as Baseline if first)"];
        F --> H;
        G --> H;
        H --> I["User Names/Confirms Scenario Name"];
        I --> J["Open 'Scenario Editor View' for this new Baseline Scenario"];
        J --> K["User Inputs/Edits: Location, Gross Income (context), Expenses, Effective CGT Rates, etc."];
        K --> L["Data Auto-Saved to Active Plan"];
        L --> M["User Navigates Back to Dashboard or Scenario Hub"];
    ```

    **Summary of Steps:**
    1.  From the "Active Plan Dashboard," the user initiates the creation of a new scenario. (If this is the very first scenario, it will be designated as the Baseline).
    2.  The system displays the "Select a Starting Point" interface. This interface *always* attempts to list choices from three categories:
        * Global Example Templates (from `AppConfig`).
        * The Global "Blank" Template (from `AppConfig`).
        * Any of the user's Existing Scenarios within the current Active Plan (this list will naturally be empty if no scenarios have been created yet).
    3.  The user selects their desired starting point from the available options.
    4.  The system performs a deep copy of the selected source data to create a new scenario object. If it's the first scenario, it's designated as the Baseline.
    5.  The user is prompted to name (or confirm/edit the default name for) this new scenario.
    6.  The "Scenario Editor View" opens for this newly created scenario, pre-filled with data from the chosen starting point.
    7.  Within the editor, the user inputs or modifies core attributes: Location details, Gross Income figures (for context only), Annual Expenses, and importantly, the effective Short-Term and Long-Term Capital Gains Tax rates. Projection period and residency start date can also be set.
    8.  All changes are continuously auto-saved to the Active Plan in `localStorage`.
    9.  The user can then navigate away from the editor.

### 3. User Flow: Comparison Scenario Management

* **Goal:** To add and refine multiple "Comparison Scenarios" within the Active Plan. This involves creating new scenarios by selecting a starting point (global example, blank template, or copying an existing scenario), then customizing their specific details such as location, contextual gross income, expenses, effective Capital Gains Tax rates, planning asset sales (with gain/loss previews), and applying relevant Special Tax Features (STFs) to model different potential outcomes.

* **Steps / Diagram:**

    ```mermaid
    graph TD
        A[From "Scenario Hub / Comparison Dashboard"] --> B["Click 'Add New Scenario'"];
        B --> C["Display 'Select a Starting Point' Interface"];
        C --> D{"Choose Source:"};
        D -- "Global Example Template" --> E[Deep-copy Example];
        D -- "Global 'Blank' Template" --> F[Deep-copy Blank Template];
        D -- "Existing Scenario in Plan" --> G[Deep-copy Existing Scenario];
        E --> H["New Comparison Scenario Created"];
        F --> H;
        G --> H;
        H --> I["User Names/Confirms Scenario Name"];
        I --> J["Open 'Scenario Editor View' for this Comparison Scenario"];
        J --> K["Edit Core Data (Location, CGT Rates, Income, Expenses)"];
        J --> L["Manage 'Planned Asset Sales' (with gain/loss preview)"];
        J --> M["Configure 'Special Tax Features' (STFs)"];
        K --> N["Data Auto-Saved"];
        L --> N;
        M --> N;
        N --> O["User Navigates Back to Scenario Hub"];
    ```

    **Summary of Steps:**
    1.  From the "Scenario Hub / Comparison Dashboard," the user initiates the creation of a new "Comparison Scenario" (e.g., by clicking "Add New Scenario").
    2.  The system displays the unified "Select a Starting Point" interface (offering Global Examples, Global Blank, or User's Existing Scenarios).
    3.  The user selects their desired starting point.
    4.  The system performs a deep copy, creates a new scenario object, and the user names/confirms the name for this new Comparison Scenario.
    5.  The "Scenario Editor View" opens for this new Comparison Scenario.
    6.  Within the editor, the user:
        * Edits core data: Location, effective Capital Gains Tax rates, contextual Gross Income, Annual Expenses, etc..
        * Navigates to the "Planned Asset Sales" section to add/edit planned sales, receiving an immediate estimated capital gain/loss preview for each transaction.
        * Navigates to the "Special Tax Features" (STF) section to browse, select, and configure STFs, including providing scenario-specific asset tax details if an STF `requiresGainBifurcation`.
    7.  All changes are continuously auto-saved to the Active Plan.
    8.  The user can then navigate away from the editor (e.g., back to the "Scenario Hub / Comparison Dashboard").

### 4. User Flow: Qualitative Assessment Setup

* **Goal:** To define personal lifestyle priorities by selecting and weighting qualitative goals, and then for each scenario, to customize how pre-defined location attributes (linked to these goals) apply to them, ultimately enabling the system to calculate a "Qualitative Fit Score" for each scenario.

* **Steps / Diagram:**

    ```mermaid
    graph TD
        A[From "Active Plan Dashboard"] --> B["Navigate to 'My Personal Goals' Management"];
        B --> C["View/Manage List of Personal Goals"];
        C --> D["Add New Goal"];
        D -- Select from Global Concept --> E["Personalize Name/Description"];
        E --> F["Assign Weight (Low, Medium, High, Critical)"];
        F --> C;
        C --> G["Edit Existing Goal (Name, Description, Weight)"];
        G --> C;
        C --> H["Navigate Back to Active Plan Dashboard"];
        
        H2[From "Scenario Editor View" for a specific scenario] --> I["Navigate to 'Scenario Attributes for Personal Goals' Section"];
        I --> J["View/Manage Scenario Attributes"];
        J --> K["Customize 'userSentiment' & 'significanceToUser' for an Attribute"];
        K --> J;
        J --> L["Add New Attribute to Scenario (from Global Concepts)"];
        L --> M["Define 'userSentiment' & 'significanceToUser' for new attribute"];
        M --> J;
        
        N[System: Any change to Goals or Scenario Attributes] --> O["Recalculate 'Qualitative Fit Score' for affected Scenarios"];
        O --> P["Score updated in Scenario Editor, Summary Cards, Overview Table"];

    ```

    **Summary of Steps:**

    **Part 1: Defining Personal Goals (Global for Active Plan)**
    1.  From the "Active Plan Dashboard," the user navigates to the "My Personal Goals" Management view.
    2.  The user views their list of existing personal goals (if any).
    3.  To add a new goal, the user selects a base concept from the `appConfig.globalQualitativeConcepts`, can personalize its name and description, and assigns a weight (e.g., Low, Medium, High, Critical).
    4.  The user can also edit the personalized name, description, and weight of any existing goal.
    5.  Changes are saved to the Active Plan.

    **Part 2: Customizing Scenario-Specific Attributes for Personal Goals**
    6.  The user navigates to the "Scenario Editor View" for a specific scenario.
    7.  Within the editor, they access the section for "Scenario Attributes for Personal Goals".
    8.  For each attribute listed (potentially pre-populated from a template), the user can customize their `userSentiment` (e.g., Positive, Neutral, Negative) and `significanceToUser` (None, Low, Medium, High) specifically for that scenario.
    9.  The user can also add new attributes to the current scenario by selecting from the `GlobalQualitativeConcepts` list and then defining their perspective (sentiment, significance) for it within that scenario.
    10. These customizations are saved as part of that specific scenario's data within the Active Plan.

    **Part 3: System Recalculation (Implied)**
    11. Whenever personal goals (or their weights) or any scenario's specific attributes are modified, the system automatically recalculates the "Qualitative Fit Score" for all affected scenarios.
    12. This updated score is then reflected in all relevant display areas (e.g., within the Scenario Editor for the current scenario, on Scenario Summary Cards, and in the Overview Comparison Table).

### 5. User Flow: Scenario Comparison & Analysis

* **Goal:** To compare different scenarios side-by-side, understand their key financial (especially Capital Gains Tax implications) and qualitative differences, and dive deep into the specifics of any given scenario to make informed initial assessments.

* **Steps / Diagram:**

    ```mermaid
    graph TD
        A[From "Scenario Hub / Comparison Dashboard"] --> B["View 'Scenario Summary Cards'"];
        B -- Select/Deselect Scenarios for Comparison --> C["'Overview Comparison Table' Updates Dynamically"];
        C -- Sort Table by Metrics --> C;
        B -- Click 'View Details' or Card itself --> D["Navigate to 'Detailed Scenario View' for selected scenario"];
        D --> E["View Year-by-Year Financials (CGT Focus)"];
        D --> F["View Detailed Qualitative Assessment (with contribution hints)"];
        E --> G["Navigate Back to Scenario Hub"];
        F --> G;
    ```

    **Summary of Steps:**
    1.  The user is on the "Scenario Hub / Comparison Dashboard."
    2.  The system displays "Scenario Summary Cards" for all scenarios in the Active Plan. Each card shows key aggregated metrics like total estimated Capital Gains Tax, net financial outcome, the scenario's Qualitative Fit Score, and a control to select it for the main comparison table.
    3.  The "Overview Comparison Table" is also displayed, showing data only for the scenarios currently selected by the user via their summary cards. This table includes columns for key financial metrics (Total Gross Income, Total Expenses, Total Estimated Capital Gains Tax, Total Net Financial Outcome) and the Qualitative Fit Score, allowing side-by-side comparison.
    4.  The user can select or deselect scenarios using the controls on the summary cards, and the "Overview Comparison Table" updates dynamically.
    5.  The user can sort the "Overview Comparison Table" by any of its metric columns (e.g., by CGT, Net Financial Outcome, or Qualitative Fit Score).
    6.  To analyze a scenario in greater depth, the user clicks on its "Scenario Summary Card" or a dedicated "details" link/button.
    7.  The system navigates to the "Detailed Scenario View" for the selected scenario.
    8.  In the "Detailed Scenario View," the user can see:
        * A year-by-year breakdown of financial projections, emphasizing Capital Gains Tax, contextual gross income, expenses, and net outcomes.
        * A detailed list of the scenario's attributes related to personal goals, showing the user's sentiments/significance, and an indication of how these contributed to the overall Qualitative Fit Score.
    9.  The user can navigate back from the "Detailed Scenario View" to the "Scenario Hub / Comparison Dashboard".

### 6. User Flow: Sharing the Active Plan

* **Goal:** To generate a shareable link for their current Active Plan to either back it up, share it with others, or move it between devices, and also to be able to load a plan (including pre-configured example scenarios) from such a link, with appropriate safeguards for existing work.

* **Steps / Diagram:**

    ```mermaid
    graph TD
        A[Active Plan Ready] --> B["User Edits/Confirms Active Plan Name (on Dashboard)"];
        B --> C["User Clicks 'Share Plan' Button (in Main Header)"];
        C --> D["System Generates Dual URLs: Overview Link + Deep Link"];
        D --> E["SharePlanDialog: Display Context-Aware Link Options"];
        E --> F{Current Page Type?};
        F -- "Overview-Type (/,/overview)" --> G["Show Single 'Share Plan' Option"];
        F -- "Feature Page" --> H["Show Dual Options: Overview (Default) + Deep Link"];
        G --> I["User Copies Overview Link"];
        H --> J["User Chooses and Copies Preferred Link Type"];
        I --> K[User Shares URL];
        J --> K;

        subgraph Loading a Shared Plan
            L[User Opens App with Shared URL in Address Bar] --> M["System Detects Plan Data in URL"];
            M --> N{URL Data Valid?};
            N -- No --> O["Error Message; Load Local Plan or Show 'Get Started' Screen"];
            N -- Yes --> P["Parse URL Data into Plan Object"];
            P --> Q{Current Active Plan has Significant Data?};
            Q -- Yes --> R["Prompt: 'Load New Plan & Discard Current Work?' or 'Cancel'"];
            R -- "Load New" --> S["Replace Current Active Plan with URL Plan Data"];
            R -- "Cancel" --> T["Keep Current Active Plan; URL Plan Not Loaded"];
            Q -- No --> S;
            S --> U["UI Updates with Loaded Plan"];
            U --> V{Loaded from Deep Link?};
            V -- Yes --> W["Show Contextual Toast with Navigation Help"];
            V -- No --> X["Standard Load Complete"];
        end
    ```

    **Summary of Steps:**

    **Part 1: Generating a Shareable URL (Enhanced with Dual Links)**
    1.  The user ensures their "Active Plan" is named as desired (editable on the "Active Plan Dashboard").
    2.  The user clicks the "Share Plan" button located in the main application header.
    3.  The system generates two URL types:
        - **Overview Link**: Always directs to `/overview?planData=[encodedString]` (recommended for general sharing)
        - **Deep Link**: Preserves current path (e.g., `/scenarios/1/edit?planData=[encodedString]`) for focused discussions
    4.  The SharePlanDialog displays context-aware options:
        - **On overview-type pages** (/ or /overview): Shows single "Share Plan" option (overview link)
        - **On feature pages**: Shows dual options with clear descriptions and visual hierarchy
    5.  The overview link is automatically copied to clipboard by default, with manual copy options available for both link types.
    6.  Clear feedback is provided for successful copy actions with context-appropriate messages.

    **Part 2: Loading a Plan from a Shared URL (Enhanced with Deep Linking)**
    5.  The user (or another person) opens the application by navigating to a URL that includes the shared plan data string. The URL preserves the original path for natural deep linking.
    6.  The system detects and attempts to parse, decompress, and deserialize the plan data from the URL.
        * If the URL data is invalid or cannot be parsed, an error is indicated, and the application falls back to loading any plan from `localStorage` or showing the "Get Started" screen.
    7.  If the URL data is valid:
        * The system checks if the *current* Active Plan (already in memory from `localStorage` or a new empty session) contains "significant user-entered data".
        * If significant data exists, the user is prompted to either "[Load New Plan from Link & Discard Current Work]" or "[Cancel]".
        * If the user chooses to load (or if no significant data was present in the current plan, or if they confirm the overwrite), the data from the URL becomes the new Active Plan.
        * **Deep Link Enhancement**: If the user arrives on a non-overview page via shared link, a contextual toast appears providing guidance and a quick navigation option to the overview.
        * The UI updates to reflect this newly loaded plan while preserving the intended destination path.
        * If the user chooses to cancel, the current Active Plan remains unchanged.

## Wireframes & Mockups

This section describes the conceptual layout and key elements for the main screens and views of the Tax Scenarios Analyzer MVP. Detailed visual designs and interactive prototypes would typically be housed in a dedicated design file (e.g., Figma), which would be linked here:

* **Link to Primary Design Files:** *{To be added if/when a dedicated visual design file (e.g., Figma) is created}*

### 1. Screen / View Name: "Get Started" Screen

* **Purpose:** To welcome new users (without an existing plan in `localStorage`) and provide immediate card-based options for starting their planning session: exploring pre-configured example scenarios or starting with a fresh, blank plan template.
* **Conceptual Layout & Key Elements:**
    * A welcoming message or a brief tagline.
    * A clear heading like "Get Started" or "How would you like to begin?"
    * A collection of clickable cards (styled akin to ShadCN `Card` components), arranged in a grid or flexbox:
        * **"Start with a Blank Plan" Card:** Positioned prominently (e.g., first or visually highlighted). Displays text like "Start with a Blank Plan" and a brief description (e.g., "Build your plan from scratch"). Clicking this card loads the minimal blank template.
        * **"Example Scenario" Cards:** One card for each pre-configured example (e.g., "CGT Savings in Portugal"). Each card would display the example's name and a brief one-liner description. Clicking an example card loads its respective template.
    * The overall design focuses on clarity, ease of choice, and minimal clutter.

### 2. Screen / View Name: "Main Application Layout/Shell"

* **Purpose:** To provide a consistent and persistent framework for all application views and interactions. It houses global elements like the application header and the main content area where different views are rendered, establishing the overall visual tone and responsiveness.
* **Conceptual Layout & Key Elements:**
    * **Header (Persistent, Fixed Top):**
        * Application Title/Logo: A minimalist display (e.g., text "Tax Scenarios Analyzer").
        * "Active Plan" Name Display: Shows the name of the current Active Plan as **display-only text** (actual editing occurs on the "Active Plan Dashboard").
        * "Share Plan" Button/Icon: A clear clickable element to trigger the plan sharing (URL generation) functionality.
        * The header will be styled cleanly, consistent with ShadCN UI aesthetics.
    * **Main Content Area:**
        * This is the primary section below the header where all other specific views ("Get Started," "Active Plan Dashboard," "Scenario Editor," etc.) will be dynamically rendered.
    * **Footer (Optional, Persistent, Fixed Bottom):**
        * A simple, unobtrusive bar.
        * May contain copyright information, application version, and/or a link to disclaimers/limitations of the tool.
    * **Navigation:** Global navigation elements (like a persistent sidebar) are minimal for the MVP. Navigation is primarily contextual, driven from the "Active Plan Dashboard" or within specific views (e.g., "Back" buttons).
    * **Responsiveness:** The overall shell structure (header, content area, footer) will be designed to be responsive, ensuring a good user experience on both desktop (primary) and mobile devices.

### 3. Screen / View Name: "Active Plan Dashboard" / Main View

* **Purpose:**
    * To act as the central landing page and primary navigation hub for the currently loaded "Active Plan."
    * To allow users to view and directly edit the name of their Active Plan.
    * To provide clear access points for managing plan-wide settings (like assets and personal goals).
    * To act as the gateway for creating, viewing, editing, and comparing all scenarios within the Active Plan.
* **Conceptual Layout & Key Elements:**
    * **"Active Plan" Name Display & Editor:**
        * Prominently displays the name of the Active Plan.
        * This display utilizes a "click-to-edit" mechanism: it appears as non-editable text by default, with a small "edit" icon (e.g., pencil icon) alongside it. Clicking either the name text or the edit icon transforms it into an inline editable input field.
        * Upon confirming the edit (e.g., via Enter key or blur event), the input field reverts to displaying the updated name as non-editable text. This change is saved to the Active Plan.
    * **Main Action Sections/Cards:**
        * A series of prominent, clearly labeled clickable elements, potentially styled as ShadCN `Card` components:
            * **"Manage Assets" Card/Link:**
                * Title: "My Assets" or "Manage Assets."
                * Brief Description: e.g., "Define and update your financial assets for this plan."
                * Action: Navigates the user to the dedicated "Asset Management" screen/view.
            * **"My Personal Goals" Card/Link:**
                * Title: "My Personal Goals" or "Define Personal Goals."
                * Brief Description: e.g., "Set up and weight the lifestyle factors important to you."
                * Action: Navigates the user to the dedicated "My Personal Goals" Management screen/view.
            * **"Scenarios & Comparison" Card/Link:**
                * Title: "Scenarios & Comparison" or "View & Manage Scenarios."
                * Brief Description: e.g., "Create, edit, and compare your different tax residency scenarios."
                * Action: Navigates the user to the "Scenario Hub / Comparison Dashboard" view.
    * **Optional Contextual Information:**
        * A brief, unobtrusive summary (e.g., "Assets: 5 | Goals: 3 | Scenarios: 2").
    * **Layout:**
        * A clean, dashboard-style layout. The action cards/links should be arranged logically to create an intuitive "home base."

### 4. Screen / View Name: "Asset Management" View
*(This screen is accessed from the "Manage Assets" card/link on the "Active Plan Dashboard")*

* **Purpose:**
    * To allow users to define, view, edit, and delete all financial assets that will be available for planning sales across all scenarios within their current Active Plan.
* **Conceptual Layout & Key Elements:**
    * **Title:** A clear title such as "My Assets" or "Manage Plan Assets."
    * **Asset List/Table:**
        * A primary area displaying all currently defined assets for the Active Plan, likely using a ShadCN `Table` for structured presentation.
        * Columns would include key asset details: Name, Quantity, Cost Basis/Unit, Acquisition Date, Asset Type (if provided), and FMV/Unit (if provided).
        * Each row representing an asset would have controls for "Edit" and "Delete" (with a confirmation prompt for deletion).
        * A "Duplicate" button/icon could also be available for each asset to quickly create a similar one.
    * **"Add New Asset" Button:** A prominent clickable element (e.g., ShadCN `Button`) to initiate the creation of a new asset.
    * **Asset Entry/Edit Form:**
        * This form would likely appear in a ShadCN `Dialog` (modal) or `Sheet` (side panel) when adding a new asset or editing an existing one, providing a focused experience.
        * Fields in the form would include:
            * Asset Name (required text input).
            * Quantity (required numeric input).
            * Cost Basis/Unit (required numeric input).
            * Acquisition Date (required, using a date picker).
            * Asset Type (optional, perhaps a dropdown or free text).
            * FMV/Unit (optional numeric input).
        * Form actions would include "Save" and "Cancel" buttons.
        * An option like "Save and Add Another" could be included for efficiency when adding multiple assets.
    * **Navigation:** A clear way to navigate back to the "Active Plan Dashboard" (e.g., a "Back" button or breadcrumb).

### 5. Screen / View Name: "My Personal Goals" Management View
*(This screen is accessed from the "Define Personal Goals" or similar card/link on the "Active Plan Dashboard")*

* **Purpose:**
    * To allow users to define and manage their list of personal goals (which the system uses for qualitative assessment). This involves selecting from a master list of general concepts (like "Good Weather," "Access to Healthcare"), personalizing their names and descriptions if desired, and assigning a weight to each goal to reflect its importance to the user. These weighted goals are then used to calculate the "Qualitative Fit Score" for scenarios.
* **Conceptual Layout & Key Elements:**
    * **Title:** A clear title such as "My Personal Goals" or "Define My Goals."
    * **Goal List/Table:**
        * A primary area displaying all currently defined personal goals for the Active Plan. This could use a ShadCN `Table` or a series of `Card` components.
        * For each goal, the display should include:
            * Personalized `name` (user-editable).
            * The underlying `category` (derived from the selected global concept).
            * Personalized `description` (user-editable).
            * Assigned `weight` (e.g., "Low," "Medium," "High," "Critical" - displayed and editable).
        * Each listed goal would have controls for "Edit" and "Delete" (with a confirmation prompt for deletion).
    * **"Add New Goal" Button:** A prominent clickable element (e.g., ShadCN `Button`) to initiate the creation of a new personal goal.
    * **Add/Edit Goal Form:**
        * This form would likely appear in a ShadCN `Dialog` (modal) or `Sheet` (side panel).
        * Fields/Controls in the form would include:
            * **Select Base Concept:** A mechanism (e.g., ShadCN `Combobox` or categorized `Select`) for the user to choose a base `GlobalQualitativeConcept` from the `appConfig.globalQualitativeConcepts` list (displaying concept names).
            * **Personalized Name:** Text input for the goal's name (may pre-fill from the selected global concept's name).
            * **Personalized Description:** Text area for the goal's description (may pre-fill from the selected global concept's description).
            * **Assign Weight:** A selection control (e.g., ShadCN `Select` or `RadioGroup`) for choosing the weight (e.g., "Low," "Medium," "High," "Critical").
        * Form actions would include "Save" and "Cancel" buttons.
    * **Navigation:** A clear way to navigate back to the "Active Plan Dashboard" (e.g., a "Back" button or breadcrumb).

### 6. Screen / View Name: "Scenario Hub / Comparison Dashboard" View
*(This screen is accessed from the "View & Manage Scenarios" card/link on the "Active Plan Dashboard")*

* **Purpose:**
    * To provide a comprehensive overview of all scenarios (Baseline and Comparison) within the Active Plan.
    * To serve as the primary entry point for creating new scenarios or selecting existing ones for editing or detailed viewing.
    * To display the main comparison tools: "Scenario Summary Cards" and the "Overview Comparison Table," allowing users to analyze scenarios side-by-side.
* **Conceptual Layout & Key Elements:**
    * **Title:** A clear title such as "My Scenarios & Comparison" or "Scenario Dashboard."
    * **"Add New Scenario" Button:** A prominent clickable element (e.g., ShadCN `Button`). Clicking this initiates the unified scenario creation flow by opening the "Select a Starting Point" interface.
    * **Scenario Summary Cards Area:**
        * This section dynamically displays a "Scenario Summary Card" (e.g., using ShadCN `Card`) for each scenario currently in the Active Plan.
        * Each card should clearly display:
            * The scenario's `displayLocationName` (or custom name).
            * Key aggregated financial outcomes: Total Net Financial Outcome and Total Estimated Capital Gains Tax.
            * The scenario's calculated `QualitativeFitScore`.
            * An "Edit" button/link to navigate to the "Scenario Editor View."
            * A "View Details" button/link (or making the card itself clickable) to navigate to the "Detailed Scenario View."
            * A "Delete" option/icon (with confirmation).
            * A selection control (e.g., ShadCN `Checkbox` or `Switch`) to include/exclude this scenario from the "Overview Comparison Table".
        * Cards could be arranged in a responsive grid or list.
    * **Overview Comparison Table Area:**
        * This section displays the "Overview Comparison Table" (e.g., using ShadCN `Table`).
        * The table dynamically updates to show data *only* for the scenarios selected via their summary cards.
        * It presents key metrics side-by-side for the selected scenarios. Columns represent scenarios (headed by `displayLocationName`), and rows represent metrics (or vice-versa).
        * Metrics to include: Total Gross Income (for context), Total Expenses, **Total Estimated Capital Gains Tax**, Total Net Financial Outcome, and the `QualitativeFitScore`.
        * All metric columns should be sortable.
    * **Navigation:** A clear way to navigate back to the "Active Plan Dashboard."

### 7. Screen / View Name: "Scenario Editor View"
*(This screen is accessed by clicking "Edit" on a Scenario Summary Card or by creating a new scenario from the "Scenario Hub / Comparison Dashboard")*

* **Purpose:**
    * To allow users to define and modify all aspects of a single scenario (Baseline or Comparison). This includes its core identifying information, financial parameters (with a focus on those affecting Capital Gains Tax), planned asset sales, special tax features, and its specific attributes for "Personal Goals" assessment.
* **Conceptual Layout & Key Elements:**
    * **Title:** Clearly indicates which scenario is being edited (e.g., "Editing: [Scenario Display Name]").
    * **Tabbed or Sectioned Interface:** Using ShadCN `Tabs` or distinct, clearly headed expandable sections. Potential tabs/sections:
        * **1. Core Details & Financials:**
            * `displayLocationName` (editable text input).
            * Location components (`locationCountry`, `locationState`, `locationCity` - editable inputs).
            * Projection Period (e.g., `projectionPeriodYears` - editable numeric input).
            * Residency Start Date (optional, editable date picker).
            * **Effective Capital Gains Tax Rates:** Clear input fields for Short-Term and Long-Term CGT rates for *this specific scenario*.
            * **Gross Income (for context):** Interface to add/edit/delete `IncomeSource` objects (Name, Type, Annual Amount, Start/End Year). Reminder: income not taxed by MVP engine.
            * **Annual Expenses:** Interface to manage `AnnualExpense` categories and `additionalCosts`.
        * **2. Planned Asset Sales:**
            * Dedicated area to manage `PlannedAssetSale` entries for this scenario.
            * UI to add new planned sales (selecting asset, specifying year, quantity, sale price).
            * List of existing planned sales with edit/delete.
            * **Crucial Feature:** Immediate estimated capital gain/loss preview displayed dynamically for individual sale transactions, attempting to differentiate ST/LT gains and account for gain bifurcation if relevant STFs are active.
        * **3. Special Tax Features (STF):**
            * Interface to browse available `globalSpecialTaxFeatures` (displaying name, description, eligibility hints).
            * Mechanism to select/deselect STFs.
            * For selected STFs, input fields for required parameters.
            * If an active STF `requiresGainBifurcation`, a sub-section to input/edit scenario-specific `residencyAcquisitionDate` and `valueAtResidencyAcquisitionDatePerUnit` for relevant assets.
        * **4. Scenario Attributes for "Personal Goals":**
            * Section to manage attributes related to "Personal Goals".
            * List of attributes, controls to customize `userSentiment` and `significanceToUser`.
            * Option to add new attributes from `GlobalQualitativeConcepts`.
            * Display scenario's current calculated "Qualitative Fit Score" (read-only).
    * **Navigation/Actions:**
        * "Done Editing" or "Back to Dashboard" button/link.
        * (Auto-save is primary persistence).

### 8. Screen / View Name: "Detailed Scenario View"
*(This screen is accessed by clicking "View Details" on a Scenario Summary Card or a similar link from the "Scenario Hub / Comparison Dashboard")*

* **Purpose:**
    * To provide users with an in-depth, comprehensive, and read-only breakdown of a single selected scenario. This includes its year-by-year financial projections (with a clear focus on Capital Gains Tax impact) and a detailed view of its qualitative assessment, showing how individual attributes contributed to its "Personal Goals" fit score.
* **Conceptual Layout & Key Elements:**
    * **Title:** Clearly indicates scenario being viewed (e.g., "Detailed Analysis: [Scenario Display Name]").
    * **Layout Structure:** Two-column layout or ShadCN `Tabs` (e.g., "Financial Breakdown," "Personal Goals Fit").
    * **Financial Projections Section:**
        * Year-by-year presentation (ShadCN `Table` or structured list).
        * For each year: Gross Income, Total Annual Expenses, Realized Capital Gains Income, Detailed Tax Breakdown (CGT MVP calculated, other taxes estimated/placeholders), Net Financial Outcome.
    * **"Personal Goals" Fit / Qualitative Assessment Section:**
        * Display overall "Qualitative Fit Score."
        * List each `ScenarioAttribute` with underlying concept, user's sentiment/significance, notes.
        * Intuitive summary/indication of how attributes contributed to the score (visual cues or text).
    * **Navigation:**
        * Clear "Back" button/link to "Scenario Hub / Comparison Dashboard".
    * **Responsiveness:** Layout must be responsive for readability on various devices.

## Component Library / Design System Reference

* The Tax Scenarios Analyzer MVP will leverage **ShadCN UI** as its primary component library[cite: 1].
* This choice aligns with the goal of a modern, minimalist aesthetic and provides a solid foundation of accessible and stylable components (e.g., `Card`, `Table`, `Button`, `Input`, `Select`, `Dialog`, `Tabs`, `Checkbox`, `Switch`, `DatePicker`, `Combobox`, `RadioGroup`)[cite: 1].
* Custom components will be built as needed, following similar design principles.

## Branding & Style Guide Reference

* **Branding:** For the MVP, there is no specific pre-defined branding. The application will aim for a clean, professional, and trustworthy appearance[cite: 1].
* **Color Palette:** To be determined during the UI development phase, focusing on clarity, readability, and a modern feel. It will likely utilize a simple, minimalist palette with clear accent colors for calls to action and highlighting important information.
* **Typography:** Font choices will prioritize readability and a modern aesthetic, suitable for a data-intensive application. Standard sans-serif fonts commonly used with ShadCN UI will likely be adopted.
* **Iconography:** Minimalist and universally understood icons will be used for actions like "edit," "delete," "share," "add," etc., likely sourced from a common library compatible with ShadCN UI (e.g., Lucide Icons).
* **Spacing & Grid:** Consistent spacing and a clear visual hierarchy will be maintained, following common web design best practices.

## Accessibility (AX) Requirements

* **Target Compliance:** While a specific WCAG level isn't formally mandated for this personal MVP, the project will strive for a **good baseline level of accessibility**[cite: 1].
* **Specific Requirements & Approach:**
    * Utilize semantic HTML5 elements wherever appropriate.
    * Ensure keyboard navigability for all interactive elements.
    * Leverage the accessibility features built into ShadCN UI components[cite: 1].
    * Aim for sufficient color contrast.
    * Provide appropriate labels for form inputs and controls.
    * Basic ARIA attributes will be used as needed, especially if custom interactive components are developed.

## Responsiveness

* **Target Devices/Platforms:** The application is primarily designed for **web desktop use**[cite: 1].
* **Adaptation Strategy:** It must also be **responsive and usable on common mobile devices** (smartphones and tablets)[cite: 1]. This means:
    * Layouts will adapt to smaller screen sizes (e.g., single-column views, appropriately scaled tables, touch-friendly targets).
    * Navigation and interactive elements will remain accessible and easy to use on touchscreens.
    * Readability will be maintained across different viewport sizes.

## Change Log

| Change        | Date       | Version | Description                                                       | Author                         |
| :------------ | :--------- | :------ | :---------------------------------------------------------------- | :----------------------------- |
| Initial Draft | May 29, 2025 | 0.1     | First draft of UI/UX Specification based on Lean MVP PRD v1.0. | Jane (Design Architect) & Vibe CEO |

