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
import { v4 as uuidv4 } from 'uuid';

type DialogMode = 'add' | 'edit' | 'duplicate';

interface QualitativeAttributeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attribute?: ScenarioQualitativeAttribute;
  mode?: DialogMode;
  onSave: (attribute: ScenarioQualitativeAttribute) => void;
}

export function QualitativeAttributeDialog({
  open,
  onOpenChange,
  attribute,
  mode = 'add',
  onSave,
}: QualitativeAttributeDialogProps) {
  const [formData, setFormData] = useState<Partial<ScenarioQualitativeAttribute>>({
    text: '',
    sentiment: 'neutral',
    significance: 'Medium',
  });
  const [errors, setErrors] = useState<{ text?: string }>({});

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (open) {
      if (attribute) {
        setFormData({
          ...attribute,
        });
      } else {
        setFormData({
          text: '',
          sentiment: 'neutral',
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

  const validateText = (value: string | undefined): string | undefined => {
    return !value?.trim() ? 'Thoughts are required' : undefined;
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
    const textError = validateText(formData.text);
    if (textError) newErrors.text = textError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const attributeToSave: ScenarioQualitativeAttribute = {
      id: attribute?.id || uuidv4(),
      scenarioId: attribute?.scenarioId || '',
      text: formData.text || '',
      sentiment: formData.sentiment || 'neutral',
      significance: formData.significance || 'Medium',
      mappedGoalId: attribute?.mappedGoalId,
    };

    onSave(attributeToSave);
    onOpenChange(false);
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'add':
        return 'Add Qualitative Attribute';
      case 'edit':
        return 'Edit Qualitative Attribute';
      case 'duplicate':
        return 'Duplicate Qualitative Attribute';
      default:
        return 'Qualitative Attribute';
    }
  };

  const getDialogDescription = () => {
    switch (mode) {
      case 'add':
        return 'Add a new qualitative attribute to your scenario.';
      case 'edit':
        return 'Update the details of this qualitative attribute.';
      case 'duplicate':
        return 'Create a copy of this qualitative attribute.';
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
              id="text"
              label="What's one thing you've noticed about this location?"
              error={errors.text}
            >
              <input
                id="text"
                type="text"
                value={formData.text}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, text: value });
                  setFieldError('text', validateText(value));
                }}
                onBlur={() => setFieldError('text', validateText(formData.text))}
                className={`w-full rounded-md border ${errors.text ? 'border-destructive' : 'border-input'} bg-background px-3 py-2`}
                placeholder="e.g., Low cost of living, Great healthcare, Many outdoor activities..."
              />
            </FormField>

            <FormField
              id="sentiment"
              label="How do you feel about this?"
            >
              <SentimentSelector
                value={formData.sentiment || 'neutral'}
                onChange={(value) => setFormData({ ...formData, sentiment: value })}
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