## Story 6.1: Date Object Type Safety Refactor

**As a** developer
**I want** all date-related properties in our data models to be consistently handled as native JavaScript `Date` objects
**So that** we can ensure type safety and simplify date calculations throughout the application

### Status: Complete

### Context
The architecture has been updated to standardize date handling across the application. All date properties in our data models must be `Date` objects in memory, with conversion to/from ISO strings only happening at the serialization boundary.

### Acceptance Criteria

1. **Type Definition Updates**
   - [x] Update all interfaces in `src/types/index.ts` to use `Date` type for date properties:
     - `Asset.acquisitionDate`
     - `Scenario.residencyStartDate`
     - `ScenarioAssetTaxDetail.residencyAcquisitionDate`
   - [x] Remove any `string` type options from date properties
   - [x] Add JSDoc comments explaining the date handling strategy

2. **Data Hydration Layer**
   - [x] Create a new `dateHydrationService.ts` with:
     - `reviver` function for `JSON.parse()` to convert date strings to `Date` objects
     - `replacer` function for `JSON.stringify()` to convert `Date` objects to ISO strings
   - [x] Update `localStorageService.ts` to use the hydration service
   - [x] Update `planSharingService.ts` to use the hydration service

3. **Date Utility Service**
   - [x] Create `dateService.ts` with utility functions:
     ```typescript
     export const dateService = {
       fromString: (dateStr: string): Date => new Date(dateStr),
       toString: (date: Date): string => date.toISOString(),
       formatForDisplay: (date: Date): string => date.toLocaleDateString(),
       formatForInput: (date: Date): string => date.toISOString().split('T')[0]
     };
     ```

4. **Validation**
   - [x] Add runtime type guards to validate date properties
   - [x] Add error handling for invalid date conversions
   - [x] Add logging for date conversion failures

### Technical Notes

1. **Implementation Strategy**
   - Create the date service and hydration layer first
   - Update type definitions
   - Update components to use the new services
   - Add validation and error handling

2. **Testing Requirements**
   - Unit tests for date service functions
   - Unit tests for hydration service
   - Integration tests for localStorage and sharing
   - Type guard validation tests

3. **Migration Considerations**
   - Handle existing data in localStorage
   - Handle existing shared URLs
   - Add data migration function if needed

### Definition of Done
- [x] All date properties in models are `Date` type
- [x] Date hydration layer is implemented and tested
- [x] Date utility service is implemented and tested
- [x] All components use the new date services
- [x] Validation and error handling is in place
- [x] Tests pass and provide good coverage
- [x] Documentation is updated

### Next Steps
1. Begin work on Story 6.2 for component updates 