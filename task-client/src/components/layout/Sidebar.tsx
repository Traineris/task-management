import React from 'react';
import {
  Kanban,
  ListTodo,
  BarChart3,
  Settings,
  Users,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export type ActiveTab = 'kanban' | 'backlog' | 'analytics' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { activeProject } = useProject();

  const navItems = [
    { id: 'kanban', label: 'Kanban Board', icon: <Kanban size={16} /> },
    { id: 'backlog', label: 'Backlog & Sprints', icon: <ListTodo size={16} /> },
    { id: 'analytics', label: 'Reports & Analytics', icon: <BarChart3 size={16} /> },
    { id: 'settings', label: 'Project Settings', icon: <Settings size={16} /> },
  ];

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: '#FAFBFC',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 48px)',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {/* Project Banner Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#0747A6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '12px',
            letterSpacing: '0.04em',
            boxShadow: '0 1px 3px rgba(7, 71, 166, 0.25)',
          }}
        >
          {activeProject ? activeProject.key.substring(0, 4) : 'PRJ'}
        </div>
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
            <span>Software project</span>
          </div>
        </div>
      </div>

      {/* Nav Menu Items */}
      <nav style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
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
          PLANNING & WORKFLOW
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as ActiveTab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                background: isActive ? 'var(--color-primary-light)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--text-body)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={{ color: isActive ? 'var(--color-primary)' : 'var(--text-subtle)' }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Project Members Footer */}
      {activeProject && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--text-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} color="var(--color-primary)" />
            <span>{activeProject.members.length + 1} Anggota Tim</span>
          </div>
        </div>
      )}
    </aside>
  );
};
