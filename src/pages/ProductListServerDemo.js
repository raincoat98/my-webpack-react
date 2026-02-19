/**
 * 서버 사이드 렌더링 상품 목록 데모 페이지
 *
 * 특징:
 * - 서버에서 초기 데이터를 받아 렌더링
 * - 클라이언트에서 하이드레이션하여 인터랙티브 기능 추가
 * - 초기 로딩 시간 단축 및 SEO 최적화
 */

import React, { useState, useEffect } from 'react';
import { Card, Drawer, Divider, Tag, Spin, Alert } from 'antd';
import { withRouter } from 'react-router-dom';
import ProductListServer from '@/components/ProductListServer';
import { fetchProducts } from '@/api/productApi';

function ProductListServerDemo({ location, history }) {
  const [initialData, setInitialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerProduct, setDrawerProduct] = useState(null);

  // 서버에서 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setInitialData(data);
        setError(null);
      } catch (err) {
        console.error('초기 데이터 로드 실패:', err);
        setError(err.message || '데이터를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // URL 쿼리 파라미터에서 상태 초기화
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = parseInt(params.get('id'));
    const detail = params.get('detail') === 'true';

    if (detail && productId) {
      setDrawerVisible(true);
      if (initialData.length > 0) {
        const product = initialData.find(p => p.id === productId);
        if (product) {
          setDrawerProduct(product);
        }
      }
    }
  }, [location.search, initialData]);

  const handleOpenDrawer = (product) => {
    console.log('ProductListServerDemo drawer opened:', product);
    setDrawerProduct(product);
    setDrawerVisible(true);

    // URL 업데이트
    const params = new URLSearchParams();
    params.set('id', product.id);
    params.set('detail', 'true');
    history.push(`${location.pathname}?${params.toString()}`);
  };

  const handleCloseDrawer = () => {
    console.log('Closing drawer');
    setDrawerVisible(false);
    setTimeout(() => setDrawerProduct(null), 300); // 드로어 닫기 애니메이션 후 상태 초기화

    // URL에서 쿼리 파라미터 제거
    history.push(location.pathname);
  };

  return (
    <div>
      <Card
        title="상품 목록 (서버 사이드 렌더링)"
        style={{ marginBottom: '20px' }}
      >
        <p>
          서버에서 초기 데이터를 가져와 렌더링합니다.
          SSR(Server-Side Rendering)을 통해 초기 로딩 시간을 단축하고 SEO를 최적화합니다.
        </p>
        <p style={{ fontSize: '12px', color: '#999' }}>
          💡 Tip: 이 방식은 페이지 로드 시 서버에서 데이터를 미리 가져와서 초기 렌더링합니다.
          CSR(Client-Side Rendering) 방식에 비해 초기 로딩이 빠릅니다.
        </p>
      </Card>

      {error && (
        <Alert
          message="데이터 로드 실패"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '20px' }}
          onClose={() => setError(null)}
        />
      )}

      <Card>
        <Spin spinning={loading} tip="데이터를 불러오는 중...">
          <ProductListServer
            initialData={initialData}
            onOpenDrawer={handleOpenDrawer}
            isLoading={loading}
            error={error}
          />
        </Spin>
      </Card>

      {/* 상품 상세 정보 Drawer */}
      {drawerProduct && (
        <Drawer
          title={`상품 상세 정보 - ${drawerProduct.name}`}
          placement="right"
          onClose={handleCloseDrawer}
          visible={drawerVisible}
          width={400}
        >
          <div>
            <div style={{ marginBottom: '16px' }}>
              <strong>상품 ID:</strong>
              <Tag style={{ marginLeft: '8px' }}>{drawerProduct.id}</Tag>
            </div>
            <Divider />

            <div style={{ marginBottom: '16px' }}>
              <strong>상품명:</strong>
              <Tag style={{ marginLeft: '8px' }}>{drawerProduct.name}</Tag>
            </div>
            <Divider />

            <div style={{ marginBottom: '16px' }}>
              <strong>설명:</strong>
              <p style={{ marginLeft: '0px', marginTop: '8px' }}>{drawerProduct.description}</p>
            </div>
            <Divider />

            <div style={{ marginBottom: '16px' }}>
              <strong>가격:</strong>
              <Tag color="blue" style={{ marginLeft: '8px' }}>
                ₩{drawerProduct.price.toLocaleString()}
              </Tag>
            </div>
            <Divider />

            <div style={{ marginBottom: '16px' }}>
              <strong>재고:</strong>
              <Tag
                color={drawerProduct.stock < 20 ? 'red' : 'green'}
                style={{ marginLeft: '8px' }}
              >
                {drawerProduct.stock}개
              </Tag>
            </div>
            <Divider />

            <div style={{ marginBottom: '16px' }}>
              <strong>카테고리:</strong>
              <Tag style={{ marginLeft: '8px' }}>{drawerProduct.category}</Tag>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}

export default withRouter(ProductListServerDemo);
