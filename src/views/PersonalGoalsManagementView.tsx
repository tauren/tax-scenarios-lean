"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { UserQualitativeGoal } from "@/types"
import { useUserAppState } from "@/store/userAppStateSlice"
import { GoalDialog } from "@/components/dialogs/GoalDialog"
import { StatementSelectionDialog } from "@/components/dialogs/StatementSelectionDialog"
import { qualitativeConcepts } from "@/data/qualitativeConcepts.data"
import { QualitativeGoalCard } from "@/components/shared/QualitativeGoalCard"
import type { WeightOption } from "@/components/shared/WeightSelector"

export default function PersonalGoalsManagementView() {
  const { userQualitativeGoals = [], addQualitativeGoal, updateQualitativeGoal, deleteQualitativeGoal } = useUserAppState()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isStatementDialogOpen, setIsStatementDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<UserQualitativeGoal | null>(null)

  const handleOpenDialog = (goal?: UserQualitativeGoal) => {
    setEditingGoal(goal || null)
    setIsDialogOpen(true)
  }

  const handleSaveGoal = (goalData: Omit<UserQualitativeGoal, 'id'>) => {
    if (editingGoal) {
      updateQualitativeGoal(editingGoal.id, goalData)
    } else {
      addQualitativeGoal(goalData)
    }
    setIsDialogOpen(false)
  }

  const handleAddFromStatements = (statements: { conceptId: string; name: string }[]) => {
    statements.forEach(statement => {
      addQualitativeGoal({
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

  const getConceptName = (conceptId: string) => {
    const concept = qualitativeConcepts.find(c => c.id === conceptId)
    return concept?.name || conceptId
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Location Objectives</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsStatementDialogOpen(true)}
          >
            Add Objectives from Examples
          </Button>
          <Button onClick={() => handleOpenDialog()}>Add New Objective</Button>
        </div>
      </div>

      {/* Goals Summary */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Define the lifestyle factors that matter most to you. These objectives will be used to score and compare your tax
          residency scenarios.
        </p>
      </div>

      {/* Goal List */}
      {userQualitativeGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userQualitativeGoals.map((goal) => (
            <QualitativeGoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleOpenDialog}
              onDelete={deleteQualitativeGoal}
              onUpdateName={handleUpdateName}
              onUpdateWeight={handleUpdateWeight}
              getConceptName={getConceptName}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't added any location objectives yet.</p>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={() => setIsStatementDialogOpen(true)}
            >
              Add Objectives from Examples
            </Button>
            <Button onClick={() => handleOpenDialog()}>Add Your First Objective</Button>
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