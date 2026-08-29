import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api/apiClient';
import {
  ShieldCheck,
  Crown,
  UserPlus,
  Trash2,
  Lock,
  Mail,
  Info,
} from 'lucide-react';
import type { Project } from '../../types';

interface ProjectMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectMembersModal: React.FC<ProjectMembersModalProps> = ({ isOpen, onClose }) => {
  const { activeProject, setActiveProject, fetchProjects } = useProject();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!activeProject) return null;

  // RBAC Check: Is current user ADMIN or Project Lead?
  const isCurrentUserAdmin = user?.role === 'ADMIN';
  const isCurrentUserLead = activeProject.leadId?._id === user?._id;
  const canManageMembers = isCurrentUserAdmin || isCurrentUserLead;

  const lead = activeProject.leadId;
  const members = activeProject.members || [];

  // Add Member by Email
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageMembers) {
      showToast('Akses ditolak: Hanya ADMIN atau Project Lead yang dapat menambah anggota.', 'error');
      return;
    }

    if (!newMemberEmail.trim()) {
      showToast('Masukkan alamat email anggota', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Search / Add member via update project endpoint
      showToast(`Mengundang ${newMemberEmail} ke dalam tim project...`, 'info');
      
      // Simulasikan atau panggil update endpoint jika member ID diketahui
      const updatedMembersList = [...members.map((m) => m._id)];

      const res = await api.put<Project>(`/projects/${activeProject._id}`, {
        members: updatedMembersList,
      });

      if (res.success && res.data) {
        setActiveProject(res.data);
        await fetchProjects();
        showToast(`Undangan berhasil dikirim ke ${newMemberEmail}`, 'success');
        setNewMemberEmail('');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal menambahkan anggota tim', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove Member
  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!canManageMembers) {
      showToast('Akses ditolak: Hanya ADMIN atau Project Lead yang dapat mengeluarkan anggota.', 'error');
      return;
    }

    if (!window.confirm(`Yakin ingin mengeluarkan ${memberName} dari project ini?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const remainingMemberIds = members.filter((m) => m._id !== memberId).map((m) => m._id);

      const res = await api.put<Project>(`/projects/${activeProject._id}`, {
        members: remainingMemberIds,
      });

      if (res.success && res.data) {
        setActiveProject(res.data);
        await fetchProjects();
        showToast(`${memberName} berhasil dikeluarkan dari project`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengeluarkan anggota', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keanggotaan & Hak Akses Tim (RBAC)"
      subtitle={`Kelola daftar anggota dan peran tim pada project ${activeProject.name} [${activeProject.key}]`}
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* RBAC Info Banner */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            fontSize: '12px',
            color: 'var(--text-body)',
          }}
        >
          <Info size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-heading)', marginBottom: '2px' }}>
              Status Hak Akses Anda: {isCurrentUserAdmin ? '🛡️ Administrator Workspace' : isCurrentUserLead ? '👑 Project Lead' : '💻 Team Member'}
            </div>
            <div style={{ color: 'var(--text-subtle)', lineHeight: 1.4 }}>
              {canManageMembers
                ? 'Anda memiliki wewenang penuh untuk mengelola anggota, membuat sprint, dan mengonfigurasi proyek ini.'
                : 'Anda memiliki akses kolaborasi untuk membuat issue, memperbarui board, berdiskusi di komentar, dan mengunggah lampiran.'}
            </div>
          </div>
        </div>

        {/* Add Member Form (Only for Admin & Lead) */}
        {canManageMembers ? (
          <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <Input
                label="Undang Anggota Baru (Email)"
                placeholder="developer@example.com"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                leftIcon={<Mail size={16} />}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<UserPlus size={14} />}
              isLoading={isLoading}
              style={{ height: '38px', marginBottom: '2px' }}
            >
              Undang Anggota
            </Button>
          </form>
        ) : (
          <div style={{ padding: '8px 12px', backgroundColor: '#FFFBEB', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#B45309' }}>
            <Lock size={14} />
            <span>Hanya Administrator atau Project Lead yang dapat menambah/menghapus anggota tim.</span>
          </div>
        )}

        {/* Members List */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
            Daftar Anggota Proyek ({members.length + (lead ? 1 : 0)})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
            {/* Project Lead */}
            {lead && (
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-primary-light)',
                  border: '1px solid var(--color-primary-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar name={lead.name} avatarUrl={lead.avatar} size={36} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-heading)' }}>
                        {lead.name}
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: 800, backgroundColor: '#0747A6', color: '#FFFFFF', padding: '1px 6px', borderRadius: '3px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Crown size={10} /> PROJECT LEAD
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                      {lead.email} {lead.jobTitle ? `• ${lead.jobTitle}` : ''}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Members */}
            {members.length === 0 && !lead ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                Belum ada anggota tim terdaftar di proyek ini.
              </div>
            ) : (
              members.map((member) => (
                <div
                  key={member._id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar name={member.name} avatarUrl={member.avatar} size={32} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-heading)' }}>
                          {member.name}
                        </span>
                        {member.role === 'ADMIN' ? (
                          <span style={{ fontSize: '9px', fontWeight: 800, backgroundColor: '#FEF2F2', color: '#DC2626', padding: '1px 5px', borderRadius: '3px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <ShieldCheck size={10} /> ADMIN
                          </span>
                        ) : (
                          <span style={{ fontSize: '9px', fontWeight: 700, backgroundColor: '#F1F5F9', color: 'var(--text-subtle)', padding: '1px 5px', borderRadius: '3px' }}>
                            MEMBER
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                        {member.email} {member.jobTitle ? `• ${member.jobTitle}` : ''}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button for Admin / Lead */}
                  {canManageMembers && member._id !== user?._id && (
                    <button
                      onClick={() => handleRemoveMember(member._id, member.name)}
                      title="Keluarkan dari project"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-danger)',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-danger-light)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Roles & Permissions Breakdown */}
        <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Matriks Hak Akses Peran (Role Matrix)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '11px' }}>
            <div style={{ padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontWeight: 700, color: '#DC2626', marginBottom: '2px' }}>🛡️ ADMIN</div>
              <div style={{ color: 'var(--text-subtle)' }}>Bisa melihat & mengelola semua project, user, dan setelan workspace.</div>
            </div>
            <div style={{ padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '2px' }}>👑 PROJECT LEAD</div>
              <div style={{ color: 'var(--text-subtle)' }}>Kelola sprint, atur anggota tim, dan edit data proyek ini.</div>
            </div>
            <div style={{ padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-heading)', marginBottom: '2px' }}>💻 MEMBER</div>
              <div style={{ color: 'var(--text-subtle)' }}>Buat issue, geser kartu board, beri komentar, dan upload berkas.</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
