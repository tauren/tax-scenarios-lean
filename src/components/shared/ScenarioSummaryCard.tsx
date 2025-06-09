import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Eye, Pencil, Copy, Trash2, MoreVertical, Target } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Scenario } from '@/types';
import type { QualitativeGoalAlignment } from '@/types/qualitative';

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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getScoreBadgeVariant(score: number): "default" | "secondary" | "destructive" | "outline" {
  if (score >= 80) return "default";
  if (score >= 60) return "secondary";
  return "destructive";
}

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
    <Card
      className={`relative overflow-hidden ${isBaseline ? 'border-primary' : ''} ${isBaseline ? 'pb-0' : ''}`}
      onClick={() => onViewDetails(scenario.id)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${scenario.name}`}
      style={{ cursor: 'pointer' }}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2 relative">
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-8 h-8 flex items-center justify-center"
          >
            <Checkbox
              checked={isSelectedForCompare}
              onCheckedChange={(checked) => onToggleSelection(scenario.id, checked as boolean)}
              className="z-10"
            />
            <span
              className="absolute inset-0 z-0"
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
          <CardTitle className="text-lg font-semibold">{scenario.name}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              onClick={e => e.stopPropagation()}
              className="relative w-8 h-8 flex items-center justify-center"
            >
              <Button variant="ghost" size="icon" className="h-8 w-8 z-10">
                <MoreVertical className="h-4 w-4" />
              </Button>
              <span
                className="absolute inset-0 z-0"
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(scenario.id)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(scenario)}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            {!isBaseline && (
              <DropdownMenuItem onClick={() => onSetAsBaseline(scenario)}>
                <Target className="h-4 w-4 mr-2" />
                Set as Baseline
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => onDelete(scenario)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Qualitative Fit:</span>
          <Badge variant={getScoreBadgeVariant(results.qualitativeFitScore)}>
            {results.qualitativeFitScore}/100
          </Badge>
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

      {isBaseline && (
        <div className="bg-muted border-t border-border py-1.5 px-3 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground rounded-b-lg">
          <Target className="h-3 w-3" />
          Baseline
        </div>
      )}
    </Card>
  );
} 