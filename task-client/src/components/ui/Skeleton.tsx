import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = 'var(--radius-sm)',
  style,
  className = '',
}) => {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
};

// Skeleton khusus untuk Active Board (Kanban)
export const BoardSkeleton: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px 24px', gap: '20px' }}>
      {/* Header bar skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '220px' }}>
          <Skeleton width="120px" height="12px" />
          <Skeleton width="200px" height="24px" borderRadius="var(--radius-md)" />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Skeleton width="180px" height="32px" borderRadius="var(--radius-sm)" />
          <Skeleton width="100px" height="32px" borderRadius="var(--radius-sm)" />
        </div>
      </div>

      {/* Columns Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', flex: 1 }}>
        {[1, 2, 3].map((col) => (
          <div
            key={col}
            style={{
              backgroundColor: 'var(--bg-column)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              border: '1px solid var(--border-default)',
            }}
          >
            {/* Column Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Skeleton width="90px" height="16px" />
              <Skeleton width="24px" height="16px" borderRadius="10px" />
            </div>

            {/* Simulated Cards */}
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <Skeleton width="16px" height="16px" borderRadius="3px" />
                  <Skeleton width="60px" height="12px" />
                </div>
                <Skeleton width="90%" height="14px" />
                <Skeleton width="60%" height="12px" />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <Skeleton width="36px" height="16px" borderRadius="10px" />
                  <Skeleton width="22px" height="22px" borderRadius="50%" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton khusus untuk Project Summary Dashboard
export const SummarySkeleton: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '24px 32px', gap: '24px' }}>
      {/* Header skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '280px' }}>
          <Skeleton width="140px" height="12px" />
          <Skeleton width="240px" height="26px" borderRadius="var(--radius-md)" />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Skeleton width="110px" height="32px" borderRadius="var(--radius-sm)" />
          <Skeleton width="100px" height="32px" borderRadius="var(--radius-sm)" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[1, 2, 3, 4].map((k) => (
          <div
            key={k}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border-default)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '60%' }}>
              <Skeleton width="70px" height="10px" />
              <Skeleton width="50px" height="26px" />
              <Skeleton width="90px" height="10px" />
            </div>
            <Skeleton width="42px" height="42px" borderRadius="10px" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', padding: '24px', border: '1px solid var(--border-default)', height: '180px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Skeleton width="160px" height="18px" />
          <Skeleton width="100%" height="16px" borderRadius="8px" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <Skeleton height="50px" borderRadius="var(--radius-sm)" />
            <Skeleton height="50px" borderRadius="var(--radius-sm)" />
            <Skeleton height="50px" borderRadius="var(--radius-sm)" />
          </div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', padding: '24px', border: '1px solid var(--border-default)', height: '180px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Skeleton width="120px" height="18px" />
          <Skeleton width="180px" height="14px" />
          <Skeleton width="100%" height="10px" borderRadius="5px" />
        </div>
      </div>
    </div>
  );
};
