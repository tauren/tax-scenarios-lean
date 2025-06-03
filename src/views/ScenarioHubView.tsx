import { useUserAppState } from '@/store/userAppStateSlice';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, PlusCircle, Pencil, Eye, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { CreateScenarioDialog } from '@/components/dialogs/CreateScenarioDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function ScenarioHubView() {
  const { scenarios } = useUserAppState();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<Set<string>>(new Set());

  const handleScenarioSelection = (scenarioId: string, checked: boolean) => {
    const newSelected = new Set(selectedScenarios);
    if (checked) {
      newSelected.add(scenarioId);
    } else {
      newSelected.delete(scenarioId);
    }
    setSelectedScenarios(newSelected);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const selectedScenariosData = scenarios.filter((scenario) => selectedScenarios.has(scenario.id));

  const comparisonMetrics = [
    { key: 'totalGrossIncome', label: 'Total Gross Income', format: formatCurrency },
    { key: 'totalExpenses', label: 'Total Expenses', format: formatCurrency },
    { key: 'estimatedCapitalGainsTax', label: 'Est. Capital Gains Tax', format: formatCurrency, highlight: true },
    { key: 'netFinancialOutcome', label: 'Net Financial Outcome', format: formatCurrency },
    { key: 'qualitativeFitScore', label: 'Qualitative Fit Score', format: (val: number) => `${val}/100` },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Scenarios & Comparison</h1>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
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
            <span className="font-medium">
              {Math.max(...scenarios.map((s) => s.qualitativeFitScore || 0))}/100
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Best Net Outcome: </span>
            <span className="font-medium">
              {formatCurrency(Math.max(...scenarios.map((s) => s.netFinancialOutcome || 0)))}
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
                    <CardTitle className="text-lg leading-tight">{scenario.name}</CardTitle>
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
                  <Badge variant={getScoreBadgeVariant(scenario.qualitativeFitScore || 0)}>
                    {scenario.qualitativeFitScore || 0}/100
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Est. CGT:</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(scenario.estimatedCapitalGainsTax || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Net Outcome:</span>
                  <div className="flex items-center gap-1">
                    {(scenario.netFinancialOutcome || 0) > 80000 ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className="text-sm font-medium">
                      {formatCurrency(scenario.netFinancialOutcome || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/scenario/edit', { state: { scenario } })}
                  className="flex-1 text-xs"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/scenario/edit', { state: { scenario, viewOnly: true } })}
                  className="flex-1 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Details
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {/* TODO: Implement delete */}}
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
      {selectedScenarios.size > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Comparison Table</h2>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  {selectedScenariosData.map((scenario) => (
                    <TableHead key={scenario.id}>{scenario.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonMetrics.map((metric) => (
                  <TableRow key={metric.key}>
                    <TableCell className="font-medium">{metric.label}</TableCell>
                    {selectedScenariosData.map((scenario) => (
                      <TableCell
                        key={scenario.id}
                        className={metric.highlight ? 'bg-muted/50 font-medium' : ''}
                      >
                        {metric.format(scenario[metric.key as keyof typeof scenario] as number || 0)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <CreateScenarioDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
} 