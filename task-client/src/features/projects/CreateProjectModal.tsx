import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useProject } from '../../context/ProjectContext';
import { useToast } from '../../context/ToastContext';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { createProject } = useProject();
  const { showToast } = useToast();

  const handleNameChange = (val: string) => {
    setName(val);
    // Auto-generate project key uppercase (misal Mobile Banking -> MBANK)
    if (!key || key.length <= 4) {
      const generated = val
        .replace(/[^a-zA-Z]/g, '')
        .substring(0, 4)
        .toUpperCase();
      if (generated) setKey(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) {
      showToast('Nama dan Key project wajib diisi', 'warning');
      return;
    }

    if (key.length < 2 || key.length > 10) {
      showToast('Key project harus 2-10 karakter huruf', 'warning');
      return;
    }

    setIsLoading(true);
    const result = await createProject(name.trim(), key.trim().toUpperCase(), description.trim() || undefined);
    setIsLoading(false);

    if (result) {
      setName('');
      setKey('');
      setDescription('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Buat Project Baru"
      subtitle="Atur workspace tim, penomoran task, dan target sprint"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Nama Project"
          placeholder="Contoh: Mobile Banking App"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
          autoFocus
        />

        <Input
          label="Project Key (Singkatan Unik)"
          placeholder="BANK"
          value={key}
          onChange={(e) => setKey(e.target.value.toUpperCase())}
          required
          helperText="Digunakan sebagai prefix nomor issue (contoh: BANK-1, BANK-2)"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-subtle)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Deskripsi Project (Opsional)
          </label>
          <textarea
            placeholder="Jelaskan tujuan dan ruang lingkup project ini..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            Buat Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};
