"use client"

import { useRouter } from "next/navigation"
import MainApplicationLayout from "../../components/main-application-layout"
import AssetManagementView from "../../components/asset-management-view"

export default function AssetsPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push("/")
  }

  const handleSharePlan = () => {
    console.log("Share plan clicked")
  }

  return (
    <MainApplicationLayout activePlanName="My Tax Residency Plan Q3" onSharePlan={handleSharePlan}>
      <AssetManagementView onBack={handleBack} />
    </MainApplicationLayout>
  )
}
