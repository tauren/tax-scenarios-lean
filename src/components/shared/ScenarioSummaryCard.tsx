import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Eye, Pencil, Copy, Trash2, MoreVertical, Target, CheckCircle2, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Scenario, QualitativeGoalAlignment } from '@/types';

interface ScenarioSummaryCardProps {
  scenario: Scenario;
  results: {
    estimatedCapitalGainsTax: number;
    netFinancialOutcome: number;
    qualitativeFitScore: number;
    goalAlignments: QualitativeGoalAlignment[];
  };
  isSelectedForCompare: boolean;
  onToggleSelection: (scenarioId: string, isSelected: boolean) => void;
  onViewDetails: (scenarioId: string) => void;
  onEdit: (scenarioId: string) => void;
  onDuplicate: (scenario: Scenario) => void;
  onDelete: (scenario: Scenario) => void;
  onSetAsBaseline: (scenario: Scenario) => void;
  isBaseline?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getScoreBadgeVariant = (score: number) => {
  if (score >= 80) return 'default';
  if (score >= 60) return 'secondary';
  return 'destructive';
};

export function ScenarioSummaryCard({
  scenario,
  results,
  isSelectedForCompare,
  onToggleSelection,
  onViewDetails,
  onEdit,
  onDuplicate,
  onDelete,
  onSetAsBaseline,
  isBaseline = false,
}: ScenarioSummaryCardProps) {
  return (
    <Card className="relative hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg leading-tight">{scenario.name}</CardTitle>
              {isBaseline && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Target className="h-3 w-3 mr-1 text-primary" />
                  Baseline
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isSelectedForCompare}
              onCheckedChange={(checked) => onToggleSelection(scenario.id, !!checked)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Qualitative Fit:</span>
          <Badge variant={getScoreBadgeVariant(results.qualitativeFitScore)}>
            {results.qualitativeFitScore}/100
          </Badge>
        </div>

        <div className="space-y-2">
          {results.goalAlignments.map((alignment) => (
            <div key={alignment.goalId} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{alignment.goalName}:</span>
              <div className="flex items-center gap-1">
                {alignment.isAligned ? (
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-600" />
                )}
                <span className="font-medium">
                  {alignment.isAligned ? 'Aligned' : 'Not Aligned'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Est. CGT:</span>
          <span className="text-sm font-medium">
            {formatCurrency(results.estimatedCapitalGainsTax)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Net Outcome:</span>
          <div className="flex items-center gap-1">
            {results.netFinancialOutcome > 80000 ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600" />
            )}
            <span className="text-sm font-medium">
              {formatCurrency(results.netFinancialOutcome)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(scenario.id)}
          className="flex-1 text-xs"
        >
          <Pencil className="h-3 w-3 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(scenario.id)}
          className="flex-1 text-xs"
        >
          <Eye className="h-3 w-3 mr-1" />
          Details
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!isBaseline && (
              <DropdownMenuItem onClick={() => onSetAsBaseline(scenario)}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Set as Baseline
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDuplicate(scenario)}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(scenario)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
} 