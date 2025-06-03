import { useUserAppState } from '@/store/userAppStateSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Pencil, ArrowRight } from 'lucide-react';

export function PlanOverview() {
  const navigate = useNavigate();
  const { activePlanInternalName, setActivePlanInternalName, initialAssets, scenarios } = useUserAppState();
  const [isEditingName, setIsEditingName] = useState(false);
  const [planName, setPlanName] = useState(activePlanInternalName || 'Untitled Plan');

  const handleNameSubmit = () => {
    if (planName.trim()) {
      setActivePlanInternalName(planName.trim());
    } else {
      setPlanName(activePlanInternalName || 'Untitled Plan');
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setPlanName(activePlanInternalName || 'Untitled Plan');
      setIsEditingName(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Plan Name Section */}
      <div className="flex items-center gap-4">
        {isEditingName ? (
          <Input
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyDown}
            className="text-2xl font-bold"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{planName}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditingName(true)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Plan Components Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Scenarios Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Scenarios</CardTitle>
            <CardDescription>
              {scenarios.length} {scenarios.length === 1 ? 'scenario' : 'scenarios'} in your plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate('/scenarios')}
              className="w-full justify-between"
            >
              View Scenarios
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Assets Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Assets</CardTitle>
            <CardDescription>
              {initialAssets.length} {initialAssets.length === 1 ? 'asset' : 'assets'} in your plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate('/assets')}
              className="w-full justify-between"
            >
              View Assets
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 