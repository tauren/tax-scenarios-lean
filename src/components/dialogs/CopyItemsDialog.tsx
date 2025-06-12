import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Scenario, Asset, IncomeSource, AnnualExpense, OneTimeExpense, PlannedAssetSale } from '@/types';
import { formatCurrency } from '@/utils/formatting';

type ItemType = 'incomeSource' | 'annualExpense' | 'oneTimeExpense' | 'plannedAssetSale';
type CopyableItem = IncomeSource | AnnualExpense | OneTimeExpense | PlannedAssetSale;

const ITEM_TYPE_LABELS = {
  incomeSource: {
    plural: 'Income Sources',
    singular: 'Income Source',
    empty: 'No income sources'
  },
  annualExpense: {
    plural: 'Annual Expenses',
    singular: 'Annual Expense',
    empty: 'No annual expenses'
  },
  oneTimeExpense: {
    plural: 'One-Time Expenses',
    singular: 'One-Time Expense',
    empty: 'No one-time expenses'
  },
  plannedAssetSale: {
    plural: 'Planned Asset Sales',
    singular: 'Planned Asset Sale',
    empty: 'No planned asset sales'
  }
} as const;

interface CopyItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (items: CopyableItem[]) => void;
  scenarios: Scenario[];
  currentScenarioId: string;
  type: ItemType;
  assets?: Asset[]; // Required only for plannedAssetSales
}

export function CopyItemsDialog({
  open,
  onOpenChange,
  onSave,
  scenarios,
  currentScenarioId,
  type,
  assets,
}: CopyItemsDialogProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const getItemsFromScenario = (scenario: Scenario): CopyableItem[] => {
    switch (type) {
      case 'incomeSource':
        return scenario.incomeSources || [];
      case 'annualExpense':
        return scenario.annualExpenses || [];
      case 'oneTimeExpense':
        return scenario.oneTimeExpenses || [];
      case 'plannedAssetSale':
        return scenario.plannedAssetSales || [];
      default:
        return [];
    }
  };

  const getItemLabel = (item: CopyableItem): string => {
    switch (type) {
      case 'incomeSource': {
        const incomeSource = item as IncomeSource;
        return `${incomeSource.name} (${formatCurrency(incomeSource.annualAmount)}/year)`;
      }
      case 'annualExpense': {
        const expense = item as AnnualExpense;
        return `${expense.name} (${formatCurrency(expense.amount)}/year)`;
      }
      case 'oneTimeExpense': {
        const expense = item as OneTimeExpense;
        return `${expense.name} (${formatCurrency(expense.amount)} in ${expense.year})`;
      }
      case 'plannedAssetSale': {
        const sale = item as PlannedAssetSale;
        const asset = assets?.find(a => a.id === sale.assetId);
        return `${asset?.name || 'Unknown Asset'} (${sale.quantity} in ${sale.year})`;
      }
      default:
        return (item as any).name;
    }
  };

  const handleSave = () => {
    const itemsToCopy = scenarios.flatMap(scenario => {
      const items = getItemsFromScenario(scenario);
      return items
        .filter(item => selectedItems.has(item.id))
        .map(item => {
          // Create a new object without the id
          const { id, ...itemWithoutId } = item;
          return itemWithoutId;
        });
    });
    onSave(itemsToCopy as CopyableItem[]);
    setSelectedItems(new Set());
  };

  const handleClose = () => {
    setSelectedItems(new Set());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Copy {ITEM_TYPE_LABELS[type].plural}
          </DialogTitle>
          <DialogDescription>
            Select items to copy from other scenarios
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {scenarios
              .filter(scenario => scenario.id !== currentScenarioId)
              .map((scenario) => {
                const items = getItemsFromScenario(scenario);
                return (
                  <div key={scenario.id} className="space-y-2">
                    <div className="font-medium text-foreground">
                      {scenario.name}
                    </div>
                    <div className="space-y-2 pl-4">
                      {items.length > 0 ? (
                        items.map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <Checkbox
                              id={`item-${item.id}`}
                              checked={selectedItems.has(item.id)}
                              onCheckedChange={(checked) => {
                                const newSelected = new Set(selectedItems);
                                if (checked) {
                                  newSelected.add(item.id);
                                } else {
                                  newSelected.delete(item.id);
                                }
                                setSelectedItems(newSelected);
                              }}
                            />
                            <label
                              htmlFor={`item-${item.id}`}
                              className="text-sm text-muted-foreground"
                            >
                              {getItemLabel(item)}
                            </label>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground italic">
                          {ITEM_TYPE_LABELS[type].empty}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={selectedItems.size === 0}>
            Copy Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 