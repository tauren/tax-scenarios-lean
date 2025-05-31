import type { Asset } from '@/models';

export const initialAssets: Asset[] = [
  {
    id: 'stock-portfolio',
    name: 'Stock Portfolio',
    type: 'stock',
    value: 1000000,
    growthRate: 0.07,
    incomeRate: 0.02,
    taxRate: 0.15
  },
  {
    id: 'bond-portfolio',
    name: 'Bond Portfolio',
    type: 'bond',
    value: 500000,
    growthRate: 0.03,
    incomeRate: 0.04,
    taxRate: 0.22
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    type: 'real-estate',
    value: 750000,
    growthRate: 0.04,
    incomeRate: 0.05,
    taxRate: 0.15
  },
  {
    id: 'cash',
    name: 'Cash',
    type: 'cash',
    value: 250000,
    growthRate: 0.02,
    incomeRate: 0.03,
    taxRate: 0.22
  }
]; 