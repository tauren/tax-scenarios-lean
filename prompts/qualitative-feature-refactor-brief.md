## Prompt for Scrum Master Agent: Refactoring the Qualitative Assessment Feature

**Objective:** Hello SM. We need your expertise to lead a significant refinement of the "Qualitative Assessment" feature. A new, more intuitive design for the data models and user workflow has been created. Your task is to analyze the existing project, identify all impacted areas, and create/update the necessary user stories to implement this new design.

### 1. Core Context and Design Summary

For full context on the new design, please first review the contents of this attached markdown file, `qualitative-feature-refactor-brief.md`. It contains the full design proposal, including the new data models and the improved user workflow.

**Key File Locations:**
* All project documentation (PRD, Architecture, Specs) is in the `/docs` folder.
* All user stories are in the `/docs/stories` folder.

**Summary of the New Design:**

* **New Data Models:** The system will now use a two-tiered data structure:
    * `QualitativeConcept`: A master list of broad categories (e.g., `id: "lifestyle"`, `name: "Lifestyle & Culture"`).
    * `QualitativeStatement`: A master list of specific, selectable preference statements (e.g., `"Vibrant arts and cultural scene"`), with each statement linking to a parent `QualitativeConcept`.
* **New "Jot Down & Map" Workflow:** This is a major UX improvement.
    1.  **Jot Down:** A user can add an attribute directly to a scenario by writing a free-text note (e.g., "Florida is hot and humid") and assigning their personal `sentiment` and `significance`. This attribute is initially "unmapped."
    2.  **Map:** The user can later map this scenario-specific attribute to one of their overarching, plan-wide `UserQualitativeGoals`.
    3.  **Scoring:** Only attributes that have been successfully mapped to a goal will affect the `QualitativeFitScore`.

### 2. Your Step-by-Step Instructions

Please follow these steps carefully:

**Step 1: Familiarize Yourself with the Project State**
Thoroughly review this prompt, the existing project documents in `/docs`, and the existing stories in `/docs/stories`.

**Step 2: Analyze the Codebase (CRITICAL INSTRUCTION)**
The current implementation in the codebase has deviated from the original documentation in some areas. Therefore, **you MUST prioritize the current state of the code as the single source of truth** when analyzing impacts. Your analysis should identify where the new design will impact the *existing, implemented code*, not just what the old documents say. Do not propose changes that will break existing, unrelated functionality.

**Step 3: Analyze Epic 4 & Devise Refactoring Strategy**
The bulk of the changes will affect **Epic 4**. You will notice that story `4.1` may have been completed under the old design. Our strategy is to **avoid modifying already completed stories.**

Instead, please create **new stories** to handle the refactoring work. These new stories should be added to Epic 4, or you can group them into a new sub-epic (e.g., "Epic 4.5: Qualitative Feature Refactor") for clarity. These stories will cover tasks like: updating UI components to use the new "Jot Down & Map" workflow, migrating any existing state, and updating the calculation engine.

**Step 4: Conduct Cross-Epic Impact Analysis**
Review stories in *other* epics. The new data models for qualitative assessment might be referenced by components or logic implemented in other epics.
* If you find an impact on an *incomplete* story, please update that story's technical guidance or Acceptance Criteria.
* If you find an impact on a *completed* story, **do not modify it**. Instead, create a new "technical debt" or "refactor" story and add it to our new refactoring epic (e.g., Epic 4.5).

**Step 5: Create and Update User Stories**
Based on your complete analysis, your primary task is to create and/or update the necessary story files directly in the `/docs/stories` directory.
* This will involve modifying the remaining, incomplete stories in Epic 4.
* It will involve creating all the new refactoring stories you identified in Steps 3 and 4.
* Ensure every story you create or modify is "Dev Ready," with clear Acceptance Criteria, technical notes, and context that a Dev agent can use to implement it successfully.

### 3. Final Output

Your final output will consist of two parts. Please confirm when both are complete.

1.  **Updated Story Files:** The set of all new and updated story files, saved directly to the `/docs/stories` directory.
2.  **A Prompt for the Architect:** A clear, concise prompt that I can give to the Architect (Fred). Put this prompt into a markdown file within the `/prompts` folder. This prompt should instruct him on the necessary changes for the architecture document. It must include:
    * A reference to the stories you've just updated as the new "source of truth" for the feature's requirements.
    * An explicit instruction to update the data models in `architecture-lean-v1.2.md`, replacing the old qualitative models with the new, official `QualitativeConcept` and `QualitativeStatement` structures.
    * A reference to this context file (`qualitative-feature-refactor-brief.md`) for the background rationale.