import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'subtle' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-primary)',
          color: '#FFFFFF',
          border: 'none',
        };
      case 'secondary':
        return {
          backgroundColor: '#EBECF0',
          color: 'var(--text-heading)',
          border: 'none',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-danger)',
          color: '#FFFFFF',
          border: 'none',
        };
      case 'subtle':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-body)',
          border: 'none',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-heading)',
          border: '1px solid var(--border-default)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          border: 'none',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '4px 10px', fontSize: '12px', height: '28px' };
      case 'lg':
        return { padding: '10px 20px', fontSize: '15px', height: '42px' };
      default:
        return { padding: '6px 14px', fontSize: '13px', height: '34px' };
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontWeight: 600,
        borderRadius: 'var(--radius-sm)',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'var(--transition-fast)',
        outline: 'none',
        userSelect: 'none',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
          if (variant === 'secondary') e.currentTarget.style.backgroundColor = '#DFE1E6';
          if (variant === 'subtle') e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-primary)';
          if (variant === 'secondary') e.currentTarget.style.backgroundColor = '#EBECF0';
          if (variant === 'subtle') e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      {...props}
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
