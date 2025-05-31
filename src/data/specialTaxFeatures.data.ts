import type { SpecialTaxFeature } from "@/models";

export const specialTaxFeatures: SpecialTaxFeature[] = [
  {
    id: "nhr-portugal",
    name: "Non-Habitual Resident (NHR) Regime",
    description: "Special tax regime for new residents, phasing out for new applicants from 2024.",
    appliesTo: "CAPITAL_GAINS",
    inputs: [
      {
        key: "qualificationDate",
        type: "DATE",
        label: "Qualification Date",
        placeholder: "YYYY-MM-DD"
      }
    ],
    requiresGainBifurcation: false
  },
  {
    id: "new-incentive-portugal",
    name: "Tax Incentive for Scientific Research and Innovation",
    description: "New regime from 2024 for specific high-value activities.",
    appliesTo: "CAPITAL_GAINS",
    inputs: [
      {
        key: "profession",
        type: "STRING",
        label: "Profession",
        placeholder: "e.g., Scientist, Researcher"
      }
    ],
    requiresGainBifurcation: false
  }
]; 