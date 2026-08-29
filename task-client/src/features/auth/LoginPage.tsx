import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { OtpModal } from './OtpModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { AuthLayout } from './AuthLayout';
import { api } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail } from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Masukkan email dan password Anda', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        showToast('Login berhasil! Selamat datang kembali.', 'success');
        login(res.data.token, res.data.user);
      }
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('verifikasi')) {
        showToast(err.message, 'warning');
        setIsOtpOpen(true);
      } else {
        showToast(err.message || 'Login gagal. Periksa email atau password Anda.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Explore WorkFlow"
      subtitle="Gunakan akun terdaftar Anda untuk melanjutkan kolaborasi"
    >
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Email Akun"
          type="email"
          placeholder="nama@perusahaan.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          leftIcon={<Mail size={16} />}
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<Lock size={16} />}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => setIsForgotOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Lupa Password?
            </button>
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" isLoading={isLoading} style={{ width: '100%', marginTop: '4px' }}>
          Masuk ke Workspace
        </Button>
      </form>

      {/* Switch to Register */}
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
        Belum memiliki akun tim?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-primary)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Daftar Sekarang
        </button>
      </div>

      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        email={email}
      />

      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </AuthLayout>
  );
};
