import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
// ─── AG Grid 모듈 등록 (v33+) ────────────────────────────────────
import { ModuleRegistry, AllEnterpriseModule } from 'ag-grid-enterprise';
ModuleRegistry.registerModules([AllEnterpriseModule]);
// ─────────────────────────────────────────────────────────────────

ReactDOM.render(<App />, document.getElementById('root'));