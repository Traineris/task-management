import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { OtpModal } from './OtpModal';
import { AuthLayout } from './AuthLayout';
import { api } from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, User as UserIcon, Briefcase, Eye, EyeOff } from 'lucide-react';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [debugOtp, setDebugOtp] = useState<string | undefined>();

  const { showToast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Harap lengkapi semua field yang wajib diisi', 'warning');
      return;
    }

    if (password.length < 6) {
      showToast('Password minimal 6 karakter', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        jobTitle: jobTitle || undefined,
      });

      if (res.success) {
        showToast('Pendaftaran berhasil! Silakan masukkan kode OTP yang dikirim.', 'success');
        if (res.data && res.data.debugOtpCode) {
          setDebugOtp(res.data.debugOtpCode);
        }
        setIsOtpOpen(true);
      }
    } catch (err: any) {
      showToast(err.message || 'Pendaftaran gagal. Email mungkin sudah terdaftar.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Buat Akun Tim Baru"
      subtitle="Mulai kolaborasi proyek dan sprint bersama tim Anda"
    >
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Input
          label="Nama Lengkap"
          placeholder="Contoh: Budi Pratama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          leftIcon={<UserIcon size={16} />}
        />

        <Input
          label="Email Kantor"
          type="email"
          placeholder="budi@perusahaan.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          leftIcon={<Mail size={16} />}
        />

        <Input
          label="Posisi / Job Title (Opsional)"
          placeholder="Frontend Engineer / Product Lead"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          leftIcon={<Briefcase size={16} />}
        />

        <div style={{ position: 'relative' }}>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<Lock size={16} />}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '28px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
            }}
            title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          style={{
            width: '100%',
            marginTop: '6px',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #424C8C 100%)',
            boxShadow: '0 4px 12px rgba(82, 94, 167, 0.25)',
          }}
        >
          Daftar & Terima Kode OTP
        </Button>
      </form>

      <div
        style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--text-subtle)',
        }}
      >
        Sudah memiliki akun?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-primary)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Masuk Sekarang
        </button>
      </div>

      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        email={email}
        debugOtpCode={debugOtp}
      />
    </AuthLayout>
  );
};
