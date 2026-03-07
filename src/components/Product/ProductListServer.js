/**
 * 서버 사이드 상품 목록 컴포넌트
 *
 * 특징:
 * - 페이지별로 서버에서 데이터를 받아 렌더링
 * - URL 쿼리 파라미터로 페이지 상태 관리
 * - 페이지 변경 시 서버 요청 발생
 *
 * 사용법:
 * import ProductListServer from '@/components/Product/ProductListServer';
 * <ProductListServer onOpenDrawer={handleOpenDrawer} />
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useProductServerStore } from '@/stores/productServerStore';
import { Button, Spin } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * 서버에서 데이터를 페이지 단위로 받아 표시하는 상품 목록 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Function} props.onOpenDrawer - drawer 열기 핸들러
 */
function ProductListServer({ onOpenDrawer }) {
  const refreshKey = useProductServerStore((state) => state.refreshKey);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 5;
  const currentPageRef = useRef(0);

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

  // 페이지 변경 시 서버에서 데이터 로드
  const loadPage = useCallback((pageNumber) => {
    // 같은 페이지 요청이면 무시
    if (currentPageRef.current === pageNumber) {
      return;
    }

    currentPageRef.current = pageNumber;
    const startRow = (pageNumber - 1) * pageSize;
    const endRow = startRow + pageSize;

    setLoading(true);

    fetch(`http://localhost:3001/api/products?startRow=${startRow}&endRow=${endRow}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setProducts(result.data);
          setTotalRows(result.rowCount);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('데이터 로드 실패:', err);
        setLoading(false);
      });
  }, [pageSize]);

  // 초기 데이터 로드 (마운트 시 1회만)
  useEffect(() => {
    loadPage(1);
  }, []);

  // refreshKey 변경 시 현재 페이지 재로드
  useEffect(() => {
    if (refreshKey > 0) {
      const page = currentPageRef.current;
      currentPageRef.current = 0; // 같은 페이지 스킵 방지
      loadPage(page);
    }
  }, [refreshKey]);

  const onGridReady = useCallback((params) => {
    // Grid ready handler
  }, []);

  const onRowSelected = () => {
    // Row selection handler
  };

  // 페이지 변경 핸들러 - 실제 페이지 변경 시에만 호출
  const onPaginationChanged = useCallback((params) => {
    const newPage = params.api.paginationGetCurrentPage() + 1;

    // 페이지가 실제로 변경되었을 때만 서버에서 데이터 로드
    if (currentPageRef.current !== newPage) {
      loadPage(newPage);
    }
  }, [loadPage]);

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
            onPaginationChanged={onPaginationChanged}
            rowSelection="single"
            pagination={true}
            paginationPageSize={pageSize}
            domLayout="normal"
          />
        </div>
      </div>
    </Spin>
  );
}

export default ProductListServer;
