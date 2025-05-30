"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Pencil, Trash2, XCircle, CalendarIcon, TrendingUp, TrendingDown } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface IncomeSource {
  id: string
  name: string
  type: string
  annualAmount: number
  startYear: number
  endYear: number
}

interface AnnualExpense {
  id: string
  name: string
  amount: number
}

interface PlannedAssetSale {
  id: string
  assetId: string
  assetName: string
  yearOfSale: number
  quantityToSell: number
  expectedSalePricePerUnit: number
  costBasisPerUnit: number
  estimatedGainLoss: number
}

interface SpecialTaxFeature {
  id: string
  name: string
  description: string
  requiresGainBifurcation: boolean
  inputs?: { name: string; value: string }[]
}

interface ScenarioAttribute {
  id: string
  conceptName: string
  userSentiment: "Positive" | "Neutral" | "Negative"
  significanceToUser: "None" | "Low" | "Medium" | "High"
}

interface ScenarioEditorViewProps {
  scenarioId?: string
  isNewScenario?: boolean
  onBack?: () => void
}

export default function ScenarioEditorView({ scenarioId, isNewScenario = false, onBack }: ScenarioEditorViewProps) {
  const [activeTab, setActiveTab] = useState("core")

  // Core scenario data
  const [scenarioData, setScenarioData] = useState({
    displayLocationName: isNewScenario ? "" : "Lisbon, Portugal (NHR)",
    locationCountry: isNewScenario ? "" : "Portugal",
    locationState: "",
    locationCity: isNewScenario ? "" : "Lisbon",
    projectionPeriodYears: 5,
    residencyStartDate: undefined as Date | undefined,
    shortTermCgtRate: 37,
    longTermCgtRate: 20,
  })

  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
    {
      id: "1",
      name: "Software Consulting",
      type: "Business Income",
      annualAmount: 120000,
      startYear: 2024,
      endYear: 2029,
    },
    {
      id: "2",
      name: "Investment Dividends",
      type: "Investment Income",
      annualAmount: 30000,
      startYear: 2024,
      endYear: 2029,
    },
  ])

  const [expenses, setExpenses] = useState<AnnualExpense[]>([
    { id: "1", name: "Housing", amount: 24000 },
    { id: "2", name: "Living Expenses", amount: 18000 },
    { id: "3", name: "Healthcare", amount: 6000 },
  ])

  const [plannedSales, setPlannedSales] = useState<PlannedAssetSale[]>([
    {
      id: "1",
      assetId: "asset1",
      assetName: "Vanguard S&P 500 ETF",
      yearOfSale: 2025,
      quantityToSell: 50,
      expectedSalePricePerUnit: 450,
      costBasisPerUnit: 350.25,
      estimatedGainLoss: 4987.5,
    },
  ])

  const [specialTaxFeatures, setSpecialTaxFeatures] = useState<SpecialTaxFeature[]>([
    {
      id: "1",
      name: "Portugal NHR Program",
      description: "Non-Habitual Resident tax benefits for foreign income",
      requiresGainBifurcation: true,
    },
  ])

  const [scenarioAttributes, setScenarioAttributes] = useState<ScenarioAttribute[]>([
    {
      id: "1",
      conceptName: "Climate",
      userSentiment: "Positive",
      significanceToUser: "High",
    },
    {
      id: "2",
      conceptName: "Healthcare",
      userSentiment: "Positive",
      significanceToUser: "Medium",
    },
  ])

  // Dialog states
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false)
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false)
  const [isStfDialogOpen, setIsStfDialogOpen] = useState(false)
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  // Form states
  const [incomeForm, setIncomeForm] = useState({
    name: "",
    type: "",
    annualAmount: "",
    startYear: "",
    endYear: "",
  })

  const [expenseForm, setExpenseForm] = useState({
    name: "",
    amount: "",
  })

  const [saleForm, setSaleForm] = useState({
    assetId: "",
    yearOfSale: "",
    quantityToSell: "",
    expectedSalePricePerUnit: "",
  })

  const [attributeForm, setAttributeForm] = useState({
    conceptName: "",
    userSentiment: "Neutral" as ScenarioAttribute["userSentiment"],
    significanceToUser: "Medium" as ScenarioAttribute["significanceToUser"],
  })

  // Mock data for selects
  const availableAssets = [
    { id: "asset1", name: "Vanguard S&P 500 ETF", costBasisPerUnit: 350.25 },
    { id: "asset2", name: "Apple Inc. (AAPL)", costBasisPerUnit: 145.3 },
    { id: "asset3", name: "Downtown Condo", costBasisPerUnit: 450000 },
  ]

  const availableStfs = [
    {
      id: "stf1",
      name: "Portugal NHR Program",
      description: "Non-Habitual Resident tax benefits for foreign income",
    },
    {
      id: "stf2",
      name: "UAE Tax Residency",
      description: "Zero capital gains tax for UAE tax residents",
    },
  ]

  const availableConcepts = [
    "Climate",
    "Healthcare",
    "Safety & Security",
    "Cost of Living",
    "Education",
    "Culture & Language",
    "Business Environment",
    "Infrastructure",
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const calculateQualitativeFitScore = () => {
    // Mock calculation - in real app this would be more sophisticated
    const totalWeight = scenarioAttributes.reduce((sum, attr) => {
      const weights = { None: 0, Low: 1, Medium: 2, High: 3 }
      return sum + weights[attr.significanceToUser]
    }, 0)

    const weightedScore = scenarioAttributes.reduce((sum, attr) => {
      const weights = { None: 0, Low: 1, Medium: 2, High: 3 }
      const sentimentScores = { Negative: 0, Neutral: 0.5, Positive: 1 }
      return sum + weights[attr.significanceToUser] * sentimentScores[attr.userSentiment]
    }, 0)

    return totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0
  }

  const handleSaveIncome = () => {
    if (!incomeForm.name || !incomeForm.annualAmount) return

    const newIncome: IncomeSource = {
      id: Date.now().toString(),
      name: incomeForm.name,
      type: incomeForm.type || "Other",
      annualAmount: Number.parseFloat(incomeForm.annualAmount),
      startYear: Number.parseInt(incomeForm.startYear) || new Date().getFullYear(),
      endYear: Number.parseInt(incomeForm.endYear) || new Date().getFullYear() + 5,
    }

    setIncomeSources([...incomeSources, newIncome])
    setIncomeForm({ name: "", type: "", annualAmount: "", startYear: "", endYear: "" })
    setIsIncomeDialogOpen(false)
  }

  const handleSaveExpense = () => {
    if (!expenseForm.name || !expenseForm.amount) return

    const newExpense: AnnualExpense = {
      id: Date.now().toString(),
      name: expenseForm.name,
      amount: Number.parseFloat(expenseForm.amount),
    }

    setExpenses([...expenses, newExpense])
    setExpenseForm({ name: "", amount: "" })
    setIsExpenseDialogOpen(false)
  }

  const handleSaveSale = () => {
    if (!saleForm.assetId || !saleForm.yearOfSale || !saleForm.quantityToSell || !saleForm.expectedSalePricePerUnit)
      return

    const asset = availableAssets.find((a) => a.id === saleForm.assetId)
    if (!asset) return

    const quantity = Number.parseFloat(saleForm.quantityToSell)
    const salePrice = Number.parseFloat(saleForm.expectedSalePricePerUnit)
    const estimatedGainLoss = quantity * (salePrice - asset.costBasisPerUnit)

    const newSale: PlannedAssetSale = {
      id: Date.now().toString(),
      assetId: saleForm.assetId,
      assetName: asset.name,
      yearOfSale: Number.parseInt(saleForm.yearOfSale),
      quantityToSell: quantity,
      expectedSalePricePerUnit: salePrice,
      costBasisPerUnit: asset.costBasisPerUnit,
      estimatedGainLoss,
    }

    setPlannedSales([...plannedSales, newSale])
    setSaleForm({ assetId: "", yearOfSale: "", quantityToSell: "", expectedSalePricePerUnit: "" })
    setIsSaleDialogOpen(false)
  }

  const handleSaveAttribute = () => {
    if (!attributeForm.conceptName) return

    const newAttribute: ScenarioAttribute = {
      id: Date.now().toString(),
      conceptName: attributeForm.conceptName,
      userSentiment: attributeForm.userSentiment,
      significanceToUser: attributeForm.significanceToUser,
    }

    setScenarioAttributes([...scenarioAttributes, newAttribute])
    setAttributeForm({ conceptName: "", userSentiment: "Neutral", significanceToUser: "Medium" })
    setIsAttributeDialogOpen(false)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Scenarios
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {isNewScenario ? "Create New Scenario" : `Editing: ${scenarioData.displayLocationName}`}
          </h1>
        </div>
        <Badge variant="secondary" className="text-sm">
          Auto-saving
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="core">Core Details & Financials</TabsTrigger>
          <TabsTrigger value="sales">Planned Asset Sales</TabsTrigger>
          <TabsTrigger value="stf">Special Tax Features</TabsTrigger>
          <TabsTrigger value="goals">Personal Goals Fit</TabsTrigger>
        </TabsList>

        {/* Core Details & Financials Tab */}
        <TabsContent value="core" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Location Name</Label>
                  <Input
                    id="displayName"
                    value={scenarioData.displayLocationName}
                    onChange={(e) => setScenarioData((prev) => ({ ...prev, displayLocationName: e.target.value }))}
                    placeholder="e.g., Lisbon, Portugal (NHR)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectionYears">Projection Period (Years)</Label>
                  <Input
                    id="projectionYears"
                    type="number"
                    value={scenarioData.projectionPeriodYears}
                    onChange={(e) =>
                      setScenarioData((prev) => ({ ...prev, projectionPeriodYears: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={scenarioData.locationCountry}
                    onChange={(e) => setScenarioData((prev) => ({ ...prev, locationCountry: e.target.value }))}
                    placeholder="Portugal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Region (Optional)</Label>
                  <Input
                    id="state"
                    value={scenarioData.locationState}
                    onChange={(e) => setScenarioData((prev) => ({ ...prev, locationState: e.target.value }))}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City (Optional)</Label>
                  <Input
                    id="city"
                    value={scenarioData.locationCity}
                    onChange={(e) => setScenarioData((prev) => ({ ...prev, locationCity: e.target.value }))}
                    placeholder="Lisbon"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Residency Start Date (Optional)</Label>
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !scenarioData.residencyStartDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scenarioData.residencyStartDate
                          ? format(scenarioData.residencyStartDate, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={scenarioData.residencyStartDate}
                        onSelect={(date) => {
                          setScenarioData((prev) => ({ ...prev, residencyStartDate: date }))
                          setIsDatePickerOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortTermCgt">Short-Term CGT Rate (%)</Label>
                  <Input
                    id="shortTermCgt"
                    type="number"
                    value={scenarioData.shortTermCgtRate}
                    onChange={(e) =>
                      setScenarioData((prev) => ({ ...prev, shortTermCgtRate: Number.parseFloat(e.target.value) }))
                    }
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longTermCgt">Long-Term CGT Rate (%)</Label>
                  <Input
                    id="longTermCgt"
                    type="number"
                    value={scenarioData.longTermCgtRate}
                    onChange={(e) =>
                      setScenarioData((prev) => ({ ...prev, longTermCgtRate: Number.parseFloat(e.target.value) }))
                    }
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Income Sources */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Income Sources</CardTitle>
                <Button onClick={() => setIsIncomeDialogOpen(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Income Source
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {incomeSources.map((income) => (
                  <div key={income.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{income.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {income.type} • {formatCurrency(income.annualAmount)}/year • {income.startYear}-{income.endYear}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() => setIncomeSources(incomeSources.filter((i) => i.id !== income.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Annual Expenses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Annual Expenses</CardTitle>
                <Button onClick={() => setIsExpenseDialogOpen(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{expense.name}</div>
                      <div className="text-sm text-muted-foreground">{formatCurrency(expense.amount)}/year</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() => setExpenses(expenses.filter((e) => e.id !== expense.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Planned Asset Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Planned Asset Sales</CardTitle>
                  <CardDescription>Define when and how much of each asset you plan to sell</CardDescription>
                </div>
                <Button onClick={() => setIsSaleDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Planned Sale
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {plannedSales.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No planned sales defined. Click "Add Planned Sale" to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {plannedSales.map((sale) => (
                    <div key={sale.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="font-medium">{sale.assetName}</div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Year: </span>
                              <span className="font-medium">{sale.yearOfSale}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Quantity: </span>
                              <span className="font-medium">{sale.quantityToSell}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Sale Price: </span>
                              <span className="font-medium">{formatCurrency(sale.expectedSalePricePerUnit)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Est. Gain/Loss: </span>
                              <span
                                className={cn(
                                  "font-medium",
                                  sale.estimatedGainLoss >= 0 ? "text-green-600" : "text-red-600",
                                )}
                              >
                                {sale.estimatedGainLoss >= 0 ? (
                                  <TrendingUp className="h-3 w-3 inline mr-1" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 inline mr-1" />
                                )}
                                {formatCurrency(Math.abs(sale.estimatedGainLoss))}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => setPlannedSales(plannedSales.filter((s) => s.id !== sale.id))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Special Tax Features Tab */}
        <TabsContent value="stf" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Special Tax Features</CardTitle>
                  <CardDescription>Configure special tax programs and benefits for this scenario</CardDescription>
                </div>
                <Button onClick={() => setIsStfDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add STF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {specialTaxFeatures.map((stf) => (
                  <Card key={stf.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{stf.name}</CardTitle>
                          <CardDescription>{stf.description}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => setSpecialTaxFeatures(specialTaxFeatures.filter((s) => s.id !== stf.id))}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    {stf.requiresGainBifurcation && (
                      <CardContent>
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="text-sm font-medium text-orange-800 mb-2">Gain Bifurcation Required</div>
                          <div className="text-sm text-orange-700">
                            This feature requires tracking pre/post-residency gains. Configure asset acquisition details
                            for accurate calculations.
                          </div>
                          <Button variant="outline" size="sm" className="mt-2">
                            Configure Asset Details
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Goals Fit Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Goals Fit</CardTitle>
                  <CardDescription>Rate how this scenario aligns with your personal goals</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Qualitative Fit Score</div>
                    <div className="text-2xl font-bold text-primary">{calculateQualitativeFitScore()}/100</div>
                  </div>
                  <Button onClick={() => setIsAttributeDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Attribute
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scenarioAttributes.map((attribute) => (
                  <Card key={attribute.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-4 flex-1">
                          <div className="font-medium">{attribute.conceptName}</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>User Sentiment</Label>
                              <RadioGroup
                                value={attribute.userSentiment}
                                onValueChange={(value) => {
                                  setScenarioAttributes(
                                    scenarioAttributes.map((attr) =>
                                      attr.id === attribute.id
                                        ? { ...attr, userSentiment: value as ScenarioAttribute["userSentiment"] }
                                        : attr,
                                    ),
                                  )
                                }}
                                className="flex gap-6"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="Positive" id={`${attribute.id}-positive`} />
                                  <Label htmlFor={`${attribute.id}-positive`}>Positive</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="Neutral" id={`${attribute.id}-neutral`} />
                                  <Label htmlFor={`${attribute.id}-neutral`}>Neutral</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="Negative" id={`${attribute.id}-negative`} />
                                  <Label htmlFor={`${attribute.id}-negative`}>Negative</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            <div className="space-y-2">
                              <Label>Significance to You</Label>
                              <Select
                                value={attribute.significanceToUser}
                                onValueChange={(value) => {
                                  setScenarioAttributes(
                                    scenarioAttributes.map((attr) =>
                                      attr.id === attribute.id
                                        ? {
                                            ...attr,
                                            significanceToUser: value as ScenarioAttribute["significanceToUser"],
                                          }
                                        : attr,
                                    ),
                                  )
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="None">None</SelectItem>
                                  <SelectItem value="Low">Low</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => setScenarioAttributes(scenarioAttributes.filter((a) => a.id !== attribute.id))}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {/* Income Source Dialog */}
      <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Income Source</DialogTitle>
            <DialogDescription>Define a source of income for this scenario</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="incomeName">Income Source Name</Label>
              <Input
                id="incomeName"
                value={incomeForm.name}
                onChange={(e) => setIncomeForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Software Consulting"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="incomeType">Type</Label>
              <Input
                id="incomeType"
                value={incomeForm.type}
                onChange={(e) => setIncomeForm((prev) => ({ ...prev, type: e.target.value }))}
                placeholder="e.g., Business Income"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="incomeAmount">Annual Amount</Label>
              <Input
                id="incomeAmount"
                type="number"
                value={incomeForm.annualAmount}
                onChange={(e) => setIncomeForm((prev) => ({ ...prev, annualAmount: e.target.value }))}
                placeholder="120000"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startYear">Start Year</Label>
                <Input
                  id="startYear"
                  type="number"
                  value={incomeForm.startYear}
                  onChange={(e) => setIncomeForm((prev) => ({ ...prev, startYear: e.target.value }))}
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endYear">End Year</Label>
                <Input
                  id="endYear"
                  type="number"
                  value={incomeForm.endYear}
                  onChange={(e) => setIncomeForm((prev) => ({ ...prev, endYear: e.target.value }))}
                  placeholder="2029"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIncomeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveIncome}>Add Income Source</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Annual Expense</DialogTitle>
            <DialogDescription>Define an annual expense category for this scenario</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expenseName">Expense Category</Label>
              <Input
                id="expenseName"
                value={expenseForm.name}
                onChange={(e) => setExpenseForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Housing"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenseAmount">Annual Amount</Label>
              <Input
                id="expenseAmount"
                type="number"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder="24000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Planned Sale Dialog */}
      <Dialog open={isSaleDialogOpen} onOpenChange={setIsSaleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Planned Asset Sale</DialogTitle>
            <DialogDescription>Define when and how much of an asset you plan to sell</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="saleAsset">Asset</Label>
              <Select
                value={saleForm.assetId}
                onValueChange={(value) => setSaleForm((prev) => ({ ...prev, assetId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent>
                  {availableAssets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="saleYear">Year of Sale</Label>
                <Input
                  id="saleYear"
                  type="number"
                  value={saleForm.yearOfSale}
                  onChange={(e) => setSaleForm((prev) => ({ ...prev, yearOfSale: e.target.value }))}
                  placeholder="2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="saleQuantity">Quantity to Sell</Label>
                <Input
                  id="saleQuantity"
                  type="number"
                  value={saleForm.quantityToSell}
                  onChange={(e) => setSaleForm((prev) => ({ ...prev, quantityToSell: e.target.value }))}
                  placeholder="50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salePrice">Expected Sale Price per Unit</Label>
              <Input
                id="salePrice"
                type="number"
                value={saleForm.expectedSalePricePerUnit}
                onChange={(e) => setSaleForm((prev) => ({ ...prev, expectedSalePricePerUnit: e.target.value }))}
                placeholder="450"
                step="0.01"
              />
            </div>
            {saleForm.assetId && saleForm.quantityToSell && saleForm.expectedSalePricePerUnit && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Estimated Gain/Loss Preview</div>
                <div className="text-lg font-bold text-green-600">
                  +
                  {formatCurrency(
                    Number.parseFloat(saleForm.quantityToSell) *
                      (Number.parseFloat(saleForm.expectedSalePricePerUnit) -
                        (availableAssets.find((a) => a.id === saleForm.assetId)?.costBasisPerUnit || 0)),
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSale}>Add Planned Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attribute Dialog */}
      <Dialog open={isAttributeDialogOpen} onOpenChange={setIsAttributeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Scenario Attribute</DialogTitle>
            <DialogDescription>Rate how this scenario performs for a specific lifestyle factor</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="conceptSelect">Concept</Label>
              <Select
                value={attributeForm.conceptName}
                onValueChange={(value) => setAttributeForm((prev) => ({ ...prev, conceptName: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a concept" />
                </SelectTrigger>
                <SelectContent>
                  {availableConcepts
                    .filter((concept) => !scenarioAttributes.some((attr) => attr.conceptName === concept))
                    .map((concept) => (
                      <SelectItem key={concept} value={concept}>
                        {concept}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>User Sentiment</Label>
              <RadioGroup
                value={attributeForm.userSentiment}
                onValueChange={(value) =>
                  setAttributeForm((prev) => ({ ...prev, userSentiment: value as ScenarioAttribute["userSentiment"] }))
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Positive" id="positive" />
                  <Label htmlFor="positive">Positive</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Neutral" id="neutral" />
                  <Label htmlFor="neutral">Neutral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Negative" id="negative" />
                  <Label htmlFor="negative">Negative</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="significance">Significance to You</Label>
              <Select
                value={attributeForm.significanceToUser}
                onValueChange={(value) =>
                  setAttributeForm((prev) => ({
                    ...prev,
                    significanceToUser: value as ScenarioAttribute["significanceToUser"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAttributeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAttribute}>Add Attribute</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
