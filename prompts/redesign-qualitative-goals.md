**Subject: New Design for Qualitative Assessment Feature**

Hi Sarah,

Based on a detailed design review, we have significantly improved the user experience and data model for the qualitative assessment feature. Please use this summary to guide the update of all relevant user stories (primarily under Epic 4, but with potential impacts elsewhere).

**1. The Core Problem Solved:**
The previous design was based on generic topics (e.g., "Climate"), which was ambiguous for users to evaluate. The new design is based on specific, preference-oriented goal statements that are more intuitive and lead to a more meaningful score.

**2. New Data Models:**
The system will now use a two-tiered data structure:

* **`QualitativeConcept`:** A fixed master list of broad categories (e.g., `id: "lifestyle"`, `name: "Lifestyle & Culture"`). This provides high-level organization.
* **`QualitativeStatement`:** A master list of specific, selectable preference statements (e.g., `"Vibrant arts and cultural scene"`). Each statement is linked to a parent `QualitativeConcept` via a `conceptId`.

**3. New User Goal Model:**
A `UserQualitativeGoal` is no longer a static reference. When a user selects a statement, a *new, unique goal object is created* for their plan. This object has its own unique `id` (`goalId`) and a customizable `name` field, which is pre-filled with the statement text.

**4. New Scenario Attribute Model & Workflow:**
This is the most significant UX improvement, introducing the **"Jot Down & Map"** workflow.

* **The Model:** The `ScenarioAttribute` model now includes a `notes` field (for the user's free-text observation) and an optional `goalId` field for mapping.
* **The Workflow:**
    1.  **Jot Down:** In a scenario editor (e.g., for Florida), a user can directly add an attribute by writing a note, like "Feels very hot and humid in the summer." They can immediately assign their `sentiment` ("Negative") and `significance` ("High"). At this point, the attribute is unmapped.
    2.  **Map:** The UI will indicate that the attribute is unmapped. The user can then map this attribute to one of their personal `UserQualitativeGoals` (e.g., their goal for "I prefer mild temperatures year-round").
    3.  **Scoring:** Only attributes that have been mapped to a `UserQualitativeGoal` will be used in the `QualitativeFitScore` calculation. Unmapped attributes function as personal notes for that scenario.

This new design is more flexible, personal, and intuitive, supporting both top-down (goals-first) and bottom-up (scenario-first) planning. Please ensure the user stories are updated to reflect these new models and this improved user flow.

***

### Comprehensive Master Data Lists

Here is a more fleshed-out set of `Concepts` and `Statements` to serve as the master list for the application.

#### 1. `QualitativeConcept` Data
This list is comprehensive yet concise, covering the major domains of life that people consider when relocating. Since users cannot add new concepts, this list is designed to be all-encompassing at a high level.


```typescript
[
  {
    id: "financial",
    name: "Financial Considerations",
    description: "Factors related to personal finance, taxation, cost of living, and economic stability."
  },
  {
    id: "lifestyle_culture",
    name: "Lifestyle & Culture",
    description: "The daily life, cultural environment, recreational activities, and social norms of a location."
  },
  {
    id: "health_healthcare", // REVISED: More focused name
    name: "Health & Healthcare",
    description: "Aspects related to the quality, cost, and accessibility of the healthcare system."
  },
  {
    id: "safety_stability", // NEW: Created based on your feedback
    name: "Safety & Stability",
    description: "The level of personal safety, low crime rates, and the political and social stability of a location."
  },
  {
    id: "environment_climate", // NEW: Created based on your feedback
    name: "Environment & Climate",
    description: "The typical weather patterns, air quality, and overall natural environment."
  },
  {
    id: "governance_bureaucracy",
    name: "Governance & Bureaucracy",
    description: "The political climate, legal system, bureaucratic efficiency, and ease of residency."
  },
  {
    id: "infrastructure_connectivity",
    name: "Infrastructure & Connectivity",
    description: "The quality of essential services like transport, internet, and international travel access."
  },
  {
    id: "career_education",
    name: "Career & Education",
    description: "Opportunities for professional employment, business development, and education for oneself or family."
  },
  {
    id: "social_community",
    name: "Social & Community",
    description: "The social environment, including language, ease of integration, and community support networks."
  }
]
```

#### 2. `QualitativeStatement` Data
This is a richer list of starting points for users, grouped by their parent `conceptId`.

```typescript
[
  // === FINANCIAL === (conceptId: "financial")
  { id: "fin-low-gct", statementText: "A low or zero Capital Gains Tax rate", conceptId: "financial" },
  { id: "fin-low-income-tax", statementText: "A low overall personal income tax burden", conceptId: "financial" },
  { id: "fin-affordable-housing", statementText: "Reasonable and affordable housing options (rent or buy)", conceptId: "financial" },
  { id: "fin-low-cost-living", statementText: "A low general cost of living (groceries, utilities, etc.)", conceptId: "financial" },
  { id: "fin-currency-stability", statementText: "A stable local currency and reliable banking system", conceptId: "financial" },

  // === LIFESTYLE & CULTURE === (conceptId: "lifestyle_culture")
  { id: "life-work-balance", statementText: "A culture that values a healthy work-life balance", conceptId: "lifestyle_culture" },
  { id: "life-food-scene", statementText: "A vibrant and diverse culinary and restaurant scene", conceptId: "lifestyle_culture" },
  { id: "life-nightlife", statementText: "Diverse and accessible entertainment and nightlife options", conceptId: "lifestyle_culture" },
  { id: "life-arts-culture", statementText: "A rich and active arts and cultural scene (museums, theater, music)", conceptId: "lifestyle_culture" },
  { id: "life-outdoor-rec", statementText: "Abundant opportunities for outdoor recreation (hiking, beaches, parks)", conceptId: "lifestyle_culture" },

  // === HEALTH & HEALTHCARE === (conceptId: "health_healthcare") // MOVED-IN: Now focused on healthcare.
  { id: "hw-high-quality-health", statementText: "Access to high-quality, modern medical facilities and specialists", conceptId: "health_healthcare" },
  { id: "hw-affordable-health", statementText: "Affordable healthcare costs and comprehensive insurance options", conceptId: "health_healthcare" },

  // === SAFETY & STABILITY === (conceptId: "safety_stability") // MOVED-IN: New, dedicated concept for safety.
  { id: "ss-low-crime", statementText: "Low crime rates and a strong sense of personal safety", conceptId: "safety_stability" },
  { id: "ss-political-stability", statementText: "A stable political environment, distant from geopolitical conflicts", conceptId: "safety_stability" },
  
  // === ENVIRONMENT & CLIMATE === (conceptId: "environment_climate") // MOVED-IN: New, dedicated concept for climate/environment.
  { id: "ec-sunny-climate", statementText: "A predominantly warm and sunny climate", conceptId: "environment_climate" },
  { id: "ec-seasons-climate", statementText: "Four distinct seasons with varied weather", conceptId: "environment_climate" },
  { id: "ec-clean-air", statementText: "High air and environmental quality with low pollution", conceptId: "environment_climate" },

  // === GOVERNANCE & BUREAUCRACY === (conceptId: "governance_bureaucracy")
  { id: "gov-low-bureaucracy", statementText: "Simple, efficient, and transparent government bureaucracy", conceptId: "governance_bureaucracy" },
  { id: "gov-easy-residency", statementText: "Clear and attainable pathways to long-term residency or citizenship", conceptId: "governance_bureaucracy" },
  { id: "gov-rule-of-law", statementText: "A strong and impartial rule of law that protects personal and property rights", conceptId: "governance_bureaucracy" },

  // === INFRASTRUCTURE & CONNECTIVITY === (conceptId: "infrastructure_connectivity")
  { id: "infra-fast-internet", statementText: "Fast, reliable, and affordable high-speed internet", conceptId: "infrastructure_connectivity" },
  { id: "infra-public-transport", statementText: "Efficient, clean, and extensive public transportation", conceptId: "infrastructure_connectivity" },
  { id: "infra-airport", statementText: "Excellent connectivity via a major international airport", conceptId: "infrastructure_connectivity" },
  { id: "infra-walkability", statementText: "A highly walkable city center with pedestrian-friendly areas", conceptId: "infrastructure_connectivity" },

  // === CAREER & EDUCATION === (conceptId: "career_education")
  { id: "ce-job-market", statementText: "A strong job market with opportunities in my field", conceptId: "career_education" },
  { id: "ce-business-friendly", statementText: "A favorable environment for entrepreneurs and starting a business", conceptId: "career_education" },
  { id: "ce-good-schools", statementText: "Access to high-quality international or private schools for children", conceptId: "career_education" },
  { id: "ce-higher-ed", statementText: "Access to prestigious universities for higher education", conceptId: "career_education" },

  // === SOCIAL & COMMUNITY === (conceptId: "social_community")
  { id: "sc-english-spoken", statementText: "English is widely spoken, making daily life easy without the local language", conceptId: "social_community" },
  { id: "sc-expat-community", statementText: "A large, active, and welcoming expat community", conceptId: "social_community" }, // FIXED: Typo "id:g id:" is corrected.
  { id: "sc-easy-integration", statementText: "Ease of social integration with the local population", conceptId: "social_community" },
  { id: "sc-family-proximity", statementText: "Geographic proximity to my family and friends", conceptId: "social_community" }
]
```
