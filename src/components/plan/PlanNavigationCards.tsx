import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Building2, Target, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PlanNavigationCardsProps {
  assetsCount: number;
  objectivesCount: number;
  scenariosCount: number;
}

export function PlanNavigationCards({ assetsCount, objectivesCount, scenariosCount }: PlanNavigationCardsProps) {
  const navigate = useNavigate();

  const renderNavigationCard = (
    Icon: LucideIcon,
    title: string,
    count: number,
    singularLabel: string,
    pluralLabel: string,
    path: string
  ) => (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer border-muted"
      onClick={() => navigate(path)}
    >
      <CardContent className="pt-2">
        <div className="flex flex-col items-center text-center">
          <Icon className="h-8 w-8 text-muted-foreground mb-2" />
          <div className="text-sm font-medium">{title}</div>
          <div className="text-2xl font-bold">{count}</div>
          <p className="text-xs text-muted-foreground">
            {count === 1 ? singularLabel : pluralLabel}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {renderNavigationCard(
        Layers,
        "My Scenarios",
        scenariosCount,
        "scenario created",
        "scenarios created",
        "/overview"
      )}

      {renderNavigationCard(
        Target,
        "My Priorities",
        objectivesCount,
        "priority defined",
        "priorities defined",
        "/priorities"
      )}

      {renderNavigationCard(
        Building2,
        "My Assets",
        assetsCount,
        "asset in your plan",
        "assets in your plan",
        "/assets"
      )}
    </div>
  );
} 