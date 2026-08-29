import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MailCheck } from 'lucide-react';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  debugOtpCode?: string;
  onSuccess?: () => void;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  email,
  debugOtpCode,
  onSuccess,
}) => {
  const [code, setCode] = useState(debugOtpCode || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      showToast('Masukkan 6 digit kode verifikasi OTP', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, code });
      if (res.success && res.data) {
        showToast('Verifikasi email berhasil! Selamat datang.', 'success');
        login(res.data.token, res.data.user);
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      showToast(err.message || 'Kode verifikasi tidak valid atau telah kedaluwarsa', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await api.post('/auth/send-otp', { email });
      if (res.success) {
        showToast('Kode OTP baru telah dikirimkan ke email Anda!', 'success');
        if (res.debugOtpCode) {
          setCode(res.debugOtpCode);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengirim ulang kode OTP', 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verifikasi Email Anda"
      subtitle={`Kami telah mengirimkan 6 digit kode ke ${email}`}
    >
      <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-primary)',
          }}
        >
          <MailCheck size={28} />
          <div style={{ fontSize: '12px' }}>
            Periksa kotak masuk (atau spam) email Anda untuk mendapatkan kode OTP.
          </div>
        </div>

        <Input
          label="Kode OTP (6 Digit)"
          placeholder="Contoh: 123456"
          value={code}
          onChange={(e) => setCode(e.target.value.trim())}
          maxLength={6}
          autoFocus
          style={{ letterSpacing: '0.25em', fontSize: '18px', textAlign: 'center', fontWeight: 700 }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-primary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isResending ? 'Mengirim...' : 'Kirim Ulang Kode OTP'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
          <Button type="button" variant="subtle" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Verifikasi & Masuk
          </Button>
        </div>
      </form>
    </Modal>
  );
};
