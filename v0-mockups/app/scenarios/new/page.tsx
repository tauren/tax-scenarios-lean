"use client"

import { useRouter } from "next/navigation"
import MainApplicationLayout from "../../../components/main-application-layout"
import ScenarioEditorView from "../../../components/scenario-editor-view"

export default function NewScenarioPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push("/scenarios")
  }

  const handleSharePlan = () => {
    console.log("Share plan clicked")
  }

  return (
    <MainApplicationLayout activePlanName="My Tax Residency Plan Q3" onSharePlan={handleSharePlan}>
      <ScenarioEditorView isNewScenario={true} onBack={handleBack} />
    </MainApplicationLayout>
  )
}
