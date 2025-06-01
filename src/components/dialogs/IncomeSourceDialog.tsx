import { useState, useEffect } from 'react';
import type { ScenarioIncomeSource } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/shared/form-field';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';

interface IncomeSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incomeSource?: ScenarioIncomeSource;
  onSave: (incomeSource: ScenarioIncomeSource) => void;
}

interface ValidationErrors {
  name?: string;
  annualAmount?: string;
  startYear?: string;
  endYear?: string;
}

export function IncomeSourceDialog({
  open,
  onOpenChange,
  incomeSource,
  onSave,
}: IncomeSourceDialogProps) {
  const [formData, setFormData] = useState<Partial<ScenarioIncomeSource>>({
    name: '',
    type: 'EMPLOYMENT',
    annualAmount: 0,
    startYear: new Date().getFullYear(),
    endYear: undefined,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
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
  }, [incomeSource, open]);

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
      case 'annualAmount':
        return !value || value <= 0 ? 'Annual amount must be greater than 0' : undefined;
      case 'startYear':
        return !value || value < new Date().getFullYear() ? 'Start year must be current year or later' : undefined;
      case 'endYear':
        if (!value) return undefined;
        return value < formData.startYear! ? 'End year must be after start year' : undefined;
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

    const incomeSourceToSave: ScenarioIncomeSource = {
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

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{incomeSource ? 'Edit Income Source' : 'Add Income Source'}</DialogTitle>
          <DialogDescription>
            {incomeSource 
              ? 'Update the details of this income source.'
              : 'Add a new income source to your scenario.'}
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
              id="name"
              label="Source Name"
              error={errors.name}
            >
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onBlur={() => handleFieldBlur('name', formData.name)}
                placeholder="e.g., Salary, Rental"
                className={errors.name ? 'border-destructive' : ''}
              />
            </FormField>

            <FormField
              id="type"
              label="Type"
            >
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ScenarioIncomeSource['type'] })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
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
                onChange={(e) => setFormData({ ...formData, annualAmount: e.target.value ? Number(e.target.value) : 0 })}
                onBlur={() => handleFieldBlur('annualAmount', formData.annualAmount)}
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
                onChange={(e) => setFormData({ ...formData, startYear: Number(e.target.value) })}
                onBlur={() => handleFieldBlur('startYear', formData.startYear)}
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
                value={formData.endYear}
                onChange={(e) => setFormData({ ...formData, endYear: Number(e.target.value) })}
                onBlur={() => handleFieldBlur('endYear', formData.endYear)}
                className={errors.endYear ? 'border-destructive' : ''}
              />
            </FormField>
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