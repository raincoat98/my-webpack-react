import React from 'react';
import { Form, Input, Select, DatePicker, Tag, Icon, Divider } from 'antd';
import { PROJECTS, TYPE_COLORS } from './mockData';

const { Option } = Select;
const { TextArea } = Input;

function Step2RegistrationForm({ selectedRows, formData, onFormChange }) {
  const handleChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
  };

  const labelStyle = { fontWeight: 600, color: '#333', fontSize: 13 };
  const fieldStyle = { marginBottom: 20 };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* 선택된 서버 요약 */}
      <div
        style={{
          padding: '14px 18px',
          background: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: 8,
          marginBottom: 28,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 10, color: '#52c41a', fontSize: 13 }}>
          <Icon type="check-circle" style={{ marginRight: 6 }} />
          선택된 서버 {selectedRows.length}개
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {selectedRows.map(r => (
            <Tag key={r.id} color={TYPE_COLORS[r.type] || '#999'} style={{ fontSize: 12 }}>
              {r.name}
            </Tag>
          ))}
        </div>
      </div>

      <Divider style={{ margin: '0 0 24px' }} />

      {/* 등록 폼 */}
      <Form layout="vertical">
        <div style={fieldStyle}>
          <div style={labelStyle}>
            <Icon type="project" style={{ marginRight: 6, color: '#1890ff' }} />
            프로젝트 <span style={{ color: '#ff4d4f' }}>*</span>
          </div>
          <Select
            style={{ width: '100%', marginTop: 6 }}
            placeholder="등록할 프로젝트를 선택하세요"
            value={formData.projectId || undefined}
            onChange={val => handleChange('projectId', val)}
            size="large"
          >
            {PROJECTS.map(p => (
              <Option key={p.id} value={p.id}>{p.name}</Option>
            ))}
          </Select>
        </div>

        <div style={fieldStyle}>
          <div style={labelStyle}>
            <Icon type="environment" style={{ marginRight: 6, color: '#1890ff' }} />
            배포 환경 <span style={{ color: '#ff4d4f' }}>*</span>
          </div>
          <Select
            style={{ width: '100%', marginTop: 6 }}
            placeholder="배포 환경을 선택하세요"
            value={formData.environment || undefined}
            onChange={val => handleChange('environment', val)}
            size="large"
          >
            <Option value="dev">개발 (Development)</Option>
            <Option value="staging">스테이징 (Staging)</Option>
            <Option value="prod">운영 (Production)</Option>
          </Select>
        </div>

        <div style={fieldStyle}>
          <div style={labelStyle}>
            <Icon type="calendar" style={{ marginRight: 6, color: '#1890ff' }} />
            사용 만료일
          </div>
          <DatePicker
            style={{ width: '100%', marginTop: 6 }}
            placeholder="만료일을 선택하세요 (선택 사항)"
            value={formData.expiryDate || null}
            onChange={val => handleChange('expiryDate', val)}
            size="large"
          />
        </div>

        <div style={fieldStyle}>
          <div style={labelStyle}>
            <Icon type="edit" style={{ marginRight: 6, color: '#1890ff' }} />
            메모
          </div>
          <TextArea
            style={{ marginTop: 6 }}
            placeholder="등록 관련 메모를 입력하세요 (선택 사항)"
            rows={4}
            value={formData.memo || ''}
            onChange={e => handleChange('memo', e.target.value)}
            maxLength={200}
            showCount
          />
        </div>
      </Form>
    </div>
  );
}

export default Step2RegistrationForm;
