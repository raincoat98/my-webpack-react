import React, { useState } from 'react';
import { Card, Drawer, Divider, Tag } from 'antd';
import ProductList from '@/components/ProductList';

function ProductListDemo() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerProduct, setDrawerProduct] = useState(null);

  const handleOpenDrawer = (product) => {
    console.log('ProductListDemo drawer opened:', product);
    setDrawerProduct(product);
    setDrawerVisible(true);
  };

  return (
    <div>
      <Card title="상품 목록 (AG Grid)" style={{ marginBottom: '20px' }}>
        <p>ag-grid를 사용한 상품 목록입니다. 상세보기를 클릭하면 상품 정보가 표시됩니다.</p>
      </Card>

      <Card>
        <ProductList onOpenDrawer={handleOpenDrawer} />
      </Card>

      {drawerProduct && (
        <Drawer
          title={`상품 상세 정보 - ${drawerProduct.name}`}
          placement="right"
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          width={400}
        >
          <div>
            <p><strong>상품 ID:</strong> {drawerProduct.id}</p>
            <Divider />
            <p><strong>상품명:</strong> {drawerProduct.name}</p>
            <Divider />
            <p><strong>설명:</strong> {drawerProduct.description}</p>
            <Divider />
            <p><strong>가격:</strong> <Tag color="blue">₩{drawerProduct.price.toLocaleString()}</Tag></p>
            <Divider />
            <p><strong>재고:</strong> <Tag color={drawerProduct.stock < 20 ? 'red' : 'green'}>{drawerProduct.stock}개</Tag></p>
            <Divider />
            <p><strong>카테고리:</strong> <Tag>{drawerProduct.category}</Tag></p>
          </div>
        </Drawer>
      )}
    </div>
  );
}

export default ProductListDemo;
