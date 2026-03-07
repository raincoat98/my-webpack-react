import React from 'react';
import { Alert, Tag, Divider, Icon } from 'antd';
import { PROJECTS, TYPE_COLORS } from './mockData';

const ENV_LABELS = {
  dev: { label: '개발', color: '#13c2c2' },
  staging: { label: '스테이징', color: '#fa8c16' },
  prod: { label: '운영', color: '#f5222d' },
};

function Step3Confirm({ selectedRows, formData }) {
  const project = PROJECTS.find(p => p.id === formData.projectId);
  const env = ENV_LABELS[formData.environment] || { label: formData.environment, color: '#999' };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '8px 0' }}>
      <Alert
        message="등록 내용을 최종 확인하세요"
        description="아래 내용이 맞으면 '등록 실행' 버튼을 눌러 등록을 진행합니다."
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <div
        style={{
          background: '#fafafa',
          border: '1px solid #e8e8e8',
          borderRadius: 10,
          padding: '20px 24px',
        }}
      >
        {/* 등록 정보 */}
        <div style={{ fontWeight: 600, marginBottom: 14, color: '#333' }}>
          <Icon type="info-circle" style={{ marginRight: 6, color: '#1890ff' }} />
          등록 정보
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <InfoRow label="프로젝트" value={project ? project.name : '—'} />
          <InfoRow
            label="배포 환경"
            value={
              <Tag color={env.color} style={{ fontSize: 12 }}>
                {env.label}
              </Tag>
            }
          />
          <InfoRow
            label="사용 만료일"
            value={formData.expiryDate ? formData.expiryDate.format('YYYY-MM-DD') : '미설정'}
          />
          {formData.memo && <InfoRow label="메모" value={formData.memo} />}
        </div>

        <Divider style={{ margin: '4px 0 16px' }} />

        {/* 등록 서버 목록 */}
        <div style={{ fontWeight: 600, marginBottom: 12, color: '#333' }}>
          <Icon type="server" style={{ marginRight: 6, color: '#1890ff' }} />
          등록될 서버 목록 ({selectedRows.length}개)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {selectedRows.map(r => (
            <div
              key={r.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'white',
                border: '1px solid #e8e8e8',
                borderRadius: 6,
                padding: '8px 14px',
                flexWrap: 'wrap',
                gap: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <code style={{ fontSize: 11, background: '#f5f5f5', padding: '1px 5px', borderRadius: 3 }}>
                  {r.id}
                </code>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</span>
                <Tag color={TYPE_COLORS[r.type] || '#999'} style={{ fontSize: 11 }}>
                  {r.type}
                </Tag>
              </div>
              <div style={{ display: 'flex', gap: 6, color: '#888', fontSize: 12 }}>
                <span>{r.ip}</span>
                <span>·</span>
                <span>{r.os}</span>
                <span>·</span>
                <span>{r.region}</span>
                <span>·</span>
                <span>CPU {r.cpu}C / {r.memory}GB / {r.storage}GB</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 90, color: '#888', fontSize: 13, flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 500, fontSize: 13 }}>{value}</span>
    </div>
  );
}

export default Step3Confirm;
