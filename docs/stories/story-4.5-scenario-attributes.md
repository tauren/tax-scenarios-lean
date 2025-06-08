# Story 4.5: Jot Down & Map Workflow for Scenario Attributes

## Description
As a user, I want to add qualitative attributes to my scenarios and map them to my personal goals, so that I can better understand how well each scenario aligns with my objectives.

## Acceptance Criteria
1. Users can add qualitative attributes to scenarios with:
   - Free-form text input for jotting down thoughts
   - Sentiment selection (positive, neutral, negative)
   - Significance level (Low, Medium, High, Critical)
2. Users can view a list of attributes for each scenario
3. Users can map attributes to their personal goals
4. The system calculates a qualitative fit score based on:
   - Sentiment alignment with goals
   - Significance of attributes
   - Priority of mapped goals
5. The fit score is displayed prominently in the scenario view

## Technical Notes
- Use Radix UI components for consistent UI
- Implement proper state management for attributes
- Ensure backward compatibility with existing scenarios
- Add appropriate error handling and validation

## Tasks
- [x] Create QualitativeAttributeInput component
- [x] Create QualitativeAttributeList component
- [x] Create AttributeMappingDialog component
- [x] Update QualitativeFitScoreDisplay component
- [x] Implement QualitativeAttributeService
- [x] Add tests for all components and service
- [x] Integrate components into scenario view

## Dependencies
- Story 4.2: Data Cleanup (Completed)
- Story 4.3: Statement Selection (Completed)

## Progress Notes
- Created all required components using Radix UI
- Implemented attribute management service
- Added comprehensive test coverage
- Components are ready for integration into scenario view

## Status: Complete 