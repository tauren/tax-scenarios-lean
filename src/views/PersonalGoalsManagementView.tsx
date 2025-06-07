"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { UserQualitativeGoal } from "@/types"
import { useUserAppState } from "@/store/userAppStateSlice"
import { GoalDialog } from "@/components/dialogs/GoalDialog"

export default function PersonalGoalsManagementView() {
  const { userQualitativeGoals = [], addQualitativeGoal, updateQualitativeGoal, deleteQualitativeGoal } = useUserAppState()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<UserQualitativeGoal | null>(null)

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
      <GoalDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingGoal={editingGoal}
        onSave={handleSaveGoal}
      />
    </div>
  )
} 