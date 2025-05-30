"use client"

import { useRouter } from "next/navigation"
import MainApplicationLayout from "../../components/main-application-layout"
import PersonalGoalsManagementView from "../../components/personal-goals-management-view"

export default function GoalsPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push("/")
  }

  const handleSharePlan = () => {
    console.log("Share plan clicked")
  }

  return (
    <MainApplicationLayout activePlanName="My Tax Residency Plan Q3" onSharePlan={handleSharePlan}>
      <PersonalGoalsManagementView onBack={handleBack} />
    </MainApplicationLayout>
  )
}
