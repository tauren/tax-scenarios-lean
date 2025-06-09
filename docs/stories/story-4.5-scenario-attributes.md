## Story 4.5: Jot Down & Map Workflow for Scenario Attributes

**Status:** Complete

**Story**
- As a user, I want to add qualitative attributes to my scenarios and map them to my personal goals, so that I can better understand how well each scenario aligns with my objectives.

**Acceptance Criteria (ACs)**
1. Users can add qualitative attributes to scenarios with:
   - Free-form text input for jotting down thoughts
   - Sentiment selection (positive, neutral, negative)
   - Significance level (Low, Medium, High, Critical)

2. Users can view and manage attributes for each scenario:
   - Display list of all attributes for a scenario
   - Edit existing attributes
   - Remove unwanted attributes
   - Clear visual organization and hierarchy

3. Users can map attributes to their personal goals:
   - Select which personal goals each attribute relates to
   - Visual indicators showing mapping relationships
   - Easy modification of goal mappings
   - Support for multiple goal mappings per attribute

4. The system calculates a qualitative fit score based on:
   - Sentiment alignment with goals (positive/negative impact)
   - Significance of attributes (weight in scoring)
   - Priority of mapped goals (user-defined importance)
   - Overall contribution to goal achievement

5. The fit score is displayed prominently in the scenario view:
   - Clear numerical score (0-100 range)
   - Visual progress indicators
   - Breakdown by individual goal contributions
   - Real-time updates as attributes change

**Technical Notes**
1. Component Architecture:
   - Use Radix UI components for consistent design system
   - Implement proper form validation and error handling
   - Ensure responsive design across device sizes
   - Follow accessibility best practices

2. State Management:
   - Integrate with existing Zustand store for persistence
   - Implement optimistic updates for better UX
   - Handle concurrent editing scenarios
   - Maintain data consistency across components

3. Data Model Integration:
   - Work with new QualitativeGoalAlignment system
   - Support backward compatibility with existing scenarios
   - Handle migration of legacy attribute data
   - Ensure type safety throughout the workflow

4. Performance Considerations:
   - Optimize re-renders for large attribute lists
   - Implement debounced saving for text inputs
   - Lazy load mapping dialogs when needed
   - Cache calculated scores for display

**Implementation Details**

1. QualitativeAttributeInput Component:
   - Free-form text input with auto-resize
   - Dropdown for sentiment selection with icons
   - Significance level selector with visual indicators
   - Save/cancel actions with proper validation
   - Real-time character count and limits

2. QualitativeAttributeList Component:
   - Organized display of all scenario attributes
   - Expandable/collapsible sections for large lists
   - Quick edit functionality for existing attributes
   - Bulk operations (delete multiple, change significance)
   - Search and filtering capabilities

3. AttributeMappingDialog Component:
   - Modal dialog for goal mapping interface
   - Multi-select functionality for goal associations
   - Visual representation of mapping relationships
   - Clear indication of mapped vs unmapped goals
   - Batch mapping operations for efficiency

4. QualitativeFitScoreDisplay Component:
   - Prominent score display with visual progress
   - Breakdown by individual goal contributions
   - Expandable details showing calculation logic
   - Historical score tracking and trends
   - Export functionality for analysis

5. QualitativeAttributeService:
   - CRUD operations for attribute management
   - Score calculation algorithms
   - Data validation and sanitization
   - Migration utilities for legacy data
   - Analytics and reporting functions

**Tasks**
1. [x] Design and implement QualitativeAttributeInput component
   - [x] Create responsive form layout
   - [x] Implement sentiment and significance selectors
   - [x] Add proper validation and error handling
   - [x] Integrate with store for persistence

2. [x] Build QualitativeAttributeList component
   - [x] Create organized attribute display
   - [x] Implement edit/delete functionality
   - [x] Add search and filtering capabilities
   - [x] Optimize for performance with large lists

3. [x] Develop AttributeMappingDialog component
   - [x] Design goal mapping interface
   - [x] Implement multi-select functionality
   - [x] Add visual mapping indicators
   - [x] Create batch operation capabilities

4. [x] Enhance QualitativeFitScoreDisplay component
   - [x] Update to show detailed score breakdown
   - [x] Add goal contribution visualization
   - [x] Implement expandable details view
   - [x] Integrate with new scoring system

5. [x] Implement QualitativeAttributeService
   - [x] Create comprehensive CRUD operations
   - [x] Implement score calculation algorithms
   - [x] Add data validation and migration utilities
   - [x] Build analytics and reporting functions

6. [x] Testing and validation
   - [x] Unit tests for all components
   - [x] Integration tests for service layer
   - [x] End-to-end tests for complete workflow
   - [x] Accessibility testing and compliance

7. [x] Integration and deployment
   - [x] Integrate components into scenario edit view
   - [x] Connect with existing goal management system
   - [x] Implement proper error handling and recovery
   - [x] Deploy with feature flag for controlled rollout

**Dependencies**
- Story 4.2: Data Model Integration ✅ Completed
- Story 4.3: Refactor Goal Dialog to Use Statement Selection ✅ Completed
- Story 4.4: Handle Cross-Epic Impacts ✅ Completed
- Required for Story 4.6: Qualitative Fit Score Integration ✅ Ready

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * ✅ Designed and implemented comprehensive QualitativeAttributeInput component with full functionality
    * ✅ Built robust QualitativeAttributeList component with advanced management features
    * ✅ Created intuitive AttributeMappingDialog with multi-goal mapping capabilities
    * ✅ Enhanced QualitativeFitScoreDisplay to show detailed breakdown and goal contributions
    * ✅ Implemented comprehensive QualitativeAttributeService with full CRUD operations
    * ✅ Added extensive test coverage for all components and service functions
    * ✅ Successfully integrated all components into scenario editing workflow
    * ✅ Ensured backward compatibility with existing scenario data
    * ✅ Optimized performance for responsive user experience
    * ✅ Implemented proper accessibility features throughout
    * ✅ Added comprehensive error handling and data validation
    * ✅ Successfully deployed with controlled feature rollout
* **Change Log:**
    * 2024-03-21: Initial story creation and component design
    * 2024-03-21: Implemented core attribute input and list components
    * 2024-03-21: Developed goal mapping functionality and dialog
    * 2024-03-21: Enhanced score display with detailed breakdowns
    * 2024-03-21: Built comprehensive service layer with full capabilities
    * 2024-03-21: Completed testing and integration phases
    * 2024-03-21: Final validation and story completion

## Notes

- ✅ The attribute management workflow provides intuitive jot-down capabilities for users
- ✅ Goal mapping functionality creates clear relationships between attributes and personal objectives
- ✅ Score calculation system accurately reflects sentiment, significance, and goal priority
- ✅ All components follow design system standards and accessibility guidelines
- ✅ Performance optimizations ensure smooth experience even with large attribute datasets
- ✅ Comprehensive testing validates functionality across all user scenarios
- ✅ Integration with existing goal management creates seamless user experience
- ✅ Ready for next phase of qualitative fit score system development 