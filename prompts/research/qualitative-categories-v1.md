# Qualitative Categories Research Prompt

**Purpose:** Determine the optimal set of categories for organizing global qualitative concepts in a tax planning and international relocation context.

**Last Updated:** 2024-03-19
**Version:** 1.0.0

## Prompt

Please analyze and recommend the optimal set of categories for organizing qualitative concepts that would be relevant for someone considering international tax planning and relocation. The categories should be comprehensive, mutually exclusive, and collectively exhaustive (MECE).

The response should be a valid JSON array of objects conforming to this TypeScript interface:

```typescript
interface QualitativeCategory {
  id: string;           // Unique identifier (e.g., "FINANCIAL")
  name: string;         // Human-readable name
  description: string;  // Brief description of what this category encompasses
  rationale: string;    // Explanation of why this category is important for tax planning/relocation decisions
  exampleConcepts: string[];  // 2-3 example concepts that would fit in this category
}
```

## Guidelines

1. **Category Requirements:**
   - Categories should be MECE (Mutually Exclusive, Collectively Exhaustive)
   - Each category should be distinct and not overlap significantly with others
   - Categories should cover all important aspects of tax planning and relocation decisions
   - Categories should be broad enough to accommodate multiple related concepts
   - Categories should be specific enough to be meaningful

2. **Consider These Aspects:**
   - Direct financial impact (taxes, costs)
   - Quality of life factors
   - Practical considerations
   - Long-term stability and security
   - Cultural and social aspects
   - Legal and regulatory environment
   - Infrastructure and services
   - Personal and family considerations

3. **Evaluation Criteria:**
   - How relevant is this category to tax planning decisions?
   - How important is this category for relocation decisions?
   - Can concepts in this category be objectively measured or assessed?
   - Is this category applicable across different locations and scenarios?
   - Does this category provide meaningful insights for decision-making?

4. **Response Format:**
   - Return a valid JSON array of QualitativeCategory objects
   - Use UPPERCASE_SNAKE_CASE for IDs
   - Keep descriptions and rationales concise but informative
   - Provide 2-3 concrete examples for each category

## Usage Notes

This prompt is designed to help determine the foundational categories that will be used to organize qualitative concepts throughout the application. The categories should be comprehensive enough to cover all important aspects of tax planning and relocation decisions while being specific enough to provide meaningful organization.

## Related Files
- `src/models/index.ts` - Will contain the category definitions
- `src/data/globalQualitativeConcepts.data.ts` - Will use these categories
- `docs/architecture-lean-v1.2.md` - Contains the data model specifications

## Change Log
- 2024-03-19: Initial version created 