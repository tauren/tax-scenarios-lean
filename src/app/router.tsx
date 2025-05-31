import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { TempContent } from '../components/TempContent';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <TempContent />
      }
    ]
  }
]); 