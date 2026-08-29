import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { Sprint } from '../../types';
import { api } from '../../api/apiClient';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';

interface SprintPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSprintCreated: (sprint: Sprint) => void;
}

export const SprintPlanningModal: React.FC<SprintPlanningModalProps> = ({
  isOpen,
  onClose,
  onSprintCreated,
}) => {
  const { activeProject } = useProject();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;
    if (!name.trim()) {
      showToast('Nama sprint wajib diisi', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post<Sprint>('/sprints', {
        projectId: activeProject._id,
        name: name.trim(),
        goal: goal.trim() || undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      });

      if (res.success && res.data) {
        showToast(`Sprint ${res.data.name} berhasil dibuat!`, 'success');
        onSprintCreated(res.data);
        setName('');
        setGoal('');
        onClose();
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal membuat Sprint', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rencanakan Sprint Baru"
      subtitle={`Project: ${activeProject?.name || ''}`}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Nama Sprint"
          placeholder="Contoh: Sprint 1 - Auth & Core Module"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Tanggal Mulai (Opsional)"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="Tanggal Selesai (Opsional)"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
            Sprint Goal / Target (Opsional)
          </label>
          <textarea
            placeholder="Apa target utama yang ingin dicapai tim dalam sprint ini?"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
          <Button type="button" variant="subtle" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Buat Sprint
          </Button>
        </div>
      </form>
    </Modal>
  );
};
