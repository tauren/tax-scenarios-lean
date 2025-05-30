"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileEdit, Check, Landmark, Target, BarChart3, X } from "lucide-react"

interface ActivePlanDashboardViewProps {
  planName?: string
  assetCount?: number
  goalCount?: number
  scenarioCount?: number
  onPlanNameChange?: (newName: string) => void
  onNavigateToAssets?: () => void
  onNavigateToGoals?: () => void
  onNavigateToScenarios?: () => void
}

export default function ActivePlanDashboardView({
  planName = "My Tax Residency Plan Q3",
  assetCount = 0,
  goalCount = 0,
  scenarioCount = 0,
  onPlanNameChange,
  onNavigateToAssets,
  onNavigateToGoals,
  onNavigateToScenarios,
}: ActivePlanDashboardViewProps) {
  const [isEditingPlanName, setIsEditingPlanName] = useState(false)
  const [editedPlanName, setEditedPlanName] = useState(planName)

  const handleStartEdit = () => {
    setEditedPlanName(planName)
    setIsEditingPlanName(true)
  }

  const handleSaveEdit = () => {
    if (editedPlanName.trim()) {
      onPlanNameChange?.(editedPlanName.trim())
      setIsEditingPlanName(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedPlanName(planName)
    setIsEditingPlanName(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit()
    } else if (e.key === "Escape") {
      handleCancelEdit()
    }
  }

  const actionCards = [
    {
      title: "My Assets",
      description: "Define and update your financial assets for this plan.",
      icon: Landmark,
      onClick: onNavigateToAssets,
      count: assetCount,
    },
    {
      title: "My Personal Goals",
      description: "Set up and weight the lifestyle factors important to you.",
      icon: Target,
      onClick: onNavigateToGoals,
      count: goalCount,
    },
    {
      title: "Scenarios & Comparison",
      description: "Create, edit, and compare your different tax residency scenarios.",
      icon: BarChart3,
      onClick: onNavigateToScenarios,
      count: scenarioCount,
    },
  ]

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Plan Name Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {isEditingPlanName ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editedPlanName}
                  onChange={(e) => setEditedPlanName(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={handleKeyDown}
                  className="text-2xl md:text-3xl font-bold h-auto py-2 px-3 border-2"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveEdit}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <h1
                  className="text-2xl md:text-3xl font-bold text-foreground cursor-pointer hover:text-muted-foreground transition-colors"
                  onClick={handleStartEdit}
                >
                  {planName}
                </h1>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleStartEdit}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <FileEdit className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Summary Statistics */}
          <div className="text-sm text-muted-foreground">
            Assets: {assetCount} | Goals: {goalCount} | Scenarios: {scenarioCount}
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {actionCards.map((card, index) => {
            const IconComponent = card.icon
            return (
              <Card
                key={index}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/20"
                onClick={card.onClick}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
                      {card.count > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {card.count} item{card.count !== 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed">{card.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Getting Started Hint */}
        {assetCount === 0 && goalCount === 0 && scenarioCount === 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              Get started by defining your assets, then set your personal goals, and create scenarios to compare.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
