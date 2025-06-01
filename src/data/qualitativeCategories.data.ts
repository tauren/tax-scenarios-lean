import type { QualitativeCategory } from '@/types';

export const qualitativeCategories: QualitativeCategory[] = [
  {
    id: "FINANCIAL_IMPACT",
    name: "Financial Impact",
    description: "This category encompasses all direct monetary effects on an individual's wealth, income, and expenses, including taxation on various income streams and the overall cost of living.",
    rationale: "Tax optimization is often the primary driver for international relocation, making the direct financial implications paramount. Understanding the tax burden and cost of living is crucial for assessing the financial viability and benefits of a move.",
    exampleConcepts: [
      "Capital Gains Tax Rates",
      "Personal Income Tax Burden",
      "Cost of Living Index"
    ]
  },
  {
    id: "GOVERNANCE_STABILITY",
    name: "Governance & Stability",
    description: "This category covers the political, legal, and administrative environment of a country, including the predictability, transparency, and stability of its laws, institutions, and government.",
    rationale: "Long-term planning and security are heavily dependent on a stable and predictable governance framework. This minimizes risks associated with sudden policy changes, legal uncertainties, and ensures a reliable environment for personal and financial affairs.",
    exampleConcepts: [
      "Political Stability Index",
      "Rule of Law",
      "Ease of Bureaucracy"
    ]
  },
  {
    id: "LIFESTYLE_WELLBEING",
    name: "Lifestyle & Wellbeing",
    description: "This category addresses the overall quality of daily life and personal satisfaction, encompassing factors related to health, safety, environmental quality, and general living conditions.",
    rationale: "Beyond financial benefits, personal happiness, safety, and comfort are critical for a successful and sustainable relocation. This category helps assess the non-monetary benefits and challenges of living in a new place.",
    exampleConcepts: [
      "Healthcare System Quality",
      "Personal Safety & Crime Rate",
      "Climate & Environmental Quality"
    ]
  },
  {
    id: "INFRASTRUCTURE_ACCESSIBILITY",
    name: "Infrastructure & Accessibility",
    description: "This category pertains to the availability, quality, and efficiency of essential public and private services and physical networks that support daily life and economic activity.",
    rationale: "Reliable infrastructure directly impacts convenience, connectivity, and the ability to conduct personal and professional affairs smoothly. It is fundamental for a functional and modern living experience.",
    exampleConcepts: [
      "Internet Connectivity & Speed",
      "Public Transportation Systems",
      "Banking & Financial Services"
    ]
  },
  {
    id: "CULTURAL_SOCIAL_ENVIRONMENT",
    name: "Cultural & Social Environment",
    description: "This category includes aspects related to the local culture, language, social norms, and the ease of social integration and community engagement for expatriates.",
    rationale: "Cultural and social factors are crucial for psychological adaptation and building a support network in a new country. A welcoming and understandable cultural environment facilitates a smoother transition and long-term satisfaction.",
    exampleConcepts: [
      "Language Barrier",
      "Expat Community Size & Vibrancy",
      "Cultural Openness & Tolerance"
    ]
  },
  {
    id: "PERSONAL_DEVELOPMENT_OPPORTUNITIES",
    name: "Personal Development & Opportunities",
    description: "This category covers factors related to education, career prospects, and leisure activities that contribute to an individual's or family's growth, fulfillment, and long-term engagement.",
    rationale: "Relocation often involves seeking new opportunities for personal and professional advancement. This category addresses the availability of resources for learning, career development, and recreational pursuits, which are key drivers for many individuals and families.",
    exampleConcepts: [
      "Quality of Education System",
      "Job Market & Career Prospects",
      "Availability of Hobbies & Recreation"
    ]
  }
]; 