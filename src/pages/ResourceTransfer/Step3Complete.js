import React from 'react';
import { Icon, Tag, Divider, Button } from 'antd';
import { SOURCE_ACCOUNT, TARGET_ACCOUNTS } from './mockData';

function Step3Complete({ selectedRows, targetAccountId, onReset }) {
  const targetAccount = TARGET_ACCOUNTS.find(a => a.id === targetAccountId);

  const totalCpu = selectedRows.reduce((s, r) => s + r.cpu, 0);
  const totalGpu = selectedRows.reduce((s, r) => s + r.gpu, 0);
  const totalMemory = selectedRows.reduce((s, r) => s + r.memory, 0);

  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      {/* 성공 아이콘 */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #52c41a, #73d13d)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 4px 16px rgba(82,196,26,0.35)',
        }}
      >
        <Icon type="check" style={{ fontSize: 36, color: 'white' }} />
      </div>

      <h2 style={{ color: '#52c41a', marginBottom: 4 }}>이관 완료!</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        자원이 성공적으로 이관되었습니다.
      </p>

      {/* 이관 요약 카드 */}
      <div
        style={{
          maxWidth: 500,
          margin: '0 auto',
          background: '#fafafa',
          border: '1px solid #e8e8e8',
          borderRadius: 10,
          padding: '20px 24px',
          textAlign: 'left',
        }}
      >
        {/* 계정 이동 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 20,
            flexWrap: 'wrap',
          }}
        >
          <AccountBadge name={SOURCE_ACCOUNT.name} color="#1890ff" icon="export" />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fa8c16' }}>
            <Icon type="right" style={{ fontSize: 20 }} />
          </div>
          <AccountBadge name={targetAccount ? targetAccount.name : '—'} color="#fa8c16" icon="import" />
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* 이관된 자원 수치 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 10, color: '#333' }}>이관된 자원량</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <ResourceStat label="CPU" value={totalCpu} unit="core" color="#1890ff" />
            <ResourceStat label="GPU" value={totalGpu} unit="core" color="#722ed1" />
            <ResourceStat label="Memory" value={totalMemory} unit="GB" color="#13c2c2" />
          </div>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* 이관된 자원 목록 */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#333' }}>
            이관된 자원 목록 ({selectedRows.length}개)
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
                  <code style={{ fontSize: 11, background: '#f5f5f5', padding: '1px 5px', borderRadius: 3, marginRight: 8 }}>
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

      {/* 다시 시작 버튼 */}
      <Button
        style={{ marginTop: 24 }}
        icon="reload"
        onClick={onReset}
      >
        새 이관 시작
      </Button>
    </div>
  );
}

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

export default Step3Complete;
