import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar, type ActiveTab } from './Sidebar';
import { KanbanBoard } from '../../features/kanban/KanbanBoard';
import { BacklogView } from '../../features/backlog/BacklogView';
import { AnalyticsDashboard } from '../../features/analytics/AnalyticsDashboard';
import { ProjectSettings } from '../../features/projects/ProjectSettings';

export const AppLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('kanban');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Top Navbar */}
      <Navbar onOpenCreateTaskModal={() => setIsCreateTaskOpen(true)} />

      {/* Main Workspace Frame (Sidebar + Active View) */}
      <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 48px)', overflow: 'hidden' }}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main style={{ flex: 1, backgroundColor: 'var(--bg-app)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'kanban' && (
            <KanbanBoard
              isCreateTaskOpen={isCreateTaskOpen}
              setIsCreateTaskOpen={setIsCreateTaskOpen}
            />
          )}
          {activeTab === 'backlog' && <BacklogView />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'settings' && <ProjectSettings />}
        </main>
      </div>
    </div>
  );
};
