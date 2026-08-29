import React, { useState, useEffect, useCallback } from 'react';
import type { Task } from '../../types';
import { api } from '../../api/apiClient';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';
import { IssueTypeBadge } from '../../components/ui/Badge';
import { TaskDetailModal } from '../kanban/TaskDetailModal';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const CalendarView: React.FC<{ onOpenCreateIssue: () => void }> = ({ onOpenCreateIssue }) => {
  const { activeProject } = useProject();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!activeProject) return;
    try {
      const res = await api.get<Task[]>(`/tasks?projectId=${activeProject._id}`);
      if (res.success && res.data) setTasks(res.data);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat task kalender', 'error');
    }
  }, [activeProject, showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  // First day of month & total days
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevDays = Array.from({ length: (firstDayIndex + 6) % 7 }, (_, i) => daysInPrevMonth - ((firstDayIndex + 6) % 7) + 1 + i);
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const remainingCells = 35 - (prevDays.length + currentDays.length);
  const nextDays = Array.from({ length: Math.max(0, remainingCells > 0 ? remainingCells : (42 - (prevDays.length + currentDays.length))) }, (_, i) => i + 1);

  const weekDayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

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
            <span>Calendar</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>
            Kalender Jadwal Issue
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '2px' }}>
            Visualisasi batas waktu pengerjaan dan jadwal target seluruh issue tim.
          </p>
        </div>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button size="sm" variant="outline" onClick={handleToday}>
            Hari Ini
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '2px 6px', gap: '6px' }}>
            <button
              onClick={handlePrevMonth}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '3px', display: 'flex' }}
              title="Bulan Sebelumnya"
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)', minWidth: '120px', textAlign: 'center' }}>
              {monthName}
            </span>
            <button
              onClick={handleNextMonth}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '3px', display: 'flex' }}
              title="Bulan Berikutnya"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus size={14} />}
            onClick={onOpenCreateIssue}
          >
            Buat Issue
          </Button>
        </div>
      </div>

      {/* Calendar Grid Container */}
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
        {/* Days of Week Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid var(--border-default)',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '11px',
            color: 'var(--text-subtle)',
            padding: '10px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {weekDayNames.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>

        {/* Calendar Grid Cells */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridAutoRows: 'minmax(110px, 1fr)',
            flex: 1,
          }}
        >
          {/* Prev Month Days */}
          {prevDays.map((d) => (
            <div
              key={`prev-${d}`}
              style={{
                borderRight: '1px solid #F1F5F9',
                borderBottom: '1px solid #F1F5F9',
                padding: '8px',
                backgroundColor: '#FAFBFC',
                color: 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              {d}
            </div>
          ))}

          {/* Current Month Days */}
          {currentDays.map((d) => {
            // Filter task yang terpetakan pada hari ini (simulasi pemetaan jadwal)
            const dayTasks = tasks.filter((_, idx) => (idx % daysInMonth) + 1 === d);
            const todayActive = isToday(d);

            return (
              <div
                key={`current-${d}`}
                style={{
                  borderRight: '1px solid #F1F5F9',
                  borderBottom: '1px solid #F1F5F9',
                  padding: '8px',
                  backgroundColor: todayActive ? '#F0F9FF' : '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  overflow: 'hidden',
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = todayActive ? '#E0F2FE' : '#F8FAFC')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = todayActive ? '#F0F9FF' : '#FFFFFF')}
              >
                {/* Date Number Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: todayActive ? 800 : 600,
                      color: todayActive ? 'var(--color-primary)' : 'var(--text-heading)',
                      width: todayActive ? '22px' : 'auto',
                      height: todayActive ? '22px' : 'auto',
                      borderRadius: todayActive ? '50%' : '0',
                      backgroundColor: todayActive ? 'var(--color-primary-light)' : 'transparent',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {d}
                  </span>
                  {todayActive && (
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-primary)' }}>
                      HARI INI
                    </span>
                  )}
                </div>

                {/* Day Tasks List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto', flex: 1 }}>
                  {dayTasks.map((t, idx) => {
                    const shortId = `${activeProject.key}-${idx + 1}`;
                    return (
                      <div
                        key={t._id}
                        onClick={() => setSelectedTask(t)}
                        style={{
                          padding: '3px 6px',
                          borderRadius: '3px',
                          backgroundColor: t.status === 'DONE' ? 'var(--color-success-light)' : '#F1F5F9',
                          border: `1px solid ${t.status === 'DONE' ? 'var(--color-success-border)' : 'var(--border-default)'}`,
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'var(--text-heading)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={`${shortId}: ${t.title} (${t.status})`}
                      >
                        <IssueTypeBadge issueType={t.issueType} showLabel={false} size={11} />
                        <span style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>{shortId}</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Next Month Days */}
          {nextDays.map((d) => (
            <div
              key={`next-${d}`}
              style={{
                borderRight: '1px solid #F1F5F9',
                borderBottom: '1px solid #F1F5F9',
                padding: '8px',
                backgroundColor: '#FAFBFC',
                color: 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              {d}
            </div>
          ))}
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
