## Story 4.3: Refactor Goal Dialog to Use Statement Selection

**Status:** Complete

**Story**
- As a user, I want to select from predefined statements when creating or editing a goal, so that I can easily choose from well-crafted options that align with my priorities.

**Acceptance Criteria (ACs)**
1. The goal dialog must show a dropdown of statements grouped by their concepts:
   - Statements must be organized under their respective concept categories
   - The dropdown must be easily navigable and searchable
   - Each statement must be clearly associated with its concept

2. When a statement is selected:
   - The goal name field must be automatically populated with the statement text
   - The concept dropdown must be automatically set to the statement's concept
   - The user must still be able to modify the goal name after selection

3. When the concept is changed:
   - The goal name field must be cleared if it was populated by a statement
   - The user must be able to enter a new goal name

4. The description field must be optional:
   - Remove any validation requiring the description field
   - Update the data model to make description optional
   - Update any related components to handle optional descriptions

5. The UI must be intuitive:
   - Clear labeling of all fields
   - Proper grouping and hierarchy of concepts and statements
   - Smooth transitions when selections change

**Technical Notes**
1. Component Structure:
   ```typescript
   // GoalDialog.tsx
   interface GoalDialogProps {
     open: boolean;
     onClose: () => void;
     onSave: (goal: UserQualitativeGoal) => void;
     initialGoal?: UserQualitativeGoal;
   }

   interface FormData {
     conceptId: string;
     statementId: string | null;
     name: string;
     description?: string;
     weight: "Low" | "Medium" | "High" | "Critical";
   }
   ```

2. Data Flow:
   ```typescript
   // When statement is selected
   const handleStatementSelect = (statementId: string) => {
     const statement = qualitativeStatements.find(s => s.id === statementId);
     if (statement) {
       setFormData(prev => ({
         ...prev,
         conceptId: statement.conceptId,
         statementId: statement.id,
         name: statement.statementText
       }));
     }
   };

   // When concept changes
   const handleConceptChange = (conceptId: string) => {
     setFormData(prev => ({
       ...prev,
       conceptId,
       statementId: null,
       name: prev.statementId ? '' : prev.name // Clear name only if it was from a statement
     }));
   };
   ```

3. UI Components:
   ```typescript
   // StatementSelect.tsx
   interface StatementSelectProps {
     value: string | null;
     onChange: (statementId: string) => void;
     conceptId: string;
     statements: QualitativeStatement[];
   }

   // ConceptSelect.tsx
   interface ConceptSelectProps {
     value: string;
     onChange: (conceptId: string) => void;
     concepts: QualitativeConcept[];
   }
   ```

**Tasks / Subtasks**
1. [x] Data Model Updates
   - [x] Update `UserQualitativeGoal` interface to make description optional
   - [x] Do not add `statementId` to the model, it is only necessary for the form data
   - [x] Update any related type definitions

2. [x] Component Refactoring
   - [x] Create new `StatementSelect` component
   - [x] Update `GoalDialog` to use new statement selection
   - [x] Implement concept-based filtering
   - [x] Add statement selection handling
   - [x] Update form validation

3. [x] UI/UX Implementation
   - [x] Design and implement grouped statement dropdown
   - [x] Implement smooth transitions
   - [x] Add proper error handling
   - [x] Update form layout

4. [x] Testing & Validation
   - [x] Unit tests for new components
   - [x] Integration tests for form behavior
   - [x] SKIP FOR NOW: End-to-end tests for goal creation/editing
   - [x] Test edge cases (empty states, invalid selections)

**Dependencies**
- Story 4.2 (Data Cleanup) must be completed first
- This story is a prerequisite for Story 4.4 (Cross-Epic Impacts)

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Initial story creation
    * Defined new component structure
    * Outlined implementation tasks
    * Updated UserQualitativeGoal interface
    * Created StatementSelect component
    * Updated GoalDialog component
    * Implemented all required functionality
    * Final review and marked as complete
* **Change Log:**
    * Initial Draft - June 1, 2025 - Claude (Dev)
    * Completed - June 1, 2025 - Claude (Dev) 