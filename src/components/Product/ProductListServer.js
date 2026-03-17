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

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useProductServerStore } from '@/stores/productServerStore';
import { Button, Spin, Tag } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

/**
 * 서버에서 데이터를 페이지 단위로 받아 표시하는 상품 목록 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Function} props.onOpenDrawer - drawer 열기 핸들러
 */
function ProductListServer({ onOpenDrawer, onOpenAction }) {
  const refreshKey = useProductServerStore((state) => state.refreshKey);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const pageSize = 5;

  const handleOpenDrawer = useCallback((product) => {
    console.log('ServerComponent Drawer opened for:', product);
    onOpenDrawer && onOpenDrawer(product);
  }, [onOpenDrawer]);

  const handleOpenAction = useCallback((product) => {
    onOpenAction && onOpenAction(product);
  }, [onOpenAction]);

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
      field: 'id',
      headerName: '액션',
      width: 90,
      sortable: false,
      filter: false,
      suppressRowClickSelection: true,
      cellRenderer: (params) => (
        <Button
          type="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenAction(params.data);
          }}
        >
          액션
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
    {
      field: 'active',
      headerName: '상태',
      width: 90,
      sortable: true,
      filter: false,
      cellRenderer: (params) => (
        <Tag color={params.value ? 'green' : 'red'}>
          {params.value ? '활성' : '비활성'}
        </Tag>
      ),
    },
  ], [handleOpenDrawer, handleOpenAction]);

  const defaultColDef = {
    resizable: true,
    editable: false,
    cellStyle: { display: 'flex', alignItems: 'center' },
  };

  const fetchAll = useCallback(() => {
    setLoading(true);
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(result => {
        if (result.success) setProducts(result.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('데이터 로드 실패:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (refreshKey > 0) fetchAll();
  }, [refreshKey]);

  return (
    <Spin spinning={loading}>
      <div style={{ height: '500px', width: '100%' }}>
        <div className="ag-theme-balham" style={{ height: '100%' }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={products}
            defaultColDef={defaultColDef}
            rowSelection="single"
            pagination={true}
            paginationPageSize={pageSize}
            paginationPageSizeSelector={false}
            domLayout="normal"
            rowHeight={40}
          />
        </div>
      </div>
    </Spin>
  );
}

export default ProductListServer;
