## Prompt for Scrum Master: Implementing Date Object Refactor

**Objective:** Hello SM. The project's architecture has been updated to improve type safety and code quality. The new standard is to handle all dates as native JavaScript `Date` objects within the application's runtime state, rather than as strings. Your task is to create the necessary technical refactor stories to implement this architectural change across the codebase.

### 1. Core Architectural Change

The definitive source of truth for this change is the new **`architecture-lean-v1.4.md`** document. Please refer to it.

The key changes are:
* **Data Model Update:** All properties in our data models that represent a date (e.g., `Asset.acquisitionDate`, `Scenario.residencyStartDate`) have been changed from type `string` to `Date`.
* **New Hydration Strategy:** A new "data hydration" layer is required. When loading data from `localStorage` or a URL, the JSON data must be parsed with a "reviver" function that converts all ISO date strings back into `Date` objects. This ensures the in-memory state is always correctly typed.

### 2. Your Task: Create Refactor Stories

Please create one or more new technical refactor stories to implement this change. The stories must cover the following work:

1.  **Update All TypeScript Interfaces:** Go through the codebase (likely in `src/types/`) and update all relevant interfaces to use the `Date` type for date properties, aligning them with `architecture-lean-v1.4.md`.
2.  **Implement the Data Hydration Logic:**
    * In the services responsible for loading data (`localStorageService.ts`, `planSharingService.ts`), implement the `reviver` function for `JSON.parse()` to correctly convert date strings to `Date` objects upon loading.
3.  **Refactor Components and Logic:**
    * Search the codebase for any place where a date string was being manually converted (e.g., `new Date(someString)`).
    * Refactor these components and functions to now expect and use a native `Date` object directly. This will simplify logic throughout the app.
4.  **Update All Tests:** All unit and integration tests that mock or interact with these data models must be updated to use `Date` objects instead of date strings to pass.

### 3. Priority & Sequencing

This is a foundational refactor that affects many parts of the application. Please sequence the created stories with high priority to ensure the codebase aligns with the new architecture before new feature development continues on top of it.

### 4. Final Output

The final output should be the new story/stories, created in the `/docs/stories` directory, with clear Acceptance Criteria, ready for a Dev agent to implement.


---

I've asked the developer to identify anywhere in the application that references, uses, or handles dates. Below is the report he created. This information may be useful to you.

Based on my analysis, here's an itemized list of date handling in the codebase:

1. **Model Definitions (src/types/index.ts)**:
   - `Asset.acquisitionDate`: Defined as `Date`
   - `Scenario.residencyStartDate`: Defined as `Date | string` (currently allows both types)

2. **Date Utility Functions (src/utils/date.ts)**:
   - `toDateInputValue`: Converts Date/string to YYYY-MM-DD format for HTML date inputs
   - Handles both string and Date inputs
   - Includes validation for ISO date strings

3. **Date Handling in Components**:
   - **ScenarioEditorView.tsx**:
     - Converts date input values to Date objects
     - Uses `toDateInputValue` for form display
     - Handles date validation
     - Converts between string and Date formats for form handling

4. **Date Handling in Services**:
   - **calculationService.ts**:
     - Converts string dates to Date objects for calculations
     - Validates date presence
     - Uses dates for year calculations

5. **Date Handling in State Management**:
   - **userAppStateSlice.ts**:
     - Handles date updates in asset and scenario updates
     - Stores dates in state

6. **Date Handling in Tests**:
   - **planSharingService.test.ts**:
     - Uses Date objects in test data
     - Tests date serialization/deserialization

7. **Date Handling in Sharing/Storage**:
   - Dates are converted to strings when:
     - Saving to localStorage
     - Creating shareable URLs
     - Serializing state

Recommendations for Standardization:

1. **Model Updates**:
   ```typescript
   // Update Scenario interface
   export interface Scenario {
     // ... other fields ...
     residencyStartDate: Date; // Remove string option
   }
   ```

2. **Conversion Points**:
   - Create a dedicated service for date handling with these functions:
     ```typescript
     // src/services/dateService.ts
     export const dateService = {
       // Convert string to Date (for loading from storage/URL)
       fromString: (dateStr: string): Date => new Date(dateStr),
       
       // Convert Date to string (for saving to storage/URL)
       toString: (date: Date): string => date.toISOString(),
       
       // Format for display
       formatForDisplay: (date: Date): string => date.toLocaleDateString(),
       
       // Format for input
       formatForInput: (date: Date): string => date.toISOString().split('T')[0]
     };
     ```

3. **Implementation Strategy**:
   1. Update the `Scenario` interface to only use `Date`
   2. Create the `dateService` for centralized date handling
   3. Update components to use `dateService` instead of direct conversions
   4. Update storage/sharing logic to use `dateService` for serialization/deserialization
   5. Add validation to ensure dates are always stored as `Date` objects in state

4. **Migration Plan**:
   1. Add type guards to identify string dates in state
   2. Create a migration function to convert string dates to Date objects
   3. Update components one at a time to use the new date service
   4. Add runtime validation to ensure no string dates enter the system
   5. Update tests to use Date objects consistently
