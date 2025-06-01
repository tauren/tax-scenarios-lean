import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BaselineScenarioDialog } from '@/components/dialogs/BaselineScenarioDialog';
import { useAppConfig } from '@/hooks/useAppConfig';

export function GetStartedView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: appConfig } = useAppConfig();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-2xl mx-auto px-4 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Tax Scenarios</h1>
          <p className="text-xl text-muted-foreground">
            Create and manage your tax scenarios to optimize your investment strategy.
          </p>
        </div>

        <Button
          size="lg"
          className="px-8"
          onClick={() => setIsDialogOpen(true)}
        >
          Create Baseline Scenario
        </Button>
      </div>

      <BaselineScenarioDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
} 