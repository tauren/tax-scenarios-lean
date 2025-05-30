"use client"

import { useRouter, useParams } from "next/navigation"
import MainApplicationLayout from "../../../../components/main-application-layout"
import ScenarioEditorView from "../../../../components/scenario-editor-view"

export default function EditScenarioPage() {
  const router = useRouter()
  const params = useParams()
  const scenarioId = params.id as string

  const handleBack = () => {
    router.push("/scenarios")
  }

  const handleSharePlan = () => {
    console.log("Share plan clicked")
  }

  return (
    <MainApplicationLayout activePlanName="My Tax Residency Plan Q3" onSharePlan={handleSharePlan}>
      <ScenarioEditorView scenarioId={scenarioId} onBack={handleBack} />
    </MainApplicationLayout>
  )
}
