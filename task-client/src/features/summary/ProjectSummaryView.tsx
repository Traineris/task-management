import React, { useState, useEffect, useCallback } from 'react';
import type { ProjectAnalytics, Task } from '../../types';
import { api } from '../../api/apiClient';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../../components/ui/Avatar';
import { IssueTypeBadge, PriorityBadge } from '../../components/ui/Badge';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
  Target,
  Download,
  Flame,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ProjectSummaryView: React.FC<{ onNavigateToBoard: () => void }> = ({ onNavigateToBoard }) => {
  const { activeProject } = useProject();
  const { showToast } = useToast();

  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSummaryData = useCallback(async () => {
    if (!activeProject) return;
    setIsLoading(true);
    try {
      const [analyticsRes, tasksRes] = await Promise.all([
        api.get<ProjectAnalytics>(`/projects/${activeProject._id}/analytics`),
        api.get<Task[]>(`/tasks?projectId=${activeProject._id}`),
      ]);

      if (analyticsRes.success && analyticsRes.data) setAnalytics(analyticsRes.data);
      if (tasksRes.success && tasksRes.data) setTasks(tasksRes.data);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat ringkasan proyek', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [activeProject, showToast]);

  useEffect(() => {
    fetchSummaryData();
  }, [fetchSummaryData]);

  // Export tasks data to CSV
  const handleExportCSV = () => {
    if (tasks.length === 0) {
      showToast('Tidak ada data issue untuk diekspor', 'warning');
      return;
    }

    const headers = ['Issue ID', 'Judul', 'Status', 'Prioritas', 'Tipe', 'Story Points', 'Assignee', 'Dibuat'];
    const rows = tasks.map((t, idx) => [
      `${activeProject?.key}-${idx + 1}`,
      `"${t.title.replace(/"/g, '""')}"`,
      t.status,
      t.priority,
      t.issueType,
      t.storyPoints || 0,
      `"${t.assigneeId?.name || 'Unassigned'}"`,
      new Date(t.createdAt).toLocaleDateString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeProject?.key || 'PROJECT'}_Issues_Summary.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data ringkasan proyek berhasil diekspor (CSV)', 'success');
  };

  if (!activeProject) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Pilih proyek terlebih dahulu.
      </div>
    );
  }

  if (isLoading || !analytics) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Memuat ringkasan proyek...
      </div>
    );
  }

  const { overview, statusDistribution, priorityDistribution, issueTypeDistribution, activeSprint } = analytics;

  // Hitung persentase & Story Points dari tasks
  const total = overview.totalTasks || 1;
  const donePct = Math.round((overview.completedTasks / total) * 100);
  const inProgressPct = Math.round((overview.inProgressTasks / total) * 100);
  const todoPct = Math.round((overview.todoTasks / total) * 100);

  const totalStoryPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
  const completedStoryPoints = tasks.filter((t) => t.status === 'DONE').reduce((sum, t) => sum + (t.storyPoints || 0), 0);

  // Grouping Assignee Workload
  const memberWorkload: Record<string, { name: string; avatar?: string; count: number }> = {};
  tasks.forEach((t) => {
    const key = t.assigneeId?._id || 'unassigned';
    const name = t.assigneeId?.name || 'Unassigned';
    if (!memberWorkload[key]) {
      memberWorkload[key] = { name, avatar: t.assigneeId?.avatar, count: 0 };
    }
    memberWorkload[key].count++;
  });

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header & Export Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-subtle)', marginBottom: '4px' }}>
            <span>Projects</span>
            <span>/</span>
            <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{activeProject.name}</span>
            <span>/</span>
            <span>Summary</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.03em' }}>
            Project Summary & Metrics
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-subtle)', marginTop: '2px' }}>
            Gambaran menyeluruh status kesehatan, progres sprint, dan distribusi beban kerja tim.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Download size={14} />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={onNavigateToBoard}
          >
            Buka Board
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {/* Total Issues */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Issues
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-heading)', marginTop: '4px' }}>
              {overview.totalTasks}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {totalStoryPoints} Total Story Points
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            <ListTodo size={22} />
          </div>
        </div>

        {/* Completion Rate */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Completion Rate
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-success)', marginTop: '4px' }}>
              {overview.completionRate}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {overview.completedTasks} issue telah selesai
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--color-success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* In Progress */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              In Progress
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0084FF', marginTop: '4px' }}>
              {overview.inProgressTasks}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Sedang aktif dikerjakan tim
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0084FF' }}>
            <Clock size={22} />
          </div>
        </div>

        {/* Story Points Completed */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Velocity Progress
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-accent-purple)', marginTop: '4px' }}>
              {completedStoryPoints} <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>/ {totalStoryPoints} SP</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Poin terselesaikan
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--color-accent-purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-purple)' }}>
            <Flame size={22} />
          </div>
        </div>
      </div>

      {/* Main Grid: Status Progress Breakdown & Active Sprint */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        {/* Status Distribution Progress Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)' }}>
                Distribusi Status Pengerjaan
              </h3>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-subtle)' }}>
              Total {overview.totalTasks} Issue
            </span>
          </div>

          {/* Multi-segment Progress Bar */}
          <div
            style={{
              height: '14px',
              borderRadius: '7px',
              backgroundColor: '#E2E8F0',
              display: 'flex',
              overflow: 'hidden',
              marginTop: '4px',
            }}
          >
            <div style={{ width: `${donePct}%`, backgroundColor: 'var(--color-success)', transition: 'width 0.4s ease' }} title={`Done: ${donePct}%`} />
            <div style={{ width: `${inProgressPct}%`, backgroundColor: 'var(--color-primary)', transition: 'width 0.4s ease' }} title={`In Progress: ${inProgressPct}%`} />
            <div style={{ width: `${todoPct}%`, backgroundColor: '#94A3B8', transition: 'width 0.4s ease' }} title={`To Do: ${todoPct}%`} />
          </div>

          {/* Status Indicators List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '8px' }}>
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-success-light)', border: '1px solid var(--color-success-border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-success-dark)', textTransform: 'uppercase' }}>
                DONE
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-success-dark)', marginTop: '2px' }}>
                {statusDistribution.DONE} <span style={{ fontSize: '12px', fontWeight: 600 }}>({donePct}%)</span>
              </div>
            </div>

            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-primary-border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                IN PROGRESS
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)', marginTop: '2px' }}>
                {statusDistribution.IN_PROGRESS} <span style={{ fontSize: '12px', fontWeight: 600 }}>({inProgressPct}%)</span>
              </div>
            </div>

            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: '#F1F5F9', border: '1px solid var(--border-strong)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                TO DO
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-heading)', marginTop: '2px' }}>
                {statusDistribution.TODO} <span style={{ fontSize: '12px', fontWeight: 600 }}>({todoPct}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Sprint Summary Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="var(--color-accent-purple)" />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)' }}>
              Sprint Aktif
            </h3>
          </div>

          {activeSprint ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)' }}>
                  {activeSprint.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '2px' }}>
                  Target: {activeSprint.goal || 'Belum ada target sprint spesifik'}
                </div>
              </div>

              {/* Progress bar sprint */}
              <div style={{ marginTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--text-body)', marginBottom: '4px' }}>
                  <span>Progres Sprint</span>
                  <span style={{ color: 'var(--color-primary)' }}>{activeSprint.completionRate}%</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                  <div style={{ width: `${activeSprint.completionRate}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '4px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>{activeSprint.completedTasks} dari {activeSprint.totalTasks} issue selesai</span>
                <span>{activeSprint.totalStoryPoints} Story Points</span>
              </div>
            </div>
          ) : (
            <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)' }}>
              Tidak ada sprint yang sedang berjalan saat ini.<br />
              <button
                onClick={onNavigateToBoard}
                style={{ marginTop: '8px', background: 'transparent', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
              >
                Mulai Sprint Baru &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Grid: Issue Types & Priorities Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Issue Types Breakdown */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)' }}>
            Distribusi Jenis Issue
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(['STORY', 'TASK', 'BUG', 'EPIC'] as const).map((type) => {
              const count = issueTypeDistribution[type] || 0;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100px' }}>
                    <IssueTypeBadge issueType={type} />
                  </div>
                  <div style={{ flex: 1, height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: type === 'STORY' ? 'var(--type-story)' : type === 'BUG' ? 'var(--type-bug)' : type === 'EPIC' ? 'var(--type-epic)' : 'var(--type-task)' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)', width: '60px', textAlign: 'right' }}>
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)' }}>
            Tingkat Prioritas Issue
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(['HIGHEST', 'HIGH', 'MEDIUM', 'LOW'] as const).map((prio) => {
              const count = priorityDistribution[prio] || 0;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={prio} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100px' }}>
                    <PriorityBadge priority={prio} showLabel />
                  </div>
                  <div style={{ flex: 1, height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: prio === 'HIGHEST' ? '#DC2626' : prio === 'HIGH' ? '#F97316' : prio === 'MEDIUM' ? '#F59E0B' : '#10B981' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)', width: '60px', textAlign: 'right' }}>
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Workload Allocation */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)' }}>
          Alokasi Beban Kerja Tim (Team Workload)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {Object.entries(memberWorkload).map(([key, data]) => (
            <div
              key={key}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Avatar name={data.name} avatarUrl={data.avatar} size={28} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-heading)' }}>
                    {data.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                    {data.count} Assigned Issues
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)' }}>
                {Math.round((data.count / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
