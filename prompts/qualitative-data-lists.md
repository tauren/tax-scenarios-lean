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
  { id: "fin-low-gct", text: "A low or zero Capital Gains Tax rate", conceptId: "financial" },
  { id: "fin-low-income-tax", text: "A low overall personal income tax burden", conceptId: "financial" },
  { id: "fin-affordable-housing", text: "Reasonable and affordable housing options (rent or buy)", conceptId: "financial" },
  { id: "fin-low-cost-living", text: "A low general cost of living (groceries, utilities, etc.)", conceptId: "financial" },
  { id: "fin-currency-stability", text: "A stable local currency and reliable banking system", conceptId: "financial" },

  // === LIFESTYLE & CULTURE === (conceptId: "lifestyle_culture")
  { id: "life-work-balance", text: "A culture that values a healthy work-life balance", conceptId: "lifestyle_culture" },
  { id: "life-food-scene", text: "A vibrant and diverse culinary and restaurant scene", conceptId: "lifestyle_culture" },
  { id: "life-nightlife", text: "Diverse and accessible entertainment and nightlife options", conceptId: "lifestyle_culture" },
  { id: "life-arts-culture", text: "A rich and active arts and cultural scene (museums, theater, music)", conceptId: "lifestyle_culture" },
  { id: "life-outdoor-rec", text: "Abundant opportunities for outdoor recreation (hiking, beaches, parks)", conceptId: "lifestyle_culture" },

  // === HEALTH & HEALTHCARE === (conceptId: "health_healthcare") // MOVED-IN: Now focused on healthcare.
  { id: "hw-high-quality-health", text: "Access to high-quality, modern medical facilities and specialists", conceptId: "health_healthcare" },
  { id: "hw-affordable-health", text: "Affordable healthcare costs and comprehensive insurance options", conceptId: "health_healthcare" },

  // === SAFETY & STABILITY === (conceptId: "safety_stability") // MOVED-IN: New, dedicated concept for safety.
  { id: "ss-low-crime", text: "Low crime rates and a strong sense of personal safety", conceptId: "safety_stability" },
  { id: "ss-political-stability", text: "A stable political environment, distant from geopolitical conflicts", conceptId: "safety_stability" },
  
  // === ENVIRONMENT & CLIMATE === (conceptId: "environment_climate") // MOVED-IN: New, dedicated concept for climate/environment.
  { id: "ec-sunny-climate", text: "A predominantly warm and sunny climate", conceptId: "environment_climate" },
  { id: "ec-seasons-climate", text: "Four distinct seasons with varied weather", conceptId: "environment_climate" },
  { id: "ec-clean-air", text: "High air and environmental quality with low pollution", conceptId: "environment_climate" },

  // === GOVERNANCE & BUREAUCRACY === (conceptId: "governance_bureaucracy")
  { id: "gov-low-bureaucracy", text: "Simple, efficient, and transparent government bureaucracy", conceptId: "governance_bureaucracy" },
  { id: "gov-easy-residency", text: "Clear and attainable pathways to long-term residency or citizenship", conceptId: "governance_bureaucracy" },
  { id: "gov-rule-of-law", text: "A strong and impartial rule of law that protects personal and property rights", conceptId: "governance_bureaucracy" },

  // === INFRASTRUCTURE & CONNECTIVITY === (conceptId: "infrastructure_connectivity")
  { id: "infra-fast-internet", text: "Fast, reliable, and affordable high-speed internet", conceptId: "infrastructure_connectivity" },
  { id: "infra-public-transport", text: "Efficient, clean, and extensive public transportation", conceptId: "infrastructure_connectivity" },
  { id: "infra-airport", text: "Excellent connectivity via a major international airport", conceptId: "infrastructure_connectivity" },
  { id: "infra-walkability", text: "A highly walkable city center with pedestrian-friendly areas", conceptId: "infrastructure_connectivity" },

  // === CAREER & EDUCATION === (conceptId: "career_education")
  { id: "ce-job-market", text: "A strong job market with opportunities in my field", conceptId: "career_education" },
  { id: "ce-business-friendly", text: "A favorable environment for entrepreneurs and starting a business", conceptId: "career_education" },
  { id: "ce-good-schools", text: "Access to high-quality international or private schools for children", conceptId: "career_education" },
  { id: "ce-higher-ed", text: "Access to prestigious universities for higher education", conceptId: "career_education" },

  // === SOCIAL & COMMUNITY === (conceptId: "social_community")
  { id: "sc-english-spoken", text: "English is widely spoken, making daily life easy without the local language", conceptId: "social_community" },
  { id: "sc-expat-community", text: "A large, active, and welcoming expat community", conceptId: "social_community" }, // FIXED: Typo "id:g id:" is corrected.
  { id: "sc-easy-integration", text: "Ease of social integration with the local population", conceptId: "social_community" },
  { id: "sc-family-proximity", text: "Geographic proximity to my family and friends", conceptId: "social_community" }
]
```
