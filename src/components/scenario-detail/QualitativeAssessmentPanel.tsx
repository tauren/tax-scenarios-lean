import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QualitativeAssessmentPanelProps {
  results: any;
  goals: any[];
}

const QualitativeAssessmentPanel: React.FC<QualitativeAssessmentPanelProps> = ({ results, goals }) => {
  const alignments = results.goalAlignments || [];
  
  // Only include goals with mapped attributes in aligned/not aligned
  const mappedAlignments = alignments.filter((a: any) => {
    const hasContributing = a.contributingAttributes && a.contributingAttributes.length > 0;
    return hasContributing;
  });
  const alignedGoals = mappedAlignments.filter((a: any) => a.isAligned);
  const notAlignedGoals = mappedAlignments.filter((a: any) => !a.isAligned);
  // Unmapped goals: user goals not present in mappedAlignments
  const unmappedGoals = goals.filter(goal =>
    !mappedAlignments.some((a: any) => a.goalId === goal.id)
  );

  const renderGoalCard = (alignment: any) => {
    const goal = goals.find((g: any) => g.id === alignment.goalId);
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
            <div className="text-xs text-muted-foreground mb-2">
              Score: {Math.round(alignment.alignmentScore)} / 100
            </div>
            {alignment.contributingAttributes && alignment.contributingAttributes.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <div className="font-medium mb-1">Contributing Attributes:</div>
                <ul className="list-disc ml-4 space-y-0.5">
                  {alignment.contributingAttributes.map((attr: any) => {
                    // Prefer conceptName from calculation results, then scenario attribute text, then ID
                    const scenarioAttribute = results.scenario?.scenarioSpecificAttributes?.find(
                      (a: any) => a.id === attr.attributeId
                    );
                    const name = attr.conceptName || scenarioAttribute?.text || attr.attributeId;
                    return (
                      <li key={attr.attributeId} className="flex items-center gap-1">
                        <span>{name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({Math.round(attr.contribution)}%)
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
      <h2 className="text-lg font-semibold mb-4">Qualitative Assessment</h2>
      
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