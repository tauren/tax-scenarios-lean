import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/shared/FormField';
import type { PlannedAssetSale, Asset } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { dateService } from '@/services/dateService';

interface PlannedAssetSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (sale: PlannedAssetSale) => void;
  sale?: PlannedAssetSale;
  mode: 'add' | 'edit' | 'duplicate';
  assets: Asset[];
  projectionPeriod: number;
}

interface FormData {
  assetId: string;
  quantity: string;
  year: string;
  salePricePerUnit: string;
}

interface ValidationErrors {
  assetId?: string;
  quantity?: string;
  year?: string;
  salePricePerUnit?: string;
}

export function PlannedAssetSaleDialog({
  open,
  onOpenChange,
  onSave,
  sale,
  mode,
  assets,
  projectionPeriod,
}: PlannedAssetSaleDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    assetId: '',
    quantity: '',
    year: '',
    salePricePerUnit: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (open) {
      if (sale) {
        setFormData({
          assetId: sale.assetId,
          quantity: sale.quantity.toString(),
          year: sale.year.toString(),
          salePricePerUnit: sale.salePricePerUnit.toString(),
        });
      } else {
        setFormData({
          assetId: '',
          quantity: '',
          year: '',
          salePricePerUnit: '',
        });
      }
      setErrors({});
    }
  }, [open, sale]);

  // Run validation after form data has been updated
  useEffect(() => {
    if (open) {
      validateForm();
    }
  }, [open, formData]);

  const validateField = (field: keyof ValidationErrors, value: any): string | undefined => {
    switch (field) {
      case 'assetId':
        return !value ? 'Asset is required' : undefined;
      case 'quantity':
        return !value || Number(value) <= 0 ? 'Quantity must be greater than 0' : undefined;
      case 'year':
        const currentYear = dateService.getCurrentYear();
        return !value || Number(value) < currentYear ? `Year must be ${currentYear} or later` : undefined;
      case 'salePricePerUnit':
        return !value || Number(value) <= 0 ? 'Sale price must be greater than 0' : undefined;
      default:
        return undefined;
    }
  };

  const setFieldError = (field: keyof ValidationErrors, value: any) => {
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
      const error = validateField(field as keyof ValidationErrors, formData[field as keyof FormData]);
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

    const saleToSave: PlannedAssetSale = {
      id: sale?.id || uuidv4(),
      assetId: formData.assetId,
      quantity: Number(formData.quantity),
      year: Number(formData.year),
      salePricePerUnit: Number(formData.salePricePerUnit),
    };

    onSave(saleToSave);
    onOpenChange(false);
  };

  const getDialogTitle = () => {
    const action = mode === 'add' ? 'Add' : mode === 'edit' ? 'Edit' : 'Duplicate';
    return `${action} Planned Asset Sale`;
  };

  const getDialogDescription = () => {
    const action = mode === 'add' ? 'Add a new' : mode === 'edit' ? 'Update the details of this' : 'Create a copy of this';
    return `${action} planned asset sale${mode === 'duplicate' ? ' with a new name' : ''}.`;
  };

  const currentYear = dateService.getCurrentYear();
  const years = Array.from({ length: projectionPeriod }, (_, i) => currentYear + i);

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
              id="asset"
              label="Asset"
              error={errors.assetId}
            >
              <Select 
                value={formData.assetId} 
                onValueChange={(value) => {
                  setFormData({ ...formData, assetId: value });
                  setFieldError('assetId', value);
                }}
              >
                <SelectTrigger className={errors.assetId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              id="quantity"
              label="Quantity"
              error={errors.quantity}
            >
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => {
                  setFormData({ ...formData, quantity: e.target.value });
                  setFieldError('quantity', e.target.value ? Number(e.target.value) : undefined);
                }}
                className={errors.quantity ? 'border-destructive' : ''}
              />
            </FormField>

            <FormField
              id="year"
              label="Year"
              error={errors.year}
            >
              <Select 
                value={formData.year} 
                onValueChange={(value) => {
                  setFormData({ ...formData, year: value });
                  setFieldError('year', value ? Number(value) : undefined);
                }}
              >
                <SelectTrigger className={errors.year ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select a year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              id="salePricePerUnit"
              label="Sale Price per Unit"
              error={errors.salePricePerUnit}
            >
              <Input
                id="salePricePerUnit"
                type="number"
                min="0"
                step="0.01"
                value={formData.salePricePerUnit}
                onChange={(e) => {
                  setFormData({ ...formData, salePricePerUnit: e.target.value });
                  setFieldError('salePricePerUnit', e.target.value ? Number(e.target.value) : undefined);
                }}
                className={errors.salePricePerUnit ? 'border-destructive' : ''}
              />
            </FormField>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {mode === 'add' ? 'Add Sale' : mode === 'edit' ? 'Save Changes' : 'Duplicate Sale'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 