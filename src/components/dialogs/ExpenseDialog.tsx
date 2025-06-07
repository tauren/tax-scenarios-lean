import { useState, useEffect } from 'react';
import type { AnnualExpense, OneTimeExpense } from '@/types';
import type { AnnualExpenseValidationErrors, OneTimeExpenseValidationErrors } from '@/types/validation';
import { EXPENSE_CATEGORIES } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/shared/FormField';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from 'uuid';
import { dateService } from '@/services/dateService';

type DialogMode = 'add' | 'edit' | 'duplicate';

interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: AnnualExpense | OneTimeExpense;
  type: 'annual' | 'oneTime';
  mode?: DialogMode;
  onSave: (expense: AnnualExpense | OneTimeExpense) => void;
}

interface FormData {
  name: string;
  amount: string;
  year?: number;
}

export function ExpenseDialog({
  open,
  onOpenChange,
  expense,
  type,
  mode = 'add',
  onSave,
}: ExpenseDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    amount: '',
    ...(type === 'oneTime' ? { year: dateService.getCurrentYear() } : {}),
  });
  const [errors, setErrors] = useState<AnnualExpenseValidationErrors | OneTimeExpenseValidationErrors>({});
  const [openCombobox, setOpenCombobox] = useState(false);

  // Reset form data when expense changes or dialog opens
  useEffect(() => {
    if (open) {
      if (expense) {
        setFormData({
          name: expense.name || '',
          amount: expense.amount?.toString() || '',
          ...(type === 'oneTime' && { year: (expense as OneTimeExpense).year || dateService.getCurrentYear() }),
        });
      } else {
        setFormData({
          name: '',
          amount: '',
          ...(type === 'oneTime' && { year: dateService.getCurrentYear() }),
        });
      }
      setErrors({});
    }
  }, [open, expense, type]);

  // Run validation after form data has been updated
  useEffect(() => {
    if (open) {
      validateForm();
    }
  }, [open, formData]);

  const validateField = (field: keyof (AnnualExpenseValidationErrors | OneTimeExpenseValidationErrors), value: any): string | undefined => {
    switch (field) {
      case 'name':
        return !value?.trim() ? 'Name is required' : undefined;
      case 'amount':
        return !value || value <= 0 ? 'Amount must be greater than 0' : undefined;
      case 'year':
        if (type !== 'oneTime') return undefined;
        return !value || value < dateService.getCurrentYear() ? 'Year must be current year or later' : undefined;
      default:
        return undefined;
    }
  };

  const setFieldError = (field: keyof (AnnualExpenseValidationErrors | OneTimeExpenseValidationErrors), value: any) => {
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
          amount: Number(formData.amount) || 0,
        } as AnnualExpense
      : {
          id: expense?.id || uuidv4(),
          name: formData.name || '',
          amount: Number(formData.amount) || 0,
          year: formData.year || dateService.getCurrentYear(),
        } as OneTimeExpense;

    onSave(expenseToSave);
    onOpenChange(false);
  };

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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          if (Object.keys(errors).length === 0) {
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
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search or enter expense category..."
                      value={formData.name || ''}
                      onValueChange={(value) => {
                        setFormData({ ...formData, name: value });
                        setFieldError('name', value);
                      }}
                    />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {EXPENSE_CATEGORIES.map((category) => (
                          <CommandItem
                            key={category}
                            value={category}
                            onSelect={(value) => {
                              setFormData({ ...formData, name: value });
                              setFieldError('name', value);
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
                    </CommandList>
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
                value={formData.amount}
                onChange={(e) => {
                  setFormData({ ...formData, amount: e.target.value });
                  setFieldError('amount', e.target.value ? Number(e.target.value) : undefined);
                }}
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
                  min={dateService.getCurrentYear()}
                  value={formData.year}
                  onChange={(e) => {
                    setFormData({ ...formData, year: e.target.value ? Number(e.target.value) : undefined });
                    setFieldError('year', e.target.value ? Number(e.target.value) : undefined);
                  }}
                  className={errors.year ? 'border-destructive' : ''}
                />
              </FormField>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 