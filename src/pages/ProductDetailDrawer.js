import React from 'react';
import { Drawer, Divider, Tag } from 'antd';

function ProductDetailDrawer({ product, visible, onClose }) {
  if (!product) return null;

  return (
    <Drawer
      title={`상품 상세 정보 - ${product.name}`}
      placement="right"
      onClose={onClose}
      visible={visible}
      width={400}
    >
      <div>
        <p><strong>상품 ID:</strong> {product.id}</p>
        <Divider />
        <p><strong>상품명:</strong> {product.name}</p>
        <Divider />
        <p><strong>설명:</strong> {product.description}</p>
        <Divider />
        <p><strong>가격:</strong> <Tag color="blue">₩{product.price.toLocaleString()}</Tag></p>
        <Divider />
        <p><strong>재고:</strong> <Tag color={product.stock < 20 ? 'red' : 'green'}>{product.stock}개</Tag></p>
        <Divider />
        <p><strong>카테고리:</strong> <Tag>{product.category}</Tag></p>
      </div>
    </Drawer>
  );
}

export default ProductDetailDrawer;
