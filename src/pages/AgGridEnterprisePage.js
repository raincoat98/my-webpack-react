import React, { useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Card, Typography } from 'antd';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
// Enterprise 모듈 로드 (이 페이지는 항상 Enterprise 전용)
// ag-grid-enterprise 설치 필요: npm install ag-grid-enterprise@32.2.1
import 'ag-grid-enterprise';
// 라이센스키는 index.js에서 설정

const { Title, Text } = Typography;

// 목(Mock) 전체 데이터 — 실제 환경에서는 서버 DB
const ALL_DATA = [
  { id: 1,  name: '노트북 Pro',     category: '전자기기', region: '서울', price: 1500000, stock: 30,  status: '판매중' },
  { id: 2,  name: '무선 마우스',    category: '주변기기', region: '부산', price: 45000,   stock: 120, status: '판매중' },
  { id: 3,  name: '기계식 키보드', category: '주변기기', region: '서울', price: 130000,  stock: 55,  status: '판매중' },
  { id: 4,  name: '27인치 모니터', category: '전자기기', region: '대구', price: 380000,  stock: 8,   status: '재고부족' },
  { id: 5,  name: 'USB-C 허브',    category: '주변기기', region: '서울', price: 62000,   stock: 200, status: '판매중' },
  { id: 6,  name: '웹캠 HD',       category: '전자기기', region: '인천', price: 95000,   stock: 40,  status: '판매중' },
  { id: 7,  name: '스피커 세트',   category: '음향기기', region: '부산', price: 220000,  stock: 0,   status: '품절' },
  { id: 8,  name: '헤드셋 무선',   category: '음향기기', region: '서울', price: 175000,  stock: 15,  status: '재고부족' },
  { id: 9,  name: '태블릿 패드',   category: '전자기기', region: '대전', price: 890000,  stock: 22,  status: '판매중' },
  { id: 10, name: '충전 독',        category: '주변기기', region: '서울', price: 48000,   stock: 90,  status: '판매중' },
  { id: 11, name: '외장 SSD',      category: '저장장치', region: '서울', price: 120000,  stock: 65,  status: '판매중' },
  { id: 12, name: 'NVMe SSD',      category: '저장장치', region: '부산', price: 85000,   stock: 3,   status: '재고부족' },
  { id: 13, name: '게이밍 마우스', category: '주변기기', region: '대구', price: 78000,   stock: 42,  status: '판매중' },
  { id: 14, name: '4K 웹캠',       category: '전자기기', region: '서울', price: 185000,  stock: 0,   status: '품절' },
  { id: 15, name: '노이즈캔슬링 이어폰', category: '음향기기', region: '인천', price: 320000, stock: 18, status: '판매중' },
];

/**
 * 목 서버: 정렬·필터·페이지네이션을 서버에서 처리하는 것을 시뮬레이션
 * 실제 환경에서는 이 로직이 백엔드 API에 있음
 */
function fetchFromMockServer(request) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let rows = [...ALL_DATA];

      // 필터 적용
      const { filterModel } = request;
      if (filterModel) {
        Object.entries(filterModel).forEach(([field, filter]) => {
          rows = rows.filter((row) => {
            const value = row[field];
            if (filter.filterType === 'text') {
              return String(value).toLowerCase().includes(filter.filter.toLowerCase());
            }
            if (filter.filterType === 'number') {
              if (filter.type === 'equals')            return value === filter.filter;
              if (filter.type === 'greaterThan')       return value > filter.filter;
              if (filter.type === 'lessThan')          return value < filter.filter;
              if (filter.type === 'greaterThanOrEqual') return value >= filter.filter;
              if (filter.type === 'lessThanOrEqual')   return value <= filter.filter;
            }
            if (filter.filterType === 'set') {
              return filter.values?.includes(String(value));
            }
            return true;
          });
        });
      }

      // 정렬 적용
      const { sortModel } = request;
      if (sortModel?.length) {
        const { colId, sort } = sortModel[0];
        rows.sort((a, b) => {
          if (a[colId] < b[colId]) return sort === 'asc' ? -1 : 1;
          if (a[colId] > b[colId]) return sort === 'asc' ? 1 : -1;
          return 0;
        });
      }

      const rowCount = rows.length;
      const rowData = rows.slice(request.startRow, request.endRow);

      resolve({ rowData, rowCount });
    }, 300); // 300ms 지연으로 실제 API 호출 시뮬레이션
  });
}

function AgGridEnterprisePage() {
  const columnDefs = useMemo(() => [
    {
      field: 'name',
      headerName: '상품명',
      width: 180,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'category',
      headerName: '카테고리',
      width: 120,
      filter: 'agSetColumnFilter',
    },
    {
      field: 'region',
      headerName: '지역',
      width: 100,
      filter: 'agSetColumnFilter',
    },
    {
      field: 'price',
      headerName: '가격',
      width: 130,
      filter: 'agNumberColumnFilter',
      cellRenderer: (params) =>
        params.value != null ? `₩${params.value.toLocaleString()}` : '',
    },
    {
      field: 'stock',
      headerName: '재고',
      width: 100,
      filter: 'agNumberColumnFilter',
      cellStyle: (params) => ({
        color: params.value === 0 ? '#ff4d4f' : params.value < 20 ? '#fa8c16' : '#52c41a',
        fontWeight: 'bold',
      }),
    },
    {
      field: 'status',
      headerName: '상태',
      width: 110,
      filter: 'agSetColumnFilter',
    },
  ], []);

  const defaultColDef = {
    resizable: true,
    sortable: true,
    floatingFilter: true,
  };

  const sideBar = {
    toolPanels: [
      { id: 'columns', labelDefault: 'Columns', labelKey: 'columns', iconKey: 'columns', toolPanel: 'agColumnsToolPanel' },
      { id: 'filters', labelDefault: 'Filters',  labelKey: 'filters',  iconKey: 'filter',  toolPanel: 'agFiltersToolPanel' },
    ],
    defaultToolPanel: '',
  };

  /**
   * Server-Side Datasource
   * ag-grid가 데이터가 필요할 때마다 getRows()를 호출함
   * (페이지 이동, 정렬, 필터 변경 시)
   */
  const serverSideDatasource = useCallback(() => ({
    getRows: async (params) => {
      try {
        const { rowData, rowCount } = await fetchFromMockServer(params.request);
        params.success({ rowData, rowCount });
      } catch (e) {
        params.fail();
      }
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
{`// Server-Side Datasource 구현
const serverSideDatasource = {
  getRows: async (params) => {
    // params.request 에 포함된 정보:
    //   startRow, endRow   — 요청 행 범위
    //   sortModel          — 정렬 조건
    //   filterModel        — 필터 조건
    //   groupKeys          — 행 그룹 키 (그룹화 사용 시)

    const { rowData, rowCount } = await fetchFromServer(params.request);

    params.success({ rowData, rowCount }); // 성공
    // params.fail();                       // 실패 시
  },
};

// 그리드에 연결
<AgGridReact
  rowModelType="serverSide"
  serverSideDatasource={serverSideDatasource}
  cacheBlockSize={5}        // 한 번에 요청할 행 수
  pagination={true}
  paginationPageSize={5}
/>`}
        </pre>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          ※ 정렬·필터 변경 시 콘솔에서 서버 요청 로그를 확인할 수 있습니다.
        </Text>
      </Card>

      <Card title="데모 (정렬·필터 변경 시 서버 재요청)">
        <div style={{ height: '480px', width: '100%' }}>
          <div className="ag-theme-balham" style={{ height: '100%' }}>
            <AgGridReact
              rowModelType="serverSide"
              serverSideDatasource={serverSideDatasource()}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              sideBar={sideBar}
              cacheBlockSize={5}
              pagination={true}
              paginationPageSize={5}
              rowSelection={{ mode: 'multiRow' }}
              cellSelection={true}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AgGridEnterprisePage;
