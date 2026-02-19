/**
 * 서버 사이드 상품 목록 컴포넌트
 *
 * 특징:
 * - 서버에서 데이터를 직접 가져와 초기 렌더링
 * - 클라이언트 사이드 하이드레이션 지원
 * - SEO 최적화 (SSR)
 * - 초기 로딩 시간 단축
 *
 * 사용법:
 * import ProductListServer from '@/components/ProductListServer';
 * <ProductListServer onOpenDrawer={handleOpenDrawer} />
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button, Spin } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * 서버에서 초기 데이터를 받아 렌더링하는 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.initialData - 서버에서 가져온 초기 데이터
 * @param {Function} props.onOpenDrawer - drawer 열기 핸들러
 * @param {boolean} props.isLoading - 로딩 상태
 * @param {string} props.error - 에러 메시지
 */
function ProductListServer({ initialData = [], onOpenDrawer, isLoading = false, error = null }) {
  const [products, setProducts] = useState(initialData);
  const [loading, setLoading] = useState(isLoading);

  // initialData가 변경될 때 products 업데이트
  useEffect(() => {
    console.log('ProductListServer: initialData changed', initialData);
    setProducts(initialData);
  }, [initialData]);

  // loading 상태 업데이트
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  // 에러 상태 처리
  if (error) {
    return (
      <div style={{ padding: '20px', color: '#ff4d4f' }}>
        <p><strong>오류가 발생했습니다:</strong> {error}</p>
      </div>
    );
  }

  const handleOpenDrawer = useCallback((product) => {
    console.log('ServerComponent Drawer opened for:', product);
    onOpenDrawer && onOpenDrawer(product);
  }, [onOpenDrawer]);

  const columnDefs = useMemo(() => [
    {
      field: 'id',
      headerName: '상세',
      width: 80,
      sortable: false,
      filter: false,
      suppressRowClickSelection: true,
      cellRenderer: (params) => (
        <Button
          type="link"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDrawer(params.data);
          }}
        >
          상세보기
        </Button>
      ),
    },
    {
      field: 'name',
      headerName: '상품명',
      width: 150,
      sortable: true,
      filter: true,
    },
    {
      field: 'description',
      headerName: '설명',
      width: 200,
      sortable: true,
      filter: true,
    },
    {
      field: 'price',
      headerName: '가격',
      width: 120,
      sortable: true,
      filter: true,
      cellRenderer: (params) => `₩${params.value.toLocaleString()}`,
    },
    {
      field: 'stock',
      headerName: '재고',
      width: 100,
      sortable: true,
      filter: true,
      cellRenderer: (params) => (
        <span style={{ color: params.value < 20 ? '#ff4d4f' : '#52c41a' }}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'category',
      headerName: '카테고리',
      width: 120,
      sortable: true,
      filter: true,
    },
  ], [handleOpenDrawer]);

  const defaultColDef = {
    resizable: true,
    editable: false,
  };

  const onGridReady = () => {
    // Grid ready handler
  };

  const onRowSelected = () => {
    // Row selection handler
  };

  return (
    <Spin spinning={loading}>
      <div style={{ height: '500px', width: '100%' }}>
        <div className="ag-theme-balham" style={{ height: '100%' }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={products}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onSelectionChanged={onRowSelected}
            rowSelection="single"
            pagination={true}
            paginationPageSize={5}
            loading={loading}
          />
        </div>
      </div>
    </Spin>
  );
}

export default ProductListServer;
