import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Steps, Button, Card, message } from 'antd';
import Step1ProductSelection from '@/components/Stepper/Step1ProductSelection';
import Step2AccountInfo from '@/components/Stepper/Step2AccountInfo';
import Step3Completion from '@/components/Stepper/Step3Completion';
import { validateStep1 } from '@/components/Stepper/validators';

const { Step } = Steps;
const API_BASE = 'http://localhost:3001/api';

function Stepper({ history }) {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    price: null,
    stock: null,
    category: undefined,
    description: '',
  });
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    if (current === 0) {
      const newErrors = validateStep1(formData);
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setCurrent(1);
      setErrors({});
    } else if (current === 1) {
      fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          price: formData.price,
          stock: formData.stock,
          category: formData.category || '',
          description: formData.description || '',
        }),
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            message.success('상품이 등록되었습니다!');
            setCurrent(2);
          } else {
            message.error(result.message || '등록 실패');
          }
        })
        .catch(() => message.error('서버 오류가 발생했습니다.'));
    } else if (current === 2) {
      history.push('/products-server');
    }
  };

  const handlePrev = () => {
    setCurrent(current - 1);
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Card title="상품 등록" style={{ marginBottom: '30px' }}>
        <Steps current={current} style={{ marginBottom: '30px' }}>
          <Step title="상품 정보" description="상품 정보 입력" />
          <Step title="확인" description="내용 검토" />
          <Step title="완료" description="등록 완료" />
        </Steps>

        {current === 0 && (
          <Step1ProductSelection
            formData={formData}
            errors={errors}
            onFieldChange={handleChange}
          />
        )}

        {current === 1 && (
          <Step2AccountInfo formData={formData} />
        )}

        {current === 2 && <Step3Completion />}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
          <Button onClick={handlePrev} disabled={current === 0}>
            이전
          </Button>
          <Button
            type="primary"
            onClick={handleNext}
            icon={current === 1 ? 'check' : 'arrow-right'}
          >
            {current === 1 ? '등록' : '다음'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default withRouter(Stepper);
