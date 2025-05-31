import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { TempContent } from '../components/TempContent';
import { AssetManagementView } from '../components/views/AssetManagementView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <TempContent />,
      },
      {
        path: 'assets',
        element: <AssetManagementView />,
      },
    ],
  },
]); 