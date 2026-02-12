import React, { useState, useEffect } from 'react';
import { Card, Drawer, Divider, Tag } from 'antd';
import { withRouter } from 'react-router-dom';
import ProductList from '@/components/ProductList';

function ProductListDemo({ location, history }) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerProduct, setDrawerProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);

  // URL 쿼리 파라미터에서 상태 초기화
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = parseInt(params.get('id'));
    const page = parseInt(params.get('page')) || 1;
    const detail = params.get('detail') === 'true';

    setCurrentPage(page);

    if (detail && productId && allProducts.length > 0) {
      const product = allProducts.find(p => p.id === productId);
      if (product) {
        setDrawerProduct(product);
        setDrawerVisible(true);
      }
    }
  }, [location.search, allProducts]);

  const handleOpenDrawer = (product, page = currentPage) => {
    console.log('ProductListDemo drawer opened:', product);
    setDrawerProduct(product);
    setDrawerVisible(true);

    // URL 업데이트
    const params = new URLSearchParams();
    params.set('id', product.id);
    params.set('page', page);
    params.set('detail', 'true');
    history.push(`${location.pathname}?${params.toString()}`);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setDrawerProduct(null);

    // URL에서 쿼리 파라미터 제거
    history.push(location.pathname);
  };

  const handleProductsLoaded = (products) => {
    setAllProducts(products);
  };

  return (
    <div>
      <Card title="상품 목록 (AG Grid)" style={{ marginBottom: '20px' }}>
        <p>ag-grid를 사용한 상품 목록입니다. 상세보기를 클릭하면 상품 정보가 표시됩니다.</p>
      </Card>

      <Card>
        <ProductList
          onOpenDrawer={handleOpenDrawer}
          onProductsLoaded={handleProductsLoaded}
          currentPage={currentPage}
        />
      </Card>

      {drawerProduct && (
        <Drawer
          title={`상품 상세 정보 - ${drawerProduct.name}`}
          placement="right"
          onClose={handleCloseDrawer}
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

export default withRouter(ProductListDemo);
