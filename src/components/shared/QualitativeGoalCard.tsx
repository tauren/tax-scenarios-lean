import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { WeightSelector } from "@/components/shared/WeightSelector"
import type { UserQualitativeGoal } from "@/types"
import type { WeightOption } from "@/components/shared/WeightSelector"

interface QualitativeGoalCardProps {
  goal: UserQualitativeGoal;
  onEdit: (goal: UserQualitativeGoal) => void;
  onDelete: (id: string) => void;
  onUpdateName: (goalId: string, newName: string) => void;
  onUpdateWeight: (goalId: string, weight: WeightOption) => void;
  getConceptName: (conceptId: string) => string;
  disabled?: boolean;
}

export function QualitativeGoalCard({
  goal,
  onEdit,
  onDelete,
  onUpdateName,
  onUpdateWeight,
  getConceptName,
  disabled = false,
}: QualitativeGoalCardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col h-full">
      {/* Name + pencil + actions at the top */}
      <div className="flex items-start justify-between gap-4">
        <div className="cursor-pointer group/name flex-1 min-w-0">
          <Popover>
            <PopoverTrigger asChild>
              <span>
                <h3 className="font-semibold break-words">
                  {goal.name}
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover/name:opacity-100 transition-opacity inline-block align-text-bottom ml-1 whitespace-nowrap" />
                </h3>
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-[500px]" align="start">
              <div className="space-y-4">
                <h4 className="font-medium">Edit Goal Name</h4>
                <Textarea
                  value={goal.name}
                  onChange={(e) => onUpdateName(goal.id, e.target.value)}
                  className="w-full min-h-[100px] resize-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Tab') {
                      e.preventDefault()
                      const popoverTrigger = document.querySelector('[data-state="open"]')
                      if (popoverTrigger) {
                        ;(popoverTrigger as HTMLElement).click()
                      }
                    }
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(goal)}
            disabled={disabled}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(goal.id)}
            disabled={disabled}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Flexible spacer */}
      <div className="flex-1" />
      {/* Bottom group: concept tag + importance buttons */}
      <div>
        <div className="flex items-center mb-2 mt-2">
          <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
            {getConceptName(goal.conceptId)}
          </span>
        </div>
        <div className="mb-2">
          <WeightSelector
            value={goal.weight}
            onChange={(weight) => onUpdateWeight(goal.id, weight)}
            className="mt-0"
          />
        </div>
      </div>
    </div>
  );
} 