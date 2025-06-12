import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from '@/App';
import { AssetManagementView } from '@/components/views/AssetManagementView';
import { GetStartedView } from "@/views/GetStartedView";
import { ScenarioEditorView } from "@/views/ScenarioEditorView";
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
        path: 'scenarios',
        element: <Navigate to="/overview" replace />,
      },
      {
        path: 'assets',
        element: <AssetManagementView />,
      },
      {
        path: 'scenarios/:id',
        element: <ScenarioDetailView />,
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
        path: 'priorities',
        element: <PersonalGoalsManagementView />,
      },
    ],
  },
]); 