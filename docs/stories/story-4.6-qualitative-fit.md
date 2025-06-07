## Story 4.5: Update Qualitative Fit Score Calculation and Display

**Status:** Ready for Development

**Story**
- As a user, I want the system to calculate and display a "Qualitative Fit Score" that accurately reflects my mapped scenario attributes and their alignment with my personal goals, so I can make informed decisions about different locations.

**Acceptance Criteria (ACs)**
1. The `calculateQualitativeFitScore` function must be updated to:
   - Only consider mapped attributes in the score calculation
   - Weight the score based on both attribute significance and goal weight
   - Maintain backward compatibility with existing data
   - Handle edge cases (no mapped attributes, no goals, etc.)

2. The score calculation must:
   - Convert sentiment and significance to numerical values
   - Apply proper weighting based on goal importance
   - Normalize the final score to a consistent scale (0-100)
   - Provide clear documentation of the calculation method

3. The UI must display the score with:
   - Clear labeling and context
   - Visual indicators of score components
   - Responsive design across all viewports
   - Proper error states and loading indicators

4. The system must:
   - Recalculate scores when attributes are mapped/unmapped
   - Recalculate scores when goal weights change
   - Maintain performance with large numbers of attributes
   - Handle concurrent updates gracefully

**Technical Notes**
1. Score Calculation:
   ```typescript
   interface ScoreComponent {
     attributeId: string;
     goalId: string;
     baseScore: number;
     weight: number;
     finalContribution: number;
   }

   interface QualitativeFitScore {
     total: number;
     components: ScoreComponent[];
     lastUpdated: Date;
   }
   ```

2. UI Components:
   - `QualitativeFitScoreDisplay.tsx`: Main score display
   - `ScoreBreakdownDialog.tsx`: Detailed score analysis
   - `ScoreUpdateIndicator.tsx`: Loading/updating states

3. Performance Considerations:
   - Implement efficient recalculation
   - Cache intermediate results
   - Batch updates when possible
   - Use proper memoization

**Tasks / Subtasks**
1. [ ] Score Calculation Implementation
   - [ ] Update `calculateQualitativeFitScore` function
   - [ ] Implement weighting system
   - [ ] Add normalization logic
   - [ ] Handle edge cases

2. [ ] UI Component Implementation
   - [ ] Create/update score display components
   - [ ] Implement score breakdown view
   - [ ] Add loading states
   - [ ] Ensure responsiveness

3. [ ] Performance Optimization
   - [ ] Implement caching
   - [ ] Add batch processing
   - [ ] Optimize calculations
   - [ ] Add performance monitoring

4. [ ] Testing & Validation
   - [ ] Unit tests for calculation
   - [ ] Integration tests
   - [ ] Performance testing
   - [ ] User acceptance testing

**Dependencies**
- Story 4.2 (Data Model Integration) must be completed first
- Story 4.3 (Cross-Epic Impacts) must be completed first
- Story 4.4 (Scenario Attributes) must be completed first

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Initial story creation
    * Defined new calculation approach
    * Outlined UI components
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO) 