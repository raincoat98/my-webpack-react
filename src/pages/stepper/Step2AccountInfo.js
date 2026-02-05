import React from 'react';
import { Form, Input } from 'antd';

function Step2AccountInfo({ formData, errors, onFieldChange, selectedProduct }) {
  return (
    <div>
      <h3>계정 정보</h3>
      <Form layout="vertical" style={{ marginBottom: '20px' }}>
        <Form.Item
          label="이름"
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name}
        >
          <Input
            placeholder="이름을 입력하세요"
            value={formData.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="이메일"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email}
        >
          <Input
            type="email"
            placeholder="이메일을 입력하세요"
            value={formData.email}
            onChange={(e) => onFieldChange('email', e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="휴대폰"
          validateStatus={errors.phone ? 'error' : ''}
          help={errors.phone}
        >
          <Input
            placeholder="휴대폰 번호를 입력하세요 (숫자만)"
            value={formData.phone}
            onChange={(e) => onFieldChange('phone', e.target.value.replace(/\D/g, ''))}
          />
        </Form.Item>

        {selectedProduct && (
          <div style={{
            background: '#f0f2f5',
            padding: '15px',
            borderRadius: '4px',
            marginTop: '15px'
          }}>
            <p><strong>주문 요약:</strong></p>
            <p>상품: {selectedProduct.name}</p>
            <p>수량: {formData.quantity}</p>
            <p>총액: ₩{(selectedProduct.price * formData.quantity).toLocaleString()}</p>
          </div>
        )}
      </Form>
    </div>
  );
}

export default Step2AccountInfo;
