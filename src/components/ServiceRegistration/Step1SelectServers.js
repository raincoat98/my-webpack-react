import React, { useMemo, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { Tag, Icon, Button } from 'antd';
import { AVAILABLE_SERVERS, TYPE_COLORS } from './mockData';

const STATUS_CONFIG = {
  available: { color: '#52c41a', label: '사용 가능' },
  maintenance: { color: '#faad14', label: '점검 중' },
};

function Step1SelectServers({ selectedRows, onSelectionChange }) {
  const gridRef = useRef(null);

  const columnDefs = useMemo(() => [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 48,
      minWidth: 48,
      maxWidth: 48,
      sortable: false,
      filter: false,
      pinned: 'left',
      suppressHeaderMenuButton: true,
    },
    {
      field: 'id',
      headerName: 'ID',
      width: 110,
      filter: true,
      cellRenderer: (params) => (
        <code style={{ fontSize: 11, background: '#f5f5f5', padding: '2px 6px', borderRadius: 3, color: '#555' }}>
          {params.value}
        </code>
      ),
    },
    {
      field: 'name',
      headerName: '서버명',
      width: 160,
      filter: true,
      sortable: true,
    },
    {
      field: 'type',
      headerName: '유형',
      width: 110,
      filter: true,
      sortable: true,
      cellRenderer: (params) => {
        const color = TYPE_COLORS[params.value] || '#999';
        return (
          <Tag color={color} style={{ fontSize: 11 }}>
            {params.value}
          </Tag>
        );
      },
    },
    {
      field: 'ip',
      headerName: 'IP 주소',
      width: 130,
      filter: true,
    },
    {
      field: 'os',
      headerName: 'OS',
      width: 150,
      filter: true,
      sortable: true,
    },
    {
      field: 'region',
      headerName: '리전',
      width: 90,
      filter: true,
      sortable: true,
    },
    {
      field: 'cpu',
      headerName: 'CPU',
      width: 90,
      sortable: true,
      cellRenderer: (params) => `${params.value} Core`,
    },
    {
      field: 'memory',
      headerName: 'Memory',
      width: 100,
      sortable: true,
      cellRenderer: (params) => `${params.value} GB`,
    },
    {
      field: 'storage',
      headerName: 'Storage',
      width: 100,
      sortable: true,
      cellRenderer: (params) => `${params.value} GB`,
    },
    {
      field: 'status',
      headerName: '상태',
      width: 110,
      filter: true,
      sortable: true,
      cellRenderer: (params) => {
        const cfg = STATUS_CONFIG[params.value] || { color: '#999', label: params.value };
        return (
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: cfg.color,
                display: 'inline-block',
              }}
            />
            <span style={{ color: cfg.color, fontSize: 12 }}>{cfg.label}</span>
          </span>
        );
      },
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: false,
  }), []);

  const selectedIds = useMemo(() => new Set(selectedRows.map(r => r.id)), [selectedRows]);

  const onGridReady = useCallback((params) => {
    params.api.forEachNode((node) => {
      if (selectedIds.has(node.data.id)) {
        node.setSelected(true);
      }
    });
  }, [selectedIds]);

  const onSelectionChanged = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    const rows = api.getSelectedRows().filter(r => r.status === 'available');
    onSelectionChange(rows);
  }, [onSelectionChange]);

  const removeRow = useCallback((id) => {
    const api = gridRef.current?.api;
    if (api) {
      api.forEachNode((node) => {
        if (node.data.id === id) node.setSelected(false);
      });
    }
    onSelectionChange(selectedRows.filter(r => r.id !== id));
  }, [selectedRows, onSelectionChange]);

  const selectedColumnDefs = useMemo(() => [
    {
      field: 'name',
      headerName: '서버명',
      flex: 1,
      cellRenderer: (params) => (
        <div style={{ lineHeight: 1.4, paddingTop: 2 }}>
          <div style={{ fontWeight: 600, fontSize: 12 }}>{params.value}</div>
          <code style={{ fontSize: 10, color: '#888' }}>{params.data.id}</code>
        </div>
      ),
    },
    {
      field: 'type',
      headerName: '유형',
      width: 85,
      cellRenderer: (params) => (
        <Tag color={TYPE_COLORS[params.value] || '#999'} style={{ fontSize: 11 }}>
          {params.value}
        </Tag>
      ),
    },
    {
      field: 'region',
      headerName: '리전',
      width: 60,
      cellStyle: { fontSize: 12, color: '#555' },
    },
    {
      headerName: '',
      width: 42,
      sortable: false,
      filter: false,
      suppressHeaderMenuButton: true,
      cellRenderer: (params) => (
        <Button
          type="link"
          size="small"
          icon="close"
          style={{ color: '#ff4d4f', padding: 0 }}
          onClick={() => removeRow(params.data.id)}
        />
      ),
    },
  ], [removeRow]);

  const count = selectedRows.length;

  return (
    <div>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: '#333' }}>
        <Icon type="server" style={{ marginRight: 6, color: '#1890ff' }} />
        등록할 서버 선택
        <span style={{ fontWeight: 400, fontSize: 12, color: '#999', marginLeft: 8 }}>
          체크박스로 여러 서버를 동시에 선택할 수 있습니다 (점검 중 서버는 선택 불가)
        </span>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* 왼쪽: AG Grid */}
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          <div className="ag-theme-balham" style={{ height: 420, width: '100%' }}>
            <AgGridReact
              ref={gridRef}
              rowData={AVAILABLE_SERVERS}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              onGridReady={onGridReady}
              onSelectionChanged={onSelectionChanged}
              pagination={true}
              paginationPageSize={8}
              domLayout="normal"
              rowClassRules={{ 'row-disabled': (params) => params.data?.status === 'maintenance' }}
            />
          </div>
        </div>

        {/* 오른쪽: 선택된 서버 목록 */}
        <div
          style={{
            width: 300,
            flexShrink: 0,
            border: `1px solid ${count > 0 ? '#91d5ff' : '#e8e8e8'}`,
            borderRadius: 8,
            overflow: 'hidden',
            transition: 'border-color 0.3s',
          }}
        >
          <div
            style={{
              padding: '10px 14px',
              background: count > 0 ? '#e6f7ff' : '#fafafa',
              borderBottom: '1px solid #e8e8e8',
              fontWeight: 600,
              fontSize: 13,
              color: count > 0 ? '#1890ff' : '#bbb',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.3s',
            }}
          >
            <Icon type="check-square" />
            선택된 서버
            {count > 0 && (
              <span
                style={{
                  marginLeft: 'auto',
                  background: '#1890ff',
                  color: 'white',
                  borderRadius: 10,
                  padding: '0 8px',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {count}
              </span>
            )}
          </div>

          <div className="ag-theme-balham" style={{ height: 370 }}>
            <AgGridReact
              rowData={selectedRows}
              columnDefs={selectedColumnDefs}
              defaultColDef={{ resizable: false, sortable: false }}
              domLayout="normal"
              headerHeight={36}
              rowHeight={48}
              suppressMovableColumns={true}
              overlayNoRowsTemplate='<span style="color:#bbb;font-size:13px;">선택된 서버가 없습니다</span>'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step1SelectServers;
