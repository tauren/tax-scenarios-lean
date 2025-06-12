import { v4 as uuidv4 } from 'uuid';
import type { Scenario, IncomeSource, AnnualExpense, OneTimeExpense, PlannedAssetSale } from '@/types';

type CopyableItem = IncomeSource | AnnualExpense | OneTimeExpense | PlannedAssetSale;
type ItemType = 'incomeSource' | 'annualExpense' | 'oneTimeExpense' | 'plannedAssetSale';

export const copyItemsToScenario = (
  targetScenario: Scenario,
  items: Partial<CopyableItem>[],
  itemType: ItemType
): Scenario => {
  const updatedScenario = { ...targetScenario };
  
  // Generate new IDs for copied items
  const itemsWithNewIds = items.map(item => ({
    ...item,
    id: uuidv4()
  }));
  
  switch (itemType) {
    case 'incomeSource':
      updatedScenario.incomeSources = [...(updatedScenario.incomeSources || []), ...(itemsWithNewIds as IncomeSource[])];
      break;
    case 'annualExpense':
      updatedScenario.annualExpenses = [...(updatedScenario.annualExpenses || []), ...(itemsWithNewIds as AnnualExpense[])];
      break;
    case 'oneTimeExpense':
      updatedScenario.oneTimeExpenses = [...(updatedScenario.oneTimeExpenses || []), ...(itemsWithNewIds as OneTimeExpense[])];
      break;
    case 'plannedAssetSale':
      updatedScenario.plannedAssetSales = [...(updatedScenario.plannedAssetSales || []), ...(itemsWithNewIds as PlannedAssetSale[])];
      break;
  }
  
  return updatedScenario;
}; 