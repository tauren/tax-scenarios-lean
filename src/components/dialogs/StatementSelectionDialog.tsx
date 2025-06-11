import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { qualitativeConcepts } from "@/data/qualitativeConcepts.data"
import { qualitativeStatements } from "@/data/qualitativeStatements.data"

interface StatementSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (statements: { conceptId: string; name: string }[]) => void;
}

export function StatementSelectionDialog({ open, onOpenChange, onConfirm }: StatementSelectionDialogProps) {
  const [selectedStatements, setSelectedStatements] = useState<Set<string>>(new Set());

  // Group statements by concept
  const statementsByConcept = qualitativeConcepts.map(concept => ({
    concept,
    statements: qualitativeStatements.filter(s => s.conceptId === concept.id)
  })).filter(group => group.statements.length > 0);

  const handleToggleStatement = (statementId: string) => {
    setSelectedStatements(prev => {
      const next = new Set(prev);
      if (next.has(statementId)) {
        next.delete(statementId);
      } else {
        next.add(statementId);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const selected = Array.from(selectedStatements).map(id => {
      const statement = qualitativeStatements.find(s => s.id === id);
      return {
        conceptId: statement!.conceptId,
        name: statement!.statementText
      };
    });
    onConfirm(selected);
    setSelectedStatements(new Set());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Location Objectives from Examples</DialogTitle>
          <DialogDescription>
            Select one or more examples to create location objectives.  
            Pick examples that match or are similar to your location objectives. 
            You can modify the example to better match your actual objective once your location objective is created.
            You can choose multiple examples from different categories.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {statementsByConcept.map(({ concept, statements }) => (
              <div key={concept.id} className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">
                  {concept.name}
                </h3>
                <div className="space-y-2">
                  {statements.map((statement) => (
                    <div key={statement.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={statement.id}
                        checked={selectedStatements.has(statement.id)}
                        onCheckedChange={() => handleToggleStatement(statement.id)}
                      />
                      <label
                        htmlFor={statement.id}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {statement.statementText}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedStatements(new Set());
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedStatements.size === 0}
          >
            Add Selected Objectives
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 