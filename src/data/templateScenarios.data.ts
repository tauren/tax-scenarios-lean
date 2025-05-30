import type { Scenario } from '../models';
import { initialAssets } from './initialAssets.data';

export const templateScenarios: Scenario[] = [
  {
    id: 'conservative',
    name: 'Conservative Growth',
    description: 'A conservative investment strategy focusing on capital preservation and steady income.',
    incomeSources: [
      {
        id: 'social-security',
        name: 'Social Security',
        amount: 30000,
        startYear: 67,
        endYear: 100,
        inflationAdjusted: true
      }
    ],
    expenses: [
      {
        id: 'basic-living',
        name: 'Basic Living Expenses',
        amount: 60000,
        startYear: 0,
        endYear: 100,
        inflationAdjusted: true
      }
    ],
    assets: initialAssets,
    startYear: 2024,
    endYear: 2074
  }
]; 