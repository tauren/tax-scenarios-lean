## Story 4.4: Handle Cross-Epic Impacts of Qualitative Feature Refactoring

**Status:** In Progress

**Story**
- As a developer, I want to identify and update any components or logic in other epics that are impacted by the new qualitative assessment system, so that we can ensure a smooth transition to the new design while maintaining system stability.

**Acceptance Criteria (ACs)**
1. The system must be analyzed for all components that reference or use:
   - The old qualitative assessment data models
   - The old qualitative scoring system
   - Any UI components that display qualitative information

2. For each identified impact, the system must:
   - Update the component to work with the new data models
   - Maintain backward compatibility during the transition
   - Include proper error handling for edge cases

3. The following epics must be reviewed and updated as needed:
   - Epic 2 (Scenario Management): Update scenario creation, editing, and comparison features
   - Epic 3 (Financial Calculations): Update any qualitative factors in financial calculations
   - Epic 5 (Sharing & Export): Update any qualitative data in sharing or export features

4. All updates must:
   - Be properly tested
   - Include clear documentation
   - Follow the established migration strategy
   - Use the feature flag system for controlled rollout

**Technical Notes**
1. Impact Analysis:
   - Review all components that use `GlobalQualitativeConcept`
   - Review all components that use `ScenarioAttribute`
   - Review all components that use `UserQualitativeGoal`
   - Review all components that use `qualitativeFitScore`

2. Update Strategy:
   - Create wrapper components/functions for backward compatibility
   - Use the feature flag system to control which version is active
   - Implement proper error handling for migration edge cases
   - Add clear logging for debugging during transition

3. Testing Requirements:
   - Unit tests for all updated components
   - Integration tests for cross-epic interactions
   - Migration testing with existing data
   - Performance testing to ensure no degradation

**Impact Analysis Results**

1. Epic 2 (Scenario Management) Impacts:
   a. ScenarioHubView.tsx
      - Uses qualitativeFitScore for scenario comparison
      - Needs update to handle new scoring system
      - Must maintain backward compatibility for existing scenarios
   
   b. ScenarioComparisonTable.tsx
      - Displays and sorts by qualitativeFitScore
      - Needs update to handle new score format
      - Must maintain sorting functionality
   
   c. ScenarioSummaryCard.tsx
      - Shows qualitativeFitScore with visual indicators
      - Needs update to handle new score format
      - Must maintain visual consistency
   
   d. ScenarioSummaryDashboard.tsx
      - Uses qualitativeFitScore for best scenario selection
      - Needs update to handle new scoring logic
      - Must maintain selection accuracy

2. Epic 3 (Financial Calculations) Impacts:
   a. calculationService.ts
      - Contains calculateQualitativeFitScore function
      - Needs complete rewrite to use new scoring system
      - Must maintain score range (0-100)
      - Must handle unmapped attributes correctly
   
   b. types/index.ts
      - Contains type definitions for all qualitative models
      - Needs updates to support new data structures
      - Must maintain backward compatibility
      - Must support new mapping relationships

3. Epic 5 (Sharing & Export) Impacts:
   a. Future Considerations
      - New sharing/export features must handle:
        * New qualitative data models
        * Updated scoring system
        * Mapping relationships
      - Must maintain data integrity during export/import
      - Must handle version differences gracefully

4. Cross-Cutting Concerns:
   a. Data Migration
      - Need strategy for converting existing data
      - Must handle unmapped attributes
      - Must preserve user preferences
   
   b. Performance
      - New scoring system must be efficient
      - Must handle large numbers of attributes
      - Must maintain responsive UI
   
   c. Error Handling
      - Must handle missing mappings
      - Must handle invalid data gracefully
      - Must provide clear error messages

**Tasks**
1. [x] Impact Analysis
   - [x] Review components across Epics 2, 3, and 5
   - [x] Document required updates
   - [x] Create implementation plan

2. [x] Update Types
   - [x] Add QualitativeGoalAlignment type
   - [x] Update ScenarioResults interface
   - [x] Update calculation service types

3. [x] Update Calculation Service
   - [x] Implement goal alignment calculation
   - [x] Update scenario results calculation
   - [x] Add goal contribution tracking

4. [x] Update Scenario Management Components
   - [x] Update ScenarioHubView to handle qualitative goals
   - [x] Update ScenarioSummaryCard to display goal alignments
   - [x] Add goal alignment visualization

5. [x] Update Scenario Comparison Components
   - [x] Update comparison table to show goal alignments
   - [x] Add goal alignment comparison view
   - [x] Update comparison metrics

6. [ ] Testing
   - [ ] Unit tests for new types
   - [ ] Unit tests for calculation service updates
   - [ ] Integration tests for scenario management
   - [ ] End-to-end tests for goal alignment features

7. [ ] Documentation
   - [ ] Update API documentation
   - [ ] Update component documentation
   - [ ] Add usage examples

**Dependencies**
- Story 4.2 (Data Model Integration) must be completed first
- Story 4.3 (Refactor Goal Dialog to Use Statement Selection) must be completed first
- This story is a prerequisite for the remaining Epic 4 stories

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Initial story creation
    * Defined impact analysis approach
    * Outlined update strategy
    * Started implementation - Beginning impact analysis across epics
    * Completed initial impact analysis of components across epics
    * Documented detailed impacts for each epic and cross-cutting concerns
    * Updated types to support new qualitative assessment system
    * Implemented new scoring system in calculation service
* **Change Log:**
    * 2024-03-21: Initial story creation
    * 2024-03-21: Completed impact analysis
    * 2024-03-21: Updated types and calculation service
    * 2024-03-21: Updated scenario management components
    * 2024-03-21: Updated scenario comparison components

## Notes

- The qualitative scoring system now includes detailed goal alignment tracking
- Each scenario's results include goal-specific alignment scores and contributing attributes
- The UI has been updated to show goal alignment status in scenario cards
- The comparison view now includes a dedicated goal alignment comparison table
- Next steps focus on testing and documentation 