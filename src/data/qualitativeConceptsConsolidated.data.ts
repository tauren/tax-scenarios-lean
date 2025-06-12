import type { QualitativeConcept } from '@/types';

export const qualitativeConceptsConsolidated: QualitativeConcept[] = [
  {
    id: "fe",
    name: "Financial & Economic",
    shortName: "Finance",
    description: "Comprehensive financial factors including cost of living, taxation, economic stability, and business environment.",
    aspects: [
      "Cost of living",
      "Taxation",
      "Economic stability",
      "Financial regulations",
      "Business environment"
    ]
  },
  {
    id: "ql",
    name: "Quality of Life",
    shortName: "Lifestyle",
    description: "Daily life factors including cultural environment, social integration, community support, and local amenities.",
    aspects: [
      "Daily life and cultural environment",
      "Social integration",
      "Community support",
      "Local amenities",
      "Language considerations",
      "Recreational activities"
    ]
  },
  {
    id: "hs",
    name: "Health & Safety",
    shortName: "Health",
    description: "Healthcare quality, personal safety, and overall stability of the location.",
    aspects: [
      "Healthcare quality and accessibility",
      "Personal safety",
      "Crime rates",
      "Political stability",
      "Social stability"
    ]
  },
  {
    id: "ec",
    name: "Environment & Climate",
    shortName: "Environment",
    description: "Natural environment, weather patterns, and environmental policies of the location.",
    aspects: [
      "Weather patterns",
      "Air quality",
      "Natural environment",
      "Environmental policies",
      "Climate change considerations"
    ]
  },
  {
    id: "gf",
    name: "Governance & Freedom",
    shortName: "Governance",
    description: "Political climate, legal system, and personal freedoms in the location.",
    aspects: [
      "Political climate",
      "Legal system",
      "Bureaucratic efficiency",
      "Personal freedoms",
      "Regulatory environment",
      "Ease of residency"
    ]
  },
  {
    id: "od",
    name: "Opportunity & Development",
    shortName: "Opportunity",
    description: "Professional opportunities, infrastructure quality, and development potential of the location.",
    aspects: [
      "Professional opportunities",
      "Business development",
      "Education system",
      "Infrastructure quality",
      "International connectivity",
      "Technology access"
    ]
  }
]; 