import React from 'react';
import { Table, Tag, Badge, Icon, Alert } from 'antd';
import { RESOURCES, SOURCE_ACCOUNT, TARGET_ACCOUNTS } from './mockData';

/* ─── 왼쪽: 이관할 자원 선택 테이블 컬럼 ─── */
const sourceColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 100,
    render: id => (
      <code style={{ fontSize: 11, background: '#f5f5f5', padding: '2px 5px', borderRadius: 3, color: '#555' }}>
        {id}
      </code>
    ),
  },
  {
    title: '자원명',
    dataIndex: 'name',
    key: 'name',
    render: (name, record) => (
      <span>
        <Badge status={record.status === 'running' ? 'processing' : 'default'} style={{ marginRight: 5 }} />
        <span style={{ fontWeight: 500, fontSize: 13 }}>{name}</span>
      </span>
    ),
  },
  {
    title: 'CPU',
    dataIndex: 'cpu',
    key: 'cpu',
    width: 75,
    align: 'center',
    render: v => <Tag color="blue">{v}c</Tag>,
  },
  {
    title: 'GPU',
    dataIndex: 'gpu',
    key: 'gpu',
    width: 70,
    align: 'center',
    render: v => v > 0 ? <Tag color="purple">{v}c</Tag> : <span style={{ color: '#d9d9d9' }}>—</span>,
  },
  {
    title: 'Mem',
    dataIndex: 'memory',
    key: 'memory',
    width: 80,
    align: 'center',
    render: v => <Tag color="cyan">{v}GB</Tag>,
  },
  {
    title: '사용기간',
    dataIndex: 'usageDays',
    key: 'usageDays',
    width: 120,
    render: (days, record) => (
      <div style={{ fontSize: 11, lineHeight: 1.6 }}>
        <div style={{ color: '#999' }}>{record.startDate}</div>
        <div style={{ color: '#1890ff', fontWeight: 500 }}>{days}일</div>
      </div>
    ),
  },
];

/* ─── 오른쪽: 이관 대상 자원 현황 테이블 ─── */
const RESOURCE_META = [
  { key: 'cpu',    label: 'CPU',    unit: 'core', color: '#1890ff', icon: 'thunderbolt' },
  { key: 'gpu',    label: 'GPU',    unit: 'core', color: '#722ed1', icon: 'experiment' },
  { key: 'memory', label: 'Memory', unit: 'GB',   color: '#13c2c2', icon: 'database' },
];

function buildTargetRows(account, transfer) {
  return RESOURCE_META.map(meta => {
    const total    = account[`total${meta.key.charAt(0).toUpperCase() + meta.key.slice(1)}`];
    const used     = account[`used${meta.key.charAt(0).toUpperCase() + meta.key.slice(1)}`];
    const incoming = transfer[meta.key];
    const available = total - used;
    const afterUsed = used + incoming;
    const overflow  = incoming > available;
    return { ...meta, total, used, incoming, available, afterUsed, overflow };
  });
}

function makeTargetColumns(hasSelection) {
  return [
    {
      title: '자원',
      dataIndex: 'label',
      key: 'label',
      width: 80,
      render: (label, r) => (
        <span style={{ fontWeight: 700, color: r.color }}>
          <Icon type={r.icon} style={{ marginRight: 4 }} />
          {label}
        </span>
      ),
    },
    {
      title: '전체',
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      render: (v, r) => <span style={{ color: '#666' }}>{v} {r.unit}</span>,
    },
    {
      title: '사용중',
      dataIndex: 'used',
      key: 'used',
      align: 'center',
      render: (v, r) => <Tag color="blue">{v} {r.unit}</Tag>,
    },
    {
      title: '이관받을',
      dataIndex: 'incoming',
      key: 'incoming',
      align: 'center',
      render: (v, r) => {
        if (!hasSelection || v === 0) return <span style={{ color: '#d9d9d9' }}>—</span>;
        return <Tag color={r.overflow ? 'red' : 'orange'}>{v} {r.unit}</Tag>;
      },
    },
    {
      title: '이관 후',
      dataIndex: 'afterUsed',
      key: 'afterUsed',
      align: 'center',
      render: (v, r) => {
        if (!hasSelection) return <span style={{ color: '#d9d9d9' }}>—</span>;
        return (
          <span style={{ fontWeight: 700, color: r.overflow ? '#f5222d' : '#52c41a' }}>
            {v} / {r.total} {r.unit}
          </span>
        );
      },
    },
    {
      title: '여유',
      key: 'available',
      align: 'center',
      render: (_, r) => {
        const afterAvail = r.total - r.afterUsed;
        if (!hasSelection) return <span style={{ color: '#999' }}>{r.available} {r.unit}</span>;
        if (r.overflow) {
          return (
            <span style={{ color: '#f5222d', fontWeight: 700 }}>
              <Icon type="close-circle" style={{ marginRight: 3 }} />
              {afterAvail} {r.unit}
            </span>
          );
        }
        return (
          <span style={{ color: '#52c41a', fontWeight: 600 }}>
            <Icon type="check-circle" style={{ marginRight: 3 }} />
            {afterAvail} {r.unit}
          </span>
        );
      },
    },
  ];
}

/* ─── 선택 자원 합계 행 ─── */
function SelectedSummaryBar({ count, transfer, hasSelection }) {
  if (!hasSelection) {
    return (
      <div style={{ marginTop: 8, padding: '8px 12px', background: '#fafafa', border: '1px dashed #d9d9d9', borderRadius: 6, color: '#bbb', fontSize: 12 }}>
        자원을 선택하면 이관 합계가 표시됩니다.
      </div>
    );
  }
  return (
    <div style={{ marginTop: 8, padding: '8px 14px', background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
      <span style={{ fontWeight: 600, color: '#1890ff', fontSize: 13 }}>
        <Icon type="check-square" style={{ marginRight: 5 }} />
        {count}개 선택
      </span>
      <Tag color="blue" style={{ margin: 0 }}>CPU {transfer.cpu} core</Tag>
      <Tag color="purple" style={{ margin: 0 }}>GPU {transfer.gpu} core</Tag>
      <Tag color="cyan" style={{ margin: 0 }}>Memory {transfer.memory} GB</Tag>
    </div>
  );
}

/* ─── Step2 메인 ─── */
function Step2TransferAccount({ selectedRowKeys, onSelectionChange, targetAccountId }) {
  const selectedRows = RESOURCES.filter(r => selectedRowKeys.includes(r.id));
  const transfer = {
    cpu:    selectedRows.reduce((s, r) => s + r.cpu, 0),
    gpu:    selectedRows.reduce((s, r) => s + r.gpu, 0),
    memory: selectedRows.reduce((s, r) => s + r.memory, 0),
  };

  const targetAccount = TARGET_ACCOUNTS.find(a => a.id === targetAccountId);
  const hasSelection  = selectedRowKeys.length > 0;

  const targetRows   = targetAccount ? buildTargetRows(targetAccount, transfer) : [];
  const overflowRows = targetRows.filter(r => r.overflow);
  const isCapacityOk = hasSelection && overflowRows.length === 0;

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, rows) => onSelectionChange(keys, rows),
  };

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>

      {/* ── 왼쪽: 이관할 자원 선택 ── */}
      <div style={{ flex: '0 0 55%', minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: '#1890ff' }}>
          <Icon type="export" style={{ marginRight: 6 }} />
          이관할 자원 선택
          <span style={{ fontWeight: 400, fontSize: 11, color: '#999', marginLeft: 6 }}>
            ({SOURCE_ACCOUNT.name})
          </span>
        </div>

        <Table
          rowSelection={rowSelection}
          dataSource={RESOURCES}
          columns={sourceColumns}
          rowKey="id"
          size="small"
          pagination={false}
          scroll={{ x: 540 }}
          rowClassName={record =>
            selectedRowKeys.includes(record.id) ? 'ant-table-row-selected' : ''
          }
        />

        <SelectedSummaryBar count={selectedRowKeys.length} transfer={transfer} hasSelection={hasSelection} />
      </div>

      {/* ── 구분선 ── */}
      <div style={{ width: 48, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 36 }}>
        <div style={{ width: 1, flex: 1, background: '#f0f0f0', minHeight: 60 }} />
        <div style={{ padding: '8px 0', color: '#fa8c16', fontSize: 18 }}>
          <Icon type="right" />
        </div>
        <div style={{ width: 1, flex: 1, background: '#f0f0f0', minHeight: 60 }} />
      </div>

      {/* ── 오른쪽: 이관 대상 자원 현황 ── */}
      <div style={{ flex: '1 1 0', minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: '#fa8c16' }}>
          <Icon type="import" style={{ marginRight: 6 }} />
          이관 대상 자원 현황
          {targetAccount && (
            <span style={{ fontWeight: 400, fontSize: 11, color: '#999', marginLeft: 6 }}>
              ({targetAccount.name})
            </span>
          )}
        </div>

        {targetAccount ? (
          <>
            <Table
              dataSource={targetRows}
              columns={makeTargetColumns(hasSelection)}
              rowKey="key"
              size="small"
              pagination={false}
              rowClassName={r => r.overflow && hasSelection ? 'capacity-overflow-row' : ''}
              style={{ fontSize: 13 }}
            />

            {/* 넘침 요약 */}
            <div style={{ marginTop: 10 }}>
              {!hasSelection && (
                <Alert
                  message="왼쪽에서 이관할 자원을 선택하면 용량 검사 결과가 표시됩니다."
                  type="info"
                  showIcon
                />
              )}
              {hasSelection && !isCapacityOk && (
                <Alert
                  message={`용량 초과 — ${overflowRows.map(r => r.label).join(', ')} 자원이 부족합니다`}
                  description={
                    <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
                      {overflowRows.map(r => (
                        <li key={r.key}>
                          {r.label}: 여유 {r.available}{r.unit}, 필요 {r.incoming}{r.unit}{' '}
                          <strong style={{ color: '#f5222d' }}>→ {r.incoming - r.available}{r.unit} 부족</strong>
                        </li>
                      ))}
                    </ul>
                  }
                  type="error"
                  showIcon
                />
              )}
              {hasSelection && isCapacityOk && (
                <Alert
                  message={`이관 가능 — ${selectedRowKeys.length}개 자원을 ${targetAccount.name}으로 이관할 수 있습니다.`}
                  type="success"
                  showIcon
                />
              )}
            </div>
          </>
        ) : (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#bbb', border: '2px dashed #e8e8e8', borderRadius: 8 }}>
            <Icon type="bank" style={{ fontSize: 32, display: 'block', marginBottom: 8 }} />
            대상 계정이 없습니다
          </div>
        )}
      </div>

      {/* 오버플로우 행 강조 스타일 */}
      <style>{`
        .capacity-overflow-row td {
          background: #fff1f0 !important;
        }
        .capacity-overflow-row:hover td {
          background: #ffe7e6 !important;
        }
      `}</style>
    </div>
  );
}

export default Step2TransferAccount;
