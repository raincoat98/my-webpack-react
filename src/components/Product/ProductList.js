import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { fetchProducts } from '@/api/productApi';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

function ProductList({ onOpenDrawer, onProductsLoaded, currentPage = 1, selectedProductId = null }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gridApi, setGridApi] = useState(null);

  useEffect(() => {
    // API에서 상품 데이터 조회 (마운트 시 1회만)
    fetchProducts().then((data) => {
      setProducts(data);
      onProductsLoaded && onProductsLoaded(data);
      setLoading(false);
    });
  }, []);

  // selectedProductId가 변경되면 해당 행 선택
  useEffect(() => {
    if (gridApi && selectedProductId) {
      const rowNode = gridApi.getRowNode(String(selectedProductId));
      if (rowNode) {
        rowNode.setSelected(true);
        gridApi.ensureNodeVisible(rowNode, 'middle');
      }
    }
  }, [gridApi, selectedProductId]);

  const handleOpenDrawer = useCallback((product) => {
    console.log('Drawer opened for:', product);
    onOpenDrawer && onOpenDrawer(product, currentPage);
  }, [onOpenDrawer, currentPage]);

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

  const onGridReady = (params) => {
    setGridApi(params.api);

    // selectedProductId가 있으면 해당 행 선택
    if (selectedProductId) {
      const rowNode = params.api.getRowNode(String(selectedProductId));
      if (rowNode) {
        rowNode.setSelected(true);
        params.api.ensureNodeVisible(rowNode, 'middle');
      }
    }
  };

  const onRowSelected = () => {
    // Row selection handler
  };

  return (
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
          getRowId={(params) => String(params.data.id)}
        />
      </div>
    </div>
  );
}

export default ProductList;
