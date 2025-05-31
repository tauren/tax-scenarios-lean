import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Scenario } from '@/models';
import { appConfigService } from '@/services/appConfigService';

interface BaselineScenarioDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BaselineScenarioDialog({ isOpen, onClose }: BaselineScenarioDialogProps) {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const templateScenarios = appConfigService.getConfig().templateScenarios;

  const handleCreateFromTemplate = () => {
    if (selectedTemplate) {
      const template = templateScenarios.find(t => t.id === selectedTemplate);
      navigate('/scenario/create-baseline', { 
        state: { 
          templateId: selectedTemplate,
          template: template
        } 
      });
    }
  };

  const handleCreateCustom = () => {
    navigate('/scenario/create-baseline', { state: { isCustom: true } });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Baseline Scenario</DialogTitle>
          <DialogDescription>
            Choose how you want to create your baseline scenario. You can start from a template or create a custom one.
          </DialogDescription>
        </DialogHeader>

        <h3 className="text-sm font-medium mt-4">Start from a Template</h3>
        
        <div className="flex-1 overflow-y-auto pr-2 mt-2">
          <div className="grid gap-4">
            {templateScenarios.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'bg-muted border-primary'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardHeader>
                  <CardTitle>{template.location?.displayName || 'Unnamed Location'}</CardTitle>
                  <CardDescription>
                    Capital Gains Tax: {template.tax?.capitalGains?.longTermRate || 0}%
                    {template.tax?.capitalGains?.specialConditions && (
                      <span className="block mt-1 text-xs">
                        {template.tax.capitalGains.specialConditions.substring(0, 100)}...
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Cost of Living: {template.costOfLiving?.housing?.currency || 'USD'} {template.costOfLiving?.housing?.averageRent || 0}/month</p>
                    <p>Quality of Life: {template.qualityOfLife?.safety?.crimeRate || 0}/5 Safety Rating</p>
                    {template.practical?.advantages?.keyBenefits && (
                      <p className="text-xs">
                        Key Benefits: {template.practical.advantages.keyBenefits[0]}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleCreateCustom}
          >
            Create Custom Baseline
          </Button>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateFromTemplate}
            disabled={!selectedTemplate}
          >
            Continue with Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 