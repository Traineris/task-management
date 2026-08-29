import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import type { Task, Comment, Activity, Attachment, TaskStatus, TaskPriority, IssueType } from '../../types';
import { api } from '../../api/apiClient';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  MessageSquare,
  History,
  Paperclip,
  Trash2,
  Send,
  Upload,
  FileText,
} from 'lucide-react';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdated: (updatedTask: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onTaskUpdated,
  onTaskDeleted,
}) => {
  const { activeProject } = useProject();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'comments' | 'activities' | 'attachments'>('comments');
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Editable states
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'TODO');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'MEDIUM');
  const [issueType, setIssueType] = useState<IssueType>(task?.issueType || 'TASK');
  const [storyPoints, setStoryPoints] = useState<number | undefined>(task?.storyPoints);
  const [assigneeId, setAssigneeId] = useState<string>(task?.assigneeId?._id || '');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setIssueType(task.issueType);
      setStoryPoints(task.storyPoints);
      setAssigneeId(task.assigneeId?._id || '');
      fetchComments();
      fetchActivities();
      fetchAttachments();
    }
  }, [task]);

  const fetchComments = async () => {
    if (!task) return;
    try {
      const res = await api.get<Comment[]>(`/tasks/${task._id}/comments`);
      if (res.success && res.data) setComments(res.data);
    } catch {
      // ignore
    }
  };

  const fetchActivities = async () => {
    if (!task) return;
    try {
      const res = await api.get<Activity[]>(`/tasks/${task._id}/activities`);
      if (res.success && res.data) setActivities(res.data);
    } catch {
      // ignore
    }
  };

  const fetchAttachments = async () => {
    if (!task) return;
    try {
      const res = await api.get<Attachment[]>(`/tasks/${task._id}/attachments`);
      if (res.success && res.data) setAttachments(res.data);
    } catch {
      // ignore
    }
  };

  const handleUpdateTaskField = async (field: string, value: any) => {
    if (!task) return;
    try {
      const res = await api.patch<Task>(`/tasks/${task._id}`, { [field]: value });
      if (res.success && res.data) {
        onTaskUpdated(res.data);
        showToast('Task diperbarui', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memperbarui task', 'error');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await api.post<Comment>(`/tasks/${task._id}/comments`, { content: newComment.trim() });
      if (res.success && res.data) {
        setComments((prev) => [res.data, ...prev]);
        setNewComment('');
        showToast('Komentar ditambahkan', 'success');
        fetchActivities(); // Refresh log aktivitas
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal menambahkan komentar', 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      showToast('Komentar dihapus', 'info');
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus komentar', 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!task || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const res = await api.post<Attachment>(`/tasks/${task._id}/attachments`, formData);
      if (res.success && res.data) {
        setAttachments((prev) => [res.data, ...prev]);
        showToast(`File ${file.name} berhasil diunggah!`, 'success');
        fetchActivities();
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah file', 'error');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      await api.delete(`/attachments/${attachmentId}`);
      setAttachments((prev) => prev.filter((a) => a._id !== attachmentId));
      showToast('File lampiran dihapus', 'info');
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus lampiran', 'error');
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    if (!window.confirm(`Yakin ingin menghapus task "${task.title}"?`)) return;

    setIsDeleting(true);
    try {
      await api.delete(`/tasks/${task._id}`);
      showToast('Task berhasil dihapus', 'success');
      onTaskDeleted(task._id);
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${activeProject?.key || 'TASK'}`}
      subtitle="Detail Task Issue & Kolaborasi Tim"
      maxWidth="860px"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
        {/* Left Column: Title, Description, Tabs (Comments, Activities, Attachments) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title input */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              if (title.trim() && title !== task.title) {
                handleUpdateTaskField('title', title.trim());
              }
            }}
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-heading)',
              border: '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 8px',
              width: '100%',
              outline: 'none',
            }}
            onFocus={(e) => (e.currentTarget.style.border = '1px solid var(--border-focus)')}
          />

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => {
                if (description !== (task.description || '')) {
                  handleUpdateTaskField('description', description);
                }
              }}
              placeholder="Tambahkan deskripsi detail untuk task ini..."
              rows={4}
              style={{
                width: '100%',
                padding: '8px 10px',
                backgroundColor: '#FAFBFC',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                color: 'var(--text-heading)',
                outline: 'none',
                resize: 'vertical',
              }}
              onFocus={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            />
          </div>

          {/* Activity Tabs Bar */}
          <div style={{ marginTop: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('comments')}
                style={{
                  padding: '8px 4px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'comments' ? '2px solid var(--color-primary)' : '2px solid transparent',
                  color: activeTab === 'comments' ? 'var(--color-primary)' : 'var(--text-subtle)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <MessageSquare size={15} />
                Komentar ({comments.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('attachments')}
                style={{
                  padding: '8px 4px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'attachments' ? '2px solid var(--color-primary)' : '2px solid transparent',
                  color: activeTab === 'attachments' ? 'var(--color-primary)' : 'var(--text-subtle)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Paperclip size={15} />
                Lampiran ({attachments.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('activities')}
                style={{
                  padding: '8px 4px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'activities' ? '2px solid var(--color-primary)' : '2px solid transparent',
                  color: activeTab === 'activities' ? 'var(--color-primary)' : 'var(--text-subtle)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <History size={15} />
                Audit Trail ({activities.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div style={{ minHeight: '160px' }}>
            {/* COMMENTS TAB */}
            {activeTab === 'comments' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    placeholder="Tulis komentar atau update progres..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-default)',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                  <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingComment} leftIcon={<Send size={13} />}>
                    Kirim
                  </Button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {comments.length === 0 ? (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '12px 0' }}>
                      Belum ada komentar pada task ini.
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment._id}
                        style={{
                          padding: '10px 12px',
                          backgroundColor: '#FAFBFC',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Avatar name={comment.userId?.name} avatarUrl={comment.userId?.avatar} size={20} />
                            <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-heading)' }}>
                              {comment.userId?.name || 'User'}
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                              {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {(comment.userId?._id === user?._id || user?.role === 'ADMIN') && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)' }}
                              title="Hapus komentar"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-body)', marginTop: '2px' }}>
                          {comment.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ATTACHMENTS TAB */}
            {activeTab === 'attachments' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px',
                    border: '2px dashed var(--border-default)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#FAFBFC',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                  }}
                >
                  <Upload size={16} />
                  <span>{isUploading ? 'Sedang Mengunggah...' : 'Pilih File untuk Diunggah (Maks 5MB)'}</span>
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {attachments.map((att) => (
                    <div
                      key={att._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={16} color="var(--color-primary)" />
                        <div>
                          <a
                            href={`http://localhost:8001${att.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}
                          >
                            {att.filename}
                          </a>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {(att.fileSize / 1024).toFixed(1)} KB • Diunggah oleh {att.uploadedBy?.name || 'User'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAttachment(att._id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIVITIES TAB */}
            {activeTab === 'activities' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activities.length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '12px 0' }}>
                    Belum ada riwayat aktivitas.
                  </div>
                ) : (
                  activities.map((act) => (
                    <div
                      key={act._id}
                      style={{
                        fontSize: '12px',
                        padding: '6px 8px',
                        borderLeft: '2px solid var(--color-primary)',
                        backgroundColor: '#FAFBFC',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong>{act.userId?.name || 'System'}</strong> {act.details}
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Metadata Panel */}
        <div
          style={{
            borderLeft: '1px solid var(--border-subtle)',
            paddingLeft: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                const newStatus = e.target.value as TaskStatus;
                setStatus(newStatus);
                handleUpdateTaskField('status', newStatus);
              }}
              style={{
                height: '32px',
                padding: '0 8px',
                backgroundColor: status === 'DONE' ? '#E3FCEF' : status === 'IN_PROGRESS' ? '#DEEBFF' : '#DFE1E6',
                color: status === 'DONE' ? '#006644' : status === 'IN_PROGRESS' ? '#0747A6' : '#42526E',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '12px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="TODO">TO DO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

          {/* Assignee */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => {
                const newAssignee = e.target.value || null;
                setAssigneeId(e.target.value);
                handleUpdateTaskField('assigneeId', newAssignee);
              }}
              style={{
                height: '32px',
                padding: '0 8px',
                backgroundColor: '#FAFBFC',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                outline: 'none',
              }}
            >
              <option value="">Unassigned</option>
              {activeProject?.leadId && (
                <option value={activeProject.leadId._id}>
                  {activeProject.leadId.name} (Lead)
                </option>
              )}
              {activeProject?.members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => {
                const newPrio = e.target.value as TaskPriority;
                setPriority(newPrio);
                handleUpdateTaskField('priority', newPrio);
              }}
              style={{
                height: '32px',
                padding: '0 8px',
                backgroundColor: '#FAFBFC',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: 600,
                outline: 'none',
              }}
            >
              <option value="HIGHEST">🔴 Highest</option>
              <option value="HIGH">🟠 High</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="LOW">🟢 Low</option>
            </select>
          </div>

          {/* Issue Type */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Issue Type
            </label>
            <select
              value={issueType}
              onChange={(e) => {
                const newType = e.target.value as IssueType;
                setIssueType(newType);
                handleUpdateTaskField('issueType', newType);
              }}
              style={{
                height: '32px',
                padding: '0 8px',
                backgroundColor: '#FAFBFC',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                outline: 'none',
              }}
            >
              <option value="TASK">📘 Task</option>
              <option value="STORY">📗 Story</option>
              <option value="BUG">📕 Bug</option>
              <option value="EPIC">🟪 Epic</option>
            </select>
          </div>

          {/* Story Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Story Points
            </label>
            <input
              type="number"
              min={0}
              value={storyPoints || ''}
              onChange={(e) => setStoryPoints(e.target.value ? Number(e.target.value) : undefined)}
              onBlur={() => {
                if (storyPoints !== task.storyPoints) {
                  handleUpdateTaskField('storyPoints', storyPoints || null);
                }
              }}
              placeholder="Tidak ditentukan"
              style={{
                height: '32px',
                padding: '0 8px',
                backgroundColor: '#FAFBFC',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                outline: 'none',
              }}
            />
          </div>

          {/* Reporter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              Reporter
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar name={task.reporterId?.name} avatarUrl={task.reporterId?.avatar} size={24} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)' }}>
                {task.reporterId?.name || 'User'}
              </span>
            </div>
          </div>

          {/* Delete Task Button */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <Button
              type="button"
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              leftIcon={<Trash2 size={13} />}
              onClick={handleDeleteTask}
              style={{ width: '100%' }}
            >
              Hapus Issue Task
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
