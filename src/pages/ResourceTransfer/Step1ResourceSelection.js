import React from 'react';
import { Table, Tag, Badge, Select, Icon, Divider } from 'antd';
import { RESOURCES, TARGET_ACCOUNTS } from './mockData';

const { Option } = Select;

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 110,
    render: id => (
      <code style={{ fontSize: 11, background: '#f5f5f5', padding: '2px 6px', borderRadius: 3, color: '#555' }}>
        {id}
      </code>
    ),
  },
  {
    title: '자원명',
    dataIndex: 'name',
    key: 'name',
    render: (name, record) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Badge status={record.status === 'running' ? 'processing' : 'default'} />
        <span style={{ fontWeight: 500 }}>{name}</span>
        <Tag style={{ marginLeft: 4, fontSize: 11 }} color={record.status === 'running' ? 'green' : 'default'}>
          {record.status === 'running' ? '실행중' : '중지됨'}
        </Tag>
      </span>
    ),
  },
  {
    title: 'CPU',
    dataIndex: 'cpu',
    key: 'cpu',
    width: 100,
    align: 'center',
    render: v => <Tag color="blue">{v} core</Tag>,
  },
  {
    title: 'GPU',
    dataIndex: 'gpu',
    key: 'gpu',
    width: 100,
    align: 'center',
    render: v => v > 0 ? <Tag color="purple">{v} core</Tag> : <span style={{ color: '#ccc' }}>—</span>,
  },
  {
    title: 'Memory',
    dataIndex: 'memory',
    key: 'memory',
    width: 110,
    align: 'center',
    render: v => <Tag color="cyan">{v} GB</Tag>,
  },
  {
    title: '사용기간',
    dataIndex: 'usageDays',
    key: 'usageDays',
    width: 145,
    render: (days, record) => (
      <div style={{ lineHeight: 1.6 }}>
        <div style={{ color: '#666', fontSize: 12 }}>{record.startDate} ~</div>
        <div style={{ color: '#1890ff', fontWeight: 500, fontSize: 12 }}>{days}일 사용</div>
      </div>
    ),
  },
];

function Step1ResourceSelection({ selectedRowKeys, onSelectionChange, targetAccountId, onTargetChange }) {
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, rows) => onSelectionChange(keys, rows),
  };

  const selectedRows = RESOURCES.filter(r => selectedRowKeys.includes(r.id));
  const totalCpu = selectedRows.reduce((s, r) => s + r.cpu, 0);
  const totalGpu = selectedRows.reduce((s, r) => s + r.gpu, 0);
  const totalMemory = selectedRows.reduce((s, r) => s + r.memory, 0);

  const hasSelection = selectedRowKeys.length > 0;

  return (
    <div>
      {/* 자원 테이블 */}
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: '#333' }}>
        <Icon type="hdd" style={{ marginRight: 6, color: '#1890ff' }} />
        이관할 자원 선택
        <span style={{ fontWeight: 400, fontSize: 12, color: '#999', marginLeft: 8 }}>
          체크박스로 여러 자원을 동시에 선택할 수 있습니다
        </span>
      </div>

      <Table
        rowSelection={rowSelection}
        dataSource={RESOURCES}
        columns={columns}
        rowKey="id"
        size="middle"
        pagination={false}
      />

      <Divider style={{ margin: '20px 0' }} />

      {/* 선택 요약 + 계정 선택 */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* 선택된 자원 요약 */}
        <div
          style={{
            flex: '1 1 280px',
            padding: '14px 18px',
            background: hasSelection ? '#e6f7ff' : '#fafafa',
            border: `1px solid ${hasSelection ? '#91d5ff' : '#e8e8e8'}`,
            borderRadius: 8,
            transition: 'all 0.3s',
            minHeight: 90,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 10, color: hasSelection ? '#1890ff' : '#bbb', fontSize: 13 }}>
            <Icon type={hasSelection ? 'check-square' : 'border'} style={{ marginRight: 6 }} />
            {hasSelection ? `선택된 자원 ${selectedRowKeys.length}개 — 이관 자원 합계` : '자원을 선택하세요'}
          </div>
          {hasSelection ? (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <ResourceChip label="CPU" value={totalCpu} unit="core" color="#1890ff" />
              <ResourceChip label="GPU" value={totalGpu} unit="core" color="#722ed1" />
              <ResourceChip label="Memory" value={totalMemory} unit="GB" color="#13c2c2" />
            </div>
          ) : (
            <span style={{ color: '#ccc', fontSize: 12 }}>위 테이블에서 이관할 자원을 체크해 주세요.</span>
          )}
        </div>

        {/* 이관받을 계정 선택 */}
        <div
          style={{
            flex: '1 1 320px',
            padding: '14px 18px',
            background: targetAccountId ? '#fff7e6' : '#fafafa',
            border: `1px solid ${targetAccountId ? '#ffd591' : '#e8e8e8'}`,
            borderRadius: 8,
            transition: 'all 0.3s',
            minHeight: 90,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 10, color: targetAccountId ? '#fa8c16' : '#888', fontSize: 13 }}>
            <Icon type="swap" style={{ marginRight: 6 }} />
            이관받을 계정
          </div>
          <Select
            style={{ width: '100%' }}
            placeholder="이관 대상 계정을 선택하세요"
            value={targetAccountId || undefined}
            onChange={onTargetChange}
            size="default"
          >
            {TARGET_ACCOUNTS.map(acc => {
              const availCpu = acc.totalCpu - acc.usedCpu;
              const availGpu = acc.totalGpu - acc.usedGpu;
              const availMem = acc.totalMemory - acc.usedMemory;
              const canReceive = !hasSelection || (
                totalCpu <= availCpu &&
                totalGpu <= availGpu &&
                totalMemory <= availMem
              );
              return (
                <Option key={acc.id} value={acc.id}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {hasSelection && (
                      <Icon
                        type={canReceive ? 'check-circle' : 'close-circle'}
                        style={{ color: canReceive ? '#52c41a' : '#f5222d', flexShrink: 0 }}
                      />
                    )}
                    <span style={{ fontWeight: 500 }}>{acc.name}</span>
                    <span style={{ color: '#bbb', fontSize: 11 }}>
                      여유 CPU {availCpu}c / GPU {availGpu}c / MEM {availMem}GB
                    </span>
                  </span>
                </Option>
              );
            })}
          </Select>
        </div>
      </div>
    </div>
  );
}

function ResourceChip({ label, value, unit, color }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 11px',
        background: 'white',
        border: `1px solid ${color}`,
        borderRadius: 14,
        fontSize: 13,
      }}
    >
      <span style={{ color, fontWeight: 700 }}>{value}</span>
      <span style={{ color: '#666' }}>{unit} {label}</span>
    </span>
  );
}

export default Step1ResourceSelection;
