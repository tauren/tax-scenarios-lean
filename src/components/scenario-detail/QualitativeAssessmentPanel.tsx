import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ScoreBreakdownDialog } from '../shared/ScoreBreakdownDialog';
import type { UserQualitativeGoal, QualitativeGoalAlignment } from '@/types/qualitative';
import type { Scenario } from '@/types';

interface QualitativeAssessmentPanelProps {
  results: {
    qualitativeFitScore: number;
    goalAlignments: QualitativeGoalAlignment[];
    scenario?: Scenario;
  };
  goals: UserQualitativeGoal[];
}

const QualitativeAssessmentPanel: React.FC<QualitativeAssessmentPanelProps> = ({ results, goals }) => {
  const alignments = results.goalAlignments || [];
  const attributes = results.scenario?.scenarioSpecificAttributes || [];
  
  // Only include goals with mapped attributes in aligned/not aligned
  const mappedAlignments = alignments.filter((a: QualitativeGoalAlignment) => {
    const hasContributing = a.contributingAttributes && a.contributingAttributes.length > 0;
    return hasContributing;
  });
  const alignedGoals = mappedAlignments.filter((a) => a.isAligned);
  const notAlignedGoals = mappedAlignments.filter((a) => !a.isAligned);
  // Unmapped goals: user goals not present in mappedAlignments
  const unmappedGoals = goals.filter(goal =>
    !mappedAlignments.some((a) => a.goalId === goal.id)
  );

  const renderGoalCard = (alignment: QualitativeGoalAlignment) => {
    const goal = goals.find((g) => g.id === alignment.goalId);
    return (
      <div 
        key={alignment.goalId} 
        className={`p-4 rounded-lg border ${
          alignment.isAligned 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}
      >
        <div className="flex items-start gap-2">
          {alignment.isAligned ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="font-semibold text-sm mb-1">
              {goal ? goal.name : alignment.goalName}
            </div>
            <div className="text-sm text-muted-foreground">
              Score: {alignment.alignmentScore} / 100
            </div>
            {alignment.contributingAttributes && alignment.contributingAttributes.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <div className="font-medium mb-1">Contributing Attributes:</div>
                <ul className="list-disc ml-4 space-y-0.5">
                  {alignment.contributingAttributes.map((attr) => {
                    // Prefer scenario attribute text, then ID
                    const scenarioAttribute = results.scenario?.scenarioSpecificAttributes?.find(
                      (a) => a.id === attr.attributeId
                    );
                    const name = scenarioAttribute?.text || attr.attributeId;
                    return (
                      <li key={attr.attributeId} className="flex items-center gap-1">
                        <span>{name}</span>
                        <span className="text-sm text-muted-foreground">
                          ({attr.contribution}% of {attr.maxPossiblePercent}%)
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-4 mb-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Qualitative Assessment</h2>
        <ScoreBreakdownDialog
          score={results.qualitativeFitScore}
          attributes={attributes}
          goals={goals}
          goalAlignments={alignments}
        />
      </div>
      
      {alignments.length === 0 ? (
        <div className="text-muted-foreground">No qualitative goals or alignments.</div>
      ) : (
        <div className="space-y-6">
          {alignedGoals.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-green-600 mb-3">Aligned Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alignedGoals.map(renderGoalCard)}
              </div>
            </div>
          )}
          
          {notAlignedGoals.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-red-600 mb-3">Not Aligned Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notAlignedGoals.map(renderGoalCard)}
              </div>
            </div>
          )}

          {unmappedGoals.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Unmapped Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unmappedGoals.map(goal => (
                  <div key={goal.id} className="p-4 rounded-lg border bg-muted">
                    <div className="font-semibold text-sm mb-1">{goal.name}</div>
                    <div className="text-xs text-muted-foreground">No attributes mapped to this goal.</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QualitativeAssessmentPanel; 