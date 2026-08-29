import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'var(--color-primary)',
  className = '',
}) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 36,
    xl: 48,
  };

  const pixelSize = sizeMap[size];

  return (
    <div
      className={`animate-spin ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
      }}
    >
      <Loader2 size={pixelSize} />
    </div>
  );
};

export const LoadingScreen: React.FC<{ message?: string }> = ({
  message = 'Memuat WorkFlow...',
}) => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        gap: '16px',
        userSelect: 'none',
      }}
    >
      {/* Brand Icon with Pulsing Glow */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          backgroundColor: '#FFFFFF',
          padding: '6px',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/web-logo.png"
          alt="WorkFlow Logo"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Modern Gradient Spinner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Spinner size="md" />
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
          {message}
        </span>
      </div>
    </div>
  );
};

export const ProcessingOverlay: React.FC<{ message?: string }> = ({
  message = 'Memproses data...',
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          padding: '20px 28px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-modal)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: '1px solid var(--border-default)',
        }}
      >
        <Spinner size="md" />
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-heading)' }}>
          {message}
        </span>
      </div>
    </div>
  );
};
