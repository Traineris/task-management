import React from 'react';
import type { TaskPriority, IssueType, TaskStatus } from '../../types';
import {
  Bookmark,
  CheckSquare,
  AlertCircle,
  Zap,
  ChevronUp,
  ChevronsUp,
  Equal,
  ChevronDown,
} from 'lucide-react';

/* =========================================================
   ISSUE TYPE BADGE (Story, Task, Bug, Epic)
   Enterprise Design Spec with SVG Glyph Box
   ========================================================= */
interface IssueTypeBadgeProps {
  issueType: IssueType;
  showLabel?: boolean;
  size?: number;
}

export const IssueTypeBadge: React.FC<IssueTypeBadgeProps> = ({
  issueType,
  showLabel = true,
  size = 14,
}) => {
  const configs: Record<
    IssueType,
    { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
  > = {
    STORY: {
      label: 'Story',
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      icon: <Bookmark size={size} color="#10B981" fill="#10B981" />,
    },
    TASK: {
      label: 'Task',
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      icon: <CheckSquare size={size} color="#2563EB" />,
    },
    BUG: {
      label: 'Bug',
      color: '#DC2626',
      bg: '#FEF2F2',
      border: '#FECACA',
      icon: <AlertCircle size={size} color="#EF4444" fill="#EF4444" />,
    },
    EPIC: {
      label: 'Epic',
      color: '#7C3AED',
      bg: '#F5F3FF',
      border: '#DDD6FE',
      icon: <Zap size={size} color="#7C3AED" fill="#7C3AED" />,
    },
  };

  const config = configs[issueType] || configs.TASK;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        userSelect: 'none',
      }}
      title={`Issue Type: ${config.label}`}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${size + 6}px`,
          height: `${size + 6}px`,
          borderRadius: '4px',
          backgroundColor: config.bg,
          border: `1px solid ${config.border}`,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
        }}
      >
        {config.icon}
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-heading)',
            letterSpacing: '-0.01em',
          }}
        >
          {config.label}
        </span>
      )}
    </div>
  );
};

/* =========================================================
   PRIORITY BADGE (Highest, High, Medium, Low)
   Enterprise Jira & Linear Styled Priority Pills
   ========================================================= */
interface PriorityBadgeProps {
  priority: TaskPriority;
  showLabel?: boolean;
  size?: number;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  showLabel = false,
  size = 13,
}) => {
  const configs: Record<
    TaskPriority,
    { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
  > = {
    HIGHEST: {
      label: 'Highest',
      color: '#DC2626',
      bg: '#FEF2F2',
      border: '#FEE2E2',
      icon: <ChevronsUp size={size} color="#DC2626" strokeWidth={2.8} />,
    },
    HIGH: {
      label: 'High',
      color: '#EA580C',
      bg: '#FFF7ED',
      border: '#FFEDD5',
      icon: <ChevronUp size={size} color="#EA580C" strokeWidth={2.8} />,
    },
    MEDIUM: {
      label: 'Medium',
      color: '#D97706',
      bg: '#FFFBEB',
      border: '#FEF3C7',
      icon: <Equal size={size} color="#D97706" strokeWidth={2.8} />,
    },
    LOW: {
      label: 'Low',
      color: '#059669',
      bg: '#ECFDF5',
      border: '#D1FAE5',
      icon: <ChevronDown size={size} color="#059669" strokeWidth={2.8} />,
    },
  };

  const config = configs[priority] || configs.MEDIUM;

  if (!showLabel) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${size + 8}px`,
          height: `${size + 8}px`,
          borderRadius: '4px',
          backgroundColor: config.bg,
          border: `1px solid ${config.border}`,
          userSelect: 'none',
        }}
        title={`Priority: ${config.label}`}
      >
        {config.icon}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 7px',
        borderRadius: '4px',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        fontSize: '11px',
        fontWeight: 700,
        color: config.color,
        letterSpacing: '0.01em',
        userSelect: 'none',
      }}
      title={`Priority: ${config.label}`}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {config.icon}
      </div>
      <span>{config.label}</span>
    </div>
  );
};

/* =========================================================
   STATUS BADGE (TODO, IN_PROGRESS, DONE)
   ========================================================= */
export const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const configs: Record<TaskStatus, { label: string; bg: string; color: string; border: string }> = {
    TODO: {
      label: 'TO DO',
      bg: '#F1F5F9',
      color: '#475569',
      border: '#CBD5E1',
    },
    IN_PROGRESS: {
      label: 'IN PROGRESS',
      bg: '#EFF6FF',
      color: '#2563EB',
      border: '#BFDBFE',
    },
    DONE: {
      label: 'DONE',
      bg: '#ECFDF5',
      color: '#059669',
      border: '#A7F3D0',
    },
  };

  const cfg = configs[status] || configs.TODO;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 700,
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      {cfg.label}
    </span>
  );
};
