import React, { useCallback, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Card, Typography, Radio, Tag } from 'antd';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

const { Title, Text } = Typography;

const ROW_DATA = [
  { id: 1,  name: '노트북 Pro',          category: '전자기기', region: '서울', price: 1500000, stock: 30,  status: '판매중' },
  { id: 2,  name: '무선 마우스',          category: '주변기기', region: '부산', price: 45000,   stock: 120, status: '판매중' },
  { id: 3,  name: '기계식 키보드',        category: '주변기기', region: '서울', price: 130000,  stock: 55,  status: '판매중' },
  { id: 4,  name: '27인치 모니터',        category: '전자기기', region: '대구', price: 380000,  stock: 8,   status: '재고부족' },
  { id: 5,  name: 'USB-C 허브',           category: '주변기기', region: '서울', price: 62000,   stock: 200, status: '판매중' },
  { id: 6,  name: '웹캠 HD',              category: '전자기기', region: '인천', price: 95000,   stock: 40,  status: '판매중' },
  { id: 7,  name: '스피커 세트',          category: '음향기기', region: '부산', price: 220000,  stock: 0,   status: '품절' },
  { id: 8,  name: '헤드셋 무선',          category: '음향기기', region: '서울', price: 175000,  stock: 15,  status: '재고부족' },
  { id: 9,  name: '태블릿 패드',          category: '전자기기', region: '대전', price: 890000,  stock: 22,  status: '판매중' },
  { id: 10, name: '충전 독',              category: '주변기기', region: '서울', price: 48000,   stock: 90,  status: '판매중' },
];

const STATUS_COLOR = { '판매중': 'green', '재고부족': 'orange', '품절': 'red' };

// ─────────────────────────────────────────────
// 1. sizeColumnsToFit — 최초 1회만 호출
//    → 처음엔 딱 맞고, 창 줄이면 가로 스크롤 발생
// ─────────────────────────────────────────────
function SizeColumnsToFitGrid() {
  const columnDefs = useMemo(() => [
    { field: 'id',       headerName: 'ID',       width: 70 },
    { field: 'name',     headerName: '상품명',    width: 160 },
    { field: 'category', headerName: '카테고리', width: 120 },
    { field: 'region',   headerName: '지역',      width: 100 },
    {
      field: 'price',
      headerName: '가격',
      width: 130,
      cellRenderer: (p) => p.value != null ? `₩${p.value.toLocaleString()}` : '',
    },
    { field: 'stock',  headerName: '재고',  width: 90 },
    {
      field: 'status',
      headerName: '상태',
      width: 100,
      cellRenderer: (p) => <Tag color={STATUS_COLOR[p.value]}>{p.value}</Tag>,
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    minWidth: 70,
  }), []);

  // 핵심: 최초 렌더링 1회만 호출
  const onFirstDataRendered = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);

  // onGridSizeChanged 에서는 호출하지 않음 → 창 줄이면 스크롤 발생

  return (
    <AgGridReact
      rowData={ROW_DATA}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      onFirstDataRendered={onFirstDataRendered}
    />
  );
}

// ─────────────────────────────────────────────
// 2. flex: 1 — 마지막 컬럼이 항상 남는 공간 채움
//    → 창 줄이면 마지막 컬럼도 같이 줄어듦
//    → minWidth 이하로는 안 줄어들어서 그 시점부터 스크롤
// ─────────────────────────────────────────────
function FlexLastColumnGrid() {
  const columnDefs = useMemo(() => [
    { field: 'id',       headerName: 'ID',       width: 70,  suppressSizeToFit: true },
    { field: 'name',     headerName: '상품명',    width: 160 },
    { field: 'category', headerName: '카테고리', width: 120 },
    { field: 'region',   headerName: '지역',      width: 100 },
    {
      field: 'price',
      headerName: '가격',
      width: 130,
      cellRenderer: (p) => p.value != null ? `₩${p.value.toLocaleString()}` : '',
    },
    { field: 'stock', headerName: '재고', width: 90 },
    {
      field: 'status',
      headerName: '상태',
      // flex: 1 — 남는 공간을 이 컬럼이 채움
      flex: 1,
      minWidth: 100,
      cellRenderer: (p) => <Tag color={STATUS_COLOR[p.value]}>{p.value}</Tag>,
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
  }), []);

  return (
    <AgGridReact
      rowData={ROW_DATA}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
    />
  );
}

// ─────────────────────────────────────────────
// 3. suppressSizeToFit — 특정 컬럼 고정 후 나머지만 맞춤
// ─────────────────────────────────────────────
function SuppressSizeToFitGrid() {
  const columnDefs = useMemo(() => [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      // 이 컬럼은 sizeColumnsToFit 대상에서 제외 — 항상 70px 고정
      suppressSizeToFit: true,
    },
    { field: 'name',     headerName: '상품명',    width: 160 },
    { field: 'category', headerName: '카테고리', width: 120 },
    { field: 'region',   headerName: '지역',      width: 100 },
    {
      field: 'price',
      headerName: '가격',
      width: 130,
      cellRenderer: (p) => p.value != null ? `₩${p.value.toLocaleString()}` : '',
    },
    { field: 'stock', headerName: '재고', width: 90 },
    {
      field: 'status',
      headerName: '상태',
      width: 100,
      cellRenderer: (p) => <Tag color={STATUS_COLOR[p.value]}>{p.value}</Tag>,
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    minWidth: 70,
  }), []);

  const onFirstDataRendered = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <AgGridReact
      rowData={ROW_DATA}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      onFirstDataRendered={onFirstDataRendered}
    />
  );
}

// ─────────────────────────────────────────────
// 페이지 진입점
// ─────────────────────────────────────────────
const MODES = [
  {
    key: 'sizeToFit',
    label: 'sizeColumnsToFit (1회)',
    tag: 'green',
    summary: '최초 렌더링 때만 sizeColumnsToFit() 호출. 이후 창 크기가 줄어들면 컬럼 폭은 그대로 유지되어 가로 스크롤이 생깁니다.',
    code: `// onFirstDataRendered 에서 1회만 호출
const onFirstDataRendered = useCallback((params) => {
  params.api.sizeColumnsToFit();
}, []);

// onGridSizeChanged 에서는 호출하지 않음
// → 창이 줄어들어도 컬럼 폭 유지 → 가로 스크롤 발생`,
    Grid: SizeColumnsToFitGrid,
  },
  {
    key: 'flex',
    label: 'flex: 1 (마지막 컬럼)',
    tag: 'blue',
    summary: '마지막 컬럼에 flex: 1 지정. 항상 남는 공간을 채우며, minWidth 이하로 줄어들면 그 시점부터 스크롤이 생깁니다.',
    code: `// 마지막 컬럼에만 flex 부여
{ field: 'status', flex: 1, minWidth: 100 }

// 나머지 컬럼은 고정 width
{ field: 'name', width: 160 }`,
    Grid: FlexLastColumnGrid,
  },
  {
    key: 'suppress',
    label: 'suppressSizeToFit (ID 고정)',
    tag: 'purple',
    summary: 'ID 컬럼에 suppressSizeToFit: true 지정. sizeColumnsToFit 호출 시 이 컬럼은 70px 고정이고 나머지 컬럼들이 남은 공간을 나눠 가집니다.',
    code: `// ID 컬럼은 sizeColumnsToFit 대상에서 제외
{ field: 'id', width: 70, suppressSizeToFit: true }

// 나머지 컬럼만 공간을 나눠 가짐
{ field: 'name', width: 160 }`,
    Grid: SuppressSizeToFitGrid,
  },
];

function AgGridColumnSizePage() {
  const [mode, setMode] = useState('sizeToFit');
  const current = MODES.find((m) => m.key === mode);
  const { Grid } = current;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>AG Grid — 컬럼 너비 전략 비교</Title>

      <Card style={{ marginBottom: '16px', background: '#fafafa' }}>
        <div style={{ marginBottom: '12px' }}>
          <Radio.Group
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            {MODES.map((m) => (
              <Radio.Button key={m.key} value={m.key}>
                <Tag color={m.tag} style={{ marginRight: 6, border: 'none', background: 'transparent', padding: 0 }} />
                {m.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>

        <Text>{current.summary}</Text>

        <pre style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: '14px 16px',
          borderRadius: '6px',
          fontSize: '13px',
          marginTop: '12px',
          marginBottom: 0,
          overflowX: 'auto',
        }}>
          {current.code}
        </pre>
      </Card>

      <Card
        title={
          <span>
            데모&nbsp;
            <Tag color={current.tag}>{current.label}</Tag>
            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: 8 }}>
              브라우저 창을 좁혀보세요
            </Text>
          </span>
        }
      >
        <div style={{ height: 420, width: '100%' }}>
          <div className="ag-theme-balham" style={{ height: '100%', width: '100%' }}>
            <Grid key={mode} />
          </div>
        </div>
      </Card>

      <Card title="전략 요약" style={{ marginTop: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              {['방식', '초기 렌더링', '창 줄일 때', '추천 상황'].map((h) => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #d9d9d9' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['sizeColumnsToFit (1회)', '테이블 폭에 꽉 참', '가로 스크롤 발생', '"처음만 맞추고 이후엔 스크롤"'],
              ['flex: 1 (마지막 컬럼)', '마지막 컬럼이 남은 공간 채움', 'minWidth 이하 시 스크롤', '"항상 반응형으로 꽉 채우기"'],
              ['suppressSizeToFit', '지정 컬럼만 고정, 나머지 맞춤', '가로 스크롤 발생', '"특정 컬럼은 고정 폭 유지"'],
            ].map(([방식, 초기, 창줄, 추천], i) => (
              <tr key={i} style={{ background: i % 2 ? '#fafafa' : 'white' }}>
                {[방식, 초기, 창줄, 추천].map((cell, j) => (
                  <td key={j} style={{ padding: '8px 12px', border: '1px solid #d9d9d9' }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default AgGridColumnSizePage;
