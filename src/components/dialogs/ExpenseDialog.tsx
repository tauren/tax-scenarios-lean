import { useState, useEffect } from 'react';
import type { AnnualExpense, OneTimeExpense } from '@/types';
import { EXPENSE_CATEGORIES } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: AnnualExpense | OneTimeExpense;
  type: 'annual' | 'oneTime';
  onSave: (expense: AnnualExpense | OneTimeExpense) => void;
}

export function ExpenseDialog({
  open,
  onOpenChange,
  expense,
  type,
  onSave,
}: ExpenseDialogProps) {
  const [formData, setFormData] = useState<Partial<AnnualExpense | OneTimeExpense>>({
    name: '',
    amount: 0,
    ...(type === 'oneTime' && { year: new Date().getFullYear() }),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openCombobox, setOpenCombobox] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        ...expense,
        name: expense.name || '',
        amount: expense.amount || 0,
        ...(type === 'oneTime' && { year: (expense as OneTimeExpense).year || new Date().getFullYear() }),
      });
    } else {
      setFormData({
        name: '',
        amount: 0,
        ...(type === 'oneTime' && { year: new Date().getFullYear() }),
      });
    }
  }, [expense, type]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (type === 'oneTime') {
      const oneTimeExpense = formData as OneTimeExpense;
      if (!oneTimeExpense.year || oneTimeExpense.year < new Date().getFullYear()) {
        newErrors.year = 'Year must be current year or later';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const expenseToSave = type === 'annual' 
      ? {
          id: expense?.id || uuidv4(),
          name: formData.name || '',
          amount: formData.amount || 0,
        } as AnnualExpense
      : {
          id: expense?.id || uuidv4(),
          name: formData.name || '',
          amount: formData.amount || 0,
          year: (formData as OneTimeExpense).year || new Date().getFullYear(),
        } as OneTimeExpense;

    onSave(expenseToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {expense ? 'Edit' : 'Add'} {type === 'annual' ? 'Annual' : 'One-Time'} Expense
          </DialogTitle>
          <DialogDescription>
            {expense 
              ? `Update the details of this ${type === 'annual' ? 'annual' : 'one-time'} expense.`
              : `Add a new ${type === 'annual' ? 'annual' : 'one-time'} expense to your scenario.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="expense-name">Expense Name</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  id="expense-name"
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  aria-controls="expense-categories"
                  className="w-full justify-between"
                >
                  {formData.name || "Select or enter expense category..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command id="expense-categories">
                  <CommandInput 
                    placeholder="Search or enter expense category..."
                    value={formData.name || ''}
                    onValueChange={(value: string) => setFormData({ ...formData, name: value })}
                  />
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {EXPENSE_CATEGORIES.map((category) => (
                      <CommandItem
                        key={category}
                        value={category}
                        onSelect={(value: string) => {
                          setFormData({ ...formData, name: value });
                          setOpenCombobox(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.name === category ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {category}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.name && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription>{errors.name}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-amount">Amount</Label>
            <Input
              id="expense-amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value ? Number(e.target.value) : 0 })}
              placeholder="0.00"
              className={errors.amount ? 'border-destructive' : ''}
            />
            {errors.amount && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription>{errors.amount}</AlertDescription>
              </Alert>
            )}
          </div>

          {type === 'oneTime' && (
            <div className="space-y-2">
              <Label htmlFor="expense-year">Year</Label>
              <Input
                id="expense-year"
                type="number"
                min={new Date().getFullYear()}
                value={(formData as OneTimeExpense).year}
                onChange={(e) =>
                  setFormData({ ...formData, year: Number(e.target.value) })
                }
                className={errors.year ? 'border-destructive' : ''}
              />
              {errors.year && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{errors.year}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 