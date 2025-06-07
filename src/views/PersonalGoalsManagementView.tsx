"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { UserQualitativeGoal } from "@/types"
import { useUserAppState } from "@/store/userAppStateSlice"
import { GoalDialog } from "@/components/dialogs/GoalDialog"
import { StatementSelectionDialog } from "@/components/dialogs/StatementSelectionDialog"
import { qualitativeConcepts } from "@/data/qualitativeConcepts.data"
import { Pencil, Trash2 } from "lucide-react"
import { WeightSelector } from "@/components/shared/WeightSelector"
import type { WeightOption } from "@/components/shared/WeightSelector"
import { FormField } from "@/components/ui/form"

export default function PersonalGoalsManagementView() {
  const { userQualitativeGoals = [], addQualitativeGoal, updateQualitativeGoal, deleteQualitativeGoal } = useUserAppState()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isStatementDialogOpen, setIsStatementDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<UserQualitativeGoal | null>(null)
  const [editingName, setEditingName] = useState<string | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Handle clicking outside of the name input
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editingName && nameInputRef.current && !nameInputRef.current.contains(event.target as Node)) {
        setEditingName(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [editingName])

  const handleOpenDialog = (goal?: UserQualitativeGoal) => {
    setEditingGoal(goal || null)
    setIsDialogOpen(true)
  }

  const handleSaveGoal = (goalData: Omit<UserQualitativeGoal, "id">) => {
    if (editingGoal) {
      updateQualitativeGoal(editingGoal.id, { ...goalData, id: editingGoal.id })
    } else {
      addQualitativeGoal({ ...goalData, id: crypto.randomUUID() })
    }
  }

  const handleAddFromStatements = (statements: { conceptId: string; name: string }[]) => {
    statements.forEach(statement => {
      addQualitativeGoal({
        id: crypto.randomUUID(),
        conceptId: statement.conceptId,
        name: statement.name,
        weight: "Medium"
      })
    })
  }

  const handleUpdateName = (goalId: string, newName: string) => {
    if (newName.trim()) {
      updateQualitativeGoal(goalId, { name: newName.trim() })
    }
  }

  const handleUpdateWeight = (goalId: string, weight: WeightOption) => {
    updateQualitativeGoal(goalId, { weight })
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

  const getConceptName = (conceptId: string) => {
    const concept = qualitativeConcepts.find(c => c.id === conceptId)
    return concept?.name || conceptId
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Personal Goals</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsStatementDialogOpen(true)}>
            Add from Statements
          </Button>
          <Button onClick={() => handleOpenDialog()}>Add New Goal</Button>
        </div>
      </div>

      {/* Goals Summary */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Define the lifestyle factors that matter most to you. These goals will be used to score and compare your tax
          residency scenarios.
        </p>
      </div>

      {/* Goal List */}
      {userQualitativeGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userQualitativeGoals.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4 flex flex-col h-full">
              {/* Name + pencil + actions at the top */}
              <div className="flex items-start justify-between gap-4">
                <div className="cursor-pointer group/name flex-1 min-w-0">
                  <Popover>
                    <PopoverTrigger asChild>
                      <span>
                        <h3 className="font-semibold break-words">
                          {goal.name}
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover/name:opacity-100 transition-opacity inline-block align-text-bottom ml-1 whitespace-nowrap" />
                        </h3>
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-[500px]" align="start">
                      <div className="space-y-4">
                        <h4 className="font-medium">Edit Goal Name</h4>
                        <Textarea
                          value={goal.name}
                          onChange={(e) => handleUpdateName(goal.id, e.target.value)}
                          className="w-full min-h-[100px] resize-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === 'Tab') {
                              e.preventDefault()
                              const popoverTrigger = document.querySelector('[data-state="open"]')
                              if (popoverTrigger) {
                                ;(popoverTrigger as HTMLElement).click()
                              }
                            }
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleOpenDialog(goal)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => deleteQualitativeGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Flexible spacer */}
              <div className="flex-1" />
              {/* Bottom group: concept tag + importance buttons */}
              <div>
                <div className="flex items-center mb-2 mt-2">
                  <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                    {getConceptName(goal.conceptId)}
                  </span>
                </div>
                <div className="mb-2">
                  <WeightSelector
                    value={goal.weight}
                    onChange={(weight) => handleUpdateWeight(goal.id, weight)}
                    className="mt-0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't added any personal goals yet.</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => setIsStatementDialogOpen(true)}>
              Add from Statements
            </Button>
            <Button onClick={() => handleOpenDialog()}>Add Your First Goal</Button>
          </div>
        </div>
      )}

      {/* Add/Edit Goal Dialog */}
      <GoalDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingGoal={editingGoal}
        onSave={handleSaveGoal}
      />

      {/* Statement Selection Dialog */}
      <StatementSelectionDialog
        open={isStatementDialogOpen}
        onOpenChange={setIsStatementDialogOpen}
        onConfirm={handleAddFromStatements}
      />
    </div>
  )
} 