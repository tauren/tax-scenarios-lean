# Story 4.8: Display Actual Goal Names in Qualitative Attribute Cards

## Description
As a user, I want to see the actual name of the goal that my qualitative attributes are mapped to, displayed as "Goal: [Goal Name]", and I want a clear visual alert when attributes are not mapped to any goal, so that I can quickly understand which specific goals my attributes align with and be reminded to map unmapped attributes.

## Status: Complete

## Acceptance Criteria
1. When a qualitative attribute is mapped to a goal, the card should display "Goal: [Goal Name]" instead of "Mapped to: [Goal Name]"
2. If the goal name cannot be found, fall back to displaying "Mapped to Goal"
3. When an attribute is not mapped to any goal, display a red alert message "No goal mapped" to encourage the user to map it
4. The implementation should be efficient and not pass entire goal arrays to individual cards

## Technical Implementation
- Modified `QualitativeAttributeCard` component to accept a `getGoalNameById` function prop
- Updated goal display format to "Goal: [Goal Name]" for better UX
- Added red alert styling for unmapped attributes using destructive colors
- Updated `QualitativeAttributesContainer` to provide the goal lookup function
- Implemented fallback behavior for cases where goal is not found
- Updated `QualitativeAttributeList` component for consistency
- Added comprehensive tests to verify functionality including the new alert message

## Files Modified
- `src/components/shared/QualitativeAttributeCard.tsx`
- `src/components/shared/QualitativeAttributesContainer.tsx`
- `src/components/shared/QualitativeAttributeList.tsx`
- `src/components/shared/__tests__/QualitativeAttributeCard.test.tsx` (created)

## Testing
- ✅ All existing tests pass
- ✅ New tests verify goal name display functionality
- ✅ Handles edge cases (missing goals, unmapped attributes)

## Tasks
- [x] Update QualitativeAttributeCard interface
- [x] Implement goal lookup function in container
- [x] Update display logic to show actual goal names
- [x] Handle fallback cases gracefully
- [x] Update related components for consistency
- [x] Add comprehensive tests
- [x] Verify all existing functionality remains intact

## Progress Notes
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes:**
    * Successfully implemented goal name display functionality with "Goal: [Goal Name]" format
    * Added red alert message for unmapped attributes to encourage user action
    * Used efficient function-based approach instead of passing entire goal arrays
    * Added proper error handling and fallback behavior
    * Implemented visual hierarchy with muted styling for mapped goals and destructive styling for unmapped attributes
    * All tests passing, no breaking changes
* **Change Log:**
    * Initial implementation - [Date] - Claude 3.7 Sonnet
    * Updated with improved UX and alert styling - [Current Date] - Claude 3.7 Sonnet 