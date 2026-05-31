import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import 'antd/dist/antd.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
// ─── AG Grid 모듈 등록 (v33+) ────────────────────────────────────
import { ModuleRegistry, AllEnterpriseModule } from 'ag-grid-enterprise';
ModuleRegistry.registerModules([AllEnterpriseModule]);
// ─────────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  document.getElementById('root')
);