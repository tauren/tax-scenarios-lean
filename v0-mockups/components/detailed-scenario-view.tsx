"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, CheckCircle, XCircle, MinusCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface YearlyFinancialData {
  year: number | string
  grossIncome: number
  totalExpenses: number
  realizedCapitalGains: number
  capitalGainsTax: number
  otherTaxes: number | null
  totalTax: number
  netOutcome: number
}

interface ScenarioAttribute {
  id: string
  name: string
  category: string
  userSentiment: "Positive" | "Neutral" | "Negative"
  significanceToUser: "None" | "Low" | "Medium" | "High"
  notes?: string
}

interface DetailedScenarioViewProps {
  scenarioId: string
  onBack?: () => void
}

export default function DetailedScenarioView({ scenarioId, onBack }: DetailedScenarioViewProps) {
  // Mock data for the scenario
  const [scenario] = useState({
    id: scenarioId,
    displayLocationName: "Lisbon, Portugal (NHR)",
    qualitativeFitScore: 82,
    projectionPeriodYears: 5,
    startYear: 2024,
    financialData: [
      {
        year: 2024,
        grossIncome: 150000,
        totalExpenses: 48000,
        realizedCapitalGains: 0,
        capitalGainsTax: 0,
        otherTaxes: null,
        totalTax: 0,
        netOutcome: 102000,
      },
      {
        year: 2025,
        grossIncome: 155000,
        totalExpenses: 49500,
        realizedCapitalGains: 25000,
        capitalGainsTax: 2500,
        otherTaxes: null,
        totalTax: 2500,
        netOutcome: 128000,
      },
      {
        year: 2026,
        grossIncome: 160000,
        totalExpenses: 51000,
        realizedCapitalGains: 35000,
        capitalGainsTax: 3500,
        otherTaxes: null,
        totalTax: 3500,
        netOutcome: 140500,
      },
      {
        year: 2027,
        grossIncome: 165000,
        totalExpenses: 52500,
        realizedCapitalGains: 40000,
        capitalGainsTax: 4000,
        otherTaxes: null,
        totalTax: 4000,
        netOutcome: 148500,
      },
      {
        year: 2028,
        grossIncome: 170000,
        totalExpenses: 54000,
        realizedCapitalGains: 50000,
        capitalGainsTax: 5000,
        otherTaxes: null,
        totalTax: 5000,
        netOutcome: 161000,
      },
    ] as YearlyFinancialData[],
    attributes: [
      {
        id: "1",
        name: "Climate",
        category: "Environment",
        userSentiment: "Positive",
        significanceToUser: "High",
        notes: "Mediterranean climate with mild winters and warm summers.",
      },
      {
        id: "2",
        name: "Healthcare",
        category: "Quality of Life",
        userSentiment: "Positive",
        significanceToUser: "Medium",
        notes: "Good public healthcare system with affordable private options.",
      },
      {
        id: "3",
        name: "Cost of Living",
        category: "Financial",
        userSentiment: "Positive",
        significanceToUser: "High",
        notes: "Lower cost of living compared to other Western European capitals.",
      },
      {
        id: "4",
        name: "Language Barrier",
        category: "Social",
        userSentiment: "Negative",
        significanceToUser: "Medium",
        notes: "Need to learn Portuguese for full integration.",
      },
      {
        id: "5",
        name: "Distance from Family",
        category: "Personal",
        userSentiment: "Negative",
        significanceToUser: "High",
        notes: "Far from family in the US, making visits less frequent.",
      },
    ] as ScenarioAttribute[],
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getSentimentIcon = (sentiment: ScenarioAttribute["userSentiment"]) => {
    switch (sentiment) {
      case "Positive":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Negative":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "Neutral":
        return <MinusCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getSignificanceBadge = (significance: ScenarioAttribute["significanceToUser"]) => {
    switch (significance) {
      case "High":
        return <Badge variant="default">High</Badge>
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>
      case "Low":
        return <Badge variant="outline">Low</Badge>
      case "None":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            None
          </Badge>
        )
    }
  }

  const calculateTotals = () => {
    return scenario.financialData.reduce(
      (acc, year) => {
        return {
          grossIncome: acc.grossIncome + year.grossIncome,
          totalExpenses: acc.totalExpenses + year.totalExpenses,
          realizedCapitalGains: acc.realizedCapitalGains + year.realizedCapitalGains,
          capitalGainsTax: acc.capitalGainsTax + year.capitalGainsTax,
          totalTax: acc.totalTax + year.totalTax,
          netOutcome: acc.netOutcome + year.netOutcome,
        }
      },
      {
        grossIncome: 0,
        totalExpenses: 0,
        realizedCapitalGains: 0,
        capitalGainsTax: 0,
        totalTax: 0,
        netOutcome: 0,
      },
    )
  }

  const totals = calculateTotals()

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
            Detailed Analysis: {scenario.displayLocationName}
          </h1>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-8 p-4 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Projection Period: </span>
            <span className="font-medium">{scenario.projectionPeriodYears} years</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Net Outcome: </span>
            <span className="font-medium">{formatCurrency(totals.netOutcome)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Qualitative Fit Score: </span>
            <span className="font-medium">{scenario.qualitativeFitScore}/100</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="financials" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="financials">Financial Breakdown</TabsTrigger>
          <TabsTrigger value="qualitative">Personal Goals Fit</TabsTrigger>
        </TabsList>

        {/* Financial Breakdown Tab */}
        <TabsContent value="financials" className="space-y-6">
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Gross Income</TableHead>
                  <TableHead className="text-right">Total Expenses</TableHead>
                  <TableHead className="text-right">Realized Capital Gains</TableHead>
                  <TableHead className="text-right">Capital Gains Tax</TableHead>
                  <TableHead className="text-right">Other Taxes</TableHead>
                  <TableHead className="text-right">Total Tax</TableHead>
                  <TableHead className="text-right">Net Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scenario.financialData.map((yearData) => (
                  <TableRow key={yearData.year}>
                    <TableCell className="font-medium">{yearData.year}</TableCell>
                    <TableCell className="text-right">{formatCurrency(yearData.grossIncome)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(yearData.totalExpenses)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(yearData.realizedCapitalGains)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(yearData.capitalGainsTax)}</TableCell>
                    <TableCell className="text-right">
                      {yearData.otherTaxes !== null ? formatCurrency(yearData.otherTaxes) : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(yearData.totalTax)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(yearData.netOutcome)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-medium">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-right">{formatCurrency(totals.grossIncome)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(totals.totalExpenses)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(totals.realizedCapitalGains)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(totals.capitalGainsTax)}</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right">{formatCurrency(totals.totalTax)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(totals.netOutcome)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totals.grossIncome)}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Over {scenario.projectionPeriodYears} years (
                  {formatCurrency(totals.grossIncome / scenario.projectionPeriodYears)}/year avg)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Tax</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totals.totalTax)}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Effective rate:{" "}
                  {((totals.totalTax / (totals.grossIncome + totals.realizedCapitalGains)) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Net Outcome</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totals.netOutcome)}</div>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    {((totals.netOutcome / (totals.grossIncome + totals.realizedCapitalGains)) * 100).toFixed(1)}%
                    retention
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Capital Gains Specific Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Capital Gains Analysis</CardTitle>
              <CardDescription>Breakdown of capital gains and associated taxes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Realized Capital Gains</div>
                    <div className="text-xl font-bold mt-1">{formatCurrency(totals.realizedCapitalGains)}</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Capital Gains Tax</div>
                    <div className="text-xl font-bold mt-1">{formatCurrency(totals.capitalGainsTax)}</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Effective CGT Rate</div>
                    <div className="text-xl font-bold mt-1">
                      {totals.realizedCapitalGains > 0
                        ? ((totals.capitalGainsTax / totals.realizedCapitalGains) * 100).toFixed(1)
                        : "0"}
                      %
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    This scenario leverages the Portugal Non-Habitual Resident (NHR) program, which offers preferential
                    tax treatment for foreign-source capital gains.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Goals Fit Tab */}
        <TabsContent value="qualitative" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Qualitative Assessment</CardTitle>
                  <CardDescription>How well this scenario aligns with your personal goals</CardDescription>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                  <div className="text-3xl font-bold text-primary">{scenario.qualitativeFitScore}/100</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scenario.attributes.map((attribute) => (
                  <Card key={attribute.id} className="overflow-hidden">
                    <div
                      className={cn(
                        "h-1.5",
                        attribute.userSentiment === "Positive"
                          ? "bg-green-500"
                          : attribute.userSentiment === "Negative"
                            ? "bg-red-500"
                            : "bg-yellow-500",
                      )}
                    />
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getSentimentIcon(attribute.userSentiment)}
                            <span className="font-medium">{attribute.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{attribute.category}</div>
                        </div>
                        <div>{getSignificanceBadge(attribute.significanceToUser)}</div>
                      </div>
                      {attribute.notes && (
                        <div className="mt-4 text-sm border-t pt-3">
                          <span className="text-muted-foreground">Notes: </span>
                          {attribute.notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Qualitative Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Qualitative Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                  <div className="font-medium text-green-800 mb-2">Positive Factors</div>
                  <ul className="space-y-2 text-sm text-green-700">
                    {scenario.attributes
                      .filter((attr) => attr.userSentiment === "Positive")
                      .map((attr) => (
                        <li key={attr.id} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 flex-shrink-0" />
                          <span>
                            <span className="font-medium">{attr.name}</span> - {attr.notes}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                  <div className="font-medium text-red-800 mb-2">Negative Factors</div>
                  <ul className="space-y-2 text-sm text-red-700">
                    {scenario.attributes
                      .filter((attr) => attr.userSentiment === "Negative")
                      .map((attr) => (
                        <li key={attr.id} className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 flex-shrink-0" />
                          <span>
                            <span className="font-medium">{attr.name}</span> - {attr.notes}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="font-medium text-blue-800 mb-2">Summary</div>
                <p className="text-sm text-blue-700">
                  This scenario offers excellent financial benefits through the Portugal NHR program with a good
                  qualitative fit for your lifestyle preferences. The Mediterranean climate and healthcare system are
                  significant positives, while the language barrier and distance from family are the main drawbacks to
                  consider.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
