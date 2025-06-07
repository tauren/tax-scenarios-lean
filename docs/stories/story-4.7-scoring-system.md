## Story 4.7: Implement New Qualitative Scoring System

**Status:** Ready for Development

**Story**
- As a developer, I want to implement a new qualitative scoring system that properly considers mapped scenario attributes and their alignment with personal goals, so that users get accurate and meaningful fit scores for their scenarios.

**Acceptance Criteria (ACs)**
1. The system must implement a new scoring service:
   - Create `qualitativeScoringService.ts`
   - Move scoring logic out of `calculationService.ts`
   - Implement proper dependency injection

2. The scoring calculation must:
   - Only consider mapped attributes in the score
   - Weight based on both attribute significance and goal weight
   - Convert sentiment to numerical values (-1 to 1)
   - Convert significance to weights (0.5 to 2.0)
   - Normalize the final score to 0-100

3. The scoring service must provide:
   - Detailed score breakdowns
   - Component-level scoring
   - Performance optimizations
   - Clear error handling

4. The system must handle edge cases:
   - No mapped attributes
   - No personal goals
   - Mixed positive/negative sentiments
   - Varying numbers of attributes

5. The scoring service must be performant:
   - Cache intermediate results
   - Batch updates when possible
   - Use proper memoization
   - Handle concurrent updates

**Technical Notes**
1. New Scoring Service:
   ```typescript
   interface ScoreComponent {
     attributeId: string;
     goalId: string;
     baseScore: number;
     weight: number;
     finalContribution: number;
   }

   interface QualitativeScore {
     total: number;
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
     // Convert sentiment to -1 to 1
     const sentimentValue = {
       positive: 1,
       neutral: 0,
       negative: -1
     }[attribute.sentiment];

     // Convert significance to weight
     const significanceWeight = {
       Low: 0.5,
       Medium: 1.0,
       High: 1.5,
       Critical: 2.0
     }[attribute.significance];

     // Convert goal weight to multiplier
     const goalWeight = {
       Low: 0.5,
       Medium: 1.0,
       High: 1.5,
       Critical: 2.0
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
1. [ ] Service Implementation
   - [ ] Create `qualitativeScoringService.ts`
   - [ ] Implement core scoring logic
   - [ ] Add caching and optimization
   - [ ] Add error handling

2. [ ] Integration
   - [ ] Update `calculationService.ts`
   - [ ] Update state management
   - [ ] Add service to dependency injection
   - [ ] Update tests

3. [ ] Performance Optimization
   - [ ] Implement caching
   - [ ] Add batch processing
   - [ ] Add memoization
   - [ ] Add performance monitoring

4. [ ] Testing & Validation
   - [ ] Unit tests for scoring logic
   - [ ] Integration tests
   - [ ] Performance tests
   - [ ] Edge case testing

**Dependencies**
- Story 4.2 (Data Cleanup) must be completed first
- Story 4.3 (Data Model Integration) must be completed first
- Story 4.4 (Cross-Epic Impacts) must be completed first
- Story 4.5 (Scenario Attributes) must be completed first
- Story 4.6 (Qualitative Fit) must be completed first

**Story Progress Notes**
* **Agent Model Used:** Claude 3.7 Sonnet
* **Completion Notes List:**
    * Initial story creation
    * Defined scoring algorithm
    * Outlined performance optimizations
* **Change Log:**
    * Initial Draft - May 31, 2025 - Sarah (PO) 