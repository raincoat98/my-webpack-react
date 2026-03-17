import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css';
// ─── AG Grid 버전 전환 ────────────────────────────────────────────
// [Enterprise 사용 시] 아래 두 줄 주석 해제 + npm install ag-grid-enterprise@32.2.1
// import { LicenseManager } from 'ag-grid-enterprise';
// LicenseManager.setLicenseKey('YOUR_LICENSE_KEY_HERE');

// [Community 사용 시] 위 두 줄 주석 처리 + npm uninstall ag-grid-enterprise
// ─────────────────────────────────────────────────────────────────

ReactDOM.render(<App />, document.getElementById('root'));
