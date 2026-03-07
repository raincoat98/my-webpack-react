import React, { useState } from 'react';
import { Steps, Button, Card, message } from 'antd';
import Step1AccountSelection from '@/components/ResourceTransfer/Step1AccountSelection';
import Step2TransferAccount from '@/components/ResourceTransfer/Step2TransferAccount';
import Step3Confirm from '@/components/ResourceTransfer/Step3Confirm';
import Step4Complete from '@/components/ResourceTransfer/Step3Complete';
import { TARGET_ACCOUNTS } from '@/components/ResourceTransfer/mockData';

const { Step } = Steps;

function ResourceTransfer() {
  const [current, setCurrent] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [targetAccountId, setTargetAccountId] = useState(null);

  const handleNext = () => {
    if (current === 0) {
      if (!targetAccountId) {
        message.warning('이관받을 계정을 선택하세요.');
        return;
      }
      setCurrent(1);
    } else if (current === 1) {
      if (selectedRowKeys.length === 0) {
        message.warning('이관할 자원을 1개 이상 선택하세요.');
        return;
      }

      const target = TARGET_ACCOUNTS.find(a => a.id === targetAccountId);
      const totalCpu = selectedRows.reduce((s, r) => s + r.cpu, 0);
      const totalGpu = selectedRows.reduce((s, r) => s + r.gpu, 0);
      const totalMemory = selectedRows.reduce((s, r) => s + r.memory, 0);

      if (
        totalCpu > target.totalCpu - target.usedCpu ||
        totalGpu > target.totalGpu - target.usedGpu ||
        totalMemory > target.totalMemory - target.usedMemory
      ) {
        message.error('대상 계정의 가용 자원이 부족합니다. 이관할 자원을 줄여주세요.');
        return;
      }

      setCurrent(2);
    } else if (current === 2) {
      message.success('이관이 완료되었습니다!');
      setCurrent(3);
    }
  };

  const handlePrev = () => {
    setCurrent(current - 1);
  };

  const handleReset = () => {
    setCurrent(0);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setTargetAccountId(null);
  };

  const handleSelectionChange = (keys, rows) => {
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
  };

  const nextButtonLabel = () => {
    if (current === 2) return '이관 실행';
    return '다음';
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Card
        title={<span style={{ fontSize: 16, fontWeight: 700 }}>자원 이관</span>}
        style={{ borderRadius: 10 }}
      >
        {/* Stepper */}
        <Steps current={current} status={current === 3 ? 'finish' : 'process'} style={{ marginBottom: 32 }}>
          <Step title="계정 선택" description="이관받을 계정 지정" />
          <Step title="자원 선택" description="이관할 자원 선택" />
          <Step title="자원 확인" description="이관 내용 최종 확인" />
          <Step title="이관 완료" description="처리 결과 확인" />
        </Steps>

        {/* Step Content */}
        <div style={{ minHeight: 400 }}>
          {current === 0 && (
            <Step1AccountSelection
              targetAccountId={targetAccountId}
              onTargetChange={id => setTargetAccountId(id)}
            />
          )}

          {current === 1 && (
            <Step2TransferAccount
              selectedRowKeys={selectedRowKeys}
              onSelectionChange={handleSelectionChange}
              targetAccountId={targetAccountId}
            />
          )}

          {current === 2 && (
            <Step3Confirm
              selectedRows={selectedRows}
              targetAccountId={targetAccountId}
            />
          )}

          {current === 3 && (
            <Step4Complete
              selectedRows={selectedRows}
              targetAccountId={targetAccountId}
              onReset={handleReset}
            />
          )}
        </div>

        {/* 버튼 */}
        {current < 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 32 }}>
            <Button onClick={handlePrev} disabled={current === 0} icon="left">
              이전
            </Button>
            <Button
              type="primary"
              onClick={handleNext}
              icon={current === 2 ? 'check' : 'right'}
            >
              {nextButtonLabel()}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default ResourceTransfer;
