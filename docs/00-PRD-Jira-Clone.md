# 00. Product Requirement Document (PRD) - Jira Clone

## 🎯 Visi & Tujuan Produk
Membangun platform manajemen tugas dan kolaborasi tim interaktif bertema **Jira Clone** berbasis MERN Stack yang cepat, responsif, dan siap dikembangkan lebih lanjut (*scalable*).

## 👥 Pengguna & Autentikasi
- **Guest / Unauthenticated**: Dapat melihat landing page, melakukan registrasi, dan login.
- **Authenticated User**: Dapat mengelola profil, membuat Workspace/Project, mengundang anggota, dan mengelola Kanban Board.

## 🔑 Fitur Utama (Core MVP Scope)

### 1. Autentikasi & User Management
- Registrasi akun (Email, Name, Password).
- Login berbasis JWT (JSON Web Token).
- Profile user & session persistence.

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
