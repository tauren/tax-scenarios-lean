## Story 1.0: Populate Initial Lean MVP Static Configuration Data

**Status:** Review

**Story**
- As the project developer, I need a *small, lean initial set* of static `AppConfig` data – including a few CGT-focused `templateScenarios`, foundational `globalQualitativeConcepts`, and 1-2 relevant `globalSpecialTaxFeatures` – to be defined and integrated, so that early development and testing of core MVP functionality can proceed.

**Acceptance Criteria (ACs)**
1.  1-2 diverse locales identified for initial CGT-focused `templateScenarios`.
2.  `templateScenario` JSON objects created for these, including: location components, MVP-appropriate effective CGT rates (ST/LT), representative expenses, and a few `ScenarioAttribute`s.
3.  An initial list of ~10 `globalQualitativeConcepts` defined.
4.  1-2 relevant `globalSpecialTaxFeatures` (e.g., one that `requiresGainBifurcation` for CGT) defined.
5.  Strategy to use AI assistance for prompt generation for this *initial lean data* acknowledged.
6.  Initial static data integrated into `AppConfig` and loadable by the `appConfigService.ts`.
7.  Data structure aligns with the *lean MVP architecture* defined in `architecture-lean-v1.2.md`.

**Tasks / Subtasks**
- [x] **Task 1: Define Scope of Initial Data (AC: 1, 3, 4)**
    - [x] Research and select 1-2 diverse locales for `templateScenarios` suitable for demonstrating CGT calculations (e.g., a high CGT location, a low/zero CGT location, or one with a specific STF).
    - [x] Identify ~10 foundational `GlobalQualitativeConcept`s covering various categories (e.g., lifestyle, finance, safety).
    - [x] Identify 1-2 `SpecialTaxFeature`s relevant for the chosen `templateScenarios` and MVP CGT focus (e.g., a feature that `requiresGainBifurcation`).
- [x] **Task 2: Define Data Structures (AC: 7)**
    - [x] Review data models in `architecture-lean-v1.2.md` for: `AppConfig`, `Scenario` (for `templateScenarios`), `CapitalGainsTaxRate`, `SpecialTaxFeature`, `GlobalQualitativeConcept`, `ScenarioAttribute` (used within `templateScenarios`).
    - [x] Ensure the data to be created will conform to these TypeScript interfaces.
- [x] **Task 3: Generate/Create Initial Data Content (AC: 2, 3, 4, 5)**
    - [x] For each selected `templateScenario`:
        - [x] Define `displayLocationName`, `locationCountry`, etc.
        - [x] Define `capitalGainsTaxRates` array (with one entry for MVP) with effective ST/LT rates.
        - [x] Define sample `annualExpenses`.
        - [x] Define a few relevant `scenarioSpecificAttributes` linking to `GlobalQualitativeConcept` IDs.
    - [x] For each `GlobalQualitativeConcept`:
        - [x] Define `id`, `name`, `category`, and optionally `description`.
    - [x] For each `SpecialTaxFeature`:
        - [x] Define `id`, `name`, `description`, `appliesTo` (e.g., "CAPITAL_GAINS"), any `inputs` schema, and `requiresGainBifurcation` flag.
    - [x] (User/Developer Acknowledgment for AC5): Note that AI assistance can be used to generate prompts for creating this sample data, or to generate the data directly, which will then be reviewed and curated.
- [x] **Task 4: Integrate Data into Project (AC: 6)**
    - [x] Create TypeScript data files in `src/data/` as specified in `front-end-architecture-v0.3.md` (e.g., `templateScenarios.data.ts`, `globalQualitativeConcepts.data.ts`, `globalSpecialTaxFeatures.data.ts`).
    - [x] Populate these files with the generated data, exporting typed constants.
    - [x] Ensure `appConfigService.ts` (as defined in `front-end-architecture-v0.3.md`) correctly imports and provides access to this data.
- [x] **Task 5: Verify Data Loading and Structure (AC: 6, 7)**
    - [x] Write a simple test or temporary console log in `App.tsx` or `main.tsx` to call the `appConfigService` methods and verify that the data is loaded correctly and matches the expected structures.
    - [x] Confirm that the data aligns with the models in `architecture-lean-v1.2.md`.

**Dev Technical Guidance**
-   **Primary Goal:** Create realistic but simple placeholder data to enable development and testing of features in subsequent stories (e.g., scenario display, CGT calculations, qualitative assessments).
-   **Data Location:** All static data should reside in `src/data/` as `.data.ts` files, exporting typed constants. Refer to `front-end-architecture-v0.3.md` for directory structure and `appConfigService.ts` definition.
-   **Model Alignment:** Strictly adhere to the TypeScript interfaces defined in `architecture-lean-v1.2.md` (Section 4: Core Components & Data Models).
-   **Example `templateScenario` content:**
    * Should include a basic set of `incomeSources` (for context, not taxed by MVP engine), `annualExpenses`, and a few `plannedAssetSales` to allow CGT calculation testing.
    * `capitalGainsTaxRates` for the template scenario should be clearly defined.
    * Include some `scenarioSpecificAttributes` with default `userSentiment` and `significanceToUser`.
-   **`GlobalQualitativeConcepts`:** Aim for variety in categories.
-   **`SpecialTaxFeatures`:**
    * If including one with `requiresGainBifurcation: true`, ensure the corresponding `templateScenario` has an asset and `scenarioAssetTaxDetails` that would be affected by it for testing purposes.
    * Any `inputs` defined for an STF should be simple for MVP.
-   This story is foundational. Its output (`AppConfig` data) will be consumed by many other parts of the application.

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Created and populated all required data files in `src/data/`
    * Integrated data into `appConfigService.ts`
    * Added comprehensive tests for all service functions
    * Fixed type imports to use type-only imports
    * All tests passing
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Completed Implementation - May 31, 2025 - Dev Agent
