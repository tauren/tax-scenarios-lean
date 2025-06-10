# Story 4.7: Implement New Qualitative Scoring System

**Status:** Completed

**Story**
- As a developer, I want to implement a new qualitative scoring system that properly considers mapped scenario attributes and their alignment with personal goals, so that users get accurate and meaningful fit scores for their scenarios.

**Acceptance Criteria (ACs)**
1. The system must implement a new scoring service:
   - Create `qualitativeScoringService.ts`
   - Move scoring logic out of `calculationService.ts`
   - Implement proper dependency injection
   - Maintain existing functionality while improving the implementation

2. The scoring calculation must:
   - Only consider mapped attributes in the score
   - Weight based on both attribute significance and goal weight
   - Convert sentiment to numerical values (-1 to 1)
   - Convert significance to weights (0.5 to 2.0) - Note: This is a change from current 0.25-1.0 scale
   - Normalize the final score to 0-100
   - Maintain the same scoring behavior and ranges that users are familiar with

3. The scoring service must provide:
   - All existing score breakdowns (goal alignments, counts, contributions)
   - Enhanced component-level scoring
   - Performance optimizations
   - Clear error handling

4. The system must handle edge cases:
   - No mapped attributes
   - No personal goals
   - Mixed positive/negative sentiments
   - Varying numbers of attributes
   - All existing edge cases currently handled

5. The scoring service must be performant:
   - Cache intermediate results
   - Batch updates when possible
   - Use proper memoization
   - Handle concurrent updates

**Technical Notes**
1. New Scoring Service:
   ```typescript
   // Preserve existing types
   interface QualitativeGoalAlignment {
     goalId: string;
     goalName: string;
     isAligned: boolean;
     alignmentScore: number;
     contributingAttributes: {
       attributeId: string;
       conceptName: string;
       contribution: number;
       maxPossiblePercent: number;
     }[];
   }

   // New types for enhanced functionality
   interface ScoreComponent {
     attributeId: string;
     goalId: string;
     baseScore: number;
     weight: number;
     finalContribution: number;
   }

   interface QualitativeScore {
     // Preserve existing fields
     score: number;
     details: {
       mappedAttributesCount: number;
       unmappedAttributesCount: number;
       goalContributions: { goalId: string; contribution: number }[];
     };
     goalAlignments: QualitativeGoalAlignment[];
     
     // New fields for enhanced functionality
     components: ScoreComponent[];
     lastUpdated: Date;
   }

   class QualitativeScoringService {
     calculateScore(scenario: Scenario, goals: UserQualitativeGoal[]): QualitativeScore;
     getScoreBreakdown(scenarioId: string): ScoreComponent[];
     invalidateCache(scenarioId: string): void;
   }
   ```

2. Scoring Algorithm:
   ```typescript
   const calculateAttributeScore = (
     attribute: ScenarioQualitativeAttribute,
     goal: UserQualitativeGoal
   ): number => {
     // Convert sentiment to -1 to 1 (unchanged)
     const sentimentValue = {
       positive: 1,
       neutral: 0,
       negative: -1
     }[attribute.sentiment];

     // Convert significance to weight (new scale)
     const significanceWeight = {
       Low: 0.5,      // Changed from 0.25
       Medium: 1.0,   // Changed from 0.5
       High: 1.5,     // Changed from 0.75
       Critical: 2.0  // Changed from 1.0
     }[attribute.significance];

     // Convert goal weight to multiplier (new scale)
     const goalWeight = {
       Low: 0.5,      // Changed from 0.25
       Medium: 1.0,   // Changed from 0.5
       High: 1.5,     // Changed from 0.75
       Critical: 2.0  // Changed from 1.0
     }[goal.weight];

     return sentimentValue * significanceWeight * goalWeight;
   };
   ```

3. Performance Optimizations:
   - Use WeakMap for caching
   - Implement batch processing
   - Add memoization for expensive calculations
   - Use proper TypeScript types for better performance

**Tasks / Subtasks**
1. [x] Service Implementation
   - [x] Create `qualitativeScoringService.ts`
   - [x] Implement core scoring logic
   - [x] Add caching and optimization
   - [x] Add error handling

2. [x] Integration
   - [x] Update `calculationService.ts`
   - [x] Update state management
   - [x] Add service to dependency injection
   - [x] Update tests

3. [x] Performance Optimization
   - [x] Implement caching
   - [x] Add batch processing
   - [x] Add memoization
   - [x] Add performance monitoring

4. [x] Testing & Validation
   - [x] Unit tests for scoring logic
   - [x] Integration tests
   - [x] Performance tests
   - [x] Edge case testing

**Dependencies**
- Story 4.2 (Data Cleanup) must be completed first
- Story 4.3 (Data Model Integration) must be completed first
- Story 4.4 (Cross-Epic Impacts) must be completed first
- Story 4.5 (Scenario Attributes) must be completed first
- Story 4.6 (Qualitative Fit) must be completed first

**Implementation Notes**
1. **Existing Functionality:**
   - Keep all existing score breakdowns
   - Maintain goal alignments as they are
   - Preserve attribute counts and contributions
   - Keep the same score range (0-100)
   - Maintain default neutral score (50)

2. **UI Components:**
   - Make minimal necessary changes to existing components
   - Only modify UI components if the data structure changes require it

3. **Scoring Scale Changes:**
   - The new weight scales (0.5-2.0) will provide more granular scoring
   - The normalization process will be adjusted to maintain the same 0-100 output range
   - These changes should be transparent to users

4. **Performance Improvements:**
   - Add caching and optimization without changing scoring behavior
   - Keep performance improvements transparent to users
   - Maintain the same scoring behavior with optimizations

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Initial story creation
    * Defined scoring algorithm
    * Outlined performance optimizations
    * Updated to focus on minimal necessary changes
    * Implemented new scoring service with caching and optimizations
    * Added comprehensive test coverage
    * Updated calculation service to use new scoring service
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO)
    * Updated - June 1, 2025 - Refined approach to focus on minimal necessary changes
    * Completed - June 2, 2025 - Implemented new scoring service with all required functionality 