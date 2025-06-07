import type { GlobalQualitativeConcept } from "@/types";

export interface GoalStatement {
  id: string;
  statement: string;
  category: string;
  conceptId: string;
}

export const GOAL_STATEMENTS: GoalStatement[] = [
  // Climate & Weather
  {
    id: "climate-mild",
    statement: "Mild temperatures year-round with minimal extreme weather",
    category: "Weather",
    conceptId: "climate"
  },
  {
    id: "climate-sunny",
    statement: "Abundant sunshine and clear skies throughout the year",
    category: "Weather",
    conceptId: "climate"
  },
  {
    id: "climate-seasons",
    statement: "Distinct seasons with moderate temperature variations",
    category: "Weather",
    conceptId: "climate"
  },
  {
    id: "climate-dry",
    statement: "Low humidity and minimal rainfall",
    category: "Weather",
    conceptId: "climate"
  },

  // Healthcare
  {
    id: "healthcare-quality",
    statement: "Access to world-class medical facilities and specialists",
    category: "Healthcare",
    conceptId: "healthcare"
  },
  {
    id: "healthcare-affordable",
    statement: "Affordable healthcare with comprehensive coverage options",
    category: "Healthcare",
    conceptId: "healthcare"
  },
  {
    id: "healthcare-preventive",
    statement: "Strong focus on preventive care and wellness programs",
    category: "Healthcare",
    conceptId: "healthcare"
  },
  {
    id: "healthcare-english",
    statement: "English-speaking medical professionals readily available",
    category: "Healthcare",
    conceptId: "healthcare"
  },

  // Education
  {
    id: "education-international",
    statement: "International schools with recognized curricula",
    category: "Education",
    conceptId: "education"
  },
  {
    id: "education-higher",
    statement: "Prestigious universities and research institutions",
    category: "Education",
    conceptId: "education"
  },
  {
    id: "education-lifelong",
    statement: "Opportunities for adult education and skill development",
    category: "Education",
    conceptId: "education"
  },
  {
    id: "education-bilingual",
    statement: "Bilingual education programs for children",
    category: "Education",
    conceptId: "education"
  },

  // Cultural Fit
  {
    id: "culture-welcoming",
    statement: "Welcoming and inclusive local community",
    category: "Lifestyle",
    conceptId: "culture"
  },
  {
    id: "culture-diverse",
    statement: "Diverse cultural events and celebrations",
    category: "Lifestyle",
    conceptId: "culture"
  },
  {
    id: "culture-arts",
    statement: "Vibrant arts and cultural scene",
    category: "Lifestyle",
    conceptId: "culture"
  },
  {
    id: "culture-traditions",
    statement: "Rich cultural heritage and traditions",
    category: "Lifestyle",
    conceptId: "culture"
  },

  // Cost of Living
  {
    id: "cost-housing",
    statement: "Reasonable housing costs relative to income",
    category: "Financial",
    conceptId: "cost-of-living"
  },
  {
    id: "cost-daily",
    statement: "Affordable daily expenses and groceries",
    category: "Financial",
    conceptId: "cost-of-living"
  },
  {
    id: "cost-luxury",
    statement: "Access to luxury amenities at reasonable prices",
    category: "Financial",
    conceptId: "cost-of-living"
  },
  {
    id: "cost-services",
    statement: "Cost-effective professional services",
    category: "Financial",
    conceptId: "cost-of-living"
  },

  // Safety & Security
  {
    id: "safety-low-crime",
    statement: "Low crime rates and safe neighborhoods",
    category: "Quality of Life",
    conceptId: "safety"
  },
  {
    id: "safety-political",
    statement: "Political stability and social harmony",
    category: "Quality of Life",
    conceptId: "safety"
  },
  {
    id: "safety-emergency",
    statement: "Efficient emergency response services",
    category: "Quality of Life",
    conceptId: "safety"
  },
  {
    id: "safety-walking",
    statement: "Safe for walking and outdoor activities",
    category: "Quality of Life",
    conceptId: "safety"
  },

  // Infrastructure
  {
    id: "infra-transport",
    statement: "Efficient and reliable public transportation",
    category: "Quality of Life",
    conceptId: "infrastructure"
  },
  {
    id: "infra-digital",
    statement: "High-speed internet and digital connectivity",
    category: "Quality of Life",
    conceptId: "infrastructure"
  },
  {
    id: "infra-utilities",
    statement: "Reliable utilities and essential services",
    category: "Quality of Life",
    conceptId: "infrastructure"
  },
  {
    id: "infra-maintenance",
    statement: "Well-maintained roads and public spaces",
    category: "Quality of Life",
    conceptId: "infrastructure"
  },

  // Community
  {
    id: "community-expat",
    statement: "Active expatriate community and support networks",
    category: "Social",
    conceptId: "community"
  },
  {
    id: "community-local",
    statement: "Friendly and welcoming local community",
    category: "Social",
    conceptId: "community"
  },
  {
    id: "community-activities",
    statement: "Regular community events and gatherings",
    category: "Social",
    conceptId: "community"
  },
  {
    id: "community-volunteer",
    statement: "Opportunities for community involvement and volunteering",
    category: "Social",
    conceptId: "community"
  },

  // Recreation
  {
    id: "recreation-outdoor",
    statement: "Abundant outdoor recreational opportunities",
    category: "Lifestyle",
    conceptId: "recreation"
  },
  {
    id: "recreation-sports",
    statement: "Access to sports facilities and activities",
    category: "Lifestyle",
    conceptId: "recreation"
  },
  {
    id: "recreation-entertainment",
    statement: "Diverse entertainment and nightlife options",
    category: "Lifestyle",
    conceptId: "recreation"
  },
  {
    id: "recreation-nature",
    statement: "Proximity to natural attractions and parks",
    category: "Lifestyle",
    conceptId: "recreation"
  },

  // Language
  {
    id: "language-english",
    statement: "Widespread use of English in daily life",
    category: "Cultural",
    conceptId: "language"
  },
  {
    id: "language-learning",
    statement: "Good opportunities for language learning",
    category: "Cultural",
    conceptId: "language"
  },
  {
    id: "language-business",
    statement: "Business environment comfortable with English",
    category: "Cultural",
    conceptId: "language"
  },
  {
    id: "language-multilingual",
    statement: "Multilingual environment with diverse language options",
    category: "Cultural",
    conceptId: "language"
  }
]; 