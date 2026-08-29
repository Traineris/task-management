import React, { useState, useEffect, useCallback } from 'react';
import type { ProjectAnalytics } from '../../types';
import { api } from '../../api/apiClient';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  ListTodo,
  Target,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { activeProject } = useProject();
  const { showToast } = useToast();

  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!activeProject) return;
    try {
      const res = await api.get<ProjectAnalytics>(`/projects/${activeProject._id}/analytics`);
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat analitik project', 'error');
    }
  }, [activeProject, showToast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (!activeProject) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
        Pilih project terlebih dahulu.
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Memuat analitik...
      </div>
    );
  }

  const { overview, statusDistribution, priorityDistribution, issueTypeDistribution, activeSprint } = analytics;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-heading)' }}>
          Project Analytics & Health
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '2px' }}>
          Ringkasan performa pengerjaan tugas dan metrik sprint project {activeProject.name}
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {/* Total Tasks */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            <ListTodo size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Total Issues
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)' }}>
              {overview.totalTasks}
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#E3FCEF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#006644' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Completion Rate
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#006644' }}>
              {overview.completionRate}%
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#FFF0B3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B78103' }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              In Progress
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)' }}>
              {overview.inProgressTasks}
            </div>
          </div>
        </div>

        {/* Completed */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#E3FCEF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#36B37E' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Completed
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-heading)' }}>
              {overview.completedTasks}
            </div>
          </div>
        </div>
      </div>

      {/* Active Sprint Highlights */}
      {activeSprint && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            border: '2px solid var(--color-primary)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} color="var(--color-primary)" />
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)' }}>
                Active Sprint: {activeSprint.name}
              </span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
              {activeSprint.completionRate}% Done
            </span>
          </div>

          {activeSprint.goal && (
            <div style={{ fontSize: '12px', color: 'var(--text-subtle)', backgroundColor: '#FAFBFC', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
              🎯 <strong>Sprint Goal:</strong> {activeSprint.goal}
            </div>
          )}

          {/* Sprint Progress Bar */}
          <div style={{ width: '100%', height: '8px', backgroundColor: '#EBECF0', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${activeSprint.completionRate}%`,
                height: '100%',
                backgroundColor: 'var(--color-primary)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: 'var(--text-body)', marginTop: '4px' }}>
            <span><strong>{activeSprint.completedTasks}</strong> dari <strong>{activeSprint.totalTasks}</strong> tasks selesai</span>
            <span>•</span>
            <span><strong>{activeSprint.totalStoryPoints}</strong> Total Story Points</span>
          </div>
        </div>
      )}

      {/* Distribution Breakdown Grids */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Status Distribution */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>
            Distribusi Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(statusDistribution).map(([statusKey, count]) => {
              const pct = overview.totalTasks > 0 ? Math.round((count / overview.totalTasks) * 100) : 0;
              return (
                <div key={statusKey} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{statusKey.replace('_', ' ')}</span>
                    <span style={{ color: 'var(--text-subtle)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#EBECF0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: statusKey === 'DONE' ? '#36B37E' : statusKey === 'IN_PROGRESS' ? '#0052CC' : '#DFE1E6' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>
            Tingkat Prioritas Issue
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(priorityDistribution).map(([prioKey, count]) => {
              const pct = overview.totalTasks > 0 ? Math.round((count / overview.totalTasks) * 100) : 0;
              const color = prioKey === 'HIGHEST' ? '#DE350B' : prioKey === 'HIGH' ? '#FF5630' : prioKey === 'MEDIUM' ? '#FFAB00' : '#36B37E';
              return (
                <div key={prioKey} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{prioKey}</span>
                    <span style={{ color: 'var(--text-subtle)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#EBECF0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Issue Type Distribution */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>
            Tipe Issue (Agile Distribution)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(issueTypeDistribution).map(([typeKey, count]) => {
              const pct = overview.totalTasks > 0 ? Math.round((count / overview.totalTasks) * 100) : 0;
              const color = typeKey === 'STORY' ? '#36B37E' : typeKey === 'BUG' ? '#FF5630' : typeKey === 'EPIC' ? '#998DD9' : '#4C9AFF';
              return (
                <div key={typeKey} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{typeKey}</span>
                    <span style={{ color: 'var(--text-subtle)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#EBECF0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
