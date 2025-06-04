import type { Scenario } from '@/types';

export const templateScenarios: Scenario[] = [
  {
    id: "template-blank",
    name: "Blank Template",
    projectionPeriod: 10,
    residencyStartDate: new Date(),
    incomeSources: [],
    annualExpenses: [
    ],
    oneTimeExpenses: [
    ],
    location: {
      country: "Blank"
    },
    tax: {
      capitalGains: {
        shortTermRate: 0,
        longTermRate: 0,
      }
    }
  },
  {
    id: "template-portugal",
    name: "Portugal",
    projectionPeriod: 10,
    residencyStartDate: new Date(),
    incomeSources: [
      {
        id: "salary",
        name: "Salary",
        type: "EMPLOYMENT",
        annualAmount: 150000,
        startYear: 2025,
        endYear: undefined,
      },
      {
        id: "rental-property",
        name: "Rental Property",
        type: "RENTAL_PROPERTY",
        annualAmount: 30000,
        startYear: 2025,
        endYear: undefined,
      }
    ],
    annualExpenses: [
      {
        id: "housing",
        name: "Housing",
        amount: 3000,
      },
      {
        id: "transportation",
        name: "Transportation",
        amount: 200,
      },
      {
        id: "food",
        name: "Food",
        amount: 1000,
      },
      {
        id: "utilities",
        name: "Utilities",
        amount: 200,
      },
      {
        id: "healthcare",
        name: "Healthcare",
        amount: 300,
      },
      {
        id: "insurance",
        name: "Insurance",
        amount: 100,
      },
      {
        id: "entertainment",
        name: "Entertainment",
        amount: 400,
      },
      {
        id: "education",
        name: "Education",
        amount: 400,
      },
      {
        id: "personal-care",
        name: "Personal Care",
        amount: 300,
      },
      {
        id: "legal",
        name: "Legal",
        amount: 5000,
      },
      {
        id: "other",
        name: "Other",
        amount: 500,
      }
    ],
    oneTimeExpenses: [
      {
        id: "new-car",
        name: "New Car",
        amount: 40000,
        year: 2025,
      },
      {
        id: "rental-deposit",
        name: "Rental Deposit",
        amount: 5000,
        year: 2025,
      },
      {
        id: "furniture",
        name: "Furniture",
        amount: 20000,
        year: 2025,
      },
      {
        id: "tax-program-donation",
        name: "Tax Program Donation",
        amount: 100000,
        year: 2025,
      }
    ],
    location: {
      country: "Portugal"
    },
    tax: {
      capitalGains: {
        shortTermRate: 28,
        longTermRate: 28,
      }
    }
  }
]; 