"use client"

import { useRouter } from "next/navigation"
import MainApplicationLayout from "../../components/main-application-layout"
import GetStartedView from "../../components/get-started-view"

export default function GetStartedPage() {
  const router = useRouter()

  const handleSelectTemplate = (templateId: "blank" | "example-portugal" | "example-dubai") => {
    // TODO: Initialize the selected template and navigate to dashboard
    console.log(`Selected template: ${templateId}`)

    // For now, navigate back to the main dashboard
    // In a real app, this would create the plan and redirect
    router.push("/")
  }

  const handleSharePlan = () => {
    // No active plan to share on get started screen
    console.log("No plan to share")
  }

  return (
    <MainApplicationLayout activePlanName={null} onSharePlan={handleSharePlan}>
      <GetStartedView onSelectTemplate={handleSelectTemplate} />
    </MainApplicationLayout>
  )
}
