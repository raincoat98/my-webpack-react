import React from 'react';
import { Icon, Tag, Divider, Alert } from 'antd';
import { SOURCE_ACCOUNT, TARGET_ACCOUNTS } from './mockData';

const RESOURCE_META = [
  { key: 'cpu',    label: 'CPU',    unit: 'core', color: '#1890ff' },
  { key: 'gpu',    label: 'GPU',    unit: 'core', color: '#722ed1' },
  { key: 'memory', label: 'Memory', unit: 'GB',   color: '#13c2c2' },
];

function AccountBadge({ name, color, icon }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        border: `1.5px solid ${color}`,
        borderRadius: 20,
        background: `${color}10`,
      }}
    >
      <Icon type={icon} style={{ color }} />
      <span style={{ fontWeight: 600, color, fontSize: 14 }}>{name}</span>
    </div>
  );
}

function ResourceStat({ label, value, unit, color }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '10px 20px',
        background: `${color}10`,
        border: `1.5px solid ${color}40`,
        borderRadius: 8,
        minWidth: 90,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 11, color: '#888' }}>
        {unit} {label}
      </div>
    </div>
  );
}

function Step3Confirm({ selectedRows, targetAccountId }) {
  const targetAccount = TARGET_ACCOUNTS.find(a => a.id === targetAccountId);

  const totals = {
    cpu:    selectedRows.reduce((s, r) => s + r.cpu, 0),
    gpu:    selectedRows.reduce((s, r) => s + r.gpu, 0),
    memory: selectedRows.reduce((s, r) => s + r.memory, 0),
  };

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '8px 0' }}>
      {/* 안내 메시지 */}
      <Alert
        message="이관 내용을 최종 확인하세요"
        description="아래 내용이 맞으면 '이관 실행' 버튼을 눌러 이관을 진행합니다."
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 계정 이동 방향 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        <AccountBadge name={SOURCE_ACCOUNT.name} color="#1890ff" icon="export" />
        <div style={{ color: '#fa8c16', fontSize: 20 }}>
          <Icon type="right" />
        </div>
        <AccountBadge name={targetAccount ? targetAccount.name : '—'} color="#fa8c16" icon="import" />
      </div>

      <div
        style={{
          background: '#fafafa',
          border: '1px solid #e8e8e8',
          borderRadius: 10,
          padding: '20px 24px',
        }}
      >
        {/* 이관 자원 합계 */}
        <div style={{ fontWeight: 600, marginBottom: 12, color: '#333' }}>이관될 자원량</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          {RESOURCE_META.map(meta => (
            <ResourceStat
              key={meta.key}
              label={meta.label}
              value={totals[meta.key]}
              unit={meta.unit}
              color={meta.color}
            />
          ))}
        </div>

        <Divider style={{ margin: '4px 0 16px' }} />

        {/* 이관 자원 목록 */}
        <div style={{ fontWeight: 600, marginBottom: 10, color: '#333' }}>
          이관될 자원 목록 ({selectedRows.length}개)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
                padding: '6px 12px',
                flexWrap: 'wrap',
                gap: 6,
              }}
            >
              <div>
                <code
                  style={{
                    fontSize: 11,
                    background: '#f5f5f5',
                    padding: '1px 5px',
                    borderRadius: 3,
                    marginRight: 8,
                  }}
                >
                  {r.id}
                </code>
                <span style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Tag color="blue" style={{ fontSize: 11 }}>CPU {r.cpu}c</Tag>
                {r.gpu > 0 && <Tag color="purple" style={{ fontSize: 11 }}>GPU {r.gpu}c</Tag>}
                <Tag color="cyan" style={{ fontSize: 11 }}>MEM {r.memory}GB</Tag>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Step3Confirm;
