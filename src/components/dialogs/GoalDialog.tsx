import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { qualitativeConcepts } from "@/data/qualitativeConcepts.data"
import { FormField } from "@/components/shared/FormField"
import type { UserQualitativeGoal } from "@/types"
import { WeightSelector } from "@/components/shared/WeightSelector"
import type { WeightOption } from "@/components/shared/WeightSelector"

interface GoalValidationErrors {
  name?: string;
  conceptId?: string;
  weight?: string;
}

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingGoal: UserQualitativeGoal | null;
  onSave: (goalData: Omit<UserQualitativeGoal, "id">) => void;
}

export function GoalDialog({ open, onOpenChange, editingGoal, onSave }: GoalDialogProps) {
  const [errors, setErrors] = useState<GoalValidationErrors>({})

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    conceptId: "",
    description: "",
    weight: "Medium" as WeightOption
  })

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (open) {
      if (editingGoal) {
        setFormData({
          name: editingGoal.name,
          conceptId: editingGoal.conceptId,
          description: editingGoal.description || "",
          weight: editingGoal.weight
        })
      } else {
        setFormData({
          name: "",
          conceptId: "",
          description: "",
          weight: "Medium"
        })
      }
      setErrors({})
    }
  }, [open, editingGoal])

  // Run validation after form data has been updated
  useEffect(() => {
    if (open) {
      validateForm()
    }
  }, [open, formData])

  const validateName = (value: string | undefined): string | undefined => {
    return !value?.trim() ? 'Name is required' : undefined
  }

  const validateConcept = (value: string | undefined): string | undefined => {
    return !value ? 'Category is required' : undefined
  }

  const validateWeight = (value: WeightOption | undefined): string | undefined => {
    return !value ? 'Importance is required' : undefined
  }

  const setFieldError = (field: keyof GoalValidationErrors, error: string | undefined) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      if (error) {
        newErrors[field] = error
      } else {
        delete newErrors[field]
      }
      return newErrors
    })
  }

  const validateForm = (): boolean => {
    const newErrors: GoalValidationErrors = {}

    // Validate all fields
    const nameError = validateName(formData.name)
    const conceptError = validateConcept(formData.conceptId)
    const weightError = validateWeight(formData.weight)

    // Only add errors that exist
    if (nameError) newErrors.name = nameError
    if (conceptError) newErrors.conceptId = conceptError
    if (weightError) newErrors.weight = weightError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const concept = qualitativeConcepts.find(c => c.id === formData.conceptId)
    if (!concept) return

    const goalData = {
      name: formData.name,
      conceptId: formData.conceptId,
      description: formData.description || undefined,
      weight: formData.weight
    }

    onSave(goalData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingGoal ? "Edit Priority" : "Add New Priority"}</DialogTitle>
          <DialogDescription>
            {editingGoal
              ? "Modify your priority details below."
              : "Create a new priority by selecting a category and customizing it to your needs."}
          </DialogDescription>
        </DialogHeader>

        <form 
          onSubmit={(e) => {
            e.preventDefault()
            if (Object.keys(errors).length === 0) {
              handleSave()
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-4 py-4">
            <FormField
              id="concept"
              label="Priority Category"
              error={errors.conceptId}
            >
              <Select
                value={formData.conceptId}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, conceptId: value }))
                  setFieldError('conceptId', validateConcept(value))
                }}
              >
                <SelectTrigger className={errors.conceptId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {qualitativeConcepts.map((concept) => (
                    <SelectItem key={concept.id} value={concept.id}>
                      {concept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              id="name"
              label="Priority Name"
              error={errors.name}
            >
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value
                  setFormData(prev => ({ ...prev, name: value }))
                  setFieldError('name', validateName(value))
                }}
                onBlur={() => setFieldError('name', validateName(formData.name))}
                placeholder="Enter a name for your priority"
                className={errors.name ? 'border-destructive' : ''}
              />
            </FormField>

            <FormField
              id="description"
              label="Description (Optional)"
            >
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => {
                  const value = e.target.value
                  setFormData(prev => ({ ...prev, description: value }))
                }}
                placeholder="Describe your priority (optional)"
              />
            </FormField>

            <FormField
              id="weight"
              error={errors.weight}
              label="How important is this priority to you?"
            >
              <WeightSelector
                value={formData.weight}
                onChange={(weight) => setFormData((prev) => ({ ...prev, weight }))}
                error={errors.weight}
              />
            </FormField>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingGoal ? "Save Changes" : "Add Priority"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 