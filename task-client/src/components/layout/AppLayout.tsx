import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar, type ActiveTab } from './Sidebar';
import { ProjectSummaryView } from '../../features/summary/ProjectSummaryView';
import { KanbanBoard } from '../../features/kanban/KanbanBoard';
import { BacklogView } from '../../features/backlog/BacklogView';
import { TimelineView } from '../../features/timeline/TimelineView';
import { CalendarView } from '../../features/calendar/CalendarView';
import { ActivityHistoryView } from '../../features/history/ActivityHistoryView';
import { ProjectSettings } from '../../features/projects/ProjectSettings';
import { CommandPalette } from '../ui/CommandPalette';
import { useProject } from '../../context/ProjectContext';
import { api } from '../../api/apiClient';
import type { Task } from '../../types';

export const AppLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('summary');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { activeProject } = useProject();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('workflow_sidebar_collapsed') === 'true';
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('workflow_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Global Ctrl+K Shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch tasks for CommandPalette search
  useEffect(() => {
    if (!activeProject) return;
    api.get<Task[]>(`/tasks?projectId=${activeProject._id}`).then((res) => {
      if (res.success && res.data) setTasks(res.data);
    });
  }, [activeProject, isCreateTaskOpen]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Top Navbar */}
      <Navbar
        onOpenCreateTaskModal={() => setIsCreateTaskOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Workspace Frame (Sidebar + Active View) */}
      <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 48px)', overflow: 'hidden' }}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />

        <main style={{ flex: 1, backgroundColor: 'var(--bg-app)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'summary' && (
            <ProjectSummaryView onNavigateToBoard={() => setActiveTab('board')} />
          )}
          {activeTab === 'board' && (
            <KanbanBoard
              isCreateTaskOpen={isCreateTaskOpen}
              setIsCreateTaskOpen={setIsCreateTaskOpen}
            />
          )}
          {activeTab === 'backlog' && <BacklogView />}
          {activeTab === 'timeline' && <TimelineView />}
          {activeTab === 'calendar' && (
            <CalendarView onOpenCreateIssue={() => setIsCreateTaskOpen(true)} />
          )}
          {activeTab === 'history' && <ActivityHistoryView />}
          {activeTab === 'settings' && <ProjectSettings />}
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenCreateIssue={() => setIsCreateTaskOpen(true)}
        tasks={tasks}
        onSelectTask={() => {
          setActiveTab('board');
        }}
      />
    </div>
  );
};
