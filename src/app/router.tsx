import { createBrowserRouter } from 'react-router-dom';
import { App } from '@/App';
import { AssetManagementView } from '@/components/views/AssetManagementView';
import { GetStartedView } from "@/views/GetStartedView";
import { ScenarioEditorView } from "@/views/ScenarioEditorView";

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
        path: 'scenario/create-baseline',
        element: <ScenarioEditorView />,
      },
    ],
  },
]); 