import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserAppState } from '@/store/userAppStateSlice';
import { appConfigService } from '@/services/appConfigService';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/formatting';
import type { Scenario } from '@/types';

interface CreateScenarioDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateScenarioDialog({ isOpen, onClose }: CreateScenarioDialogProps) {
  const navigate = useNavigate();
  const { scenarios: userScenarios, addScenario } = useUserAppState();
  const templateScenarios = appConfigService.getConfig().templateScenarios;
  const [selectedTemplate, setSelectedTemplate] = useState<Scenario | null>(null);
  const [selectedMyScenario, setSelectedMyScenario] = useState<Scenario | null>(null);
  const [pendingScenarioId, setPendingScenarioId] = useState<string | null>(null);

  // Watch for the scenario to be added to the store
  useEffect(() => {
    if (pendingScenarioId && userScenarios.some(s => s.id === pendingScenarioId)) {
      // Scenario is now in the store, safe to navigate
      navigate(`/scenarios/${pendingScenarioId}/edit`);
      setPendingScenarioId(null);
    }
  }, [pendingScenarioId, userScenarios, navigate]);

  const handleCreateScenario = () => {
    const template = selectedTemplate || selectedMyScenario || templateScenarios[0];
    if (!template) return;

    const newScenarioData = { ...template, name: `${template.name} (Copy)` };
    const createdScenario = addScenario(newScenarioData);
    onClose();
    navigate(`/scenarios/${createdScenario.id}/edit`);
  };

  const renderScenarioCard = (scenario: Scenario, isTemplate: boolean) => {
    const isSelected = isTemplate 
      ? selectedTemplate?.id === scenario.id
      : selectedMyScenario?.id === scenario.id;
    
    const handleSelect = () => {
      if (isTemplate) {
        setSelectedTemplate(scenario);
        setSelectedMyScenario(null);
      } else {
        setSelectedMyScenario(scenario);
        setSelectedTemplate(null);
      }
    };

    const grossIncome = scenario.incomeSources?.reduce((sum, src) => sum + (src.annualAmount || 0), 0) || 0;
    const expenses = (scenario.annualExpenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0) +
                     (scenario.oneTimeExpenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0);
    const netIncome = grossIncome - expenses;

    return (
      <Card 
        key={scenario.id} 
        className={`cursor-pointer transition-colors hover:bg-accent/50 ${
          isSelected ? 'border-primary bg-accent/50' : ''
        }`}
        onClick={handleSelect}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{scenario.name}</CardTitle>
          {isTemplate && (
            <Badge variant="outline" className="w-fit">
              Template
            </Badge>
          )}
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gross Income:</span>
              <span>{formatCurrency(grossIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expenses:</span>
              <span>{formatCurrency(expenses)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Net Income:</span>
              <span>{formatCurrency(netIncome)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
              handleCreateScenario();
            }}
          >
            Use This {isTemplate ? 'Template' : 'Scenario'}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Scenario</DialogTitle>
          <DialogDescription>
            Choose a template or existing scenario to start from, or create a new scenario from scratch.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="templates" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full">
            <TabsTrigger value="templates" className="flex-1">Template Scenarios</TabsTrigger>
            <TabsTrigger value="my-scenarios" className="flex-1">My Scenarios</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="templates" className="h-full mt-0">
              <div className="h-full overflow-y-auto pr-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templateScenarios.map(scenario => renderScenarioCard(scenario, true))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="my-scenarios" className="h-full mt-0">
              <div className="h-full overflow-y-auto pr-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userScenarios.map(scenario => renderScenarioCard(scenario, false))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateScenario}
            disabled={!selectedTemplate && !selectedMyScenario}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 