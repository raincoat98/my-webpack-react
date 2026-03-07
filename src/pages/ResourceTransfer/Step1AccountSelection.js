import React from 'react';
import { Select, Card, Row, Col, Icon, Divider, Tag } from 'antd';
import { SOURCE_ACCOUNT, TARGET_ACCOUNTS } from './mockData';

const { Option } = Select;

function AccountSummaryCard({ account, isSource }) {
  const color = isSource ? '#1890ff' : '#fa8c16';
  const bg = isSource ? '#f0f8ff' : '#fffbe6';
  const border = isSource ? '#91d5ff' : '#ffd591';

  const availCpu = account.totalCpu - account.usedCpu;
  const availGpu = account.totalGpu - account.usedGpu;
  const availMem = account.totalMemory - account.usedMemory;

  return (
    <Card
      size="small"
      style={{ border: `1.5px solid ${border}`, borderRadius: 8, background: bg }}
      headStyle={{ background: isSource ? '#e6f7ff' : '#fff7e6', borderBottom: `1px solid ${border}` }}
      title={
        <span>
          <Icon type={isSource ? 'export' : 'import'} style={{ marginRight: 6, color }} />
          <span style={{ fontWeight: 600 }}>{account.name}</span>
          <Tag color={isSource ? 'blue' : 'orange'} style={{ marginLeft: 8, fontSize: 11 }}>
            {isSource ? '이관 출처' : '이관 대상'}
          </Tag>
        </span>
      }
    >
      <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>ID: {account.id}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <StatRow label="CPU" total={account.totalCpu} used={account.usedCpu} avail={availCpu} unit="core" color="#1890ff" />
        <StatRow label="GPU" total={account.totalGpu} used={account.usedGpu} avail={availGpu} unit="core" color="#722ed1" />
        <StatRow label="Memory" total={account.totalMemory} used={account.usedMemory} avail={availMem} unit="GB" color="#13c2c2" />
      </div>
    </Card>
  );
}

function StatRow({ label, total, used, avail, unit, color }) {
  const pct = Math.round((used / total) * 100);
  return (
    <div style={{ flex: '1 1 140px', background: 'white', borderRadius: 6, padding: '8px 10px', border: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
        <span style={{ fontWeight: 600, color }}>{label}</span>
        <span style={{ color: '#888' }}>{used}/{total} {unit}</span>
      </div>
      <div style={{ background: '#f0f0f0', borderRadius: 3, height: 6, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <div style={{ fontSize: 11, color: '#52c41a', marginTop: 3 }}>여유 {avail}{unit}</div>
    </div>
  );
}

function Step1AccountSelection({ targetAccountId, onTargetChange }) {
  const targetAccount = TARGET_ACCOUNTS.find(a => a.id === targetAccountId);

  return (
    <div>
      <p style={{ color: '#666', marginBottom: 20 }}>
        자원을 이관받을 대상 계정을 선택하세요.
        다음 단계에서 자원을 선택하면 이관 가능 여부를 실시간으로 확인할 수 있습니다.
      </p>

      {/* 이관 출처 */}
      <AccountSummaryCard account={SOURCE_ACCOUNT} isSource={true} />

      {/* 화살표 */}
      <div style={{ textAlign: 'center', margin: '16px 0', color: '#fa8c16', fontSize: 20 }}>
        <Icon type="arrow-down" />
      </div>

      {/* 이관 대상 선택 */}
      <div
        style={{
          padding: '16px 18px',
          border: `1.5px dashed ${targetAccountId ? '#ffd591' : '#d9d9d9'}`,
          borderRadius: 8,
          background: targetAccountId ? '#fffbe6' : '#fafafa',
          transition: 'all 0.3s',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 14, color: '#333' }}>
          <Icon type="user-add" style={{ marginRight: 6, color: '#fa8c16' }} />
          이관받을 계정 선택
        </div>
        <Select
          style={{ width: '100%', maxWidth: 480 }}
          placeholder="이관 대상 계정을 선택하세요"
          value={targetAccountId || undefined}
          onChange={onTargetChange}
          size="large"
        >
          {TARGET_ACCOUNTS.map(acc => {
            const availCpu = acc.totalCpu - acc.usedCpu;
            const availGpu = acc.totalGpu - acc.usedGpu;
            const availMem = acc.totalMemory - acc.usedMemory;
            return (
              <Option key={acc.id} value={acc.id}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon type="team" style={{ color: '#fa8c16' }} />
                  <span style={{ fontWeight: 600 }}>{acc.name}</span>
                  <span style={{ color: '#bbb', fontSize: 11 }}>
                    여유 CPU {availCpu}c / GPU {availGpu}c / MEM {availMem}GB
                  </span>
                </span>
              </Option>
            );
          })}
        </Select>

        {targetAccount && (
          <div style={{ marginTop: 14 }}>
            <Divider style={{ margin: '0 0 12px' }} />
            <AccountSummaryCard account={targetAccount} isSource={false} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Step1AccountSelection;
