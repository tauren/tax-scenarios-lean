import { useState, useEffect } from 'react';
import type { Asset } from '@/types';
import type { AssetValidationErrors } from '@/types/validation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/shared/FormField";
import { cn } from "@/lib/utils"
import { toDateInputValue } from '@/utils/date';

interface AssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Omit<Asset, 'id'>) => void;
  asset?: Asset | null;
}

const initialFormData: Omit<Asset, 'id'> = {
  name: '',
  quantity: 0,
  costBasisPerUnit: 0,
  acquisitionDate: new Date(),
  assetType: '',
  fmvPerUnit: 0,
};

export function AssetDialog({ isOpen, onClose, onSave, asset }: AssetDialogProps) {
  const [formData, setFormData] = useState<Omit<Asset, 'id'>>(initialFormData);
  const [errors, setErrors] = useState<AssetValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        quantity: asset.quantity,
        costBasisPerUnit: asset.costBasisPerUnit,
        acquisitionDate: asset.acquisitionDate,
        assetType: asset.assetType || '',
        fmvPerUnit: asset.fmvPerUnit || 0,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [asset, isOpen]);

  // Add validation on initial load and when form data changes
  useEffect(() => {
    if (isOpen) {
      validateForm();
    }
  }, [isOpen, formData]);

  const validateField = (field: keyof AssetValidationErrors, value: any): string | undefined => {
    switch (field) {
      case 'name':
        return !value?.trim() ? 'Name is required' : undefined;
      case 'assetType':
        return !value ? 'Asset type is required' : undefined;
      case 'quantity':
        return !value || value <= 0 ? 'Quantity must be greater than 0' : undefined;
      case 'costBasisPerUnit':
        return !value || value <= 0 ? 'Cost basis must be greater than 0' : undefined;
      case 'acquisitionDate':
        return !value ? 'Acquisition date is required' : undefined;
      case 'fmvPerUnit':
        if (!value) return undefined;
        return value <= 0 ? 'FMV must be greater than 0' : undefined;
      default:
        return undefined;
    }
  };

  const handleFieldBlur = (field: keyof AssetValidationErrors, value: any) => {
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
    const newErrors: AssetValidationErrors = {};
    let isValid = true;

    // Validate each field
    Object.keys(formData).forEach((field) => {
      const error = validateField(field as keyof AssetValidationErrors, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field as keyof AssetValidationErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || !validateForm()) return;
    
    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving asset:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    const value = e.target.value;
    if (value === '') {
      setFormData(prev => ({ ...prev, [field]: '' }));
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setFormData(prev => ({ ...prev, [field]: numValue }));
      }
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {asset ? (asset.id ? 'Edit Asset' : 'Duplicate Asset') : 'Add New Asset'}
          </DialogTitle>
          <DialogDescription>
            {asset ? (asset.id ? 'Update the details of your existing asset.' : 'Create a copy of this asset with new details.') : 'Add a new asset to your portfolio.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Name"
            id="asset-name"
            error={errors.name}
          >
            <Input
              id="asset-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onBlur={() => handleFieldBlur('name', formData.name)}
              required
              className={errors.name ? 'border-destructive' : ''}
            />
          </FormField>

          <FormField
            label="Asset Type"
            id="asset-type"
            error={errors.assetType}
          >
            <Select
              value={formData.assetType}
              onValueChange={(value) => {
                setFormData({ ...formData, assetType: value });
                handleFieldBlur('assetType', value);
              }}
            >
              <SelectTrigger id="asset-type" className={cn("w-full", errors.assetType ? "border-destructive" : "")}>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Quantity"
            id="asset-quantity"
            error={errors.quantity}
          >
            <Input
              id="asset-quantity"
              type="number"
              value={formData.quantity === 0 ? '' : formData.quantity}
              onChange={(e) => handleNumberInput(e, 'quantity')}
              onBlur={() => handleFieldBlur('quantity', formData.quantity)}
              min="0"
              step="0.00000001"
              required
              className={errors.quantity ? 'border-destructive' : ''}
            />
          </FormField>

          <FormField
            label="Cost Basis per Unit"
            id="asset-cost-basis"
            error={errors.costBasisPerUnit}
          >
            <Input
              id="asset-cost-basis"
              type="number"
              value={formData.costBasisPerUnit === 0 ? '' : formData.costBasisPerUnit}
              onChange={(e) => handleNumberInput(e, 'costBasisPerUnit')}
              onBlur={() => handleFieldBlur('costBasisPerUnit', formData.costBasisPerUnit)}
              min="0"
              step="0.00000001"
              required
              className={errors.costBasisPerUnit ? 'border-destructive' : ''}
            />
          </FormField>

          <FormField
            label="Acquisition Date"
            id="asset-acquisition-date"
            error={errors.acquisitionDate}
          >
            <Input
              id="asset-acquisition-date"
              type="date"
              value={toDateInputValue(formData.acquisitionDate)}
              onChange={e => {
                const date = e.target.value ? new Date(e.target.value) : new Date();
                setFormData({ ...formData, acquisitionDate: date });
                handleFieldBlur('acquisitionDate', date);
              }}
              onBlur={() => handleFieldBlur('acquisitionDate', formData.acquisitionDate)}
              required
              className={errors.acquisitionDate ? 'border-destructive' : ''}
            />
          </FormField>

          <FormField
            label="FMV per Unit (Optional)"
            id="asset-fmv"
            error={errors.fmvPerUnit}
          >
            <Input
              id="asset-fmv"
              type="number"
              value={formData.fmvPerUnit === 0 ? '' : formData.fmvPerUnit}
              onChange={(e) => handleNumberInput(e, 'fmvPerUnit')}
              onBlur={() => handleFieldBlur('fmvPerUnit', formData.fmvPerUnit)}
              min="0"
              step="0.00000001"
              className={errors.fmvPerUnit ? 'border-destructive' : ''}
            />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={hasErrors}>
              {asset ? (asset.id ? 'Save Changes' : 'Create Copy') : 'Add Asset'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 