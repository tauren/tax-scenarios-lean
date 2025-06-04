import { useState, useEffect } from 'react';
import type { AnnualExpense, OneTimeExpense } from '@/types';
import type { AnnualExpenseValidationErrors, OneTimeExpenseValidationErrors } from '@/types/validation';
import { EXPENSE_CATEGORIES } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/shared/form-field';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
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

type DialogMode = 'add' | 'edit' | 'duplicate';

interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: AnnualExpense | OneTimeExpense;
  type: 'annual' | 'oneTime';
  mode?: DialogMode;
  onSave: (expense: AnnualExpense | OneTimeExpense) => void;
}

export function ExpenseDialog({
  open,
  onOpenChange,
  expense,
  type,
  mode = 'add',
  onSave,
}: ExpenseDialogProps) {
  const [formData, setFormData] = useState<Partial<AnnualExpense | OneTimeExpense>>({
    name: '',
    amount: 0,
    ...(type === 'oneTime' ? { year: new Date().getFullYear() } : {}),
  });
  const [errors, setErrors] = useState<AnnualExpenseValidationErrors | OneTimeExpenseValidationErrors>({});
  const [openCombobox, setOpenCombobox] = useState(false);

  // Reset form data when expense changes or dialog opens
  useEffect(() => {
    if (open) {
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
      setErrors({});
    }
  }, [open, expense, type]);

  const validateField = (field: keyof (AnnualExpenseValidationErrors | OneTimeExpenseValidationErrors), value: any): string | undefined => {
    switch (field) {
      case 'name':
        return !value?.trim() ? 'Name is required' : undefined;
      case 'amount':
        return !value || value <= 0 ? 'Amount must be greater than 0' : undefined;
      case 'year':
        if (type !== 'oneTime') return undefined;
        return !value || value < new Date().getFullYear() ? 'Year must be current year or later' : undefined;
      default:
        return undefined;
    }
  };

  const handleFieldBlur = (field: keyof (AnnualExpenseValidationErrors | OneTimeExpenseValidationErrors), value: any) => {
    const error = validateField(field, value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: AnnualExpenseValidationErrors | OneTimeExpenseValidationErrors = {};
    let isValid = true;

    // Validate each field
    Object.keys(formData).forEach((field) => {
      const error = validateField(field as keyof (AnnualExpenseValidationErrors | OneTimeExpenseValidationErrors), formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field as keyof (AnnualExpenseValidationErrors | OneTimeExpenseValidationErrors)] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
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

  const handleCancel = () => {
    onOpenChange(false);
  };

  const hasErrors = Object.keys(errors).length > 0;

  const getDialogTitle = () => {
    const action = mode === 'add' ? 'Add' : mode === 'edit' ? 'Edit' : 'Duplicate';
    const expenseType = type === 'annual' ? 'Annual' : 'One-Time';
    return `${action} ${expenseType} Expense`;
  };

  const getDialogDescription = () => {
    const action = mode === 'add' ? 'Add a new' : mode === 'edit' ? 'Update the details of this' : 'Create a copy of this';
    const expenseType = type === 'annual' ? 'annual' : 'one-time';
    return `${action} ${expenseType} expense${mode === 'duplicate' ? ' with a new name' : ''}.`;
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        handleCancel();
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => {
          e.preventDefault();
          if (!hasErrors) {
            handleSave();
          }
        }}>
          <div className="space-y-4 py-4">
            <FormField
              id="expense-name"
              label="Expense Name"
              error={errors.name}
            >
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    id="expense-name"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    aria-controls="expense-categories"
                    className={cn(
                      "w-full justify-between",
                      errors.name && "border-destructive"
                    )}
                    type="button"
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
                      onValueChange={(value) => {
                        setFormData({ ...formData, name: value });
                        setOpenCombobox(false);
                      }}
                    />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {EXPENSE_CATEGORIES.map((category) => (
                        <CommandItem
                          key={category}
                          value={category}
                          onSelect={(value) => {
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
            </FormField>

            <FormField
              id="amount"
              label="Amount"
              error={errors.amount}
            >
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value ? Number(e.target.value) : 0 })}
                onBlur={() => handleFieldBlur('amount', formData.amount)}
                placeholder="0.00"
                className={errors.amount ? 'border-destructive' : ''}
              />
            </FormField>

            {type === 'oneTime' && (
              <FormField
                id="year"
                label="Year"
                error={errors.year}
              >
                <Input
                  id="year"
                  type="number"
                  min={new Date().getFullYear()}
                  value={(formData as OneTimeExpense).year || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    year: e.target.value ? Number(e.target.value) : new Date().getFullYear() 
                  })}
                  onBlur={() => handleFieldBlur('year', (formData as OneTimeExpense).year)}
                  className={errors.year ? 'border-destructive' : ''}
                />
              </FormField>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={hasErrors}>
              {mode === 'add' ? 'Add Expense' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 