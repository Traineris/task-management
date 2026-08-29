import React, { useState, useEffect, useCallback } from 'react';
import type { Task, Sprint } from '../../types';
import { api } from '../../api/apiClient';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';
import { IssueTypeBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { TaskDetailModal } from '../kanban/TaskDetailModal';
import {
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';

export const TimelineView: React.FC = () => {
  const { activeProject } = useProject();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

  const fetchData = useCallback(async () => {
    if (!activeProject) return;
    try {
      const [tasksRes, sprintsRes] = await Promise.all([
        api.get<Task[]>(`/tasks?projectId=${activeProject._id}`),
        api.get<Sprint[]>(`/sprints?projectId=${activeProject._id}`),
      ]);

      if (tasksRes.success && tasksRes.data) setTasks(tasksRes.data);
      if (sprintsRes.success && sprintsRes.data) setSprints(sprintsRes.data);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat timeline', 'error');
    }
  }, [activeProject, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Timeline Date calculations
  const baseDate = new Date();
  baseDate.setMonth(baseDate.getMonth() + currentMonthOffset);

  const monthName = baseDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery) return true;
    return t.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!activeProject) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Pilih proyek terlebih dahulu.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px 24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-subtle)', marginBottom: '4px' }}>
            <span>Projects</span>
            <span>/</span>
            <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{activeProject.name}</span>
            <span>/</span>
            <span>Timeline</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>
            Timeline & Roadmap
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '2px' }}>
            Pantau durasi, milestone sprint, dan rentang pengerjaan issue tim dalam bentuk visual linimasa.
          </p>
        </div>

        {/* Month Navigation & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '180px' }}>
            <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              placeholder="Cari issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '30px',
                paddingLeft: '28px',
                paddingRight: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '2px 6px', gap: '6px' }}>
            <button
              onClick={() => setCurrentMonthOffset((prev) => prev - 1)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '3px', display: 'flex' }}
              title="Bulan Sebelumnya"
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)', minWidth: '110px', textAlign: 'center' }}>
              {monthName}
            </span>
            <button
              onClick={() => setCurrentMonthOffset((prev) => prev + 1)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '3px', display: 'flex' }}
              title="Bulan Berikutnya"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Sprints Milestone Badges */}
      {sprints.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {sprints.map((s) => (
            <div
              key={s._id}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: s.status === 'ACTIVE' ? 'var(--color-primary-light)' : '#F1F5F9',
                border: `1px solid ${s.status === 'ACTIVE' ? 'var(--color-primary-border)' : 'var(--border-default)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 700,
                color: s.status === 'ACTIVE' ? 'var(--color-primary)' : 'var(--text-subtle)',
              }}
            >
              <Calendar size={12} />
              <span>{s.name} ({s.status})</span>
            </div>
          ))}
        </div>
      )}

      {/* Gantt Timeline Table Container */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Timeline Header (Days of Month) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px repeat(' + daysInMonth + ', minmax(28px, 1fr))',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid var(--border-default)',
            userSelect: 'none',
          }}
        >
          <div style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', borderRight: '1px solid var(--border-default)', textTransform: 'uppercase' }}>
            Issue Key & Summary
          </div>
          {days.map((d) => (
            <div
              key={d}
              style={{
                padding: '10px 0',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-subtle)',
                textAlign: 'center',
                borderRight: '1px solid #F1F5F9',
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Timeline Rows */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {filteredTasks.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Layers size={36} color="var(--border-strong)" style={{ margin: '0 auto 12px auto' }} />
              Belum ada issue di proyek ini.
            </div>
          ) : (
            filteredTasks.map((task, idx) => {
              // Menghitung posisi bar timeline simulasi
              const startDay = ((idx * 3 + 2) % (daysInMonth - 8)) + 1;
              const durationDays = Math.max(3, (task.storyPoints || 3) * 2);
              const endDay = Math.min(daysInMonth, startDay + durationDays);
              const shortId = `${activeProject.key}-${idx + 1}`;

              const barColor =
                task.status === 'DONE'
                  ? 'var(--color-success)'
                  : task.status === 'IN_PROGRESS'
                  ? 'var(--color-primary)'
                  : '#94A3B8';

              return (
                <div
                  key={task._id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '260px repeat(' + daysInMonth + ', minmax(28px, 1fr))',
                    borderBottom: '1px solid #F1F5F9',
                    alignItems: 'center',
                    minHeight: '44px',
                    transition: 'var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {/* Left: Issue Meta */}
                  <div
                    onClick={() => setSelectedTask(task)}
                    style={{
                      padding: '0 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRight: '1px solid var(--border-default)',
                      cursor: 'pointer',
                      height: '100%',
                    }}
                  >
                    <IssueTypeBadge issueType={task.issueType} showLabel={false} size={13} />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)' }}>
                      {shortId}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--text-heading)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1,
                      }}
                      title={task.title}
                    >
                      {task.title}
                    </span>
                  </div>

                  {/* Right: Gantt Bar Span */}
                  <div
                    style={{
                      gridColumn: `${startDay + 1} / ${endDay + 2}`,
                      height: '24px',
                      backgroundColor: barColor,
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 8px',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      gap: '6px',
                    }}
                    onClick={() => setSelectedTask(task)}
                    title={`${task.title} (${task.status}) - ${task.storyPoints || 0} SP`}
                  >
                    <span>{shortId}</span>
                    <span style={{ opacity: 0.9, fontSize: '10px' }}>• {task.status}</span>
                    {task.assigneeId && (
                      <div style={{ marginLeft: 'auto' }}>
                        <Avatar name={task.assigneeId.name} avatarUrl={task.assigneeId.avatar} size={16} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
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
