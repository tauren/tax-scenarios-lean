"use client"

import { useRouter } from "next/navigation"
import MainApplicationLayout from "../../components/main-application-layout"
import ScenarioHubView from "../../components/scenario-hub-view"

export default function ScenariosPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push("/")
  }

  const handleAddScenario = () => {
    console.log("Add new scenario")
    // TODO: Navigate to scenario creation flow
  }

  const handleEditScenario = (scenarioId: string) => {
    console.log("Edit scenario:", scenarioId)
    // TODO: Navigate to scenario editing
  }

  const handleViewScenario = (scenarioId: string) => {
    console.log("View scenario details:", scenarioId)
    // TODO: Navigate to scenario details view
  }

  const handleDeleteScenario = (scenarioId: string) => {
    console.log("Delete scenario:", scenarioId)
    // TODO: Show confirmation dialog and delete
  }

  const handleSharePlan = () => {
    console.log("Share plan clicked")
  }

  return (
    <MainApplicationLayout activePlanName="My Tax Residency Plan Q3" onSharePlan={handleSharePlan}>
      <ScenarioHubView
        onBack={handleBack}
        onAddScenario={handleAddScenario}
        onEditScenario={handleEditScenario}
        onViewScenario={handleViewScenario}
        onDeleteScenario={handleDeleteScenario}
      />
    </MainApplicationLayout>
  )
}
