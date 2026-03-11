import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';

const { Option } = Select;

const CATEGORIES = ['카테고리 1', '카테고리 2', '카테고리 3'];

function Step1ProductSelection({ formData, errors, onFieldChange }) {
  return (
    <div>
      <h3>상품 정보 입력</h3>
      <Form layout="vertical" style={{ marginBottom: '20px' }}>
        <Form.Item
          label="상품명"
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name}
        >
          <Input
            placeholder="상품명을 입력하세요"
            value={formData.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="가격"
          validateStatus={errors.price ? 'error' : ''}
          help={errors.price}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            placeholder="가격을 입력하세요"
            value={formData.price}
            formatter={(v) => v ? `₩${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
            parser={(v) => v.replace(/₩|,/g, '')}
            onChange={(value) => onFieldChange('price', value)}
          />
        </Form.Item>

        <Form.Item
          label="재고"
          validateStatus={errors.stock ? 'error' : ''}
          help={errors.stock}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            placeholder="재고 수량을 입력하세요"
            value={formData.stock}
            onChange={(value) => onFieldChange('stock', value)}
          />
        </Form.Item>

        <Form.Item label="카테고리">
          <Select
            placeholder="카테고리를 선택하세요"
            value={formData.category}
            onChange={(value) => onFieldChange('category', value)}
          >
            {CATEGORIES.map((c) => (
              <Option key={c} value={c}>{c}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="설명">
          <Input
            placeholder="상품 설명을 입력하세요"
            value={formData.description}
            onChange={(e) => onFieldChange('description', e.target.value)}
          />
        </Form.Item>
      </Form>
    </div>
  );
}

export default Step1ProductSelection;
