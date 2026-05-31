import React, { useState } from 'react';
import { Drawer, Tabs, Divider, Tag, Table, Timeline, Spin, Alert, Card, Typography } from 'antd';
import { useProductDetail, useProductHistory, useProductMemo } from '@/hooks/useProductQueries';

const { TabPane } = Tabs;
const { Text } = Typography;

function BasicInfoTab({ product }) {
  return (
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
        <p style={{ marginTop: '8px' }}>{product.description}</p>
      </div>
      <Divider />
      <div style={{ marginBottom: '16px' }}>
        <strong>가격:</strong>
        <Tag color="blue" style={{ marginLeft: '8px' }}>₩{product.price.toLocaleString()}</Tag>
      </div>
      <Divider />
      <div style={{ marginBottom: '16px' }}>
        <strong>재고:</strong>
        <Tag color={product.stock < 20 ? 'red' : 'green'} style={{ marginLeft: '8px' }}>
          {product.stock}개
        </Tag>
      </div>
      <Divider />
      <div style={{ marginBottom: '16px' }}>
        <strong>카테고리:</strong>
        <Tag style={{ marginLeft: '8px' }}>{product.category}</Tag>
      </div>
    </div>
  );
}

function HistoryTab({ productId }) {
  const { data, isLoading, isError } = useProductHistory(productId);

  if (isLoading) return <Spin style={{ display: 'block', marginTop: '40px', textAlign: 'center' }} />;
  if (isError) return <Alert type="error" message="이력을 불러오지 못했습니다." />;

  const columns = [
    { title: '날짜', dataIndex: 'date', key: 'date', width: 100 },
    { title: '유형', dataIndex: 'type', key: 'type', width: 90,
      render: (t) => <Tag color="processing">{t}</Tag> },
    { title: '변경 전', dataIndex: 'before', key: 'before' },
    { title: '변경 후', dataIndex: 'after', key: 'after' },
    { title: '담당자', dataIndex: 'user', key: 'user', width: 80 },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="id"
      size="small"
      pagination={false}
    />
  );
}

function MemoTab({ productId }) {
  const { data, isLoading, isError } = useProductMemo(productId);

  if (isLoading) return <Spin style={{ display: 'block', marginTop: '40px', textAlign: 'center' }} />;
  if (isError) return <Alert type="error" message="메모를 불러오지 못했습니다." />;

  return (
    <Timeline>
      {data.map((memo) => (
        <Timeline.Item key={memo.id}>
          <Card size="small" style={{ marginBottom: '4px' }}>
            <p style={{ margin: 0 }}>{memo.content}</p>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {memo.createdAt} · {memo.author}
            </Text>
          </Card>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}

function ProductDetailDrawer({ productId, product: propProduct, visible, onClose }) {
  const [activeTab, setActiveTab] = useState('basic');

  const { data: queriedProduct } = useProductDetail(productId, {
    enabled: !!productId && !propProduct,
    initialData: propProduct,
  });

  const product = queriedProduct || propProduct;

  return (
    <Drawer
      title={product ? `상품 상세 정보 - ${product.name}` : '상품 상세 정보'}
      placement="right"
      onClose={onClose}
      visible={visible}
      width={480}
    >
      {product && (
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="기본정보" key="basic">
            <BasicInfoTab product={product} />
          </TabPane>
          <TabPane tab="이력" key="history">
            <HistoryTab productId={product.id} />
          </TabPane>
          <TabPane tab="메모" key="memo">
            <MemoTab productId={product.id} />
          </TabPane>
        </Tabs>
      )}
    </Drawer>
  );
}

export default ProductDetailDrawer;
