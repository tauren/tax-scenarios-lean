import { useState, useEffect } from 'react';
import type { ScenarioQualitativeAttribute } from '@/types/qualitative';
import { Button } from '@/components/ui/button';
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
import { SentimentSelector } from '@/components/shared/SentimentSelector';
import { WeightSelector } from '@/components/shared/WeightSelector';

type DialogMode = 'add' | 'edit' | 'duplicate';

interface QualitativeAttributeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attribute?: ScenarioQualitativeAttribute;
  mode?: DialogMode;
  onSave: (attribute: Omit<ScenarioQualitativeAttribute, 'id'>) => void;
}

export function QualitativeAttributeDialog({
  open,
  onOpenChange,
  attribute,
  mode = 'add',
  onSave,
}: QualitativeAttributeDialogProps) {
  const [formData, setFormData] = useState<Partial<ScenarioQualitativeAttribute>>({
    name: attribute?.name || '',
    sentiment: attribute?.sentiment || 'Neutral',
    significance: attribute?.significance || 'Medium',
  });
  const [errors, setErrors] = useState<{ name?: string }>({});

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (open) {
      if (attribute) {
        setFormData({
          ...attribute,
        });
      } else {
        setFormData({
          name: '',
          sentiment: 'Neutral',
          significance: 'Medium',
        });
      }
      setErrors({});
    }
  }, [open, attribute]);

  // Run validation after form data has been updated
  useEffect(() => {
    if (open) {
      validateForm();
    }
  }, [open, formData]);

  const validateName = (value: string | undefined): string | undefined => {
    return !value?.trim() ? 'Name is required' : undefined;
  };

  const setFieldError = (field: keyof typeof errors, error: string | undefined) => {
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
    const newErrors: typeof errors = {};

    // Validate all fields
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const attributeToSave: Omit<ScenarioQualitativeAttribute, 'id'> = {
      name: formData.name || '',
      sentiment: formData.sentiment || 'Neutral',
      significance: formData.significance || 'Medium',
      mappedGoalId: attribute?.mappedGoalId,
    };

    onSave(attributeToSave);
    onOpenChange(false);
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'add':
        return 'Add Location Consideration';
      case 'edit':
        return 'Edit Location Consideration';
      case 'duplicate':
        return 'Duplicate Location Consideration';
      default:
        return 'Location Consideration';
    }
  };

  const getDialogDescription = () => {
    switch (mode) {
      case 'add':
        return 'Describe something notable about this location and how it affects your decision. For example: "Low cost of living", "Great healthcare system", or "Limited English proficiency".';
      case 'edit':
        return 'Update the details of this location consideration.';
      case 'duplicate':
        return 'Create a copy of this location consideration.';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              label="What's one thing you've noticed about this location?"
              error={errors.name}
            >
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, name: value });
                  setFieldError('name', validateName(value));
                }}
                onBlur={() => setFieldError('name', validateName(formData.name))}
                className={`w-full rounded-md border ${errors.name ? 'border-destructive' : 'border-input'} bg-background px-3 py-2`}
                placeholder="e.g., Low cost of living, Great healthcare, Many outdoor activities..."
              />
            </FormField>

            <FormField
              id="sentiment"
              label="Is this a pro, con, or neutral factor?"
            >
              <SentimentSelector
                value={formData.sentiment || 'Neutral'}
                onChange={(value) => setFormData({ ...formData, sentiment: value })}
                labels={{
                  Positive: 'Pro',
                  Negative: 'Con',
                  Neutral: 'Neutral'
                }}
              />
            </FormField>

            <FormField
              id="significance"
              label="How significant is this to you?"
            >
              <WeightSelector
                value={formData.significance || 'Medium'}
                onChange={(value) => setFormData({ ...formData, significance: value })}
              />
            </FormField>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={Object.keys(errors).length > 0}
            >
              {mode === 'add' ? 'Add' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 