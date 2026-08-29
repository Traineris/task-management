import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  Plus,
  LogOut,
  FolderKanban,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { NotificationPopover } from '../../features/notifications/NotificationPopover';
import { CreateProjectModal } from '../../features/projects/CreateProjectModal';

interface NavbarProps {
  onOpenCreateTaskModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateTaskModal }) => {
  const { user, logout } = useAuth();
  const { projects, activeProject, setActiveProject } = useProject();
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  return (
    <>
      <header
        style={{
          height: '48px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Left: Brand, Project Switcher & Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '4px',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0, 82, 204, 0.3)',
              }}
            >
              <Layers size={16} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>
              Task Management
            </span>
          </div>

          {/* Project Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: isProjectDropdownOpen ? 'var(--bg-surface-active)' : 'transparent',
                border: '1px solid var(--border-default)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-heading)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isProjectDropdownOpen ? 'var(--bg-surface-active)' : 'transparent')}
            >
              <FolderKanban size={14} color="var(--color-primary)" />
              <span>{activeProject ? activeProject.name : 'Pilih Project'}</span>
              {activeProject && (
                <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#DEEBFF', color: '#0747A6', padding: '1px 5px', borderRadius: '3px' }}>
                  {activeProject.key}
                </span>
              )}
              <ChevronDown size={14} color="var(--text-subtle)" />
            </button>

            {isProjectDropdownOpen && (
              <>
                <div
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 110 }}
                  onClick={() => setIsProjectDropdownOpen(false)}
                />
                <div
                  className="animate-slide-down"
                  style={{
                    position: 'absolute',
                    top: '36px',
                    left: 0,
                    width: '260px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-modal)',
                    border: '1px solid var(--border-default)',
                    zIndex: 111,
                    padding: '6px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--text-subtle)',
                      textTransform: 'uppercase',
                      padding: '6px 8px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Daftar Project ({projects.length})
                  </div>

                  {projects.map((proj) => {
                    const isSelected = activeProject?._id === proj._id;
                    return (
                      <div
                        key={proj._id}
                        onClick={() => {
                          setActiveProject(proj);
                          setIsProjectDropdownOpen(false);
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: isSelected ? 600 : 400,
                          backgroundColor: isSelected ? 'var(--color-primary-light)' : 'transparent',
                          color: isSelected ? 'var(--color-primary)' : 'var(--text-heading)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: isSelected ? '#FFFFFF' : '#DFE1E6', color: 'var(--text-heading)', padding: '1px 5px', borderRadius: '3px' }}>
                            {proj.key}
                          </span>
                          <span>{proj.name}</span>
                        </div>
                        {isSelected && <Check size={14} color="var(--color-primary)" />}
                      </div>
                    );
                  })}

                  <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => {
                        setIsProjectDropdownOpen(false);
                        setIsCreateProjectOpen(true);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-primary)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary-light)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Plus size={14} />
                      Buat Project Baru
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Create Task Button */}
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus size={14} />}
            onClick={onOpenCreateTaskModal}
            disabled={!activeProject}
          >
            Create
          </Button>
        </div>

        {/* Right: Notifications & User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <NotificationPopover />

          {/* User Profile Avatar & Dropdown */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '2px',
                borderRadius: '50%',
                transition: 'var(--transition-fast)',
              }}
              title={user?.name}
            >
              <Avatar name={user?.name} avatarUrl={user?.avatar} size={28} showBorder />
            </div>

            {isUserMenuOpen && (
              <>
                <div
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 110 }}
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div
                  className="animate-slide-down"
                  style={{
                    position: 'absolute',
                    top: '36px',
                    right: 0,
                    width: '240px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-modal)',
                    border: '1px solid var(--border-default)',
                    zIndex: 111,
                    padding: '8px',
                  }}
                >
                  <div style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-heading)' }}>
                      {user?.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '2px' }}>
                      {user?.email}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '3px',
                          backgroundColor: user?.role === 'ADMIN' ? '#FFEBE6' : 'var(--color-primary-light)',
                          color: user?.role === 'ADMIN' ? 'var(--color-danger)' : 'var(--color-primary)',
                        }}
                      >
                        {user?.role}
                      </span>
                      {user?.jobTitle && (
                        <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                          {user.jobTitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-danger)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFEBE6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={14} />
                    Keluar (Logout)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
      />
    </>
  );
};
