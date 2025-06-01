import { useState, useEffect } from 'react';
import type { ScenarioIncomeSource } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { v4 as uuidv4 } from 'uuid';

interface IncomeSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incomeSource?: ScenarioIncomeSource;
  onSave: (incomeSource: ScenarioIncomeSource) => void;
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
  }, [incomeSource, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.annualAmount || formData.annualAmount <= 0) {
      newErrors.annualAmount = 'Annual amount must be greater than 0';
    }

    if (!formData.startYear) {
      newErrors.startYear = 'Start year is required';
    }

    if (formData.endYear && formData.startYear && formData.endYear < formData.startYear) {
      newErrors.endYear = 'End year must be after start year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{incomeSource ? 'Edit Income Source' : 'Add Income Source'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Source Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Salary, Rental"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription>{errors.name}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualAmount">Annual Amount</Label>
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
            {errors.annualAmount && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription>{errors.annualAmount}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startYear">Start Year</Label>
            <Input
              id="startYear"
              type="number"
              min={new Date().getFullYear()}
              value={formData.startYear}
              onChange={(e) => setFormData({ ...formData, startYear: Number(e.target.value) })}
              className={errors.startYear ? 'border-destructive' : ''}
            />
            {errors.startYear && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription>{errors.startYear}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endYear">End Year (Optional)</Label>
            <Input
              id="endYear"
              type="number"
              min={formData.startYear || new Date().getFullYear()}
              value={formData.endYear}
              onChange={(e) => setFormData({ ...formData, endYear: Number(e.target.value) })}
              className={errors.endYear ? 'border-destructive' : ''}
            />
            {errors.endYear && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription>{errors.endYear}</AlertDescription>
              </Alert>
            )}
          </div>
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