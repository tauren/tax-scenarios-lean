# Architect Prompt: Qualitative Feature Refactoring

## Context
Please review the following files for context:
1. `prompts/qualitative-feature-refactor-brief.md` - Contains the new design rationale and data models
2. `prompts/qualitative-data-lists.md` - Contains the predefined data sets for concepts and statements
3. `docs/stories/story-4.2-data-cleanup.md` - Contains the implementation details for the new data models
4. `docs/stories/story-4.4-cross-epic-impacts.md` - Contains the cross-epic impact analysis
5. `docs/stories/story-4.5-scenario-attributes.md` - Contains the new workflow implementation
6. `docs/stories/story-4.6-qualitative-fit.md` - Contains the score calculation updates
7. `docs/stories/story-4.7-scoring-system.md` - Contains the new scoring service implementation

## Key Changes Since Original Brief
1. **Story Structure**
   - Clear, linear sequence: 4.2 → 4.4 → 4.5 → 4.6 → 4.7
   - Each story has a focused, well-defined scope
   - Dependencies are explicitly defined between stories

2. **Implementation Approach**
   - Direct implementation of new data models
   - Clean removal of legacy code and structures
   - Focus on maintainable, well-tested code

3. **Scoring System**
   - Dedicated scoring service with clear responsibilities
   - Detailed score breakdowns for better user understanding
   - Performance optimizations (caching, batch processing)
   - Separation of scoring logic from calculation service

4. **Cross-Epic Integration**
   - Explicit handling of impacts on Epics 2, 3, 5, and 6
   - Clear sequencing of changes across epics
   - Focus on maintaining system consistency

## Overview
The qualitative assessment feature is being refactored to improve its data model, workflow, and scoring system. This refactoring is part of Epic 4 and involves significant changes to how qualitative data is structured and processed.

## Key Changes Required

### 1. Data Model Updates
- Remove legacy data models:
  - `GlobalQualitativeConcept`
  - `QualitativeCategory`
  - Old `QualitativeStatement` structure
- Implement new data models:
  ```typescript
  interface QualitativeConcept {
    id: string;
    name: string;
    description: string;
  }

  interface QualitativeStatement {
    id: string;
    conceptId: string;
    statementText: string;
  }

  interface UserQualitativeGoal {
    id: string;
    conceptId: string;
    name: string;
    weight: "Low" | "Medium" | "High" | "Critical";
  }
  ```

### 2. Workflow Updates
- Implement "Jot Down & Map" workflow for scenario attributes
- Update UI components to support new workflow
- Add validation for attribute mapping
- Improve user feedback during assessment

### 3. Scoring System
- Create new `QualitativeScoringService`
- Implement new scoring algorithm:
  - Consider mapped attributes only
  - Weight based on attribute significance and goal weight
  - Convert sentiment to numerical values (-1 to 1)
  - Convert significance to weights (0.5 to 2.0)
  - Normalize final score to 0-100
- Add performance optimizations:
  - Caching
  - Batch processing
  - Memoization

### 4. Cross-Epic Impacts
- Update Epic 2 (Scenario Management) to handle new attribute structure
- Update Epic 3 (Goal Management) to use new goal model
- Update Epic 5 (Reporting) to support new scoring system
- Update Epic 6 (Analytics) to work with new data structure

## Implementation Phases

### Phase 1: Data Model Implementation (Story 4.2)
- Create new data files and structures
- Remove old data files and interfaces
- Update all components to use new models
- Add comprehensive testing

### Phase 2: Cross-Epic Updates (Story 4.4)
- Update affected epics
- Add new features to existing functionality
- Ensure all components work together

### Phase 3: Scenario Attributes (Story 4.5)
- Implement new workflow
- Update UI components
- Add validation
- Improve user experience

### Phase 4: Qualitative Fit (Story 4.6)
- Update score calculation
- Improve score display
- Add detailed breakdowns
- Enhance user feedback

### Phase 5: Scoring System (Story 4.7)
- Implement new scoring service
- Add performance optimizations
- Update all score calculations
- Add comprehensive testing

## Technical Considerations

### Performance
- Use WeakMap for caching
- Implement batch processing
- Add memoization for expensive calculations
- Optimize data loading and processing

### Security
- Validate all data transformations
- Sanitize user inputs
- Implement proper error handling

### Testing
- Unit tests for all new components
- Integration tests for workflows
- Performance tests for scoring
- End-to-end tests for user flows

### Documentation
- Update API documentation
- Document new workflows
- Update architecture diagrams

## Questions for Architect
1. What's the best approach for caching in the new scoring system?
2. How can we optimize the performance of the attribute mapping workflow?
3. What's the recommended strategy for handling concurrent updates to qualitative data?
4. How should we structure the new scoring service to support future extensions?
