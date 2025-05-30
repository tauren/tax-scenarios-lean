"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, Plus, Pencil, Trash2, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface PersonalGoal {
  id: string
  name: string
  category: string
  description: string
  weight: "Low" | "Medium" | "High" | "Critical"
}

interface PersonalGoalsManagementViewProps {
  onBack?: () => void
}

const baseConcepts = [
  { value: "climate", label: "Climate" },
  { value: "healthcare", label: "Healthcare" },
  { value: "safety", label: "Safety & Security" },
  { value: "cost-of-living", label: "Cost of Living" },
  { value: "education", label: "Education" },
  { value: "culture", label: "Culture & Language" },
  { value: "business", label: "Business Environment" },
  { value: "infrastructure", label: "Infrastructure" },
]

const weightOptions = ["Low", "Medium", "High", "Critical"] as const

export default function PersonalGoalsManagementView({ onBack }: PersonalGoalsManagementViewProps) {
  const [goals, setGoals] = useState<PersonalGoal[]>([
    {
      id: "1",
      name: "Year-Round Sunshine",
      category: "Climate",
      description: "Prefer warm, sunny weather throughout the year.",
      weight: "High",
    },
    {
      id: "2",
      name: "Top-Tier Medical Facilities",
      category: "Healthcare",
      description: "Easy access to high-quality hospitals and specialists.",
      weight: "Critical",
    },
    {
      id: "3",
      name: "Low Crime Rate",
      category: "Safety & Security",
      description: "Safe environment for family and personal security.",
      weight: "High",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<PersonalGoal | null>(null)
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    baseConcept: "",
    name: "",
    description: "",
    weight: "" as PersonalGoal["weight"] | "",
  })

  const handleAddGoal = () => {
    setEditingGoal(null)
    setFormData({ baseConcept: "", name: "", description: "", weight: "" })
    setIsDialogOpen(true)
  }

  const handleEditGoal = (goal: PersonalGoal) => {
    setEditingGoal(goal)
    const concept = baseConcepts.find((c) => c.label === goal.category)
    setFormData({
      baseConcept: concept?.value || "",
      name: goal.name,
      description: goal.description,
      weight: goal.weight,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter((goal) => goal.id !== goalId))
  }

  const handleSaveGoal = () => {
    if (!formData.baseConcept || !formData.name || !formData.description || !formData.weight) {
      return
    }

    const concept = baseConcepts.find((c) => c.value === formData.baseConcept)
    if (!concept) return

    const goalData: PersonalGoal = {
      id: editingGoal?.id || Date.now().toString(),
      name: formData.name,
      category: concept.label,
      description: formData.description,
      weight: formData.weight,
    }

    if (editingGoal) {
      setGoals(goals.map((goal) => (goal.id === editingGoal.id ? goalData : goal)))
    } else {
      setGoals([...goals, goalData])
    }

    setIsDialogOpen(false)
    setFormData({ baseConcept: "", name: "", description: "", weight: "" })
  }

  const handleConceptSelect = (conceptValue: string) => {
    const concept = baseConcepts.find((c) => c.value === conceptValue)
    if (concept) {
      setFormData((prev) => ({
        ...prev,
        baseConcept: conceptValue,
        // Pre-fill name and description based on concept if creating new goal
        ...(editingGoal
          ? {}
          : {
              name: concept.label,
              description: `Goals related to ${concept.label.toLowerCase()}.`,
            }),
      }))
    }
    setIsComboboxOpen(false)
  }

  const getWeightBadgeColor = (weight: PersonalGoal["weight"]) => {
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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Personal Goals</h1>
        </div>
        <Button onClick={handleAddGoal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Goal
        </Button>
      </div>

      {/* Goals Summary */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Define the lifestyle factors that matter most to you. These goals will be used to score and compare your tax
          residency scenarios.
        </p>
      </div>

      {/* Goal List Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Goal</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No goals defined yet. Click "Add New Goal" to get started.
                </TableCell>
              </TableRow>
            ) : (
              goals.map((goal) => (
                <TableRow key={goal.id}>
                  <TableCell className="font-medium">{goal.name}</TableCell>
                  <TableCell>{goal.category}</TableCell>
                  <TableCell className="max-w-xs truncate">{goal.description}</TableCell>
                  <TableCell>
                    <span
                      className={cn("px-2 py-1 rounded-full text-xs font-medium", getWeightBadgeColor(goal.weight))}
                    >
                      {goal.weight}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditGoal(goal)} className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Goal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingGoal ? "Edit Personal Goal" : "Add a New Personal Goal"}</DialogTitle>
            <DialogDescription>
              Define a lifestyle factor that's important to you and assign it a weight for scenario comparison.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Base Concept Combobox */}
            <div className="space-y-2">
              <Label htmlFor="baseConcept">Base Goal Concept</Label>
              <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isComboboxOpen}
                    className="w-full justify-between"
                  >
                    {formData.baseConcept
                      ? baseConcepts.find((concept) => concept.value === formData.baseConcept)?.label
                      : "Select a concept..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search concepts..." />
                    <CommandList>
                      <CommandEmpty>No concept found.</CommandEmpty>
                      <CommandGroup>
                        {baseConcepts.map((concept) => (
                          <CommandItem key={concept.value} value={concept.value} onSelect={handleConceptSelect}>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.baseConcept === concept.value ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {concept.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Goal Name */}
            <div className="space-y-2">
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Year-Round Sunshine"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this goal means to you..."
                rows={3}
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight">Importance Weight</Label>
              <Select
                value={formData.weight}
                onValueChange={(value: PersonalGoal["weight"]) => setFormData((prev) => ({ ...prev, weight: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select importance level" />
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGoal}>{editingGoal ? "Save Changes" : "Add Goal"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
