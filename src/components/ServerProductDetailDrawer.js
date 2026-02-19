import React from 'react';
import { Drawer, Divider, Tag } from 'antd';

/**
 * 서버 사이드 렌더링용 상품 상세 정보 Drawer
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.product - 상품 데이터
 * @param {boolean} props.visible - Drawer 표시 여부
 * @param {Function} props.onClose - Drawer 닫기 핸들러
 */
function ServerProductDetailDrawer({ product, visible, onClose }) {
  if (!product) {
    return null;
  }

  return (
    <Drawer
      title={`상품 상세 정보 - ${product.name}`}
      placement="right"
      onClose={onClose}
      visible={visible}
      width={400}
    >
      <div>
        <div style={{ marginBottom: '16px' }}>
          <strong>상품 ID:</strong>
          <Tag style={{ marginLeft: '8px' }}>{product.id}</Tag>
        </div>
        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <strong>상품명:</strong>
          <Tag style={{ marginLeft: '8px' }}>{product.name}</Tag>
        </div>
        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <strong>설명:</strong>
          <p style={{ marginLeft: '0px', marginTop: '8px' }}>{product.description}</p>
        </div>
        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <strong>가격:</strong>
          <Tag color="blue" style={{ marginLeft: '8px' }}>
            ₩{product.price.toLocaleString()}
          </Tag>
        </div>
        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <strong>재고:</strong>
          <Tag
            color={product.stock < 20 ? 'red' : 'green'}
            style={{ marginLeft: '8px' }}
          >
            {product.stock}개
          </Tag>
        </div>
        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <strong>카테고리:</strong>
          <Tag style={{ marginLeft: '8px' }}>{product.category}</Tag>
        </div>
      </div>
    </Drawer>
  );
}

export default ServerProductDetailDrawer;
