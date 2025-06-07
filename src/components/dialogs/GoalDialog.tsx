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
import { QUALITATIVE_CONCEPTS } from "@/data/qualitative-categories.data"
import { FormField } from "@/components/shared/FormField"
import type { UserQualitativeGoal } from "@/types"

const weightOptions = ["Low", "Medium", "High", "Critical"] as const
type WeightOption = typeof weightOptions[number]

interface GoalValidationErrors {
  name?: string;
  conceptId?: string;
  description?: string;
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
          description: editingGoal.description,
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
    return !value ? 'Base concept is required' : undefined
  }

  const validateDescription = (value: string | undefined): string | undefined => {
    return !value?.trim() ? 'Description is required' : undefined
  }

  const validateWeight = (value: WeightOption | undefined): string | undefined => {
    return !value ? 'Weight is required' : undefined
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
    const descriptionError = validateDescription(formData.description)
    const weightError = validateWeight(formData.weight)

    // Only add errors that exist
    if (nameError) newErrors.name = nameError
    if (conceptError) newErrors.conceptId = conceptError
    if (descriptionError) newErrors.description = descriptionError
    if (weightError) newErrors.weight = weightError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const concept = QUALITATIVE_CONCEPTS.find(c => c.id === formData.conceptId)
    if (!concept) return

    const goalData = {
      name: formData.name,
      conceptId: formData.conceptId,
      category: concept.category,
      description: formData.description,
      weight: formData.weight
    }

    onSave(goalData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingGoal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
          <DialogDescription>
            {editingGoal
              ? "Modify your personal goal details below."
              : "Select a base concept and customize it to create your personal goal."}
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
              label="Base Concept"
              error={errors.conceptId}
            >
              <Select
                value={formData.conceptId}
                onValueChange={(value) => {
                  setFormData({ ...formData, conceptId: value })
                  setFieldError('conceptId', validateConcept(value))
                }}
              >
                <SelectTrigger className={errors.conceptId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select a concept" />
                </SelectTrigger>
                <SelectContent>
                  {QUALITATIVE_CONCEPTS.map((concept) => (
                    <SelectItem key={concept.id} value={concept.id}>
                      {concept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              id="name"
              label="Goal Name"
              error={errors.name}
            >
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value
                  setFormData({ ...formData, name: value })
                  setFieldError('name', validateName(value))
                }}
                onBlur={() => setFieldError('name', validateName(formData.name))}
                placeholder="Enter a name for your goal"
                className={errors.name ? 'border-destructive' : ''}
              />
            </FormField>

            <FormField
              id="description"
              label="Description"
              error={errors.description}
            >
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => {
                  const value = e.target.value
                  setFormData({ ...formData, description: value })
                  setFieldError('description', validateDescription(value))
                }}
                onBlur={() => setFieldError('description', validateDescription(formData.description))}
                placeholder="Describe your goal"
                className={errors.description ? 'border-destructive' : ''}
              />
            </FormField>

            <FormField
              id="weight"
              label="Weight"
              error={errors.weight}
            >
              <Select
                value={formData.weight}
                onValueChange={(value: WeightOption) => {
                  setFormData({ ...formData, weight: value })
                  setFieldError('weight', validateWeight(value))
                }}
              >
                <SelectTrigger className={errors.weight ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select weight" />
                </SelectTrigger>
                <SelectContent>
                  {weightOptions.map((weight) => (
                    <SelectItem key={weight} value={weight}>
                      {weight}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 