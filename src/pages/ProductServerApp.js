/**
 * 서버 사이드 렌더링 상품 목록 페이지
 *
 * 특징:
 * - 서버에서 초기 데이터를 받아 렌더링
 * - 클라이언트에서 하이드레이션하여 인터랙티브 기능 추가
 * - 초기 로딩 시간 단축 및 SEO 최적화
 * - URL 쿼리 파라미터로 상태 관리
 */

import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { withRouter } from 'react-router-dom';
import ProductListServer from '@/components/ProductListServer';
import ServerProductDetailDrawer from '@/components/ServerProductDetailDrawer';

function ProductServerApp({ location, history }) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerProduct, setDrawerProduct] = useState(null);

  // URL 쿼리 파라미터에서 drawer 상태 초기화
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = parseInt(params.get('id'));
    const detail = params.get('detail') === 'true';

    if (detail && productId) {
      setDrawerVisible(true);
      // 서버 사이드 페이지네이션이므로 전체 데이터 없음
      // API를 통해 상품 정보 로드
      fetch(`http://localhost:3001/api/products/${productId}`)
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            setDrawerProduct(result.data);
          }
        })
        .catch(err => console.error('상품 정보 로드 실패:', err));
    }
  }, [location.search]);

  const handleOpenDrawer = (product) => {
    console.log('ProductServerApp drawer opened:', product);
    setDrawerProduct(product);
    setDrawerVisible(true);

    // URL 업데이트
    const params = new URLSearchParams();
    params.set('id', product.id);
    params.set('detail', 'true');
    history.push(`${location.pathname}?${params.toString()}`);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setTimeout(() => setDrawerProduct(null), 300); // 드로어 닫기 애니메이션 후 상태 초기화

    // URL에서 쿼리 파라미터 제거
    history.push(location.pathname);
  };

  return (
    <div>
      <Card
        title="상품 목록 (서버 사이드 페이지네이션)"
        style={{ marginBottom: '20px' }}
      >
        <p>
          ag-grid의 Server-Side Row Model을 사용합니다.
          페이지를 변경할 때마다 서버에서 데이터를 요청하므로 초기 데이터 로딩이 빠릅니다.
        </p>
        <p style={{ fontSize: '12px', color: '#999' }}>
          💡 Tip: 페이지 변경 시 Network 탭에서 /api/products 요청을 확인할 수 있습니다.
          startRow와 endRow 파라미터로 서버가 정확한 페이지 데이터를 반환합니다.
        </p>
      </Card>

      <Card>
        <ProductListServer
          onOpenDrawer={handleOpenDrawer}
        />
      </Card>

      {/* 상품 상세 정보 Drawer */}
      <ServerProductDetailDrawer
        product={drawerProduct}
        visible={drawerVisible}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}

export default withRouter(ProductServerApp);
