## Story 4.2: Implement New Qualitative Data Models

**Status:** Ready for Development

**Story**
- As a developer, I want to implement the new qualitative data models and remove the old ones, so that we have a clean, well-structured foundation for the qualitative assessment feature.

**Acceptance Criteria (ACs)**
1. The system must implement new data files and structures:
   - Create `qualitativeConcepts.data.ts` with the new structure
   - Create `qualitativeStatements.data.ts` with the new structure
   - Remove old data files:
     - `globalQualitativeConcepts.data.ts`
     - `qualitative-categories.data.ts`
     - `qualitativeCategories.data.ts`

2. The system must implement new type definitions:
   - Create new interfaces for the updated models
   - Remove old interfaces:
     - `GlobalQualitativeConcept`
     - `QualitativeCategory`
   - Update all type references in the codebase

3. The system must update the `appConfigService`:
   - Remove old concept loading functions
   - Implement new data loading functions
   - Update all service tests

4. The system must update all components:
   - Update `PersonalGoalsManagementView`
   - Update `GoalDialog`
   - Update `QualitativeAssessmentView`
   - Update any other components using the old models

5. All code must be fully tested:
   - Unit tests for new data structures
   - Integration tests for updated components
   - Verify no regressions in existing functionality

**Technical Notes**
1. New Data File Structure:
   ```typescript
   // src/data/qualitativeConcepts.data.ts
   import type { QualitativeConcept } from '@/types';

   export const qualitativeConcepts: QualitativeConcept[] = [
     {
       id: "financial",
       name: "Financial Considerations",
       description: "Factors related to personal finance, taxation, cost of living, and economic stability."
     },
     // ... other concepts as specified in qualitative-data-lists.md
   ];

   // src/data/qualitativeStatements.data.ts
   import type { QualitativeStatement } from '@/types';

   export const qualitativeStatements: QualitativeStatement[] = [
     {
       id: "financial-1",
       conceptId: "financial",
       statementText: "I want to minimize my tax burden",
       sentiment: "positive"
     },
     // ... other statements as specified in qualitative-data-lists.md
   ];
   ```

2. Type Definitions:
   ```typescript
   // src/types/qualitative.ts
   export interface QualitativeConcept {
     id: string;
     name: string;
     description: string;
   }

   export interface QualitativeStatement {
     id: string;
     conceptId: string;
     statementText: string;
     sentiment: "positive" | "neutral" | "negative";
   }

   export interface UserQualitativeGoal {
     id: string;
     conceptId: string;
     name: string;
     weight: "Low" | "Medium" | "High" | "Critical";
   }
   ```

3. Service Updates:
   ```typescript
   // src/services/appConfigService.ts
   export class AppConfigService {
     getQualitativeConcepts(): QualitativeConcept[] {
       return qualitativeConcepts;
     }

     getQualitativeStatements(): QualitativeStatement[] {
       return qualitativeStatements;
     }
   }
   ```

**Tasks / Subtasks**
1. [ ] Data Structure Implementation
   - [ ] Create new data files
   - [ ] Remove old data files
   - [ ] Update imports across the codebase

2. [ ] Type Definition Updates
   - [ ] Create new interfaces
   - [ ] Remove old interfaces
   - [ ] Update type references

3. [ ] Service Updates
   - [ ] Update `appConfigService`
   - [ ] Remove old functions
   - [ ] Update tests

4. [ ] Component Updates
   - [ ] Update all views
   - [ ] Update all dialogs
   - [ ] Update all services
   - [ ] Update all tests

5. [ ] Testing & Validation
   - [ ] Unit tests for new code
   - [ ] Integration tests
   - [ ] End-to-end tests

**Dependencies**
- Story 4.1 (Personal Goals) must be completed first
- This story is a prerequisite for Story 4.4 (Cross-Epic Impacts)

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Initial story creation
    * Defined new data structures
    * Outlined implementation tasks
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO) 