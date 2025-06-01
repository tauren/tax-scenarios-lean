import { useUserAppState } from '@/store/userAppStateSlice';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Section } from '@/components/shared/section';
import { CardList } from '@/components/shared/card-list';
import { ListItemCard } from '@/components/shared/list-item-card';

export function ScenariosView() {
  const { scenarios } = useUserAppState();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Scenarios</h1>
        <Button onClick={() => navigate('/scenario/create-baseline')}>
          Create New Scenario
        </Button>
      </div>

      <Section
        title="Your Scenarios"
        hasItems={scenarios.length > 0}
        emptyMessage="No scenarios created yet. Create your first scenario to get started."
      >
        <CardList>
          {scenarios.map((scenario) => (
            <ListItemCard
              key={scenario.id}
              title={scenario.name}
              subtitle={`${scenario.location.country} • ${scenario.projectionPeriod} years`}
              onEdit={() => navigate(`/scenario/${scenario.id}`)}
              onDelete={() => {/* TODO: Implement delete */}}
              onDuplicate={() => {/* TODO: Implement duplicate */}}
            />
          ))}
        </CardList>
      </Section>
    </div>
  );
} 