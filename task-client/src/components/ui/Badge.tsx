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
    { label: string; color: string; bg: string; icon: React.ReactNode }
  > = {
    STORY: {
      label: 'Story',
      color: '#36B37E',
      bg: '#E3FCEF',
      icon: <Bookmark size={size} color="#36B37E" fill="#36B37E" />,
    },
    TASK: {
      label: 'Task',
      color: '#4C9AFF',
      bg: '#DEEBFF',
      icon: <CheckSquare size={size} color="#4C9AFF" />,
    },
    BUG: {
      label: 'Bug',
      color: '#FF5630',
      bg: '#FFEBE6',
      icon: <AlertCircle size={size} color="#FF5630" fill="#FF5630" />,
    },
    EPIC: {
      label: 'Epic',
      color: '#8777D9',
      bg: '#EAE6FF',
      icon: <Zap size={size} color="#8777D9" fill="#8777D9" />,
    },
  };

  const config = configs[issueType] || configs.TASK;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        userSelect: 'none',
      }}
      title={`Issue Type: ${config.label}`}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${size + 4}px`,
          height: `${size + 4}px`,
          borderRadius: '3px',
          backgroundColor: config.bg,
        }}
      >
        {config.icon}
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-body)',
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
   ========================================================= */
interface PriorityBadgeProps {
  priority: TaskPriority;
  showLabel?: boolean;
  size?: number;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  showLabel = false,
  size = 14,
}) => {
  const configs: Record<
    TaskPriority,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    HIGHEST: {
      label: 'Highest',
      color: '#DE350B',
      icon: <ChevronsUp size={size} color="#DE350B" strokeWidth={2.5} />,
    },
    HIGH: {
      label: 'High',
      color: '#FF5630',
      icon: <ChevronUp size={size} color="#FF5630" strokeWidth={2.5} />,
    },
    MEDIUM: {
      label: 'Medium',
      color: '#FFAB00',
      icon: <Equal size={size} color="#FFAB00" strokeWidth={2.5} />,
    },
    LOW: {
      label: 'Low',
      color: '#36B37E',
      icon: <ChevronDown size={size} color="#36B37E" strokeWidth={2.5} />,
    },
  };

  const config = configs[priority] || configs.MEDIUM;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        userSelect: 'none',
      }}
      title={`Priority: ${config.label}`}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {config.icon}
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: config.color,
          }}
        >
          {config.label}
        </span>
      )}
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
      bg: '#DFE1E6',
      color: '#42526E',
      border: '#C1C7D0',
    },
    IN_PROGRESS: {
      label: 'IN PROGRESS',
      bg: '#DEEBFF',
      color: '#0747A6',
      border: '#B3D4FF',
    },
    DONE: {
      label: 'DONE',
      bg: '#E3FCEF',
      color: '#006644',
      border: '#ABF5D1',
    },
  };

  const cfg = configs[status] || configs.TODO;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '3px',
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
