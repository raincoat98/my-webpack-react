import React from 'react';
import { Button, Icon, Tag } from 'antd';
import { PROJECTS, TYPE_COLORS } from './mockData';

const ENV_LABELS = {
  dev: { label: '개발', color: '#13c2c2' },
  staging: { label: '스테이징', color: '#fa8c16' },
  prod: { label: '운영', color: '#f5222d' },
};

function Step4Complete({ selectedRows, formData, onReset }) {
  const project = PROJECTS.find(p => p.id === formData.projectId);
  const env = ENV_LABELS[formData.environment] || { label: formData.environment, color: '#999' };

  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <div style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }}>
        <Icon type="check-circle" theme="filled" />
      </div>

      <div style={{ fontSize: 22, fontWeight: 700, color: '#333', marginBottom: 8 }}>
        등록이 완료되었습니다!
      </div>
      <div style={{ fontSize: 14, color: '#888', marginBottom: 32 }}>
        선택한 서버가 프로젝트에 성공적으로 등록되었습니다.
      </div>

      <div
        style={{
          display: 'inline-block',
          textAlign: 'left',
          background: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: 10,
          padding: '20px 32px',
          marginBottom: 32,
          minWidth: 360,
        }}
      >
        <div style={{ fontWeight: 600, color: '#52c41a', marginBottom: 14, fontSize: 14 }}>
          <Icon type="check" style={{ marginRight: 6 }} />
          등록 요약
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SummaryRow label="프로젝트" value={project ? project.name : '—'} />
          <SummaryRow
            label="배포 환경"
            value={<Tag color={env.color}>{env.label}</Tag>}
          />
          <SummaryRow label="등록 서버 수" value={`${selectedRows.length}개`} />
          <div style={{ marginTop: 8 }}>
            <span style={{ color: '#888', fontSize: 13 }}>등록된 서버</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {selectedRows.map(r => (
                <Tag key={r.id} color={TYPE_COLORS[r.type] || '#999'} style={{ fontSize: 12 }}>
                  {r.name}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <Button type="primary" size="large" icon="redo" onClick={onReset}>
          새로 등록하기
        </Button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 90, color: '#888', fontSize: 13, flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 13 }}>{value}</span>
    </div>
  );
}

export default Step4Complete;
