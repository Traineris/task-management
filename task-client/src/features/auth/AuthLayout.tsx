import React from 'react';
import {
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Paperclip,
  Bookmark,
  AlertCircle,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        backgroundColor: '#F4F5F7',
        overflowX: 'hidden',
      }}
    >
      {/* LEFT COLUMN: Rich Product Showcase & Live Visual Mockups */}
      <div
        style={{
          flex: 1.2,
          background: 'linear-gradient(145deg, #0084FF 0%, #2563EB 35%, #7C3AED 75%, #0F172A 100%)',
          color: '#FFFFFF',
          padding: '48px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Decorative Mesh Grids */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />

        {/* Brand Header */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/web-logo.png"
              alt="WorkFlow Logo"
              style={{
                width: '42px',
                height: '42px',
                objectFit: 'contain',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                padding: '3px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            />
            <div>
              <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                WorkFlow
              </span>
              <div style={{ fontSize: '11px', color: '#DEEBFF', fontWeight: 600, letterSpacing: '0.06em' }}>
                TASK WORKSPACE
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content & Live Kanban Preview Card */}
        <div style={{ position: 'relative', zIndex: 1, margin: '32px 0' }}>
          <div style={{ maxWidth: '520px', marginBottom: '28px' }}>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 800,
                lineHeight: 1.25,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                marginBottom: '12px',
              }}
            >
              Kelola proyek, sprint, dan issue tim dalam satu workspace terpadu.
            </h1>
            <p style={{ fontSize: '15px', color: '#DEEBFF', lineHeight: 1.5 }}>
              Alur kerja kolaboratif dengan Kanban Board interaktif, Agile Backlog, pelacakan story points, dan audit trail aktivitas real-time.
            </p>
          </div>

          {/* Interactive Live Mockup: Mini Kanban Board */}
          <div
            className="animate-fade-in"
            style={{
              maxWidth: '560px',
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              borderRadius: '10px',
              padding: '16px 20px',
              boxShadow: '0 20px 40px -15px rgba(9, 30, 66, 0.5), 0 0 1px rgba(9, 30, 66, 0.3)',
              color: 'var(--text-heading)',
            }}
          >
            {/* Mockup Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '12px',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    backgroundColor: '#0747A6',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '3px',
                  }}
                >
                  BANK
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>
                  Mobile Banking Revamp
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#E3FCEF',
                  color: '#006644',
                  padding: '3px 8px',
                  borderRadius: '12px',
                }}
              >
                <TrendingUp size={12} />
                Sprint 1 • 80% Done
              </div>
            </div>

            {/* Mockup Task Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Card 1: Story in Progress */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-default)',
                  borderLeft: '4px solid #0052CC',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bookmark size={14} color="#36B37E" fill="#36B37E" />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)' }}>
                    [BANK-101] Integrasi Payment Gateway & QRIS
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#DFE1E6', padding: '1px 5px', borderRadius: '10px' }}>
                    5 SP
                  </span>
                  <Avatar name="Budi Senior" size={20} />
                </div>
              </div>

              {/* Card 2: Bug Resolved */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-default)',
                  borderLeft: '4px solid #36B37E',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={14} color="#FF5630" fill="#FF5630" />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)' }}>
                    [BANK-104] Fix OTP Expiry Validation Race Condition
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#006644', backgroundColor: '#E3FCEF', padding: '2px 6px', borderRadius: '3px' }}>
                    DONE
                  </span>
                  <Avatar name="Siti Lead" size={20} />
                </div>
              </div>
            </div>

            {/* Mockup Footer Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '11px',
                color: 'var(--text-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={12} color="var(--color-primary)" /> 14 Komentar
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Paperclip size={12} color="var(--color-primary)" /> 6 Lampiran
                </span>
              </div>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                Drag & Drop Real-time
              </span>
            </div>
          </div>
        </div>

        {/* Left Footer Badges */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: '12px',
            color: '#DEEBFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} color="#36B37E" />
            <span>Role-Based Access (Admin/User)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} color="#36B37E" />
            <span>Audit Trail & Activity Log</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} color="#36B37E" />
            <span>Resend OTP Email Service</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Clean Enterprise Authentication Card */}
      <div
        style={{
          flex: 0.95,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 32px',
          backgroundColor: '#FAFBFC',
        }}
      >
        <div
          className="animate-fade-in"
          style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-default)',
            padding: '36px 32px',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-heading)' }}>
              {title}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-subtle)', marginTop: '4px' }}>
              {subtitle}
            </p>
          </div>

          {children}

          {/* Atlassian-Style Card Footer */}
          <div
            style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'center',
              fontSize: '11px',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
            }}
          >
            Satu akun aman untuk seluruh project tim.<br />
            Dilindungi oleh verifikasi email OTP & enkripsi JWT.
          </div>
        </div>
      </div>
    </div>
  );
};
