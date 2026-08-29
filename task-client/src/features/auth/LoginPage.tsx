import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { OtpModal } from './OtpModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { AuthLayout } from './AuthLayout';
import { api } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();

  // Load remembered email if available
  useEffect(() => {
    const savedEmail = localStorage.getItem('workflow_remembered_email');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast('Masukkan email dan password Anda', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email: email.trim(), password });
      if (res.success && res.data) {
        if (rememberMe) {
          localStorage.setItem('workflow_remembered_email', email.trim());
        } else {
          localStorage.removeItem('workflow_remembered_email');
        }

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
      title="Selamat Datang"
      subtitle="Masuk ke akun WorkFlow Anda untuk melanjutkan aktivitas proyek"
    >
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Email Input */}
        <Input
          label="Email"
          type="email"
          placeholder="nama@perusahaan.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          leftIcon={<Mail size={16} />}
        />

        {/* Password Input with Visibility Toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ position: 'relative' }}>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
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

          {/* Remember Me & Forgot Password Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-subtle)', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
              <span>Ingat saya</span>
            </label>

            <button
              type="button"
              onClick={() => setIsForgotOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '2px 0',
              }}
            >
              Lupa Password?
            </button>
          </div>
        </div>

        {/* Submit Button */}
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
          rightIcon={<ArrowRight size={16} />}
        >
          Masuk
        </Button>
      </form>

      {/* Switch to Register */}
      <div
        style={{
          marginTop: '22px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--text-subtle)',
        }}
      >
        Belum memiliki akun ?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-primary)',
            fontWeight: 700,
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
