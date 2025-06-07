## Story 4.4: Implement "Jot Down & Map" Workflow for Scenario Attributes

**Status:** Ready for Development

**Story**
- As a user, I want to use the new "Jot Down & Map" workflow to add and manage qualitative attributes for my scenarios, so that I can more naturally capture and organize my preferences about each location.

**Acceptance Criteria (ACs)**
1. The system must implement the "Jot Down" functionality:
   - Users can add free-text notes about a scenario (e.g., "Florida is hot and humid")
   - Users can assign a personal sentiment (positive/negative/neutral)
   - Users can assign a significance level (Low/Medium/High/Critical)
   - These attributes are initially "unmapped" to any personal goal

2. The system must implement the "Map" functionality:
   - Users can view a list of unmapped attributes for a scenario
   - Users can select a personal goal from their `UserQualitativeGoals` list
   - Users can link the attribute to the selected goal
   - Once mapped, the attribute affects the `QualitativeFitScore`

3. The UI must provide clear visual indicators for:
   - Unmapped vs mapped attributes
   - The mapping status of each attribute
   - The impact of each attribute on the overall fit score

4. The system must maintain backward compatibility:
   - Support existing scenario attributes during the transition
   - Provide clear migration paths for existing data
   - Handle edge cases gracefully

**Technical Notes**
1. Data Model Usage:
   ```typescript
   interface ScenarioQualitativeAttribute {
     id: string;
     scenarioId: string;
     text: string;
     sentiment: "positive" | "negative" | "neutral";
     significance: "Low" | "Medium" | "High" | "Critical";
     mappedGoalId?: string;
   }
   ```

2. UI Components:
   - `QualitativeAttributeInput.tsx`: For jotting down new attributes
   - `QualitativeAttributeList.tsx`: To display and manage attributes
   - `AttributeMappingDialog.tsx`: For mapping attributes to goals
   - `QualitativeFitScoreDisplay.tsx`: Updated to show new scoring

3. State Management:
   - Use the new store slices from Story 4.2
   - Implement proper error handling
   - Support the feature flag system

**Tasks / Subtasks**
1. [ ] UI Component Implementation
   - [ ] Create `QualitativeAttributeInput.tsx`
   - [ ] Create `QualitativeAttributeList.tsx`
   - [ ] Create `AttributeMappingDialog.tsx`
   - [ ] Update `QualitativeFitScoreDisplay.tsx`

2. [ ] State Management Implementation
   - [ ] Add new store actions for attributes
   - [ ] Implement mapping functionality
   - [ ] Add error handling
   - [ ] Support feature flags

3. [ ] Backward Compatibility
   - [ ] Implement migration utilities
   - [ ] Add compatibility layers
   - [ ] Handle edge cases

4. [ ] Testing & Validation
   - [ ] Unit tests for components
   - [ ] Integration tests
   - [ ] Migration testing
   - [ ] User acceptance testing

**Dependencies**
- Story 4.2 (Data Model Integration) must be completed first
- Story 4.3 (Cross-Epic Impacts) must be completed first

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Initial story creation
    * Defined new workflow
    * Outlined UI components
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO) 