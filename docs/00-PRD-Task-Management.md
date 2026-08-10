# 00. Product Requirement Document (PRD) - Task Management System

## 🎯 Visi & Tujuan Produk
Membangun platform manajemen tugas dan kolaborasi tim interaktif berbasis MERN Stack yang cepat, responsif, dan siap dikembangkan lebih lanjut (*scalable*).

## 👥 Pengguna & Autentikasi
- **Guest / Unauthenticated**: Dapat melihat landing page, melakukan registrasi, dan login.
- **Authenticated User**: Dapat mengelola profil, membuat Workspace/Project, mengundang anggota, dan mengelola Kanban Board.

## 🔑 Fitur Utama (Core MVP Scope)

### 1. Autentikasi & User Management (Enterprise Grade)
- Registrasi akun (Email, Name, Password) + Verifikasi Kode OTP Email (Resend API / Nodemailer).
- Login berbasis JWT + Rate Limiting (Brute-Force Protection 3x/1 min).
- Google OAuth 2.0 Single Sign-On (SSO).
- Lupa Password & Reset Password berbasis OTP Email.
- Update Profile (Nama & Avatar) & Ubah Password Akun.
- Dual-Token Architecture (Access Token & Refresh Token) + Revoke Session / Logout.

### 2. Management Workspace & Project
- Memasang workspace default untuk pengguna.
- CRUD Project (Create, Read, Update, Delete).
- Mengatur project lead & daftar anggota.

### 3. Board & Issues (Kanban Workflow)
- Interactive Kanban Board dengan kolom default: **TODO**, **IN_PROGRESS**, **DONE**.
- CRUD Issues/Tasks:
  - Title, Description (Rich Text/Markdown), Priority (Low, Medium, High, Highest), Assignee, Reporter.
  - Drag-and-drop antar kolom status.
- Komentar pada setiap Issue.

## 📊 Kriteria Kinerja & Kualitas
- **Responsivitas UI**: Drag and drop tanpa delay terasa berat (< 100ms render response).
- **Security**: Validasi input ketat via Zod, otentikasi via HTTP Headers.
