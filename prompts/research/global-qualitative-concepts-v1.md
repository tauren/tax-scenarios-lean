# Global Qualitative Concepts Research Prompt

**Purpose:** Generate a comprehensive list of global qualitative concepts that will be used to assess and compare different tax scenarios and locations.

**Last Updated:** 2024-03-19
**Version:** 1.0.0

## Prompt

Please provide a list of 10-12 global qualitative concepts that would be relevant for someone considering international tax planning and relocation. These concepts should be broad enough to apply across different locations and scenarios, while being specific enough to be meaningful for decision-making.

The response should be a valid JSON array of objects conforming to this TypeScript interface:

```typescript
interface GlobalQualitativeConcept {
  id: string;           // Unique identifier (e.g., "CAPITAL_GAINS_TAX_RATE")
  name: string;         // Human-readable name
  category: string;     // One of: "FINANCIAL_IMPACT", "GOVERNANCE_STABILITY", "LIFESTYLE_WELLBEING", "INFRASTRUCTURE_ACCESSIBILITY", "CULTURAL_SOCIAL_ENVIRONMENT", "PERSONAL_DEVELOPMENT_OPPORTUNITIES"
  description: string;  // Brief description of what this concept means
}
```

## Guidelines

1. **Categories to Use:**
   - FINANCIAL_IMPACT: Direct monetary effects on wealth, income, and expenses
   - GOVERNANCE_STABILITY: Political, legal, and administrative environment
   - LIFESTYLE_WELLBEING: Quality of daily life and personal satisfaction
   - INFRASTRUCTURE_ACCESSIBILITY: Essential services and physical networks
   - CULTURAL_SOCIAL_ENVIRONMENT: Local culture, language, and social integration
   - PERSONAL_DEVELOPMENT_OPPORTUNITIES: Education, career, and leisure activities

2. **Concept Requirements:**
   - Each concept should be measurable or observable
   - Concepts should be location-independent but location-applicable
   - Avoid concepts that are too specific to certain regions
   - Focus on concepts that would influence tax planning decisions
   - Ensure even distribution across categories (2-3 concepts per category)

3. **Examples by Category:**
   - FINANCIAL_IMPACT:
     * Capital Gains Tax Rates
     * Personal Income Tax Burden
     * Cost of Living Index
   - GOVERNANCE_STABILITY:
     * Political Stability Index
     * Rule of Law
     * Ease of Bureaucracy
   - LIFESTYLE_WELLBEING:
     * Healthcare System Quality
     * Personal Safety & Crime Rate
     * Climate & Environmental Quality
   - INFRASTRUCTURE_ACCESSIBILITY:
     * Internet Connectivity & Speed
     * Public Transportation Systems
     * Banking & Financial Services
   - CULTURAL_SOCIAL_ENVIRONMENT:
     * Language Barrier
     * Expat Community Size & Vibrancy
     * Cultural Openness & Tolerance
   - PERSONAL_DEVELOPMENT_OPPORTUNITIES:
     * Quality of Education System
     * Job Market & Career Prospects
     * Availability of Hobbies & Recreation

4. **Response Format:**
   - Return a valid JSON array of GlobalQualitativeConcept objects
   - Use UPPERCASE_SNAKE_CASE for IDs
   - Keep descriptions concise but informative
   - Ensure each concept fits into exactly one category
   - Include 2-3 concepts per category

## Usage Notes

This prompt is designed to generate the foundational set of qualitative concepts that will be used throughout the application to assess and compare different tax scenarios and locations. The concepts should be broad enough to be applicable across different contexts but specific enough to provide meaningful insights for decision-making.

## Related Files
- `src/models/index.ts` - Contains the GlobalQualitativeConcept interface
- `src/data/globalQualitativeConcepts.data.ts` - Will store the generated concepts
- `research/qualitative-categories.json` - Contains the category definitions
- `docs/architecture-lean-v1.2.md` - Contains the data model specifications

## Change Log
- 2024-03-19: Initial version created
- 2024-03-19: Updated to use new category structure from qualitative-categories.json 