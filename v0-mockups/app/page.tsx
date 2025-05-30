"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import MainApplicationLayout from "../components/main-application-layout"
import ActivePlanDashboardView from "../components/active-plan-dashboard-view"

export default function Page() {
  const router = useRouter()
  const [activePlanName, setActivePlanName] = useState<string | null>(null)
  const [hasExistingPlan, setHasExistingPlan] = useState(false)

  // Simulate checking for existing plans
  useEffect(() => {
    // TODO: Replace with actual plan checking logic
    const existingPlan = localStorage.getItem("activePlan")
    if (existingPlan) {
      setActivePlanName("My Tax Residency Plan Q3")
      setHasExistingPlan(true)
    } else {
      // Redirect to get started if no plan exists
      router.push("/get-started")
    }
  }, [router])

  const handlePlanNameChange = (newName: string) => {
    setActivePlanName(newName)
    // TODO: Save to state management/localStorage
  }

  const handleSharePlan = () => {
    console.log("Share plan clicked")
  }

  // Show loading or redirect to get started
  if (!hasExistingPlan) {
    return null
  }

  return (
    <MainApplicationLayout activePlanName={activePlanName} onSharePlan={handleSharePlan}>
      <ActivePlanDashboardView
        planName={activePlanName || ""}
        onPlanNameChange={handlePlanNameChange}
        assetCount={3}
        goalCount={5}
        scenarioCount={2}
      />
    </MainApplicationLayout>
  )
}
