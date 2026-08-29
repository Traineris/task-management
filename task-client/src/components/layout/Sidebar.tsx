import React from 'react';
import {
  LayoutGrid,
  ListTodo,
  TrendingUp,
  Settings,
  Users,
  Calendar,
  Layers,
  History,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export type ActiveTab = 'summary' | 'board' | 'backlog' | 'timeline' | 'calendar' | 'history' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { activeProject } = useProject();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'summary', label: 'Summary & Metrics', icon: <TrendingUp size={16} /> },
    { id: 'board', label: 'Active Board', icon: <LayoutGrid size={16} /> },
    { id: 'backlog', label: 'Backlog & Sprints', icon: <ListTodo size={16} /> },
    { id: 'timeline', label: 'Timeline & Roadmap', icon: <Layers size={16} /> },
    { id: 'calendar', label: 'Calendar Jadwal', icon: <Calendar size={16} /> },
    { id: 'history', label: 'Activity History', icon: <History size={16} /> },
    { id: 'settings', label: 'Project Settings', icon: <Settings size={16} /> },
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '60px' : '240px',
        backgroundColor: '#FAFBFC',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 48px)',
        flexShrink: 0,
        userSelect: 'none',
        transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
      }}
    >
      {/* Project Banner Header */}
      <div
        style={{
          padding: isCollapsed ? '14px 12px' : '16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #0084FF 0%, #2563EB 50%, #7C3AED 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '12px',
            letterSpacing: '0.04em',
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)',
            flexShrink: 0,
          }}
          title={activeProject ? activeProject.name : 'Project'}
        >
          {activeProject ? activeProject.key.substring(0, 4) : 'WRK'}
        </div>
        {!isCollapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: '13px',
                color: 'var(--text-heading)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {activeProject ? activeProject.name : 'Pilih Project'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
              <span>Software Workspace</span>
            </div>
          </div>
        )}
      </div>

      {/* Nav Menu Items */}
      <nav style={{ padding: '12px 6px', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, overflowY: 'auto' }}>
        {!isCollapsed && (
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              padding: '6px 12px 4px 12px',
              letterSpacing: '0.06em',
            }}
          >
            PLANNING & WORKSPACE
          </div>
        )}

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={isCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '10px',
                padding: isCollapsed ? '9px 0' : '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                borderLeft: !isCollapsed && isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                background: isActive ? 'var(--color-primary-light)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--text-body)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'var(--transition-fast)',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={{ color: isActive ? 'var(--color-primary)' : 'var(--text-subtle)', display: 'flex' }}>
                {item.icon}
              </span>
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer: Members & Collapse Toggle Button */}
      <div
        style={{
          padding: isCollapsed ? '10px 6px' : '10px 14px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          fontSize: '12px',
          color: 'var(--text-subtle)',
        }}
      >
        {!isCollapsed && activeProject && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} color="var(--color-primary)" />
            <span>{activeProject.members.length + 1} Anggota</span>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-subtle)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>
    </aside>
  );
};
