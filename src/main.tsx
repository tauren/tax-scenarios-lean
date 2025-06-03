import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import './index.css';
import { StagewiseToolbar } from '@stagewise/toolbar-react';

const stagewiseConfig = {
  plugins: []
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {process.env.NODE_ENV === 'development' && (
      <StagewiseToolbar config={stagewiseConfig} />
    )}
  </React.StrictMode>,
);
