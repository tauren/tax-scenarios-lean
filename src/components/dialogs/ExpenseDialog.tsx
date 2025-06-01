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
    ...(type === 'oneTime' ? { year: new Date().getFullYear() } : {}),
  });
  const [errors, setErrors] = useState<AnnualExpenseValidationErrors | OneTimeExpenseValidationErrors>({});
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
    setErrors({});
  }, [expense, type]);

  // Add validation on initial load and when form data changes
  useEffect(() => {
    if (open) {
      validateForm();
    }
  }, [open, formData]);

  const validateField = (field: keyof ValidationErrors, value: any): string | undefined => {
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

  const handleFieldBlur = (field: keyof ValidationErrors, value: any) => {
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
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate each field
    Object.keys(formData).forEach((field) => {
      const error = validateField(field as keyof ValidationErrors, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field as keyof ValidationErrors] = error;
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

  const hasErrors = Object.keys(errors).length > 0;

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
                      onValueChange={(value: string) => {
                        setFormData({ ...formData, name: value });
                        handleFieldBlur('name', value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (openCombobox) {
                            setOpenCombobox(false);
                          } else {
                            if (!hasErrors) {
                              handleSave();
                            }
                          }
                        }
                      }}
                    />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {EXPENSE_CATEGORIES.map((category) => (
                        <CommandItem
                          key={category}
                          value={category}
                          onSelect={(value: string) => {
                            setFormData({ ...formData, name: value });
                            handleFieldBlur('name', value);
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
              id="expense-amount"
              label="Amount"
              error={errors.amount}
            >
              <Input
                id="expense-amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value ? Number(e.target.value) : 0 })}
                onBlur={() => handleFieldBlur('amount', formData.amount)}
                placeholder="0.00"
                className={errors.amount ? 'border-destructive' : ''}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!hasErrors) {
                      handleSave();
                    }
                  }
                }}
              />
            </FormField>

            {type === 'oneTime' && (
              <FormField
                id="expense-year"
                label="Year"
                error={errors.year}
              >
                <Input
                  id="expense-year"
                  type="number"
                  min={new Date().getFullYear()}
                  value={(formData as OneTimeExpense).year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: Number(e.target.value) })
                  }
                  onBlur={() => handleFieldBlur('year', (formData as OneTimeExpense).year)}
                  className={errors.year ? 'border-destructive' : ''}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (!hasErrors) {
                        handleSave();
                      }
                    }
                  }}
                />
              </FormField>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={hasErrors}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 