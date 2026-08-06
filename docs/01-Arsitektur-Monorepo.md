# 01. Arsitektur Monorepo: Overview & Pola Komunikasi

Dokumen ini menjelaskan arsitektur tingkat tinggi dari **Monorepo MERN Stack (Task Management System)** dan bagaimana setiap workspace saling berinteraksi.

## 🏗️ Struktur High-Level

Monorepo diorganisir menggunakan **NPM Workspaces** yang membagi aplikasi menjadi dua domain utama:

```text
[ Browser / Client ]
        │
        ▼ (HTTP REST API / JSON)
┌────────────────────────────────────────────────────────┐
│                      NPM Monorepo                      │
│                                                        │
│  ┌───────────────────────┐   ┌──────────────────────┐  │
│  │     task-client       │   │       task-api       │  │
│  │ (React 19 + Vite + TS)│   │(Express + TS + Mongo)│  │
│  └───────────────────────┘   └──────────┬───────────┘  │
└─────────────────────────────────────────┼──────────────┘
                                          ▼
                                   ┌─────────────┐
                                   │  MongoDB    │
                                   └─────────────┘
```

## 🔄 Alur Komunikasi

1. **Client Interface (`task-client`)**:
   - Menangani UI/UX, formulir interaktif, dan visualisasi Kanban Board.
   - Melakukan HTTP Request ke `task-api` via API Client (Axios / Fetch).

2. **Backend API (`task-api`)**:
   - Menerima request dari client, memvalidasi payload via Zod, dan mengeksekusi logika bisnis.
   - Menggunakan Layered Architecture (Controller -> Service -> Repository).

3. **Database Layer (MongoDB)**:
   - Berinteraksi secara terisolasi hanya dengan `task-api` melalui Mongoose ODM.

## 📦 Prinsip Monorepo Management

- **Shared Dependencies**: Dikelola di root `package.json` jika relevan untuk pengujian atau bundling gabungan.
- **Independent Build**: Masing-masing workspace (`task-api` & `task-client`) dapat di-build secara terpisah untuk opsi deployment mikro.
- **Unified Command**: Root workspace menyediakan command `npm run dev` untuk mengeksekusi kedua aplikasi secara simultan.
