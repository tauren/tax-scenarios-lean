You are an expert frontend developer specializing in React, TypeScript, Vite, Tailwind CSS, and the ShadCN UI component library. Your task is to help scaffold the UI for a new project called the 'Tax Scenarios Analyzer MVP'.

**Project Purpose:** The application is a client-side SPA designed to help individuals compare the financial (with a core focus on capital gains tax estimations) and qualitative impacts of changing their tax residency. Users will define a baseline scenario and compare it against multiple alternative scenarios.

**Core Technologies to Use:**
* **Framework/Language:** React with TypeScript.
* **Build Tool:** Vite (assume standard Vite setup for a React TS project).
* **UI Component Library:** **ShadCN UI**. Please prioritize using ShadCN UI components directly by name wherever appropriate (e.g., `<Button>`, `<Card>`, `<Table>`, `<Input>`, `<Select>`, `<Dialog>`, `<Tabs>`, `<Checkbox>`, `<Switch>`, `<DatePicker>`, `<Combobox>`, `<RadioGroup>`, `<Toast>`, `<Alert>`). If a ShadCN component fits the need, use it.
* **Styling:** **Tailwind CSS**. All styling should be achieved using Tailwind utility classes, adhering to a utility-first approach. Custom CSS should be minimal.
* **State Management (for context, though UI generation might not directly implement all logic):** Zustand will be used globally. For the UI components you generate, assume data will be passed via props or simple local state initially.
* **Iconography:** Use icons from `lucide-react` (commonly used with ShadCN UI) for actions like edit, delete, share, add, back, etc.

**Overall Design Principles:**
* Modern, minimalist, clean, and professional.
* Intuitive and user-friendly.
* Desktop-first, but ensure components and layouts are responsive and usable on mobile.
* Good baseline accessibility.

**Section 1: Active Plan Dashboard View**

"Please generate the React component for the 'Active Plan Dashboard'. This view serves as the central hub for a user's active financial plan.

**Layout & Overall Structure:**
* The view should have a clean, dashboard-style layout.
* At the top, prominently display the name of the 'Active Plan'.
* Below the plan name, arrange three main action sections as distinct cards. These cards should be the primary focus of this view.

**1. Active Plan Name Display & Editor:**
    * Display the plan name (e.g., 'My Tax Residency Plan Q3').
    * This name should appear as non-editable text by default.
    * Place a small 'edit' icon (use `lucide-react` icon, e.g., `FileEdit` or `Edit3`) next to the plan name text.
    * **Interaction:** When the user clicks either the plan name text or the edit icon, it should transform into an inline editable input field (e.g., a ShadCN `Input` component). The edit icon might change to a 'save' or 'check' icon, or disappear.
    * When the input field loses focus or the user presses 'Enter', it should revert to displaying the text. (The actual state update logic will be handled separately, just generate the UI elements for this interaction).

**2. Main Action Cards:**
    * Use ShadCN `Card` components for these. Arrange them in a responsive grid (e.g., 1 column on small screens, up to 3 columns on larger screens) or a clear vertical stack. Each card should have a title, a brief description, and should look like a clickable area that would navigate the user.
    * **Card 1: 'Manage Assets'**
        * Title (ShadCN `CardTitle`): "My Assets"
        * Description (ShadCN `CardDescription`): "Define and update your financial assets for this plan."
        * Perhaps include a relevant `lucide-react` icon within the card (e.g., `Landmark` or `Coins`).
    * **Card 2: 'My Personal Goals'**
        * Title (ShadCN `CardTitle`): "My Personal Goals"
        * Description (ShadCN `CardDescription`): "Set up and weight the lifestyle factors important to you."
        * Perhaps include a relevant `lucide-react` icon (e.g., `Target` or `Heart`).
    * **Card 3: 'Scenarios & Comparison'**
        * Title (ShadCN `CardTitle`): "Scenarios & Comparison"
        * Description (ShadCN `CardDescription`): "Create, edit, and compare your different tax residency scenarios."
        * Perhaps include a relevant `lucide-react` icon (e.g., `BarChart3` or `ClipboardList`).

**3. Optional Contextual Information (Subtle Display):**
    * If it fits cleanly below the action cards or alongside the plan name without cluttering, display some brief summary statistics. For example:
        * `Assets: {X} | Goals: {Y} | Scenarios: {Z}`
        * Style this text to be less prominent than the plan name or card titles.

**Styling & Components:**
* Ensure all elements are styled using **Tailwind CSS utility classes**.
* Strictly use **ShadCN UI components** for cards, inputs, buttons (if any implied for card actions, though for now they are just navigational blocks).
* The component should be responsive.

Please provide the TypeScript React component code (`.tsx`) for this `ActivePlanDashboardView`.

---

**Section 2: Main Application Layout/Shell**

"Please generate the React component for the **'Main Application Layout/Shell'**. This component will serve as the persistent framework for the entire application, providing a consistent header, footer, and a main content area where all other views will be rendered.

**Component Name & Props:**
* Component Name: `MainApplicationLayout`
* Props:
    * `activePlanName: string | null` - The name of the currently active plan to display in the header.
    * `children: React.ReactNode` - The main content (the current page/view) to render.

**Layout & Overall Structure:**
* The root element should be a `div` that uses a flexbox column layout to ensure the footer stays at the bottom, even on pages with little content (e.g., using Tailwind classes like `min-h-screen flex flex-col`).

**1. Header (Persistent, Fixed Top):**
* Create a header that is fixed to the top of the viewport. Use a `header` semantic tag.
* It should have a border at the bottom and a background color consistent with a clean theme (e.g., `bg-background`).
* The header should contain a flex container (`flex items-center justify-between`) with padding.
* **Header Content (Left to Right):**
    * **Application Title:** A simple `h1` or `div` with the text "Tax Scenarios Analyzer".
    * **Active Plan Name:** Display the `activePlanName` prop. This should be styled as display-only text. If the name is `null` or empty, it should gracefully display nothing or a placeholder like 'No Active Plan'.
    * **Share Plan Button:** A ShadCN `Button` (e.g., `variant="outline"`) with a "Share Plan" label and a `Share2` icon from `lucide-react`.

**2. Main Content Area:**
* This should be the main flexible part of the layout that grows to fill the available space. Use a `main` semantic tag.
* Use Tailwind classes like `flex-grow` and provide some padding (e.g., `p-4` or `p-8`).
* Render the `{children}` prop inside this `main` element.

**3. Footer (Persistent, Fixed Bottom):**
* Create a simple, unobtrusive footer that is fixed to the bottom. Use a `footer` semantic tag.
* It should have a border at the top and a background color similar to the header.
* Use a flex container to hold the content.
* **Footer Content:**
    * Copyright information (e.g., `© 2025 Vibe CEO`).
    * Application version (e.g., `v0.1.0`).
    * A link to "Disclaimers" (the `href` can be `#`).
    * Style the text to be small and have a muted color (e.g., `text-muted-foreground`).

**Styling & Components:**
* Ensure all elements are styled using **Tailwind CSS utility classes**.
* Use **ShadCN UI components** where appropriate (e.g., `Button`).
* The component must be responsive. The header content should adapt nicely to smaller screens.

Please provide the TypeScript React component code (`.tsx`) for this `MainApplicationLayout`.

---

**Section 3: "Get Started" Screen**

"Please generate the React component for the **'Get Started' Screen**. This is the initial landing page for new users who do not have a saved plan. It provides simple, card-based options to begin.

**Component Name & Props:**
* Component Name: `GetStartedView`
* Props:
    * `onSelectTemplate: (templateId: 'blank' | 'example-portugal' | 'example-dubai') => void;` - A callback function triggered when a user clicks on a card. The `templateId` identifies which starting point was chosen.

**Layout & Overall Structure:**
* The component should be centered on the page, with a clear vertical flow.
* Start with a main heading and a brief, welcoming tagline.
* Below the heading, display a responsive grid of clickable cards.

**1. Heading & Welcome Message:**
* A main heading (e.g., `<h1>` or `<h2>`) with the text "How would you like to begin?".
* A paragraph below it with a welcoming or instructional message, styled subtly (e.g., `text-muted-foreground`), such as "Choose a pre-built example to explore the features, or start with a blank slate."

**2. Selection Cards:**
* Arrange the cards in a responsive grid. For example: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.
* Each card must be a **ShadCN `Card`** and should be a clickable element (e.g., have `cursor-pointer` and `hover` transition effects). Clicking anywhere on the card should trigger the `onSelectTemplate` callback.

* **Card 1: 'Start with a Blank Plan'**
    * **Interaction:** Clicking this card should call `onSelectTemplate('blank')`.
    * **Content:**
        * Use `CardHeader`, `CardTitle`, and `CardDescription`.
        * `CardTitle`: "Start with a Blank Plan"
        * `CardDescription`: "Build your financial and lifestyle plan from scratch."
        * Include a relevant `lucide-react` icon in the header, like `FilePlus2`.

* **Card 2: 'Example - Portugal NHR'**
    * **Interaction:** Clicking this card should call `onSelectTemplate('example-portugal')`.
    * **Content:**
        * `CardTitle`: "Explore a Portugal NHR Plan"
        * `CardDescription`: "See a sample plan for leveraging capital gains benefits under Portugal's NHR scheme."
        * Include a relevant icon, like `Plane` or `Sun`.

* **Card 3: 'Example - Dubai, UAE'**
    * **Interaction:** Clicking this card should call `onSelectTemplate('example-dubai')`.
    * **Content:**
        * `CardTitle`: "Explore a Dubai, UAE Plan"
        * `CardDescription`: "Analyze a scenario for a zero-tax residency in Dubai for capital gains planning."
        * Include a relevant icon, like `Building` or `Landmark`.

**Styling & Components:**
* Ensure all elements are styled using **Tailwind CSS utility classes**.
* Strictly use **ShadCN UI components** for cards, titles, descriptions, etc.
* The component layout must be clean, focused, and responsive.

Please provide the TypeScript React component code (`.tsx`) for this `GetStartedView`.
"

---

**Section 4: "My Personal Goals" Management View**

"Please generate the React component for the **'My Personal Goals' Management View**. This screen allows users to define, view, edit, and assign weights to their personal lifestyle goals, which are used for the qualitative scoring of their scenarios.

**Component Name:** `PersonalGoalsManagementView`

**Layout & Overall Structure:**
* The view should have a clear header section with a title and primary actions.
* The main content area should display a table of the user's defined goals.
* An 'Add' or 'Edit' action should open a `Dialog` (modal) containing a form for goal creation/modification.

**1. View Header:**
* Create a flex container at the top of the view.
* **Navigation:** Include a "Back" button (ShadCN `Button` with `variant="outline"`) with an `ArrowLeft` icon from `lucide-react` to navigate back to the dashboard.
* **Title:** A prominent `h1` or `h2` with the text "My Personal Goals".
* **Primary Action:** An "Add New Goal" button (ShadCN `Button`) with a `Plus` icon from `lucide-react` on the far right.

**2. Goal List Table:**
* Use a **ShadCN `Table`** to display the list of existing personal goals.
* The table should include the following columns (`TableHeader`, `TableRow`, `TableHead`):
    * **Goal:** The personalized name of the goal.
    * **Category:** The underlying concept category.
    * **Description:** The personalized description.
    * **Weight:** The importance assigned by the user.
    * **Actions:** A column for Edit and Delete buttons.
* Populate the table (`TableBody`) with 2-3 rows of mock data to illustrate the structure. For example:
    * **Row 1:** Goal: "Year-Round Sunshine", Category: "Climate", Description: "Prefer warm, sunny weather throughout the year.", Weight: "High", Actions: [Edit/Delete buttons].
    * **Row 2:** Goal: "Top-Tier Medical Facilities", Category: "Healthcare", Description: "Easy access to high-quality hospitals and specialists.", Weight: "Critical", Actions: [Edit/Delete buttons].
* The "Actions" column for each row should contain two small buttons (ShadCN `Button` with `variant="ghost"` and `size="icon"`):
    * An "Edit" button with a `Pencil` icon.
    * A "Delete" button with a `Trash2` icon.

**3. Add/Edit Goal Dialog (Modal):**
* Clicking the "Add New Goal" button or an "Edit" button in the table should trigger a **ShadCN `Dialog`**.
* The dialog should contain:
    * `DialogHeader` with a `DialogTitle` (e.g., "Add a New Personal Goal" or "Edit Personal Goal").
    * `DialogContent` containing the form fields.
    * `DialogFooter` with "Cancel" and "Save" buttons.
* **Form Fields inside the Dialog Content:**
    * **Select Base Concept:** This is a critical field. Use a **ShadCN `Combobox`** to allow the user to search and select from a predefined list of global concepts. The `Combobox` should have a label like "Base Goal Concept". For the prompt, use this mock data for the combobox options: `[{ value: 'climate', label: 'Climate' }, { value: 'healthcare', label: 'Healthcare' }, { value: 'safety', label: 'Safety & Security' }, { value: 'cost-of-living', label: 'Cost of Living' }]`.
    * **Personalized Name:** A ShadCN `Input` with a `Label` above it reading "Goal Name". *Interaction Note: This field could be pre-filled when a base concept is selected.*
    * **Personalized Description:** A ShadCN `Textarea` with a `Label` reading "Description". *Interaction Note: This could also be pre-filled.*
    * **Assign Weight:** A **ShadCN `Select`** component with a `Label` reading "Importance Weight". The select options should be "Low", "Medium", "High", and "Critical".

**Styling & Components:**
* Ensure all elements are styled using **Tailwind CSS utility classes**.
* Strictly use **ShadCN UI components** for the table, buttons, dialog, combobox, inputs, etc.
* The component must be responsive.

Please provide the TypeScript React component code (`.tsx`) for this `PersonalGoalsManagementView`.
"

---

**Section 5: Asset Management View**

"Please generate the React component for the **'Asset Management' view**. This screen allows users to define, view, edit, and delete all financial assets for their currently active plan. This view is accessed from the 'Manage Assets' card on the 'Active Plan Dashboard'.

**Layout & Overall Structure:**
* The view should be anchored by a clear title, such as 'My Assets' or 'Manage Plan Assets'.
* Include a prominent 'Add New Asset' button near the title.
* The main content area will be a table displaying the list of assets.
* Include a clear 'Back' button or link (with a `lucide-react` `ArrowLeft` icon) to navigate back to the 'Active Plan Dashboard'.

**1. Asset List Table:**
* Use a ShadCN `Table` (`<Table>`, `<TableHeader>`, `<TableRow>`, `<TableHead>`, `<TableBody>`, `<TableCell>`) to display the assets.
* The table should be responsive, allowing for horizontal scrolling on smaller screens if necessary.
* **Table Columns:**
    1.  **Name:** The user-defined name of the asset (e.g., "Vanguard S&P 500 ETF").
    2.  **Quantity:** The number of units.
    3.  **Cost Basis/Unit:** The purchase price per unit.
    4.  **Acquisition Date:** The date the asset was acquired.
    5.  **Asset Type:** An optional text field (e.g., "Stock", "Real Estate").
    6.  **Actions:** A column containing icon buttons for actions on each row.
* **Row Actions:**
    * In the 'Actions' column for each row, include three icon buttons:
        * An 'Edit' button (use `lucide-react` icon `Pencil`).
        * A 'Duplicate' button (use `lucide-react` icon `Copy`).
        * A 'Delete' button (use `lucide-react` icon `Trash2`). This button should have a red hover effect to indicate a destructive action.

**2. Add/Edit Asset Form (within a Modal):**
* This form should appear inside a ShadCN `Dialog` (modal) when the user clicks 'Add New Asset' or an 'Edit' button on a table row.
* Use ShadCN `DialogHeader`, `DialogTitle` (e.g., "Add New Asset" or "Edit Asset"), and `DialogDescription`.
* **Form Fields (use ShadCN `Label` and `Input` for each):**
    * **Asset Name:** Text input, required.
    * **Quantity:** Numeric input, required.
    * **Cost Basis / Unit:** Numeric input with support for currency, required.
    * **Acquisition Date:** Use a ShadCN `DatePicker` component, required.
    * **Asset Type:** Text input, optional.
    * **Fair Market Value (FMV) / Unit:** Numeric input, optional.
* **Form Actions (within ShadCN `DialogFooter`):**
    * A 'Cancel' button (using `<Button variant="outline">`).
    * A 'Save and Add Another' button (for quickly adding multiple assets).
    * A primary 'Save' button.

**Styling & Components:**
* Ensure all elements are styled using **Tailwind CSS utility classes**.
* Strictly use **ShadCN UI components** for the table, buttons, dialog, form inputs, and date picker.
* The overall layout must be responsive.

Please provide the TypeScript React component code (`.tsx`) for this `AssetManagementView`."

---

**Section 6: Scenario Hub / Comparison Dashboard View**

"Please generate the React component for the **'Scenario Hub / Comparison Dashboard' view**. This view serves as the main interface for users to get an overview of all their scenarios, initiate the creation of new ones, select existing ones for editing or detailed viewing, and compare them side-by-side. This view is accessed from the 'Scenarios & Comparison' card on the 'Active Plan Dashboard'.

**Layout & Overall Structure:**
* The view should have a clear title, such as 'My Scenarios & Comparison' or 'Scenario Dashboard'.
* Include a prominent 'Add New Scenario' button (e.g., ShadCN `Button` with a `lucide-react` `PlusCircle` icon) near the title. Clicking this will later trigger a flow to create a new scenario.
* The main content area should be divided into two key sections:
    1.  A display area for 'Scenario Summary Cards'.
    2.  An 'Overview Comparison Table'.
* Include a clear 'Back' button or link (with a `lucide-react` `ArrowLeft` icon) to navigate back to the 'Active Plan Dashboard'.

**1. Scenario Summary Cards Area:**
* This section dynamically displays a 'Scenario Summary Card' (using ShadCN `Card`) for each scenario in the Active Plan.
* Arrange these cards in a responsive grid (e.g., 1-2 columns on small screens, 2-3 columns on medium, and 3-4 on large screens) or a flexible list.
* **Each Scenario Summary Card (`<Card>`) should contain:**
    * **Title (`<CardTitle>`):** The scenario's `displayLocationName` (e.g., 'Lisbon, Portugal' or 'My Baseline - Current USA').
    * **Key Metrics (`<CardContent>`):**
        * Clearly display the scenario's `QualitativeFitScore` (e.g., "Qualitative Fit: 75/100").
        * Display Total Estimated Capital Gains Tax (e.g., "Est. CGT: $15,000").
        * Display Total Net Financial Outcome (e.g., "Net Outcome: $85,000").
    * **Actions (`<CardFooter>` or similar within content):**
        * An 'Edit' button/link (using ShadCN `<Button variant="outline" size="sm">` with a `lucide-react` `Pencil` icon and text "Edit").
        * A 'View Details' button/link (using ShadCN `<Button variant="outline" size="sm">` with a `lucide-react` `Eye` or `Search` icon and text "Details").
        * A 'Delete' button/icon (using ShadCN `<Button variant="destructive" size="sm">` with a `lucide-react` `Trash2` icon and text "Delete"). This will later trigger a confirmation dialog.
    * **Comparison Selection:**
        * Include a ShadCN `Checkbox` or `Switch` component directly on the card (e.g., in the header or top corner). This control allows the user to toggle the inclusion of this scenario in the 'Overview Comparison Table' below.

**2. Overview Comparison Table Area:**
* This section displays the 'Overview Comparison Table' using a ShadCN `Table`.
* The table should dynamically update to show data *only* for the scenarios selected via the checkboxes/switches on their respective summary cards.
* **Table Structure:**
    * **Columns:** The columns should represent the different scenarios selected for comparison. The header for each scenario column should be its `displayLocationName`.
    * **Rows:** The rows should represent the key metrics being compared. (Alternatively, scenarios could be rows and metrics columns, if that's easier for responsiveness, but the spec implies scenarios as columns for side-by-side).
    * **Metrics to Display (as rows for each scenario column):**
        1.  Total Gross Income (contextual)
        2.  Total Expenses
        3.  **Total Estimated Capital Gains Tax** (highlight this if possible)
        4.  Total Net Financial Outcome
        5.  `QualitativeFitScore`
* **Sortable Columns:** Each metric row header (or column header if metrics are columns) should ideally be sortable to allow users to rank scenarios by different criteria. (The UI for sorting indicators can be added later if complex).

**Styling & Components:**
* Ensure all elements are styled using **Tailwind CSS utility classes**.
* Strictly use **ShadCN UI components** for cards, buttons, tables, checkboxes/switches, etc.
* The overall layout must be responsive. The table might need to allow horizontal scrolling on smaller viewports if many scenarios are selected.

Please provide the TypeScript React component code (`.tsx`) for this `ScenarioHubView`."

---

**Section 7: Scenario Editor View**

"Please generate the React component for the **'Scenario Editor View'**. This view is used to define and modify all aspects of a single scenario (either a Baseline or a Comparison scenario). It's accessed when a user clicks 'Edit' on a Scenario Summary Card or initiates the creation of a new scenario from the 'Scenario Hub / Comparison Dashboard'.

**Layout & Overall Structure:**
* The view should have a title that clearly indicates which scenario is being edited (e.g., "Editing: [Scenario Display Name]" or "Create New Scenario").
* Implement a tabbed interface using ShadCN `Tabs` (`<Tabs>`, `<TabsList>`, `<TabsTrigger>`, `<TabsContent>`) to organize the different sections of scenario data.
* Include a clear 'Done Editing' or 'Back to Scenario Hub' button (e.g., ShadCN `Button` with a `lucide-react` `ArrowLeft` or `CheckCircle` icon) to navigate away from the editor. Auto-save is the primary persistence mechanism, so this button is mainly for navigation.

**Tabs and Content:**

**1. Tab: 'Core Details & Financials' (`<TabsTrigger value="core">Core Details & Financials</TabsTrigger>`)**
    * **`displayLocationName`:** Editable ShadCN `Input` field.
    * **Location Components:**
        * `locationCountry`: Editable ShadCN `Input`.
        * `locationState` (optional): Editable ShadCN `Input`.
        * `locationCity` (optional): Editable ShadCN `Input`.
    * **`projectionPeriodYears`:** Editable ShadCN `Input` (type number).
    * **`residencyStartDate`** (optional): Editable ShadCN `DatePicker`.
    * **Effective Capital Gains Tax Rates:**
        * Use ShadCN `Label` and `Input` (type number, perhaps allowing for '%' symbol or a small text adornment).
        * Field for "Short-Term CGT Rate (%)".
        * Field for "Long-Term CGT Rate (%)".
    * **Gross Income (for context):**
        * Interface to manage a list of `IncomeSource` objects (each with Name, Type, Annual Amount, Start Year, End Year).
        * Display current income sources in a list or small table. Each item should have 'Edit' and 'Delete' (`lucide-react` icons) options.
        * An 'Add Income Source' ShadCN `Button` that opens a ShadCN `Dialog` with a form for these fields.
    * **Annual Expenses:**
        * Interface to manage `AnnualExpense` categories (Name, Amount) and `additionalCosts`.
        * Similar structure to Gross Income: display list, edit/delete options, 'Add Expense' button opening a `Dialog` with a form.

**2. Tab: 'Planned Asset Sales' (`<TabsTrigger value="sales">Planned Asset Sales</TabsTrigger>`)**
    * Dedicated area to manage `PlannedAssetSale` entries for this scenario.
    * An 'Add Planned Sale' ShadCN `Button` that opens a ShadCN `Dialog`.
    * **Dialog Form for Adding/Editing a Planned Sale:**
        * ShadCN `Select` or `Combobox` to choose an asset from the user's global list of assets.
        * ShadCN `Input` (type number) for 'Year of Sale'.
        * ShadCN `Input` (type number) for 'Quantity to Sell'.
        * ShadCN `Input` (type number) for 'Expected Sale Price per Unit'.
    * Display a list or table of existing planned sales for this scenario. Each entry should show key details and have 'Edit' / 'Delete' options.
    * **Crucial Feature:** Next to or within the form/list item for a planned sale, dynamically display an *estimated capital gain/loss preview* for that *individual transaction*. (e.g., "Est. Gain/Loss: +$X,XXX"). This value will be calculated based on asset cost basis and sale price.

**3. Tab: 'Special Tax Features (STF)' (`<TabsTrigger value="stf">Special Tax Features</TabsTrigger>`)**
    * Interface to browse, select, and configure `SpecialTaxFeatures`.
    * An 'Add STF' ShadCN `Button` that opens a ShadCN `Dialog`.
    * **Dialog for Adding STF:**
        * A ShadCN `Select` or `Combobox` to choose from `globalSpecialTaxFeatures` (displaying STF name and description).
    * Display a list of currently selected STFs for the scenario. Each STF in the list should:
        * Show its name and description.
        * Have a 'Remove' or 'Delete' icon (`lucide-react` `XCircle`).
        * If the STF definition requires `inputs`, display appropriate ShadCN `Input` fields for these parameters.
        * **Gain Bifurcation:** If an active STF has `requiresGainBifurcation: true`:
            * Display a subsection or link to a `Dialog` to manage `ScenarioAssetTaxDetail`.
            * This sub-interface should allow inputting `residencyAcquisitionDate` (ShadCN `DatePicker`) and `valueAtResidencyAcquisitionDatePerUnit` (ShadCN `Input`) for each relevant global asset *specifically for this scenario*.

**4. Tab: 'Scenario Attributes for Personal Goals' (`<TabsTrigger value="goals">Personal Goals Fit</TabsTrigger>`)**
    * Section to manage this scenario's attributes related to the user's 'Personal Goals'.
    * An 'Add Attribute' ShadCN `Button` that opens a `Dialog` containing a ShadCN `Select` or `Combobox` to pick from `GlobalQualitativeConcepts`.
    * Display a list of current attributes for this scenario (perhaps using ShadCN `Card` for each or a list). Each attribute should show:
        * The underlying concept's name.
        * Controls (e.g., ShadCN `Select` or `RadioGroup`) to set `userSentiment` (e.g., Positive, Neutral, Negative).
        * Controls (e.g., ShadCN `Select` or `RadioGroup`) to set `significanceToUser` (e.g., None, Low, Medium, High).
        * A 'Remove' icon.
    * Prominently display the scenario's current calculated 'Qualitative Fit Score' (read-only text).

**Styling & Components:**
* Ensure all elements are styled using **Tailwind CSS utility classes**.
* Strictly use **ShadCN UI components** throughout (Tabs, Inputs, Buttons, Dialogs, Selects, DatePickers, etc.).
* The overall layout and tab content must be responsive. Complex tables or lists within tabs might need careful responsive consideration.

Please provide the TypeScript React component code (`.tsx`) for this `ScenarioEditorView`."

---

**Section 8: Detailed Scenario View**

"Please generate the React component for the **'Detailed Scenario View'**. This view provides a comprehensive, read-only breakdown of a single selected scenario. It is accessed from the 'Scenario Hub / Comparison Dashboard' (e.g., by clicking a 'View Details' button on a Scenario Summary Card).

**Layout & Overall Structure:**
* The view should have a clear title that includes the scenario's name (e.g., "Detailed Analysis: [Scenario Display Name]").
* Use ShadCN `Tabs` (`<Tabs>`, `<TabsList>`, `<TabsTrigger>`, `<TabsContent>`) to separate the financial breakdown from the qualitative assessment.
* Include a clear 'Back' button (e.g., ShadCN `Button` with a `lucide-react` `ArrowLeft` icon) to navigate back to the 'Scenario Hub / Comparison Dashboard'.

**Tabs and Content:**

**1. Tab: 'Financial Breakdown' (`<TabsTrigger value="financials">Financial Breakdown</TabsTrigger>`)**
    * **Purpose:** To display a year-by-year projection of the scenario's financial aspects. This is a read-only view.
    * **Structure:** Use a ShadCN `Table` or a series of structured sections (e.g., one ShadCN `Card` per year) to present the data. A table is preferred for comparing years easily.
    * **For each year in the scenario's projection period, display the following (clearly labeled):**
        * **Year:** (e.g., Year 1, Year 2, 2026, 2027)
        * **Gross Income:** (Contextual total)
        * **Total Annual Expenses:**
        * **Realized Capital Gains Income:** (Total gains from planned sales in that year)
        * **Tax Breakdown:**
            * Estimated Capital Gains Tax (Calculated by MVP)
            * (Placeholder for other taxes like Income Tax - display as "N/A" or "Not Calculated in MVP" if no value)
            * Total Estimated Tax for the year
        * **Net Financial Outcome for the year:**
    * Ensure the table is responsive, possibly with horizontal scroll on small screens.

**2. Tab: 'Personal Goals Fit' (`<TabsTrigger value="qualitative">Personal Goals Fit</TabsTrigger>`)**
    * **Purpose:** To display a detailed view of the scenario's qualitative assessment. This is a read-only view.
    * **Overall Score:** Prominently display the scenario's overall 'Qualitative Fit Score' (e.g., "Qualitative Fit Score: 82/100").
    * **Attributes List:** Display a list of all `ScenarioAttribute` entries associated with this scenario. For each attribute, show:
        * The `name` (and optionally `category`) of the underlying `GlobalQualitativeConcept`.
        * The user's chosen `userSentiment` for this attribute in this scenario (e.g., "Positive", "Neutral", "Negative").
        * The user's chosen `significanceToUser` for this attribute (e.g., "High", "Medium", "Low", "None").
        * Any user-provided `notes` for this attribute in this scenario.
        * (Optional: A subtle visual cue or text indicating if this attribute positively, negatively, or neutrally contributed to the score based on sentiment and significance).
    * This list could be presented as a series of ShadCN `Card` components or within a well-structured list.

**Styling & Components:**
* Ensure all elements are styled using **Tailwind CSS utility classes**.
* Strictly use **ShadCN UI components** for tabs, tables, cards, buttons, etc.
* The overall layout and tab content must be responsive and clearly present the detailed information.

Please provide the TypeScript React component code (`.tsx`) for this `DetailedScenarioView`."
