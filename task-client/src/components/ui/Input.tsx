import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, style, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-subtle)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {label}
          </label>
        )}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {leftIcon && (
            <div
              style={{
                position: 'absolute',
                left: '10px',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            >
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            style={{
              width: '100%',
              height: '36px',
              paddingLeft: leftIcon ? '36px' : '10px',
              paddingRight: '10px',
              backgroundColor: '#FAFBFC',
              border: `2px solid ${error ? 'var(--color-danger)' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              color: 'var(--text-heading)',
              outline: 'none',
              transition: 'var(--transition-fast)',
              ...style,
            }}
            onFocus={(e) => {
              if (!error) {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = 'var(--border-focus)';
              }
            }}
            onBlur={(e) => {
              if (!error) {
                e.currentTarget.style.backgroundColor = '#FAFBFC';
                e.currentTarget.style.borderColor = 'var(--border-default)';
              }
            }}
            {...props}
          />
        </div>
        {error && (
          <span style={{ fontSize: '11px', color: 'var(--color-danger)', fontWeight: 500 }}>
            {error}
          </span>
        )}
        {helperText && !error && (
          <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
