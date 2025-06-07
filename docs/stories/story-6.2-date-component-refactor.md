## Story 6.2: Component Date Handling Refactor

**As a** developer
**I want** all components to use the new date service and handle dates consistently
**So that** we can ensure proper date handling throughout the UI and prevent type-related bugs

### Context
Following the implementation of the date service and hydration layer, we need to update all components to use the new date handling system consistently.

### Acceptance Criteria

1. **ScenarioEditorView Updates**
   - [ ] Update date input handling to use `dateService`
   - [ ] Remove direct `toDateInputValue` usage
   - [ ] Update form validation for dates
   - [ ] Update date display formatting

2. **Asset Management Updates**
   - [ ] Update asset creation/editing forms to use `dateService`
   - [ ] Update asset display components to use proper date formatting
   - [ ] Update asset validation logic

3. **Calculation Service Updates**
   - [ ] Update `calculationService.ts` to expect `Date` objects
   - [ ] Remove any string-to-date conversions
   - [ ] Update year calculations to use `Date` methods

4. **State Management Updates**
   - [ ] Update `userAppStateSlice.ts` to handle dates consistently
   - [ ] Update state actions to use `Date` objects
   - [ ] Update state selectors to handle dates properly

5. **Test Updates**
   - [ ] Update component tests to use `Date` objects in test data
   - [ ] Add tests for date formatting and validation
   - [ ] Update integration tests for date handling

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
- [ ] All components use `dateService` for date handling
- [ ] All forms properly handle date inputs
- [ ] All date displays are consistently formatted
- [ ] All tests pass and provide good coverage
- [ ] No direct string-to-date conversions in components
- [ ] UI/UX remains consistent and user-friendly 