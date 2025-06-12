import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Building2, Target, Layers } from 'lucide-react';

interface PlanNavigationCardsProps {
  assetsCount: number;
  objectivesCount: number;
  scenariosCount: number;
}

export function PlanNavigationCards({ assetsCount, objectivesCount, scenariosCount }: PlanNavigationCardsProps) {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Scenarios Card */}
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer border-muted"
        onClick={() => navigate('/scenarios')}
      >
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Layers className="h-8 w-8 text-muted-foreground mb-2" />
            <div className="text-sm font-medium">Total Scenarios</div>
            <div className="text-2xl font-bold">{scenariosCount}</div>
            <p className="text-xs text-muted-foreground">
              {scenariosCount === 1 ? 'scenario' : 'scenarios'} created
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Assets Card */}
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer border-muted"
        onClick={() => navigate('/assets')}
      >
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Building2 className="h-8 w-8 text-muted-foreground mb-2" />
            <div className="text-sm font-medium">Total Assets</div>
            <div className="text-2xl font-bold">{assetsCount}</div>
            <p className="text-xs text-muted-foreground">
              {assetsCount === 1 ? 'asset' : 'assets'} in your plan
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Location Objectives Card */}
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer border-muted"
        onClick={() => navigate('/objectives')}
      >
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Target className="h-8 w-8 text-muted-foreground mb-2" />
            <div className="text-sm font-medium">Location Objectives</div>
            <div className="text-2xl font-bold">{objectivesCount}</div>
            <p className="text-xs text-muted-foreground">
              {objectivesCount === 1 ? 'objective' : 'objectives'} defined
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 