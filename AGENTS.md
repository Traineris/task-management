# AGENTS.md - Global Guidance for AI Coding Agents

> **Perhatian untuk AI Agent**: File ini adalah *Single Source of Truth* untuk instruksi dan aturan pengerjaan kode di repository Monorepo MERN Stack ini.

## 🧭 Navigasi Konteks Sistem (`docs/`)

Sebelum melakukan modifikasi kode atau membuat fitur baru, **baca dan ikuti dokumen panduan di direktori `docs/`**:

1. 🎯 **Product Requirements**: [docs/00-PRD-Task-Management.md](file:///e:/GitHub/MERN/docs/00-PRD-Task-Management.md)
2. 🏗️ **System Architecture**: [docs/01-Architecture-System.md](file:///e:/GitHub/MERN/docs/01-Architecture-System.md)
3. ⛔ **Rules & Constraints**: [docs/02-AI-Rules-and-Constraints.md](file:///e:/GitHub/MERN/docs/02-AI-Rules-and-Constraints.md)
4. 🗄️ **Database & API Schema**: [docs/03-Database-and-API-Schema.md](file:///e:/GitHub/MERN/docs/03-Database-and-API-Schema.md)
5. 🎨 **Design System Tokens**: [docs/04-Design-System-Tokens.md](file:///e:/GitHub/MERN/docs/04-Design-System-Tokens.md)
6. ⚙️ **AI Orchestrator**: [docs/05-AI-Orchestrator-and-Prompts.md](file:///e:/GitHub/MERN/docs/05-AI-Orchestrator-and-Prompts.md)
7. 🎭 **Agent Persona Roles**: [docs/06-AI-Agent-Role-Definitions.md](file:///e:/GitHub/MERN/docs/06-AI-Agent-Role-Definitions.md)
8. ✅ **Definition of Done**: [docs/07-Testing-and-Verification-Protocol.md](file:///e:/GitHub/MERN/docs/07-Testing-and-Verification-Protocol.md)

---

## ⚡ Ringkasan Peraturan Utama

- **Workspaces**: Repository ini menggunakan NPM Workspaces (`task-api` & `task-client`).
- **Strict Boundaries**:
  - Dilarang memodifikasi file di folder `node_modules/`, `dist/`, `.git/`.
  - Dilarang membuat perubahan besar (refactor masif) di luar kebutuhan tugas.
- **Backend Standard (`task-api`)**: Wajib menerapkan Three-Tier Architecture (`Controller` -> `Service` -> `Repository`).
- **Frontend Standard (`task-client`)**: Wajib menerapkan Feature-Based Structure & Design System Tokens.
- **Verifikasi**: Jalankan `npm run build` dari root sebelum menyatakan pekerjaan selesai.
