import React, { useState } from 'react';
import { Steps, Button, Card, message } from 'antd';
import Step1SelectServers from '@/components/ServiceRegistration/Step1SelectServers';
import Step2RegistrationForm from '@/components/ServiceRegistration/Step2RegistrationForm';
import Step3Confirm from '@/components/ServiceRegistration/Step3Confirm';
import Step4Complete from '@/components/ServiceRegistration/Step4Complete';

const { Step } = Steps;

function ServiceRegistration() {
  const [current, setCurrent] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    projectId: null,
    environment: null,
    expiryDate: null,
    memo: '',
  });

  const handleNext = () => {
    if (current === 0) {
      if (selectedRows.length === 0) {
        message.warning('등록할 서버를 1개 이상 선택하세요.');
        return;
      }
      setCurrent(1);
    } else if (current === 1) {
      if (!formData.projectId) {
        message.warning('프로젝트를 선택하세요.');
        return;
      }
      if (!formData.environment) {
        message.warning('배포 환경을 선택하세요.');
        return;
      }
      setCurrent(2);
    } else if (current === 2) {
      message.success('서버 등록이 완료되었습니다!');
      setCurrent(3);
    }
  };

  const handlePrev = () => {
    setCurrent(current - 1);
  };

  const handleReset = () => {
    setCurrent(0);
    setSelectedRows([]);
    setFormData({ projectId: null, environment: null, expiryDate: null, memo: '' });
  };

  const nextLabel = current === 2 ? '등록 실행' : '다음';
  const nextIcon = current === 2 ? 'check' : 'right';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Card
        title={<span style={{ fontSize: 16, fontWeight: 700 }}>서버 등록</span>}
        style={{ borderRadius: 10 }}
      >
        <Steps current={current} style={{ marginBottom: 32 }}>
          <Step title="서버 선택" description="AG Grid에서 다중 선택" />
          <Step title="등록 정보 입력" description="프로젝트 · 환경 설정" />
          <Step title="최종 확인" description="등록 내용 검토" />
          <Step title="등록 완료" description="처리 결과 확인" />
        </Steps>

        <div style={{ minHeight: 420 }}>
          {current === 0 && (
            <Step1SelectServers
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
            />
          )}
          {current === 1 && (
            <Step2RegistrationForm
              selectedRows={selectedRows}
              formData={formData}
              onFormChange={setFormData}
            />
          )}
          {current === 2 && (
            <Step3Confirm
              selectedRows={selectedRows}
              formData={formData}
            />
          )}
          {current === 3 && (
            <Step4Complete
              selectedRows={selectedRows}
              formData={formData}
              onReset={handleReset}
            />
          )}
        </div>

        {current < 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 32 }}>
            <Button onClick={handlePrev} disabled={current === 0} icon="left">
              이전
            </Button>
            <Button type="primary" onClick={handleNext} icon={nextIcon}>
              {nextLabel}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default ServiceRegistration;
