import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BaselineScenarioDialog } from '@/components/dialogs/BaselineScenarioDialog';
import { useAppConfig } from '@/hooks/useAppConfig';

export function GetStartedView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: appConfig } = useAppConfig();

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Welcome to Tax Scenarios</CardTitle>
          <CardDescription>
            Create and manage your tax scenarios to optimize your investment strategy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            size="lg"
            className="w-full"
            onClick={() => setIsDialogOpen(true)}
          >
            Create Baseline Scenario
          </Button>
        </CardContent>
      </Card>

      <BaselineScenarioDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        templateScenarios={appConfig?.templateScenarios || []}
      />
    </div>
  );
} 