import React, { useMemo } from 'react';
import { Card, Typography } from 'antd';
import ServerSideGrid from '../components/AgGrid/ServerSideGrid';

const { Title, Text } = Typography;

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// const ALL_DATA = [
//   { id: 1,  name: '노트북 Pro',          category: '전자기기', region: '서울', price: 1500000, stock: 30,  status: '판매중' },
//   { id: 2,  name: '무선 마우스',          category: '주변기기', region: '부산', price: 45000,   stock: 120, status: '판매중' },
//   { id: 3,  name: '기계식 키보드',        category: '주변기기', region: '서울', price: 130000,  stock: 55,  status: '판매중' },
//   { id: 4,  name: '27인치 모니터',        category: '전자기기', region: '대구', price: 380000,  stock: 8,   status: '재고부족' },
//   { id: 5,  name: 'USB-C 허브',          category: '주변기기', region: '서울', price: 62000,   stock: 200, status: '판매중' },
//   { id: 6,  name: '웹캠 HD',             category: '전자기기', region: '인천', price: 95000,   stock: 40,  status: '판매중' },
//   { id: 7,  name: '스피커 세트',          category: '음향기기', region: '부산', price: 220000,  stock: 0,   status: '품절' },
//   { id: 8,  name: '헤드셋 무선',          category: '음향기기', region: '서울', price: 175000,  stock: 15,  status: '재고부족' },
//   { id: 9,  name: '태블릿 패드',          category: '전자기기', region: '대전', price: 890000,  stock: 22,  status: '판매중' },
//   { id: 10, name: '충전 독',              category: '주변기기', region: '서울', price: 48000,   stock: 90,  status: '판매중' },
//   { id: 11, name: '외장 SSD',            category: '저장장치', region: '서울', price: 120000,  stock: 65,  status: '판매중' },
//   { id: 12, name: 'NVMe SSD',            category: '저장장치', region: '부산', price: 85000,   stock: 3,   status: '재고부족' },
//   { id: 13, name: '게이밍 마우스',        category: '주변기기', region: '대구', price: 78000,   stock: 42,  status: '판매중' },
//   { id: 14, name: '4K 웹캠',             category: '전자기기', region: '서울', price: 185000,  stock: 0,   status: '품절' },
//   { id: 15, name: '노이즈캔슬링 이어폰', category: '음향기기', region: '인천', price: 320000,  stock: 18,  status: '판매중' },
// ];

const sideBar = {
  toolPanels: [
    { id: 'columns', labelDefault: 'Columns', labelKey: 'columns', iconKey: 'columns', toolPanel: 'agColumnsToolPanel' },
    { id: 'filters', labelDefault: 'Filters',  labelKey: 'filters',  iconKey: 'filter',  toolPanel: 'agFiltersToolPanel' },
  ],
  defaultToolPanel: '',
};

function AgGridEnterprisePage() {
  const columnDefs = useMemo(() => [
    { field: 'id',          headerName: 'ID',       width: 70 },
    { field: 'name',        headerName: '상품명',   width: 160, filter: 'agTextColumnFilter' },
    { field: 'description', headerName: '설명',     width: 200, filter: 'agTextColumnFilter' },
    { field: 'category',    headerName: '카테고리', width: 130, filter: 'agSetColumnFilter' },
    {
      field: 'price', headerName: '가격', width: 130, filter: 'agNumberColumnFilter',
      cellRenderer: (params) => params.value != null ? `₩${params.value.toLocaleString()}` : '',
    },
    {
      field: 'stock', headerName: '재고', width: 100, filter: 'agNumberColumnFilter',
      cellStyle: (params) => ({
        color: params.value === 0 ? '#ff4d4f' : params.value < 20 ? '#fa8c16' : '#52c41a',
        fontWeight: 'bold',
      }),
    },
    {
      field: 'active', headerName: '활성', width: 90,
      cellRenderer: (params) => (
        <span style={{ color: params.value ? '#52c41a' : '#ff4d4f' }}>
          {params.value ? '활성' : '비활성'}
        </span>
      ),
    },
  ], []);

  const server = useMemo(() => ({
    getData: async (request) => {
      const params = new URLSearchParams({
        startRow: request.startRow,
        endRow: request.endRow,
      });

      // 정렬
      if (request.sortModel?.length) {
        params.set('sortBy', request.sortModel[0].colId);
        params.set('order', request.sortModel[0].sort);
      }

      // 필터 (서버가 지원하는 category만)
      const categoryFilter = request.filterModel?.category;
      if (categoryFilter?.filter) {
        params.set('category', categoryFilter.filter);
      }

      const res = await fetch(`${API_BASE}/products?${params}`);
      const json = await res.json();

      if (!json.success) return { success: false };
      return { success: true, rows: json.data, lastRow: json.rowCount };
    },
  }), []);

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>AG Grid Enterprise — Server-Side Row Model</Title>

      <Card
        title="Server-Side Row Model 동작 방식"
        style={{ marginBottom: '24px', background: '#fafafa' }}
      >
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '16px', borderRadius: '6px', fontSize: '13px', overflowX: 'auto' }}>
{`// server 객체 구현
const server = {
  getData: async (request) => {
    // request: { startRow, endRow, sortModel, filterModel, ... }
    const { data, rowCount } = await fetchFromAPI(request);
    return { success: true, rows: data, lastRow: rowCount };
  },
};

// 그리드에 연결
<ServerSideGrid
  server={server}
  columnDefs={columnDefs}
  cacheBlockSize={5}
  paginationPageSize={5}
/>`}
        </pre>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          ※ 정렬·필터 변경 시 콘솔에서 서버 요청 로그를 확인할 수 있습니다.
        </Text>
      </Card>

      <Card title="데모 (정렬·필터 변경 시 서버 재요청)">
        <div style={{ height: '480px' }}>
          <ServerSideGrid
            server={server}
            columnDefs={columnDefs}
            sideBar={sideBar}
            cacheBlockSize={5}
            paginationPageSize={5}
            height="100%"
            rowSelection={{ mode: 'multiRow' }}
            cellSelection={true}
          />
        </div>
      </Card>
    </div>
  );
}

export default AgGridEnterprisePage;
