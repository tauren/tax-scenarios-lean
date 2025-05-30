"use client"

import { useRouter, useParams } from "next/navigation"
import MainApplicationLayout from "../../../../components/main-application-layout"
import DetailedScenarioView from "../../../../components/detailed-scenario-view"

export default function ViewScenarioPage() {
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
      <DetailedScenarioView scenarioId={scenarioId} onBack={handleBack} />
    </MainApplicationLayout>
  )
}
