import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { TempContent } from '../components/TempContent';
import { AssetManagementView } from '../components/views/AssetManagementView';
import { GetStartedView } from "@/views/GetStartedView";

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
        element: <div>Create Baseline Scenario (Coming Soon)</div>, // Placeholder for Task 2
      },
    ],
  },
]); 