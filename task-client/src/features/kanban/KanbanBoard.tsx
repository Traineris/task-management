import React, { useState, useEffect, useCallback } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskDetailModal } from './TaskDetailModal';
import type { Task, TaskStatus, IssueType, TaskPriority } from '../../types';
import { api } from '../../api/apiClient';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Search, Plus, Layers, Filter, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

import { BoardSkeleton } from '../../components/ui/Skeleton';

export const KanbanBoard: React.FC<{ isCreateTaskOpen: boolean; setIsCreateTaskOpen: (open: boolean) => void }> = ({
  isCreateTaskOpen,
  setIsCreateTaskOpen,
}) => {
  const { activeProject } = useProject();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<IssueType | ''>('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | ''>('');
  const [onlyMyIssues, setOnlyMyIssues] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [defaultCreateStatus, setDefaultCreateStatus] = useState<TaskStatus>('TODO');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!activeProject) return;
    setIsLoading(true);
    try {
      const res = await api.get<Task[]>(`/tasks?projectId=${activeProject._id}`);
      if (res.success && res.data) {
        setTasks(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat task Kanban', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [activeProject, showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks logic
  const filteredTasks = tasks.filter((t) => {
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(query);
      const matchDesc = t.description?.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc) return false;
    }

    // Only my issues
    if (onlyMyIssues && user) {
      if (t.assigneeId?._id !== user._id) return false;
    }

    // Specific Assignee
    if (selectedAssignee) {
      if (t.assigneeId?._id !== selectedAssignee) return false;
    }

    // Issue Type
    if (selectedType && t.issueType !== selectedType) {
      return false;
    }

    // Priority
    if (selectedPriority && t.priority !== selectedPriority) {
      return false;
    }

    return true;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'IN_PROGRESS');
  const doneTasks = filteredTasks.filter((t) => t.status === 'DONE');

  const hasActiveFilters = searchQuery || onlyMyIssues || selectedAssignee || selectedType || selectedPriority;

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedAssignee(null);
    setSelectedType('');
    setSelectedPriority('');
    setOnlyMyIssues(false);
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('text/plain', task._id);
  };

  const handleDropTask = async (_e: React.DragEvent, targetStatus: TaskStatus) => {
    if (!draggedTask) return;
    if (draggedTask.status === targetStatus) return;

    // Optimistic Update
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t._id === draggedTask._id ? { ...t, status: targetStatus } : t))
    );

    try {
      const res = await api.patch<Task>(`/tasks/${draggedTask._id}/reorder`, {
        status: targetStatus,
        position: Date.now(),
      });

      if (res.success && res.data) {
        setTasks((prev) =>
          prev.map((t) => (t._id === draggedTask._id ? res.data : t))
        );
      }
    } catch (err: any) {
      setTasks(previousTasks); // Rollback
      showToast(err.message || 'Gagal memindahkan task', 'error');
    } finally {
      setDraggedTask(null);
    }
  };

  const handleQuickAdd = (status: TaskStatus) => {
    setDefaultCreateStatus(status);
    setIsCreateTaskOpen(true);
  };

  if (!activeProject) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--text-muted)',
          gap: '12px',
        }}
      >
        <Layers size={48} color="var(--border-default)" />
        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-heading)' }}>
          Belum Ada Project yang Dipilih
        </div>
        <p style={{ fontSize: '13px', maxWidth: '360px', textAlign: 'center' }}>
          Pilih project dari dropdown navigasi di atas atau buat project baru untuk mulai mengelola task.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <BoardSkeleton />;
  }

  // List unique members for filter
  const allMembers = [
    ...(activeProject.leadId ? [activeProject.leadId] : []),
    ...(activeProject.members || []),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px 24px' }}>
      {/* Board Header Title & Breadcrumbs */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-subtle)', marginBottom: '4px' }}>
          <span>Projects</span>
          <span>/</span>
          <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{activeProject.name}</span>
          <span>/</span>
          <span>Active Board</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>
            Active Board
          </h1>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus size={14} />}
            onClick={() => {
              setDefaultCreateStatus('TODO');
              setIsCreateTaskOpen(true);
            }}
          >
            Buat Issue
          </Button>
        </div>
      </div>

      {/* Jira-Style Interactive Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {/* Left Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '200px' }}>
            <Search
              size={13}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
            <input
              placeholder="Cari issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '30px',
                paddingLeft: '28px',
                paddingRight: '24px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                outline: 'none',
                transition: 'var(--transition-fast)',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Quick Filter: Only My Issues */}
          <button
            type="button"
            onClick={() => setOnlyMyIssues(!onlyMyIssues)}
            style={{
              height: '30px',
              padding: '0 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              border: onlyMyIssues ? '1px solid var(--color-primary)' : '1px solid var(--border-default)',
              backgroundColor: onlyMyIssues ? 'var(--color-primary-light)' : '#FFFFFF',
              color: onlyMyIssues ? 'var(--color-primary)' : 'var(--text-body)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'var(--transition-fast)',
            }}
          >
            Hanya Issue Saya
          </button>

          {/* Filter by Assignee Avatars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '4px' }}>
            {allMembers.slice(0, 4).map((m) => (
              <button
                key={m._id}
                onClick={() => setSelectedAssignee(selectedAssignee === m._id ? null : m._id)}
                style={{
                  background: 'transparent',
                  border: selectedAssignee === m._id ? '2px solid var(--color-primary)' : '2px solid transparent',
                  borderRadius: '50%',
                  padding: '1px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
                title={`Filter: ${m.name}`}
              >
                <Avatar name={m.name} avatarUrl={m.avatar} size={24} />
              </button>
            ))}
          </div>

          {/* Issue Type Select Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as IssueType | '')}
            style={{
              height: '30px',
              padding: '0 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              backgroundColor: '#FFFFFF',
              border: selectedType ? '1px solid var(--color-primary)' : '1px solid var(--border-default)',
              color: 'var(--text-body)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">Semua Tipe</option>
            <option value="STORY">Story</option>
            <option value="TASK">Task</option>
            <option value="BUG">Bug</option>
            <option value="EPIC">Epic</option>
          </select>

          {/* Priority Select Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as TaskPriority | '')}
            style={{
              height: '30px',
              padding: '0 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              backgroundColor: '#FFFFFF',
              border: selectedPriority ? '1px solid var(--color-primary)' : '1px solid var(--border-default)',
              color: 'var(--text-body)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">Semua Prioritas</option>
            <option value="HIGHEST">🔴 Highest</option>
            <option value="HIGH">🟠 High</option>
            <option value="MEDIUM">🟡 Medium</option>
            <option value="LOW">🟢 Low</option>
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 6px',
              }}
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Right Info: Total Counter */}
        <div style={{ fontSize: '12px', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={13} />
          <span>Menampilkan <strong>{filteredTasks.length}</strong> dari {tasks.length} issue</span>
        </div>
      </div>

      {/* 3 Kanban Columns Layout */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          flex: 1,
          overflowX: 'auto',
          alignItems: 'flex-start',
        }}
      >
        <KanbanColumn
          status="TODO"
          title="TO DO"
          tasks={todoTasks}
          projectKey={activeProject.key}
          onTaskClick={(t) => setSelectedTask(t)}
          onQuickAddTask={handleQuickAdd}
          onDragStart={handleDragStart}
          onDropTask={handleDropTask}
        />

        <KanbanColumn
          status="IN_PROGRESS"
          title="IN PROGRESS"
          tasks={inProgressTasks}
          projectKey={activeProject.key}
          onTaskClick={(t) => setSelectedTask(t)}
          onQuickAddTask={handleQuickAdd}
          onDragStart={handleDragStart}
          onDropTask={handleDropTask}
        />

        <KanbanColumn
          status="DONE"
          title="DONE"
          tasks={doneTasks}
          projectKey={activeProject.key}
          onTaskClick={(t) => setSelectedTask(t)}
          onQuickAddTask={handleQuickAdd}
          onDragStart={handleDragStart}
          onDropTask={handleDropTask}
        />
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        defaultStatus={defaultCreateStatus}
        onTaskCreated={(newTask) => {
          setTasks((prev) => [newTask, ...prev]);
        }}
      />

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onTaskUpdated={(updated) => {
          setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
          setSelectedTask(updated);
        }}
        onTaskDeleted={(deletedId) => {
          setTasks((prev) => prev.filter((t) => t._id !== deletedId));
          setSelectedTask(null);
        }}
      />
    </div>
  );
};
