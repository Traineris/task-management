import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { api } from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';
import { KeyRound } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'REQUEST' | 'RESET'>('REQUEST');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Masukkan alamat email Anda', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.success) {
        showToast('Kode OTP reset password telah dikirim ke email Anda!', 'success');
        if (res.debugOtpCode) {
          setOtpCode(res.debugOtpCode);
        }
        setStep('RESET');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengirim permintaan reset password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || !newPassword) {
      showToast('Lengkapi kode OTP dan password baru', 'warning');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Password baru minimal 6 karakter', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        email,
        code: otpCode,
        newPassword,
      });
      if (res.success) {
        showToast('Password Anda berhasil diubah! Silakan login dengan password baru.', 'success');
        onClose();
        setStep('REQUEST');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mereset password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'REQUEST' ? 'Lupa Password Akun' : 'Buat Password Baru'}
      subtitle={
        step === 'REQUEST'
          ? 'Masukkan email akun Anda untuk menerima kode OTP verifikasi'
          : `Masukkan kode OTP yang diterima dan password baru untuk ${email}`
      }
    >
      {step === 'REQUEST' ? (
        <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Email Akun"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <Button type="button" variant="subtle" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Kirim Kode OTP
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Kode OTP (6 Digit)"
            placeholder="123456"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.trim())}
            maxLength={6}
            required
            autoFocus
          />
          <Input
            label="Password Baru"
            type="password"
            placeholder="Minimal 6 karakter"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            leftIcon={<KeyRound size={16} />}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <Button type="button" variant="subtle" onClick={() => setStep('REQUEST')}>
              Kembali
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Simpan Password Baru
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
