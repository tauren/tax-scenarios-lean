import { useState, useEffect } from 'react';
import type { IncomeSource } from '@/types';
import type { IncomeSourceValidationErrors } from '@/types/validation';
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
  DialogClose,
} from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';

type DialogMode = 'add' | 'edit' | 'duplicate';

interface IncomeSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incomeSource?: IncomeSource;
  mode?: DialogMode;
  onSave: (incomeSource: IncomeSource) => void;
}

export function IncomeSourceDialog({ 
  open, 
  onOpenChange, 
  incomeSource, 
  mode = 'add',
  onSave 
}: IncomeSourceDialogProps) {
  const [formData, setFormData] = useState<Partial<IncomeSource>>({
    name: '',
    type: 'EMPLOYMENT',
    annualAmount: 0,
    startYear: new Date().getFullYear(),
    endYear: undefined,
  });
  const [errors, setErrors] = useState<IncomeSourceValidationErrors>({});

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (open) {
      if (incomeSource) {
        setFormData({
          ...incomeSource,
          startYear: incomeSource.startYear || new Date().getFullYear(),
          endYear: incomeSource.endYear || undefined,
        });
      } else {
        setFormData({
          name: '',
          type: 'EMPLOYMENT',
          annualAmount: 0,
          startYear: new Date().getFullYear(),
          endYear: undefined,
        });
      }
      setErrors({});
    }
  }, [open, incomeSource]);

  const validateName = (value: string | undefined): string | undefined => {
    return !value?.trim() ? 'Name is required' : undefined;
  };

  const validateType = (value: string | undefined): string | undefined => {
    return !value ? 'Type is required' : undefined;
  };

  const validateAnnualAmount = (value: number | undefined): string | undefined => {
    return !value || value <= 0 ? 'Annual amount must be greater than 0' : undefined;
  };

  const validateStartYear = (value: number | undefined): string | undefined => {
    const currentYear = new Date().getFullYear();
    return !value || value < currentYear ? `Start year must be ${currentYear} or later` : undefined;
  };

  const validateEndYear = (value: number | undefined, startYear: number): string | undefined => {
    if (!value) return undefined;
    return value < startYear ? 'End year must be after start year' : undefined;
  };

  const setFieldError = (field: keyof IncomeSourceValidationErrors, error: string | undefined) => {
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
    const newErrors: IncomeSourceValidationErrors = {};
    const currentYear = new Date().getFullYear();

    // Validate all fields
    const nameError = validateName(formData.name);
    const typeError = validateType(formData.type);
    const annualAmountError = validateAnnualAmount(formData.annualAmount);
    const startYearError = validateStartYear(formData.startYear);
    const endYearError = validateEndYear(formData.endYear, formData.startYear || currentYear);

    // Only add errors that exist
    if (nameError) newErrors.name = nameError;
    if (typeError) newErrors.type = typeError;
    if (annualAmountError) newErrors.annualAmount = annualAmountError;
    if (startYearError) newErrors.startYear = startYearError;
    if (endYearError) newErrors.endYear = endYearError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const incomeSourceToSave: IncomeSource = {
      id: incomeSource?.id || uuidv4(),
      name: formData.name || '',
      type: formData.type || 'EMPLOYMENT',
      annualAmount: formData.annualAmount || 0,
      startYear: formData.startYear || new Date().getFullYear(),
      endYear: formData.endYear,
    };

    onSave(incomeSourceToSave);
    onOpenChange(false);
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'add':
        return 'Add Income Source';
      case 'edit':
        return 'Edit Income Source';
      case 'duplicate':
        return 'Duplicate Income Source';
      default:
        return 'Income Source';
    }
  };

  const getDialogDescription = () => {
    switch (mode) {
      case 'add':
        return 'Add a new income source to your scenario.';
      case 'edit':
        return 'Update the details of this income source.';
      case 'duplicate':
        return 'Create a copy of this income source with a new name.';
      default:
        return '';
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (Object.keys(errors).length === 0) {
              handleSave();
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-4 py-4">
            <FormField
              id="name"
              label="Source Name"
              error={errors.name}
            >
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, name: value });
                  setFieldError('name', validateName(value));
                }}
                onBlur={() => setFieldError('name', validateName(formData.name))}
                placeholder="e.g., Salary, Rental"
                className={errors.name ? 'border-destructive' : ''}
              />
            </FormField>

            <FormField
              id="type"
              label="Type"
              error={errors.type}
            >
              <select
                id="type"
                value={formData.type}
                onChange={(e) => {
                  const value = e.target.value as IncomeSource['type'];
                  setFormData({ ...formData, type: value });
                  setFieldError('type', validateType(value));
                }}
                onBlur={() => setFieldError('type', validateType(formData.type))}
                className={`w-full rounded-md border ${errors.type ? 'border-destructive' : 'border-input'} bg-background px-3 py-2`}
              >
                <option value="EMPLOYMENT">Employment</option>
                <option value="RENTAL_PROPERTY">Rental Property</option>
                <option value="OTHER">Other</option>
              </select>
            </FormField>

            <FormField
              id="annualAmount"
              label="Annual Amount"
              error={errors.annualAmount}
            >
              <Input
                id="annualAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.annualAmount || ''}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : 0;
                  setFormData({ ...formData, annualAmount: value });
                  setFieldError('annualAmount', validateAnnualAmount(value));
                }}
                onBlur={() => setFieldError('annualAmount', validateAnnualAmount(formData.annualAmount))}
                placeholder="0.00"
                className={errors.annualAmount ? 'border-destructive' : ''}
              />
            </FormField>

            <FormField
              id="startYear"
              label="Start Year"
              error={errors.startYear}
            >
              <Input
                id="startYear"
                type="number"
                min={new Date().getFullYear()}
                value={formData.startYear}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setFormData({ ...formData, startYear: value });
                  setFieldError('startYear', validateStartYear(value));
                  setFieldError('endYear', validateEndYear(formData.endYear, value));
                }}
                onBlur={() => {
                  setFieldError('startYear', validateStartYear(formData.startYear));
                  setFieldError('endYear', validateEndYear(formData.endYear, formData.startYear || new Date().getFullYear()));
                }}
                className={errors.startYear ? 'border-destructive' : ''}
              />
            </FormField>

            <FormField
              id="endYear"
              label="End Year (Optional)"
              error={errors.endYear}
            >
              <Input
                id="endYear"
                type="number"
                min={formData.startYear || new Date().getFullYear()}
                value={formData.endYear || ''}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : undefined;
                  setFormData({ ...formData, endYear: value });
                  setFieldError('endYear', validateEndYear(value, formData.startYear || new Date().getFullYear()));
                }}
                onBlur={() => setFieldError('endYear', validateEndYear(formData.endYear, formData.startYear || new Date().getFullYear()))}
                placeholder="Leave empty for ongoing"
                className={errors.endYear ? 'border-destructive' : ''}
              />
            </FormField>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {mode === 'add' ? 'Add Income Source' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 