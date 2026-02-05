import React from 'react';
import { Form, Select, InputNumber } from 'antd';

const { Option } = Select;

const PRODUCTS = [
  { id: 1, name: 'Product A', price: 10000 },
  { id: 2, name: 'Product B', price: 20000 },
  { id: 3, name: 'Product C', price: 30000 },
];

function Step1ProductSelection({ formData, errors, onFieldChange }) {
  const selectedProduct = PRODUCTS.find(p => p.id === formData.product);

  return (
    <div>
      <h3>상품 선택</h3>
      <Form layout="vertical" style={{ marginBottom: '20px' }}>
        <Form.Item
          label="상품 선택"
          validateStatus={errors.product ? 'error' : ''}
          help={errors.product}
        >
          <Select
            placeholder="상품을 선택하세요"
            value={formData.product}
            onChange={(value) => onFieldChange('product', value)}
          >
            {PRODUCTS.map(product => (
              <Option key={product.id} value={product.id}>
                {product.name} - ₩{product.price.toLocaleString()}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="수량"
          validateStatus={errors.quantity ? 'error' : ''}
          help={errors.quantity}
        >
          <InputNumber
            min={1}
            value={formData.quantity}
            onChange={(value) => onFieldChange('quantity', value)}
            style={{ width: '100%' }}
          />
        </Form.Item>

        {selectedProduct && (
          <div style={{
            background: '#f0f2f5',
            padding: '15px',
            borderRadius: '4px',
            marginTop: '15px'
          }}>
            <p><strong>선택된 상품:</strong> {selectedProduct.name}</p>
            <p><strong>수량:</strong> {formData.quantity}</p>
            <p><strong>총액:</strong> ₩{(selectedProduct.price * formData.quantity).toLocaleString()}</p>
          </div>
        )}
      </Form>
    </div>
  );
}

export default Step1ProductSelection;
