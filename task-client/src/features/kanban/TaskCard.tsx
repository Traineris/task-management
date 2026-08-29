import React from 'react';
import type { Task } from '../../types';
import { IssueTypeBadge, PriorityBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

interface TaskCardProps {
  task: Task;
  projectKey: string;
  index: number;
  onClick: () => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  projectKey,
  index,
  onClick,
  onDragStart,
}) => {
  const shortId = `${projectKey}-${(index + 1)}`;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={onClick}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 12px',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-subtle)',
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        userSelect: 'none',
        transition: 'var(--transition-normal)',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
        e.currentTarget.style.borderColor = 'var(--border-strong)';
        e.currentTarget.style.transform = 'translateY(-1.5px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--text-heading)',
          lineHeight: '1.45',
          wordBreak: 'break-word',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {task.title}
      </div>

      {/* Meta Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '2px',
          paddingTop: '6px',
          borderTop: '1px solid #F4F5F7',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <IssueTypeBadge issueType={task.issueType} showLabel={false} size={13} />
          <PriorityBadge priority={task.priority} showLabel={false} size={13} />
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-subtle)',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            {shortId}
          </span>
          {task.storyPoints !== undefined && task.storyPoints !== null && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                backgroundColor: '#DFE1E6',
                color: 'var(--text-heading)',
                borderRadius: '10px',
                padding: '0 6px',
                height: '16px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
              title={`Story Points: ${task.storyPoints}`}
            >
              {task.storyPoints}
            </span>
          )}
        </div>

        <div>
          {task.assigneeId ? (
            <Avatar name={task.assigneeId.name} avatarUrl={task.assigneeId.avatar} size={22} />
          ) : (
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                border: '1px dashed var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'var(--text-muted)',
                backgroundColor: '#FAFBFC',
              }}
              title="Unassigned"
            >
              ?
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
