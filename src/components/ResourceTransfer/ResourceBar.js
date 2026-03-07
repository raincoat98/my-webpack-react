import React from 'react';

/**
 * ResourceBar
 *
 * isSource=true  → 자원이 나가는 계정: 사용중(파랑) + 이관될(줄무늬 주황) + 여유(회색)
 * isSource=false → 자원이 들어오는 계정: 사용중(파랑) + 이관받을(주황) + 여유(회색)
 *                  용량 초과 시 → 이관받을 부분이 빨간색 + 경고
 */
function ResourceBar({ label, unit, total, used, transfer, isSource }) {
  const available = total - used;
  const isOverCapacity = !isSource && transfer > 0 && transfer > available;

  const usedPct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const transferPct = total > 0 ? (transfer / total) * 100 : 0;

  // 이관 후 사용량
  const afterUsed = isSource ? used - transfer : used + transfer;
  const afterAvailable = total - afterUsed;

  // Source: 사용중 파란 영역은 (used - transfer) 분, 남은 transfer 분은 줄무늬
  const remainingUsedPct = isSource ? Math.max(0, usedPct - transferPct) : usedPct;
  const leavingPct = isSource ? Math.min(transferPct, usedPct) : 0;

  // Target: 이관받을 영역은 used 뒤에 붙임 (용량 초과 시 available까지만 채우고 빨간색)
  const incomingPct = isSource ? 0 : Math.min(transferPct, 100 - usedPct);
  const incomingColor = isOverCapacity ? '#f5222d' : '#fa8c16';

  return (
    <div style={{ marginBottom: 18 }}>
      {/* 라벨 + 수치 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontWeight: 600, fontSize: 13, color: '#333' }}>{label}</span>
        <span style={{ fontSize: 12, color: isOverCapacity ? '#f5222d' : '#595959' }}>
          {used}
          {transfer > 0 && (
            <span>
              {' '}
              <span style={{ color: '#bbb' }}>→</span>{' '}
              <span style={{ color: isOverCapacity ? '#f5222d' : isSource ? '#52c41a' : '#fa8c16', fontWeight: 700 }}>
                {afterUsed}
              </span>
            </span>
          )}
          {' / '}{total} {unit}
        </span>
      </div>

      {/* 바 */}
      <div
        style={{
          background: '#e8e8e8',
          borderRadius: 6,
          height: 22,
          position: 'relative',
          overflow: 'hidden',
          border: isOverCapacity ? '2px solid #f5222d' : '2px solid transparent',
          transition: 'border-color 0.3s',
        }}
      >
        {/* 사용중 (파랑) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: `${remainingUsedPct}%`,
            height: '100%',
            background: '#1890ff',
            transition: 'width 0.4s ease',
          }}
        />

        {/* Source: 이관될 자원 (줄무늬 주황) */}
        {isSource && transfer > 0 && (
          <div
            style={{
              position: 'absolute',
              left: `${remainingUsedPct}%`,
              width: `${leavingPct}%`,
              height: '100%',
              background: 'repeating-linear-gradient(45deg, #fa8c16 0px, #fa8c16 5px, #ffd591 5px, #ffd591 10px)',
              transition: 'left 0.4s ease, width 0.4s ease',
            }}
          />
        )}

        {/* Target: 이관받을 자원 (주황 or 빨강) */}
        {!isSource && transfer > 0 && (
          <div
            style={{
              position: 'absolute',
              left: `${usedPct}%`,
              width: `${isOverCapacity ? 100 - usedPct : incomingPct}%`,
              height: '100%',
              background: incomingColor,
              opacity: 0.85,
              transition: 'width 0.4s ease',
            }}
          />
        )}
      </div>

      {/* 범례 */}
      <div style={{ display: 'flex', gap: 14, marginTop: 5, fontSize: 11, color: '#666', flexWrap: 'wrap' }}>
        <LegendDot color="#1890ff" label={`사용중 ${isSource ? used - transfer : used}${unit}`} />
        {transfer > 0 && (
          <LegendDot
            color={isOverCapacity ? '#f5222d' : '#fa8c16'}
            striped={isSource}
            label={`${isSource ? '이관 ' : '이관받을 '}${transfer}${unit}`}
          />
        )}
        <LegendDot
          color="#e8e8e8"
          bordered
          label={`이관 후 여유 ${afterAvailable}${unit}`}
          labelColor={afterAvailable < 0 ? '#f5222d' : undefined}
        />
      </div>

      {/* 용량 초과 경고 */}
      {isOverCapacity && (
        <div
          style={{
            marginTop: 4,
            color: '#f5222d',
            fontSize: 12,
            background: '#fff1f0',
            border: '1px solid #ffa39e',
            borderRadius: 4,
            padding: '3px 8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span>⚠️</span>
          <span>
            용량 초과! 여유 {available}
            {unit}, 이관 필요 {transfer}
            {unit} → <b>{transfer - available}{unit} 부족</b>
          </span>
        </div>
      )}
    </div>
  );
}

function LegendDot({ color, striped, bordered, label, labelColor }) {
  const bgStyle = striped
    ? { background: 'repeating-linear-gradient(45deg, #fa8c16 0px, #fa8c16 4px, #ffd591 4px, #ffd591 8px)' }
    : { background: color };

  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span
        style={{
          display: 'inline-block',
          width: 10,
          height: 10,
          borderRadius: 2,
          border: bordered ? '1px solid #ccc' : 'none',
          flexShrink: 0,
          ...bgStyle,
        }}
      />
      <span style={{ color: labelColor || '#666' }}>{label}</span>
    </span>
  );
}

export default ResourceBar;
