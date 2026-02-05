import React from 'react';
import { Icon } from 'antd';

function Step3Completion() {
  return (
    <div style={{ textAlign: 'center', padding: '30px' }}>
      <Icon type="check-circle" style={{ fontSize: '48px', color: '#52c41a', marginBottom: '20px' }} />
      <h2>주문이 완료되었습니다!</h2>
      <p>주문 정보가 확인 이메일로 발송되었습니다.</p>
    </div>
  );
}

export default Step3Completion;
