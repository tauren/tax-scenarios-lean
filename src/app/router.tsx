import { createBrowserRouter } from 'react-router-dom';
import { App } from '@/App';
import { AssetManagementView } from '@/components/views/AssetManagementView';
import { GetStartedView } from "@/views/GetStartedView";
import { ScenarioEditorView } from "@/views/ScenarioEditorView";
import { ScenarioHubView } from "@/views/ScenarioHubView";
import { PlanOverview } from "@/views/PlanOverview";
import PersonalGoalsManagementView from "@/views/PersonalGoalsManagementView";
import ScenarioDetailView from '../views/ScenarioDetailView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <GetStartedView />,
      },
      {
        path: 'overview',
        element: <PlanOverview />,
      },
      {
        path: 'assets',
        element: <AssetManagementView />,
      },
      {
        path: 'scenarios',
        element: <ScenarioHubView />,
      },
      {
        path: 'scenarios/new',
        element: <ScenarioEditorView />,
      },
      {
        path: 'scenarios/:id',
        element: <ScenarioEditorView />,
      },
      {
        path: 'scenarios/:id/edit',
        element: <ScenarioEditorView />,
      },
      {
        path: 'scenarios/:id/view',
        element: <ScenarioDetailView />,
      },
      {
        path: 'objectives',
        element: <PersonalGoalsManagementView />,
      },
    ],
  },
]); 