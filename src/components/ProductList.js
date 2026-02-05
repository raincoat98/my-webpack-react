import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { fetchProducts } from '@/api/productApi';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

ModuleRegistry.registerModules([AllCommunityModule]);

function ProductList({ onSelectProduct }) {
  const [gridApi, setGridApi] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API에서 상품 데이터 조회
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const columnDefs = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      sortable: true,
      filter: true,
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
  ];

  const defaultColDef = {
    resizable: true,
    editable: false,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onRowSelected = () => {
    const selected = gridApi.getSelectedRows();
    setSelectedRows(selected);
    if (selected.length > 0) {
      onSelectProduct && onSelectProduct(selected[0]);
    }
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
        />
      </div>
      {selectedRows.length > 0 && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f2f5', borderRadius: '4px' }}>
          <p><strong>선택된 상품:</strong> {selectedRows[0].name}</p>
          <p><strong>가격:</strong> ₩{selectedRows[0].price.toLocaleString()}</p>
          <p><strong>재고:</strong> {selectedRows[0].stock}개</p>
        </div>
      )}
    </div>
  );
}

export default ProductList;
