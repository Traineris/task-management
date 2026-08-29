import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutGrid,
  Calendar,
  Layers,
  History,
  TrendingUp,
  Plus,
  ArrowRight,
} from 'lucide-react';
import type { Task } from '../../types';
import { IssueTypeBadge } from './Badge';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: 'summary' | 'board' | 'backlog' | 'timeline' | 'calendar' | 'history') => void;
  onOpenCreateIssue: () => void;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenCreateIssue,
  tasks,
  onSelectTask,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const navigationActions = [
    { label: 'Buka Project Summary', icon: <TrendingUp size={16} />, action: () => { onNavigate('summary'); onClose(); } },
    { label: 'Buka Active Board', icon: <LayoutGrid size={16} />, action: () => { onNavigate('board'); onClose(); } },
    { label: 'Buka Timeline & Roadmap', icon: <Layers size={16} />, action: () => { onNavigate('timeline'); onClose(); } },
    { label: 'Buka Calendar Jadwal', icon: <Calendar size={16} />, action: () => { onNavigate('calendar'); onClose(); } },
    { label: 'Buka Backlog & Sprints', icon: <Layers size={16} />, action: () => { onNavigate('backlog'); onClose(); } },
    { label: 'Buka Activity History', icon: <History size={16} />, action: () => { onNavigate('history'); onClose(); } },
    { label: 'Buat Issue Baru (+)', icon: <Plus size={16} />, action: () => { onOpenCreateIssue(); onClose(); } },
  ].filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
      }}
      onClick={onClose}
    >
      <div
        className="animate-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '560px',
          maxWidth: '92vw',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-modal)',
          border: '1px solid var(--border-default)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'modalScale 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--border-default)', gap: '10px' }}>
          <Search size={18} color="var(--color-primary)" />
          <input
            autoFocus
            placeholder="Ketik navigasi atau cari issue (contoh: board, summary, bug)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-heading)',
            }}
          />
          <kbd style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: 'var(--text-subtle)', border: '1px solid var(--border-strong)' }}>
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px' }}>
          {/* Navigation Section */}
          {navigationActions.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Navigasi Cepat
              </div>
              {navigationActions.map((action, idx) => (
                <div
                  key={action.label}
                  onClick={action.action}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text-heading)',
                    backgroundColor: idx === selectedIndex && query ? '#F1F5F9' : 'transparent',
                    transition: 'var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: 'var(--color-primary)' }}>{action.icon}</div>
                    <span>{action.label}</span>
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          )}

          {/* Issues Section */}
          {filteredTasks.length > 0 && (
            <div>
              <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Hasil Pencarian Issue
              </div>
              {filteredTasks.map((t) => (
                <div
                  key={t._id}
                  onClick={() => {
                    onSelectTask(t);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: 'var(--text-heading)',
                    transition: 'var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <IssueTypeBadge issueType={t.issueType} showLabel={false} size={13} />
                    <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {navigationActions.length === 0 && filteredTasks.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              Tidak ada hasil yang ditemukan untuk "{query}"
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{ padding: '8px 16px', backgroundColor: '#F8FAFC', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>Gunakan panah untuk navigasi</span>
          <span>Tekan ESC untuk menutup</span>
        </div>
      </div>
    </div>
  );
};
