import React, { useState } from 'react';
import type { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  projectKey: string;
  onTaskClick: (task: Task) => void;
  onQuickAddTask: (status: TaskStatus) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDropTask: (e: React.DragEvent, targetStatus: TaskStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  tasks,
  projectKey,
  onTaskClick,
  onQuickAddTask,
  onDragStart,
  onDropTask,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDropTask(e, status);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        flex: 1,
        minWidth: '290px',
        maxWidth: '380px',
        backgroundColor: isDragOver ? '#DEEBFF' : 'var(--bg-column)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 165px)',
        border: isDragOver ? '2px dashed var(--color-primary)' : '2px solid transparent',
        transition: 'var(--transition-fast)',
      }}
    >
      {/* Column Header */}
      <div
        style={{
          padding: '12px 14px 8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-subtle)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: '#DFE1E6',
              color: 'var(--text-heading)',
              padding: '1px 7px',
              borderRadius: '10px',
              minWidth: '20px',
              textAlign: 'center',
            }}
          >
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onQuickAddTask(status)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-subtle)',
            padding: '3px 6px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 600,
          }}
          title={`Tambah issue di ${title}`}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(9, 30, 66, 0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Column Card List Container */}
      <div
        style={{
          padding: '4px 8px 12px 8px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
        }}
      >
        {tasks.map((task, index) => (
          <TaskCard
            key={task._id}
            task={task}
            projectKey={projectKey}
            index={index}
            onClick={() => onTaskClick(task)}
            onDragStart={onDragStart}
          />
        ))}

        {tasks.length === 0 && (
          <div
            style={{
              padding: '32px 12px',
              textAlign: 'center',
              border: '1px dashed var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              fontSize: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            Tarik issue ke sini
          </div>
        )}
      </div>
    </div>
  );
};
