"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, PlusCircle, Pencil, Eye, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Scenario {
  id: string
  displayLocationName: string
  qualitativeFitScore: number
  totalGrossIncome: number
  totalExpenses: number
  estimatedCapitalGainsTax: number
  netFinancialOutcome: number
  isBaseline?: boolean
}

interface ScenarioHubViewProps {
  onBack?: () => void
  onAddScenario?: () => void
  onEditScenario?: (scenarioId: string) => void
  onViewScenario?: (scenarioId: string) => void
  onDeleteScenario?: (scenarioId: string) => void
}

export default function ScenarioHubView({
  onBack,
  onAddScenario,
  onEditScenario,
  onViewScenario,
  onDeleteScenario,
}: ScenarioHubViewProps) {
  const [scenarios] = useState<Scenario[]>([
    {
      id: "1",
      displayLocationName: "Current USA (Baseline)",
      qualitativeFitScore: 65,
      totalGrossIncome: 150000,
      totalExpenses: 45000,
      estimatedCapitalGainsTax: 25000,
      netFinancialOutcome: 80000,
      isBaseline: true,
    },
    {
      id: "2",
      displayLocationName: "Lisbon, Portugal (NHR)",
      qualitativeFitScore: 85,
      totalGrossIncome: 150000,
      totalExpenses: 38000,
      estimatedCapitalGainsTax: 8500,
      netFinancialOutcome: 103500,
    },
    {
      id: "3",
      displayLocationName: "Dubai, UAE",
      qualitativeFitScore: 72,
      totalGrossIncome: 150000,
      totalExpenses: 42000,
      estimatedCapitalGainsTax: 0,
      netFinancialOutcome: 108000,
    },
    {
      id: "4",
      displayLocationName: "Singapore",
      qualitativeFitScore: 78,
      totalGrossIncome: 150000,
      totalExpenses: 55000,
      estimatedCapitalGainsTax: 0,
      netFinancialOutcome: 95000,
    },
  ])

  const [selectedScenarios, setSelectedScenarios] = useState<Set<string>>(new Set(["1", "2"]))

  const handleScenarioSelection = (scenarioId: string, checked: boolean) => {
    const newSelected = new Set(selectedScenarios)
    if (checked) {
      newSelected.add(scenarioId)
    } else {
      newSelected.delete(scenarioId)
    }
    setSelectedScenarios(newSelected)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  const selectedScenariosData = scenarios.filter((scenario) => selectedScenarios.has(scenario.id))

  const comparisonMetrics = [
    { key: "totalGrossIncome", label: "Total Gross Income", format: formatCurrency },
    { key: "totalExpenses", label: "Total Expenses", format: formatCurrency },
    { key: "estimatedCapitalGainsTax", label: "Est. Capital Gains Tax", format: formatCurrency, highlight: true },
    { key: "netFinancialOutcome", label: "Net Financial Outcome", format: formatCurrency },
    { key: "qualitativeFitScore", label: "Qualitative Fit Score", format: (val: number) => `${val}/100` },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Scenarios & Comparison</h1>
        </div>
        <Button onClick={onAddScenario} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Scenario
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="mb-8 p-4 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total Scenarios: </span>
            <span className="font-medium">{scenarios.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Selected for Comparison: </span>
            <span className="font-medium">{selectedScenarios.size}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Best Qualitative Fit: </span>
            <span className="font-medium">{Math.max(...scenarios.map((s) => s.qualitativeFitScore))}/100</span>
          </div>
          <div>
            <span className="text-muted-foreground">Best Net Outcome: </span>
            <span className="font-medium">
              {formatCurrency(Math.max(...scenarios.map((s) => s.netFinancialOutcome)))}
            </span>
          </div>
        </div>
      </div>

      {/* Scenario Summary Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Scenario Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {scenarios.map((scenario) => (
            <Card key={scenario.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{scenario.displayLocationName}</CardTitle>
                    {scenario.isBaseline && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Baseline
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedScenarios.has(scenario.id)}
                      onCheckedChange={(checked) => handleScenarioSelection(scenario.id, !!checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Qualitative Fit:</span>
                  <Badge variant={getScoreBadgeVariant(scenario.qualitativeFitScore)}>
                    {scenario.qualitativeFitScore}/100
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Est. CGT:</span>
                  <span className="text-sm font-medium">{formatCurrency(scenario.estimatedCapitalGainsTax)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Net Outcome:</span>
                  <div className="flex items-center gap-1">
                    {scenario.netFinancialOutcome > 80000 ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className="text-sm font-medium">{formatCurrency(scenario.netFinancialOutcome)}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditScenario?.(scenario.id)}
                  className="flex-1 text-xs"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewScenario?.(scenario.id)}
                  className="flex-1 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Details
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteScenario?.(scenario.id)}
                  className="text-xs"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Overview Comparison Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Comparison Table
          {selectedScenarios.size > 0 && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({selectedScenarios.size} scenarios selected)
            </span>
          )}
        </h2>

        {selectedScenarios.size === 0 ? (
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            <p>Select scenarios using the checkboxes above to compare them side-by-side.</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Metric</TableHead>
                  {selectedScenariosData.map((scenario) => (
                    <TableHead key={scenario.id} className="text-center min-w-32">
                      {scenario.displayLocationName}
                      {scenario.isBaseline && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Baseline
                        </Badge>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonMetrics.map((metric) => (
                  <TableRow key={metric.key} className={metric.highlight ? "bg-muted/30" : ""}>
                    <TableCell className="font-medium">
                      {metric.label}
                      {metric.highlight && <span className="text-orange-600 ml-1">★</span>}
                    </TableCell>
                    {selectedScenariosData.map((scenario) => (
                      <TableCell key={scenario.id} className="text-center">
                        <span
                          className={cn(
                            metric.key === "qualitativeFitScore" && getScoreColor(scenario.qualitativeFitScore),
                            metric.highlight && "font-semibold",
                          )}
                        >
                          {metric.format(scenario[metric.key as keyof Scenario] as number)}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Comparison Insights */}
      {selectedScenarios.size > 1 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Quick Insights</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              • Best financial outcome:{" "}
              <span className="font-medium">
                {
                  selectedScenariosData.reduce((best, current) =>
                    current.netFinancialOutcome > best.netFinancialOutcome ? current : best,
                  ).displayLocationName
                }
              </span>
            </p>
            <p>
              • Lowest capital gains tax:{" "}
              <span className="font-medium">
                {
                  selectedScenariosData.reduce((best, current) =>
                    current.estimatedCapitalGainsTax < best.estimatedCapitalGainsTax ? current : best,
                  ).displayLocationName
                }
              </span>
            </p>
            <p>
              • Best lifestyle fit:{" "}
              <span className="font-medium">
                {
                  selectedScenariosData.reduce((best, current) =>
                    current.qualitativeFitScore > best.qualitativeFitScore ? current : best,
                  ).displayLocationName
                }
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
