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
import { Card, Button, Modal, Descriptions, Tag, Switch, message, Typography } from 'antd';
import { withRouter } from 'react-router-dom';
import ProductListServer from '@/components/Product/ProductListServer';
import ServerProductDetailDrawer from '@/components/Product/ServerProductDetailDrawer';
import { useProductServerStore } from '@/stores/productServerStore';

function ProductServerApp({ location, history }) {
  const refresh = useProductServerStore((state) => state.refresh);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerProduct, setDrawerProduct] = useState(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionProduct, setActionProduct] = useState(null);

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

  const handleOpenActionModal = (product) => {
    setActionProduct({ ...product });
    setActionModalVisible(true);
  };

  const handleCloseActionModal = () => {
    setActionModalVisible(false);
    setTimeout(() => setActionProduct(null), 300);
  };

  const handleStatusToggle = (checked) => {
    const nextLabel = checked ? '활성' : '비활성';
    Modal.confirm({
      title: '상태 변경',
      content: (
        <Typography.Text>
          <strong>{actionProduct.name}</strong> 상품을{' '}
          <Typography.Text type={checked ? 'success' : 'secondary'}>
            {nextLabel}
          </Typography.Text>
          으로 변경하시겠습니까?
        </Typography.Text>
      ),
      okText: '변경',
      cancelText: '취소',
      onOk: () => {
        fetch(`http://localhost:3001/api/products/${actionProduct.id}/status`, {
          method: 'PATCH',
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.success) {
              message.success(`상태가 ${result.data.active ? '활성' : '비활성'}으로 변경되었습니다.`);
              setActionProduct(result.data);
              refresh();
            } else {
              message.error('상태 변경에 실패했습니다.');
            }
          })
          .catch(() => message.error('서버 오류가 발생했습니다.'));
      },
    });
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

      <Card
        extra={
          <Button icon="reload" onClick={refresh}>
            새로고침
          </Button>
        }
      >
        <ProductListServer
          onOpenDrawer={handleOpenDrawer}
          onOpenAction={handleOpenActionModal}
        />
      </Card>

      {/* 상품 상세 정보 Drawer */}
      <ServerProductDetailDrawer
        product={drawerProduct}
        visible={drawerVisible}
        onClose={handleCloseDrawer}
      />

      {/* 액션 팝업 Modal */}
      <Modal
        title={actionProduct ? `상태 변경: ${actionProduct.name}` : '상태 변경'}
        visible={actionModalVisible}
        onCancel={handleCloseActionModal}
        footer={[
          <Button key="cancel" onClick={handleCloseActionModal}>
            닫기
          </Button>,
        ]}
      >
        {actionProduct && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="상품명">{actionProduct.name}</Descriptions.Item>
            <Descriptions.Item label="카테고리">
              <Tag color="blue">{actionProduct.category}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="가격">₩{actionProduct.price?.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="재고">
              <Tag color={actionProduct.stock < 20 ? 'red' : 'green'}>
                {actionProduct.stock}개
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="현재 상태">
              <Switch
                checked={actionProduct.active ?? true}
                onChange={handleStatusToggle}
                checkedChildren="활성"
                unCheckedChildren="비활성"
              />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default withRouter(ProductServerApp);
