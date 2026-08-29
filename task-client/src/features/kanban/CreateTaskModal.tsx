import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { IssueType, TaskPriority, TaskStatus, Task } from '../../types';
import { api } from '../../api/apiClient';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';
import { IssueTypeBadge, PriorityBadge } from '../../components/ui/Badge';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
  defaultStatus?: TaskStatus;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
  defaultStatus = 'TODO',
}) => {
  const { activeProject } = useProject();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [issueType, setIssueType] = useState<IssueType>('TASK');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [status] = useState<TaskStatus>(defaultStatus);
  const [storyPoints, setStoryPoints] = useState<number | undefined>();
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) {
      showToast('Pilih project terlebih dahulu', 'warning');
      return;
    }

    if (!title.trim()) {
      showToast('Judul task wajib diisi', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = {
        projectId: activeProject._id,
        title: title.trim(),
        description: description.trim() || undefined,
        issueType,
        priority,
        status,
        storyPoints: storyPoints ? Number(storyPoints) : 0,
        assigneeId: assigneeId || undefined,
      };

      const res = await api.post<Task>('/tasks', payload);
      if (res.success && res.data) {
        showToast('Issue berhasil dibuat!', 'success');
        onTaskCreated(res.data);
        onClose();
        // Reset Form
        setTitle('');
        setDescription('');
        setStoryPoints(undefined);
        setAssigneeId('');
        setIssueType('TASK');
        setPriority('MEDIUM');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal membuat task', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Issue"
      subtitle={`Project: ${activeProject?.name || ''} (${activeProject?.key || ''})`}
      maxWidth="640px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Issue Type Selector Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Issue Type
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {(['TASK', 'STORY', 'BUG', 'EPIC'] as IssueType[]).map((type) => {
              const isSelected = issueType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setIssueType(type)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-default)',
                    backgroundColor: isSelected ? 'var(--color-primary-light)' : '#FAFBFC',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <IssueTypeBadge issueType={type} showLabel size={13} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority Selector Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Priority
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {(['HIGHEST', 'HIGH', 'MEDIUM', 'LOW'] as TaskPriority[]).map((prio) => {
              const isSelected = priority === prio;
              return (
                <button
                  key={prio}
                  type="button"
                  onClick={() => setPriority(prio)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-default)',
                    backgroundColor: isSelected ? 'var(--color-primary-light)' : '#FAFBFC',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <PriorityBadge priority={prio} showLabel size={13} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <Input
          label="Summary / Judul Task"
          placeholder="Ringkasan tugas yang perlu dikerjakan"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
            Description
          </label>
          <textarea
            placeholder="Jelaskan rincian task, acceptance criteria, atau langkah reproduksi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '8px 10px',
              backgroundColor: '#FAFBFC',
              border: '2px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              color: 'var(--text-heading)',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Story Points & Assignee Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Story Points (Bobot)"
            type="number"
            placeholder="1, 2, 3, 5, 8"
            min={0}
            value={storyPoints || ''}
            onChange={(e) => setStoryPoints(e.target.value ? Number(e.target.value) : undefined)}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              style={{
                height: '36px',
                padding: '0 10px',
                backgroundColor: '#FAFBFC',
                border: '2px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                color: 'var(--text-heading)',
                outline: 'none',
              }}
            >
              <option value="">Unassigned</option>
              {activeProject?.leadId && (
                <option value={activeProject.leadId._id}>
                  {activeProject.leadId.name} (Project Lead)
                </option>
              )}
              {activeProject?.members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
          <Button type="button" variant="subtle" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create Issue
          </Button>
        </div>
      </form>
    </Modal>
  );
};
