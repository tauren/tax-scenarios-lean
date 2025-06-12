import { useUserAppState } from '@/store/userAppStateSlice';
import { useCalculationState } from '@/store/calculationStateSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Target, CheckCircle2, XCircle } from 'lucide-react';
import type { QualitativeGoalAlignment } from '@/types/qualitative';
import { appConfigService } from '@/services/appConfigService';

interface LocationObjectivesComparisonTableProps {
  selectedScenarioIds: Set<string>;
}

export function LocationObjectivesComparisonTable({ selectedScenarioIds }: LocationObjectivesComparisonTableProps) {
  const { scenarios, userQualitativeGoals } = useUserAppState();
  const { resultsByScenario } = useCalculationState();
  const { qualitativeConcepts } = appConfigService.getConfig();

  const selectedScenariosData = scenarios.filter((scenario) => selectedScenarioIds.has(scenario.id));

  const getGoalAlignments = (scenarioId: string): QualitativeGoalAlignment[] => {
    const results = resultsByScenario[scenarioId];
    if (!results) return [];
    return results.goalAlignments;
  };

  if (!selectedScenarioIds || selectedScenarioIds.size === 0) return null;

  const allGoalAlignments = selectedScenariosData.flatMap(scenario => 
    getGoalAlignments(scenario.id).map(alignment => alignment.goalId)
  );
  const uniqueGoalIds = [...new Set(allGoalAlignments)];

  // Group goals by concept ID in the order they appear in qualitativeConcepts
  const goalsByConcept = qualitativeConcepts.map(concept => {
    const goals = uniqueGoalIds
      .map(goalId => userQualitativeGoals.find(g => g.id === goalId))
      .filter((goal): goal is NonNullable<typeof goal> => 
        goal !== undefined && goal.conceptId === concept.id
      );
    return goals;
  }).flat();

  return (
    <div className="border rounded-lg">
      <Table style={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] max-w-[200px] truncate">Location Objective</TableHead>
            <TableHead className="w-[150px] max-w-[150px] truncate">Concept/Category</TableHead>
            {selectedScenariosData.map((scenario) => (
              <TableHead key={scenario.id} className="w-[160px] max-w-[160px] text-center truncate">
                <div className="flex items-center justify-center w-full truncate">
                  {scenario.id === scenarios[0]?.id && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Target className="h-3 w-3 mr-1 text-primary" />
                        </TooltipTrigger>
                        <TooltipContent>Baseline scenario</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <span className="line-clamp-2">{scenario.name}</span>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {goalsByConcept.map((goal) => {
            const concept = qualitativeConcepts.find(c => c.id === goal.conceptId);
            const conceptName = concept?.name || 'Unknown Concept';

            return (
              <TableRow key={goal.id}>
                <TableCell className="font-medium truncate">
                  {goal.name}
                </TableCell>
                <TableCell className="truncate">
                  <Badge variant="outline" className="text-xs">
                    {conceptName}
                  </Badge>
                </TableCell>
                {selectedScenariosData.map((scenario) => {
                  const alignment = getGoalAlignments(scenario.id).find(a => a.goalId === goal.id);
                  const isAligned = alignment?.isAligned ?? false;
                  const alignmentScore = alignment?.alignmentScore ?? 0;

                  return (
                    <TableCell key={scenario.id} className="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center">
                              {isAligned ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Alignment Score: {alignmentScore}/100</p>
                            <p className="text-sm text-muted-foreground">
                              {alignment?.contributingAttributes.map(attr => 
                                `${attr.name}: ${attr.contribution}%`
                              ).join(', ') || 'No contributing attributes'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
} 