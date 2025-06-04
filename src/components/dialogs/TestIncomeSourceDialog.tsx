import { useState, useEffect } from 'react';
import type { IncomeSource } from '@/types';
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

type DialogMode = 'add' | 'edit' | 'duplicate';

interface TestIncomeSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incomeSource?: IncomeSource;
  mode?: DialogMode;
  onSave: (incomeSource: IncomeSource) => void;
}

interface ValidationErrors {
  name?: string;
  type?: string;
  annualAmount?: string;
  startYear?: string;
  endYear?: string;
}

export function TestIncomeSourceDialog({
  open,
  onOpenChange,
  incomeSource,
  mode = 'add',
  onSave,
}: TestIncomeSourceDialogProps) {
  const [formData, setFormData] = useState<Partial<IncomeSource>>({
    name: '',
    type: 'EMPLOYMENT',
    annualAmount: 0,
    startYear: new Date().getFullYear(),
    endYear: undefined,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Reset form when dialog opens
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

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const currentYear = new Date().getFullYear();

    // Name validation
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    // Type validation
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    // Annual amount validation
    if (!formData.annualAmount || formData.annualAmount <= 0) {
      newErrors.annualAmount = 'Annual amount must be greater than 0';
    }

    // Start year validation
    if (!formData.startYear || formData.startYear < currentYear) {
      newErrors.startYear = `Start year must be ${currentYear} or later`;
    }

    // End year validation (if provided)
    if (formData.endYear && formData.endYear < (formData.startYear || currentYear)) {
      newErrors.endYear = 'End year must be after start year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave({
      id: incomeSource?.id || crypto.randomUUID(),
      name: formData.name || '',
      type: formData.type || 'EMPLOYMENT',
      annualAmount: formData.annualAmount || 0,
      startYear: formData.startYear || new Date().getFullYear(),
      endYear: formData.endYear,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
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
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          handleCancel();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>

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
              onChange={(e) => setFormData({ ...formData, type: e.target.value as IncomeSource['type'] })}
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
              onChange={(e) => setFormData({ ...formData, annualAmount: e.target.value ? Number(e.target.value) : 0 })}
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
              onChange={(e) => setFormData({ ...formData, endYear: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="Leave empty for ongoing"
              className={errors.endYear ? 'border-destructive' : ''}
            />
          </FormField>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            {mode === 'add' ? 'Add Income Source' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 