import React from 'react';

function Step2AccountInfo({ formData }) {
  return (
    <div>
      <h3>입력 내용 확인</h3>
      <div style={{ background: '#f0f2f5', padding: '20px', borderRadius: '4px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              ['상품명', formData.name],
              ['가격', formData.price != null ? `₩${Number(formData.price).toLocaleString()}` : '-'],
              ['재고', formData.stock != null ? `${formData.stock}개` : '-'],
              ['카테고리', formData.category || '-'],
              ['설명', formData.description || '-'],
            ].map(([label, value]) => (
              <tr key={label} style={{ borderBottom: '1px solid #e8e8e8' }}>
                <td style={{ padding: '10px', fontWeight: 'bold', width: '100px', color: '#666' }}>{label}</td>
                <td style={{ padding: '10px' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Step2AccountInfo;
