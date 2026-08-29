import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api/apiClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Trash2, Users } from 'lucide-react';

export const ProjectSettings: React.FC = () => {
  const { activeProject, setActiveProject, fetchProjects } = useProject();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(activeProject?.name || '');
  const [description, setDescription] = useState(activeProject?.description || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isLeadOrAdmin =
    activeProject?.leadId._id === user?._id || user?.role === 'ADMIN';

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    setIsUpdating(true);
    try {
      const res = await api.put(`/projects/${activeProject._id}`, {
        name: name.trim(),
        description: description.trim() || undefined,
      });

      if (res.success && res.data) {
        showToast('Pengaturan project berhasil diperbarui!', 'success');
        setActiveProject(res.data);
        await fetchProjects();
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memperbarui project', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!activeProject) return;
    if (!window.confirm(`PERINGATAN: Menghapus project "${activeProject.name}" akan menghapus seluruh task, sprint, dan lampiran file di dalamnya secara permanen. Lanjutkan?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/projects/${activeProject._id}`);
      showToast(`Project ${activeProject.name} telah dihapus`, 'success');
      setActiveProject(null);
      await fetchProjects();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus project', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!activeProject) {
    return <div style={{ padding: '32px', color: 'var(--text-muted)' }}>Pilih project terlebih dahulu.</div>;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-heading)' }}>
          Project Settings
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '2px' }}>
          Atur informasi umum dan hak akses project {activeProject.name}
        </p>
      </div>

      {/* General Settings Form */}
      <form
        onSubmit={handleUpdate}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '16px' }}>
          <Input
            label="Nama Project"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={!isLeadOrAdmin}
          />
          <Input
            label="Key"
            value={activeProject.key}
            disabled
            helperText="Tetap / Permanen"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
            Deskripsi Project
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isLeadOrAdmin}
            rows={3}
            style={{
              width: '100%',
              padding: '8px 10px',
              backgroundColor: '#FAFBFC',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        {isLeadOrAdmin && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Button type="submit" variant="primary" isLoading={isUpdating}>
              Simpan Perubahan
            </Button>
          </div>
        )}
      </form>

      {/* Team Members List */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} color="var(--color-primary)" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-heading)' }}>
            Anggota Tim ({activeProject.members.length + 1})
          </h3>
        </div>

        {/* Lead */}
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Avatar name={activeProject.leadId.name} avatarUrl={activeProject.leadId.avatar} size={28} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-heading)' }}>
                {activeProject.leadId.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                {activeProject.leadId.email}
              </div>
            </div>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '10px' }}>
            Project Lead
          </span>
        </div>

        {/* Members */}
        {activeProject.members.map((member) => (
          <div
            key={member._id}
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Avatar name={member.name} avatarUrl={member.avatar} size={28} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-heading)' }}>
                  {member.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                  {member.email}
                </div>
              </div>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Member
            </span>
          </div>
        ))}
      </div>

      {/* Danger Zone: Delete Project */}
      {isLeadOrAdmin && (
        <div
          style={{
            backgroundColor: '#FFEBE6',
            borderRadius: 'var(--radius-md)',
            padding: '20px 24px',
            border: '1px solid #FFBDAD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#DE350B' }}>
              Hapus Project Ini
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-body)', marginTop: '2px' }}>
              Tindakan ini permanen dan akan menghapus seluruh data yang terkait.
            </div>
          </div>
          <Button
            type="button"
            variant="danger"
            size="sm"
            isLoading={isDeleting}
            leftIcon={<Trash2 size={14} />}
            onClick={handleDelete}
          >
            Hapus Project
          </Button>
        </div>
      )}
    </div>
  );
};
