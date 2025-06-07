## Story 6.2: Component Date Handling Refactor

**As a** developer
**I want** all components to use the new date service and handle dates consistently
**So that** we can ensure proper date handling throughout the UI and prevent type-related bugs

### Status: Complete

### Context
Following the implementation of the date service and hydration layer, we need to update all components to use the new date handling system consistently.

### Acceptance Criteria

1. **ScenarioEditorView Updates**
   - [x] Update date input handling to use `dateService`
   - [x] Remove direct `toDateInputValue` usage
   - [x] Update form validation for dates
   - [x] Update date display formatting

2. **Asset Management Updates**
   - [x] Update asset creation/editing forms to use `dateService`
   - [x] Update asset display components to use proper date formatting
   - [x] Update asset validation logic

3. **Calculation Service Updates**
   - [x] Update `calculationService.ts` to expect `Date` objects
   - [x] Remove any string-to-date conversions
   - [x] Update year calculations to use `Date` methods

4. **State Management Updates**
   - [x] Update `userAppStateSlice.ts` to handle dates consistently
   - [x] Update state actions to use `Date` objects
   - [x] Update state selectors to handle dates properly

5. **Test Updates**
   - [x] Update component tests to use `Date` objects in test data
   - [x] Add tests for date formatting and validation
   - [x] Update integration tests for date handling

### Technical Notes

1. **Component Update Strategy**
   - Start with form components
   - Update display components
   - Update calculation logic
   - Update state management

2. **Testing Requirements**
   - Unit tests for date handling in components
   - Integration tests for form submissions
   - E2E tests for date-related workflows

3. **UI/UX Considerations**
   - Ensure consistent date formatting across the app
   - Maintain proper date input validation
   - Handle timezone considerations

### Definition of Done
- [x] All components use `dateService` for date handling
- [x] All forms properly handle date inputs
- [x] All date displays are consistently formatted
- [x] All tests pass and provide good coverage
- [x] No direct string-to-date conversions in components
- [x] UI/UX remains consistent and user-friendly

### Next Steps
1. Begin work on Story 6.3 for date migration 