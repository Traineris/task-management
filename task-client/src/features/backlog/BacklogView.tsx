import React, { useState, useEffect, useCallback } from 'react';
import type { Sprint, Task } from '../../types';
import { api } from '../../api/apiClient';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { IssueTypeBadge, PriorityBadge, StatusBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { SprintPlanningModal } from './SprintPlanningModal';
import { TaskDetailModal } from '../kanban/TaskDetailModal';
import { CreateTaskModal } from '../kanban/CreateTaskModal';
import {
  Play,
  CheckCircle,
  Plus,
  Trash2,
} from 'lucide-react';

export const BacklogView: React.FC = () => {
  const { activeProject } = useProject();
  const { showToast } = useToast();

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchData = useCallback(async () => {
    if (!activeProject) return;
    try {
      const [sprintsRes, tasksRes] = await Promise.all([
        api.get<Sprint[]>(`/sprints?projectId=${activeProject._id}`),
        api.get<Task[]>(`/tasks?projectId=${activeProject._id}`),
      ]);

      if (sprintsRes.success && sprintsRes.data) setSprints(sprintsRes.data);
      if (tasksRes.success && tasksRes.data) setTasks(tasksRes.data);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat data backlog & sprint', 'error');
    }
  }, [activeProject, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStartSprint = async (sprintId: string) => {
    try {
      const res = await api.patch<Sprint>(`/sprints/${sprintId}`, { status: 'ACTIVE' });
      if (res.success && res.data) {
        showToast('Sprint telah dimulai dan sekarang ACTIVE!', 'success');
        setSprints((prev) =>
          prev.map((s) => (s._id === sprintId ? res.data : s.status === 'ACTIVE' ? { ...s, status: 'PLANNED' } : s))
        );
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memulai sprint', 'error');
    }
  };

  const handleCompleteSprint = async (sprintId: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menyelesaikan sprint ini?')) return;
    try {
      const res = await api.patch<Sprint>(`/sprints/${sprintId}`, { status: 'COMPLETED' });
      if (res.success && res.data) {
        showToast('Sprint berhasil diselesaikan!', 'success');
        setSprints((prev) => prev.map((s) => (s._id === sprintId ? res.data : s)));
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal menyelesaikan sprint', 'error');
    }
  };

  const handleDeleteSprint = async (sprintId: string) => {
    if (!window.confirm('Yakin ingin menghapus sprint ini?')) return;
    try {
      await api.delete(`/sprints/${sprintId}`);
      showToast('Sprint berhasil dihapus', 'info');
      setSprints((prev) => prev.filter((s) => s._id !== sprintId));
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus sprint', 'error');
    }
  };

  const handleMoveTaskToSprint = async (taskId: string, sprintId: string | null) => {
    try {
      const res = await api.patch<Task>(`/tasks/${taskId}`, { sprintId });
      if (res.success && res.data) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
        showToast('Task dipindahkan', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memindahkan task', 'error');
    }
  };

  if (!activeProject) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
        Pilih project terlebih dahulu.
      </div>
    );
  }

  const activeSprint = sprints.find((s) => s.status === 'ACTIVE');
  const plannedSprints = sprints.filter((s) => s.status === 'PLANNED');
  const backlogTasks = tasks.filter((t) => !t.sprintId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-heading)' }}>
            Backlog & Sprints
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '2px' }}>
            Rencanakan siklus rilis fitur tim melalui Sprint Planning
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Plus size={14} />}
            onClick={() => setIsTaskModalOpen(true)}
          >
            Create Issue
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus size={14} />}
            onClick={() => setIsSprintModalOpen(true)}
          >
            Create Sprint
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* 1. ACTIVE SPRINT SECTION */}
        {activeSprint && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid var(--color-primary)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    padding: '2px 6px',
                    borderRadius: '3px',
                  }}
                >
                  ACTIVE SPRINT
                </span>
                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-heading)' }}>
                  {activeSprint.name}
                </span>
                {activeSprint.goal && (
                  <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
                    • Goal: {activeSprint.goal}
                  </span>
                )}
              </div>

              <Button
                size="sm"
                variant="secondary"
                leftIcon={<CheckCircle size={14} />}
                onClick={() => handleCompleteSprint(activeSprint._id)}
              >
                Complete Sprint
              </Button>
            </div>

            {/* Active Sprint Tasks List */}
            <div style={{ padding: '8px' }}>
              {tasks.filter((t) => (typeof t.sprintId === 'object' ? t.sprintId?._id === activeSprint._id : t.sprintId === activeSprint._id)).length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  Tidak ada task di sprint ini. Pindahkan task dari Backlog di bawah.
                </div>
              ) : (
                tasks
                  .filter((t) => (typeof t.sprintId === 'object' ? t.sprintId?._id === activeSprint._id : t.sprintId === activeSprint._id))
                  .map((task) => (
                    <div
                      key={task._id}
                      onClick={() => setSelectedTask(task)}
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <IssueTypeBadge issueType={task.issueType} showLabel={false} />
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-heading)' }}>
                          {task.title}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} showLabel={false} />
                        {task.storyPoints !== undefined && (
                          <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#DFE1E6', padding: '1px 6px', borderRadius: '10px' }}>
                            {task.storyPoints}
                          </span>
                        )}
                        <Avatar name={task.assigneeId?.name} avatarUrl={task.assigneeId?.avatar} size={22} />
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* 2. PLANNED SPRINTS */}
        {plannedSprints.map((sprint) => {
          const sprintTasks = tasks.filter((t) =>
            typeof t.sprintId === 'object' ? t.sprintId?._id === sprint._id : t.sprintId === sprint._id
          );

          return (
            <div
              key={sprint._id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#FAFBFC',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-heading)' }}>
                    {sprint.name}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    ({sprintTasks.length} issues)
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<Play size={12} />}
                    onClick={() => handleStartSprint(sprint._id)}
                  >
                    Start Sprint
                  </Button>
                  <button
                    onClick={() => handleDeleteSprint(sprint._id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', padding: '4px' }}
                    title="Hapus Sprint"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Sprint Tasks */}
              <div style={{ padding: '6px' }}>
                {sprintTasks.map((task) => (
                  <div
                    key={task._id}
                    onClick={() => setSelectedTask(task)}
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IssueTypeBadge issueType={task.issueType} showLabel={false} />
                      <span style={{ fontSize: '13px', color: 'var(--text-heading)' }}>{task.title}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveTaskToSprint(task._id, null);
                        }}
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-primary)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Pindah ke Backlog
                      </button>
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} showLabel={false} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* 3. BACKLOG SECTION */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: '#FAFBFC',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-subtle)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                BACKLOG ({backlogTasks.length} Issues)
              </span>
            </div>
          </div>

          <div style={{ padding: '6px' }}>
            {backlogTasks.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                Backlog kosong. Klik "+ Create Issue" untuk menambahkan ide atau tugas baru.
              </div>
            ) : (
              backlogTasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() => setSelectedTask(task)}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IssueTypeBadge issueType={task.issueType} showLabel={false} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-heading)' }}>
                      {task.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Move to sprint dropdown */}
                    {sprints.length > 0 && (
                      <select
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          if (e.target.value) handleMoveTaskToSprint(task._id, e.target.value);
                        }}
                        defaultValue=""
                        style={{
                          fontSize: '11px',
                          padding: '2px 6px',
                          border: '1px solid var(--border-default)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#FFFFFF',
                          outline: 'none',
                        }}
                      >
                        <option value="" disabled>Pindah ke Sprint...</option>
                        {sprints.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name} ({s.status})
                          </option>
                        ))}
                      </select>
                    )}

                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} showLabel={false} />
                    <Avatar name={task.assigneeId?.name} avatarUrl={task.assigneeId?.avatar} size={22} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <SprintPlanningModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        onSprintCreated={(newSprint) => setSprints((prev) => [newSprint, ...prev])}
      />

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={(newTask) => setTasks((prev) => [newTask, ...prev])}
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
