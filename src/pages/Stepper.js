import React, { useState } from 'react';
import { Steps, Button, Card, message } from 'antd';
import Step1ProductSelection from './stepper/Step1ProductSelection';
import Step2AccountInfo from './stepper/Step2AccountInfo';
import Step3Completion from './stepper/Step3Completion';
import { validateStep1, validateStep2 } from './stepper/validators';

const { Step } = Steps;

// 샘플 상품 데이터
const PRODUCTS = [
  { id: 1, name: 'Product A', price: 10000 },
  { id: 2, name: 'Product B', price: 20000 },
  { id: 3, name: 'Product C', price: 30000 },
];

function Stepper() {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    product: null,
    quantity: 1,
    name: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});

  const handleNext = () => {
    if (current === 0) {
      const newErrors = validateStep1(formData);
      if (Object.keys(newErrors).length === 0) {
        setCurrent(current + 1);
        setErrors({});
      } else {
        setErrors(newErrors);
      }
    } else if (current === 1) {
      const newErrors = validateStep2(formData);
      if (Object.keys(newErrors).length === 0) {
        message.success('모든 정보가 확인되었습니다!');
        console.log('최종 데이터:', formData);
        setCurrent(current + 1);
        setErrors({});
      } else {
        setErrors(newErrors);
      }
    }
  };

  const handlePrev = () => {
    setCurrent(current - 1);
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  };

  const selectedProduct = PRODUCTS.find(p => p.id === formData.product);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Card title="주문 프로세스" style={{ marginBottom: '30px' }}>
        <Steps current={current} style={{ marginBottom: '30px' }}>
          <Step title="상품 선택" description="상품 및 수량 선택" />
          <Step title="계정 정보" description="개인 정보 입력" />
          <Step title="완료" description="주문 완료" />
        </Steps>

        {/* Step 1: 상품 선택 및 수량 */}
        {current === 0 && (
          <Step1ProductSelection
            formData={formData}
            errors={errors}
            onFieldChange={handleChange}
          />
        )}

        {/* Step 2: 계정 정보 */}
        {current === 1 && (
          <Step2AccountInfo
            formData={formData}
            errors={errors}
            onFieldChange={handleChange}
            selectedProduct={selectedProduct}
          />
        )}

        {/* Step 3: 완료 */}
        {current === 2 && <Step3Completion />}

        {/* 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
          <Button
            onClick={handlePrev}
            disabled={current === 0}
          >
            이전
          </Button>
          <Button
            type="primary"
            onClick={handleNext}
            icon={current === 1 ? 'check' : 'arrow-right'}
          >
            {current === 1 ? '완료' : '다음'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Stepper;
