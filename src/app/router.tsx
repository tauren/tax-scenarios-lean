import { createBrowserRouter } from 'react-router-dom';
import { App } from '@/App';
import { AssetManagementView } from '@/components/views/AssetManagementView';
import { GetStartedView } from "@/views/GetStartedView";
import { ScenarioEditorView } from "@/views/ScenarioEditorView";
import { ScenarioHubView } from "@/views/ScenarioHubView";

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
        path: 'assets',
        element: <AssetManagementView />,
      },
      {
        path: 'scenarios',
        element: <ScenarioHubView />,
      },
      {
        path: 'scenario/edit',
        element: <ScenarioEditorView />,
      },
    ],
  },
]); 