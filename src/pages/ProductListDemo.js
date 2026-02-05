import React from 'react';
import { Card } from 'antd';
import ProductList from '@/components/ProductList';

function ProductListDemo() {
  const handleSelectProduct = (product) => {
    console.log('선택된 상품:', product);
  };

  return (
    <div>
      <Card title="상품 목록 (AG Grid)" style={{ marginBottom: '20px' }}>
        <p>ag-grid를 사용한 상품 목록입니다. 행을 선택하면 상품 정보가 표시됩니다.</p>
      </Card>

      <Card>
        <ProductList onSelectProduct={handleSelectProduct} />
      </Card>
    </div>
  );
}

export default ProductListDemo;
