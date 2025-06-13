import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { BarChart, Info } from 'lucide-react';
import type { ScenarioQualitativeAttribute, UserQualitativeGoal, QualitativeGoalAlignment } from '@/types/qualitative';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getScoreColor, getBadgeStyle } from '@/utils/scoreColors';

interface ScoreBreakdownDialogProps {
  score: number;
  attributes: ScenarioQualitativeAttribute[];
  goals: UserQualitativeGoal[];
  goalAlignments: QualitativeGoalAlignment[];
}

export const ScoreBreakdownDialog: React.FC<ScoreBreakdownDialogProps> = ({
  score,
  attributes,
  goals,
  goalAlignments = [],
}) => {
  // Sort goals by alignment score (highest to lowest)
  const sortedGoalAlignments = [...goalAlignments].sort((a, b) => b.alignmentScore - a.alignmentScore);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          Score Breakdown
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Lifestyle Fit Score Breakdown
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(80vh-8rem)] pr-4">
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">Overall Score</h3>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Info className="h-4 w-4 text-blue-600" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2 text-sm text-gray-600">
                          <h4 className="font-medium text-gray-900">How the Score is Calculated</h4>
                          <p>1. Each impression is assigned a base score based on its sentiment:</p>
                          <ul className="list-inside list-disc pl-4">
                            <li>Positive: 100%</li>
                            <li>Neutral: 50%</li>
                            <li>Negative: 0%</li>
                          </ul>
                          <p>2. The base score is then weighted by the impression's significance:</p>
                          <ul className="list-inside list-disc pl-4">
                            <li>Critical: 4x</li>
                            <li>High: 3x</li>
                            <li>Medium: 2x</li>
                            <li>Low: 1x</li>
                          </ul>
                          <p>3. The weighted scores are further adjusted by the importance of the priority it's linked to:</p>
                          <ul className="list-inside list-disc pl-4">
                            <li>Critical: 4x</li>
                            <li>High: 3x</li>
                            <li>Medium: 2x</li>
                            <li>Low: 1x</li>
                          </ul>
                          <p>4. The final score is normalized to a 0-100 scale.</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <p className="text-sm text-gray-500">
                    This score represents how well this scenario aligns with your priorities, weighted by importance.
                  </p>
                </div>
                <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </span>
              </div>
            </div>

            {/* Goal Alignments */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Priorities Alignment</h3>
              <div className="space-y-4">
                {sortedGoalAlignments.length > 0 ? (
                  sortedGoalAlignments.map((alignment) => {
                    const goal = goals.find((g) => g.id === alignment.goalId);
                    const badge = getBadgeStyle(alignment.alignmentScore);
                    return (
                      <div key={alignment.goalId} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{goal?.name || alignment.goalName}</h4>
                            <p className="text-sm text-gray-500">
                              Weight: {goal?.weight}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-medium ${getScoreColor(alignment.alignmentScore)}`}>
                              {alignment.alignmentScore}%
                            </span>
                            <span className={`rounded-full py-1 text-xs font-medium ${badge.className}`}>
                              {badge.label}
                            </span>
                          </div>
                        </div>

                        {/* Contributing Attributes */}
                        {alignment.contributingAttributes && alignment.contributingAttributes.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <h5 className="text-sm font-medium text-gray-700">Linked Impressions</h5>
                            <div className="space-y-2">
                              {alignment.contributingAttributes.map((attr) => {
                                const attribute = attributes.find(a => a.id === attr.attributeId);
                                if (!attribute) return null;

                                return (
                                  <div key={attr.attributeId} className="rounded-md bg-gray-50 p-3">
                                    <div className="flex items-start justify-between">
                                      <div className="space-y-1">
                                        <p className="text-sm">{attribute.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                          <span>
                                            {attribute.sentiment.charAt(0).toUpperCase() + attribute.sentiment.slice(1)}
                                          </span>
                                          <span>•</span>
                                          <span>{attribute.significance} Significance</span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm text-muted-foreground">
                                          Contribution: {attr.contribution}%
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          Max Possible: {attr.maxPossiblePercent}%
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No priorities alignments available.</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}; 