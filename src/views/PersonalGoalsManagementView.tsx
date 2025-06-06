"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Pencil, Trash2, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserQualitativeGoal, GlobalQualitativeConcept } from "@/types"
import { useUserAppState } from "@/store/userAppStateSlice"
import { Textarea } from "@/components/ui/textarea"
import { QUALITATIVE_CONCEPTS } from "@/data/qualitative-categories.data"

const weightOptions = ["Low", "Medium", "High", "Critical"] as const
type WeightOption = typeof weightOptions[number]

export default function PersonalGoalsManagementView() {
  const { userQualitativeGoals = [], addQualitativeGoal, updateQualitativeGoal, deleteQualitativeGoal } = useUserAppState()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<UserQualitativeGoal | null>(null)
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    conceptId: "",
    description: "",
    weight: "Medium" as WeightOption
  })

  const handleOpenDialog = (goal?: UserQualitativeGoal) => {
    if (goal) {
      setEditingGoal(goal)
      setFormData({
        name: goal.name,
        conceptId: goal.conceptId,
        description: goal.description,
        weight: goal.weight
      })
    } else {
      setEditingGoal(null)
      setFormData({
        name: "",
        conceptId: "",
        description: "",
        weight: "Medium"
      })
    }
    setIsDialogOpen(true)
  }

  const handleSaveGoal = () => {
    if (!formData.name || !formData.conceptId) return

    const concept = QUALITATIVE_CONCEPTS.find(c => c.id === formData.conceptId)
    if (!concept) return

    const goalData = {
      id: editingGoal?.id || crypto.randomUUID(),
      name: formData.name,
      conceptId: formData.conceptId,
      category: concept.category,
      description: formData.description,
      weight: formData.weight
    }

    if (editingGoal) {
      updateQualitativeGoal(editingGoal.id, goalData)
    } else {
      addQualitativeGoal(goalData)
    }

    setIsDialogOpen(false)
  }

  const getWeightBadgeColor = (weight: UserQualitativeGoal["weight"]) => {
    switch (weight) {
      case "Critical":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Personal Goals</h1>
        <Button onClick={() => handleOpenDialog()}>Add New Goal</Button>
      </div>

      {/* Goals Summary */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Define the lifestyle factors that matter most to you. These goals will be used to score and compare your tax
          residency scenarios.
        </p>
      </div>

      {/* Goal List Table */}
      {userQualitativeGoals.length > 0 ? (
        <div className="space-y-4">
          {userQualitativeGoals.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{goal.name}</h3>
                  <p className="text-sm text-gray-500">{goal.category}</p>
                  <p className="mt-2">{goal.description}</p>
                  <p className="text-sm text-gray-500 mt-2">Weight: {goal.weight}</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(goal)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteQualitativeGoal(goal.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't added any personal goals yet.</p>
          <Button onClick={() => handleOpenDialog()}>Add Your First Goal</Button>
        </div>
      )}

      {/* Add/Edit Goal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingGoal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
            <DialogDescription>
              {editingGoal
                ? "Modify your personal goal details below."
                : "Select a base concept and customize it to create your personal goal."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="concept">Base Concept</Label>
              <Select
                value={formData.conceptId}
                onValueChange={(value) => setFormData({ ...formData, conceptId: value })}
              >
                <SelectTrigger>
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
            </div>
            <div>
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter a name for your goal"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your goal"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight</Label>
              <Select
                value={formData.weight}
                onValueChange={(value: WeightOption) => setFormData({ ...formData, weight: value })}
              >
                <SelectTrigger>
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
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveGoal}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 