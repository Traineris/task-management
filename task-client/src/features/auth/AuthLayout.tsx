import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  TrendingUp,
  Bookmark,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {

  const slides = [
    {
      id: 'board',
      tag: 'MANAJEMEN TUGAS',
      title: 'Kanban Board & Alur Kerja',
      desc: 'Visualisasikan alur kerja tim, kelola prioritas tugas, dan pantau progres proyek secara real-time.',
      renderMockup: () => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {/* Header Banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ backgroundColor: 'var(--color-primary)', color: '#FFFFFF', fontWeight: 800, fontSize: '11px', padding: '2px 7px', borderRadius: '4px' }}>
                PROJ
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>
                Pengembangan Aplikasi Tim
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, backgroundColor: 'var(--color-success-light)', color: 'var(--color-success-dark)', padding: '2px 8px', borderRadius: '12px' }}>
              <TrendingUp size={12} />
              85% Selesai
            </div>
          </div>

          {/* Task 1 */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-default)', borderLeft: '4px solid var(--color-sky)', borderRadius: '6px', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bookmark size={14} color="#10B981" fill="#10B981" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)' }}>
                [PROJ-101] Perancangan Antarmuka & Wireframe
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: 'var(--color-amber-light)', color: 'var(--color-amber-dark)', border: '1px solid var(--color-amber-border)', padding: '1px 6px', borderRadius: '10px' }}>
                5 SP
              </span>
              <Avatar name="Budi Pratama" size={20} />
            </div>
          </div>

          {/* Task 2 */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-default)', borderLeft: '4px solid #10B981', borderRadius: '6px', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={14} color="#10B981" fill="#10B981" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)' }}>
                [PROJ-102] Implementasi Modul Autentikasi Pengguna
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-success-dark)', backgroundColor: 'var(--color-success-light)', padding: '2px 6px', borderRadius: '4px' }}>
                DONE
              </span>
              <Avatar name="Sarah Wijaya" size={20} />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'analytics',
      tag: 'METRIK & PROGRES',
      title: 'Ringkasan & Analisis Proyek',
      desc: 'Pantau tingkat penyelesaian tugas, alokasi beban kerja tim, dan distribusi status secara akurat.',
      renderMockup: () => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>Status Kinerja Sprint</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-success)' }}>Efisiensi Tinggi ⚡</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '8px 6px', borderRadius: '6px', border: '1px solid var(--border-default)', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-subtle)', fontWeight: 700 }}>SELESAI</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-success)', marginTop: '1px' }}>88%</div>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '8px 6px', borderRadius: '6px', border: '1px solid var(--border-default)', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-subtle)', fontWeight: 700 }}>BERJALAN</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-sky)', marginTop: '1px' }}>6 Tugas</div>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '8px 6px', borderRadius: '6px', border: '1px solid var(--border-default)', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-subtle)', fontWeight: 700 }}>TARGET SP</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)', marginTop: '1px' }}>32 Poin</div>
            </div>
          </div>

          {/* Multi-segment bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-subtle)', marginBottom: '4px' }}>
              <span>Penyelesaian Milestone Tim</span>
              <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>24 dari 28 Tugas</span>
            </div>
            <div style={{ height: '7px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
              <div style={{ width: '65%', backgroundColor: '#10B981' }} />
              <div style={{ width: '25%', backgroundColor: 'var(--color-sky)' }} />
              <div style={{ width: '10%', backgroundColor: 'var(--color-amber)' }} />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'timeline',
      tag: 'LINIMASA PROYEK',
      title: 'Linimasa & Jadwal Kerja',
      desc: 'Petakan jadwal pelaksanaan fase proyek dan target penyelesaian dengan tampilan linimasa terstruktur.',
      renderMockup: () => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-subtle)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>Fase Pengerjaan Proyek</span>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Rencana Kerja Tim</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '6px', padding: '8px 12px', border: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)' }}>Fase 1: Perencanaan & Penyusunan Kebutuhan</span>
              <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: 'var(--color-success-light)', color: 'var(--color-success-dark)', padding: '2px 7px', borderRadius: '10px' }}>Selesai</span>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '6px', padding: '8px 12px', border: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-heading)' }}>Fase 2: Eksekusi Fitur & Kolaborasi Tim</span>
              <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: 'var(--color-sky-light)', color: 'var(--color-sky)', padding: '2px 7px', borderRadius: '10px' }}>Berjalan</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'collab',
      tag: 'KOLABORASI TIM',
      title: 'Aktivitas & Komunikasi Terpadu',
      desc: 'Catatan pembaruan tugas, komentar, dan berkas kerja tersimpan rapi untuk transparansi seluruh anggota tim.',
      renderMockup: () => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-heading)' }}>Aktivitas Terbaru</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real-time feed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid var(--border-default)' }}>
              <Avatar name="Rian Pratama" size={24} />
              <div style={{ fontSize: '11px', flex: 1 }}>
                <strong style={{ color: 'var(--text-heading)' }}>Rian Pratama</strong> mengunggah berkas <em>dokumentasi_proyek.pdf</em>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>10 menit yang lalu</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid var(--border-default)' }}>
              <Avatar name="Sarah Wijaya" size={24} />
              <div style={{ fontSize: '11px', flex: 1 }}>
                <strong style={{ color: 'var(--text-heading)' }}>Sarah Wijaya</strong> menambahkan komentar pada tugas <em>[PROJ-101]</em>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Baru saja</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const extendedSlides = [...slides, slides[0]];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);

  // Auto rotate carousel continuously every 2.8s without stopping
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 2800);
    return () => clearInterval(timer);
  }, [currentIndex, enableTransition]);

  const handleNext = () => {
    if (currentIndex >= slides.length) {
      setEnableTransition(false);
      setCurrentIndex(0);
      setTimeout(() => {
        setEnableTransition(true);
        setCurrentIndex(1);
      }, 40);
    } else {
      setEnableTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex === 0) {
      setEnableTransition(false);
      setCurrentIndex(slides.length);
      setTimeout(() => {
        setEnableTransition(true);
        setCurrentIndex(slides.length - 1);
      }, 40);
    } else {
      setEnableTransition(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // When reaching the cloned slide (index 4), silently reset to 0 after animation completes
  useEffect(() => {
    if (currentIndex === slides.length) {
      const resetTimeout = setTimeout(() => {
        setEnableTransition(false);
        setCurrentIndex(0);
      }, 560);
      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex, slides.length]);

  const activeDotIndex = currentIndex % slides.length;  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        background: 'var(--gradient-auth)',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Background Dot Matrix Pattern Across Whole Canvas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />

      {/* Ambient Glow Orbs in Background */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(151, 221, 233, 0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* LEFT COLUMN: Dynamic Interactive Showcase Carousel */}
      <div
        style={{
          flex: 1.15,
          color: '#FFFFFF',
          padding: '44px 40px 44px 72px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Brand Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                padding: '4px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/web-logo.png"
                alt="WorkFlow Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                WorkFlow
              </span>
              <div style={{ fontSize: '11px', color: '#DEEBFF', fontWeight: 600, letterSpacing: '0.04em' }}>
                TASK MANAGEMENT WORKSPACE
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content & Sliding Carousel */}
        <div style={{ margin: '20px 0', maxWidth: '620px', width: '100%' }}>
          {/* Synchronized Sliding Text Container */}
          <div style={{ width: '100%', overflow: 'hidden', marginBottom: '16px' }}>
            <div
              style={{
                display: 'flex',
                transform: `translateX(-${currentIndex * (100 / extendedSlides.length)}%)`,
                transition: enableTransition ? 'transform 0.55s cubic-bezier(0.2, 0.9, 0.3, 1)' : 'none',
                width: `${extendedSlides.length * 100}%`,
              }}
            >
              {extendedSlides.map((s, sIdx) => (
                <div
                  key={`${s.id}-${sIdx}`}
                  style={{
                    width: `${100 / extendedSlides.length}%`,
                    flexShrink: 0,
                    paddingRight: '12px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.16)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--color-amber)',
                      marginBottom: '8px',
                    }}
                  >
                    <span>{s.tag}</span>
                  </div>

                  <h1
                    style={{
                      fontSize: '28px',
                      fontWeight: 800,
                      lineHeight: 1.25,
                      color: '#FFFFFF',
                      letterSpacing: '-0.02em',
                      marginBottom: '6px',
                    }}
                  >
                    {s.title}
                  </h1>
                  <p style={{ fontSize: '14.5px', color: '#DEEBFF', lineHeight: 1.5 }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sliding Mockup Cards Track with Shadow Padding Container */}
          <div style={{ width: '100%', overflow: 'hidden', padding: '10px 4px 20px 4px', margin: '-10px -4px -20px -4px' }}>
            <div
              style={{
                display: 'flex',
                transform: `translateX(-${currentIndex * (100 / extendedSlides.length)}%)`,
                transition: enableTransition ? 'transform 0.55s cubic-bezier(0.2, 0.9, 0.3, 1)' : 'none',
                width: `${extendedSlides.length * 100}%`,
              }}
            >
              {extendedSlides.map((s, sIdx) => (
                <div
                  key={`${s.id}-card-${sIdx}`}
                  style={{
                    width: `${100 / extendedSlides.length}%`,
                    flexShrink: 0,
                    padding: '0 6px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      height: '210px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '18px 22px',
                      color: 'var(--text-heading)',
                      boxSizing: 'border-box',
                    }}
                  >
                    {s.renderMockup()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls & Indicator Pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '22px' }}>
            {/* Step Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {slides.map((s, idx) => {
                const isActive = activeDotIndex === idx;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setEnableTransition(true);
                      setCurrentIndex(idx);
                    }}
                    style={{
                      height: '6px',
                      width: isActive ? '28px' : '8px',
                      borderRadius: '3px',
                      backgroundColor: isActive ? 'var(--color-amber)' : 'rgba(255, 255, 255, 0.35)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: 0,
                    }}
                    title={`Slide ${idx + 1}: ${s.title}`}
                  />
                );
              })}
            </div>

            {/* Prev / Next Arrows */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handlePrev}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Left Footer Trust Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: '12px',
            color: '#DEEBFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={15} color="var(--color-amber)" />
            <span>Role-Based Access (Admin/Lead/Member)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="var(--color-amber)" />
            <span>Audit Trail & OTP Security</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Elevated Glassmorphic Form Card */}
      <div
        style={{
          flex: 0.85,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '40px 72px 40px 36px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          className="animate-page-enter"
          style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.8)',
            padding: '38px 34px',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>
              {title}
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-subtle)', marginTop: '4px', lineHeight: 1.4 }}>
              {subtitle}
            </p>
          </div>

          {children}

          {/* Card Footer */}
          <div
            style={{
              marginTop: '28px',
              paddingTop: '18px',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'center',
              fontSize: '11px',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
            }}
          >
            Satu akun terpadu untuk seluruh proyek tim Anda.<br />
          </div>
        </div>
      </div>
    </div>
  );
};
