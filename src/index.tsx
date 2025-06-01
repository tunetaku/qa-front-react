import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { FluentProvider, webLightTheme, Toaster } from '@fluentui/react-components';
import App from './App';
import './index.css';
import { UserProvider } from './contexts/UserContext';

const container = document.getElementById('root');
if (!container) throw new Error('Root container missing in index.html');

createRoot(container).render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
      <Toaster position="top" />
      <UserProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserProvider>
    </FluentProvider>
  </React.StrictMode>
);
