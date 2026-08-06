# 01. Arsitektur Frontend: Feature-Based & Component Design

Dokumen ini menjelaskan struktur arsitektur pada aplikasi frontend `task-client`.

## 📁 Struktur Folder `task-client/src`

Aplikasi menggunakan pola **Feature-Based Architecture** untuk mempermudah skalabilitas:

```text
src/
├── assets/          # Gambar, icon, font statis
├── components/      # UI Components global/reusable (Button, Modal, Input, Navbar)
├── features/        # Fitur-fitur domain spesifik
│   ├── auth/        # LoginForm, RegisterForm, useAuth hook
│   ├── board/       # KanbanBoard, BoardColumn, TaskCard
│   └── projects/    # ProjectList, ProjectSettings
├── hooks/           # Custom React hooks global (useTheme, useDebounce)
├── layouts/         # Layout wrapper (DashboardLayout, AuthLayout)
├── pages/           # Page routes (HomePage, BoardPage, LoginPage)
├── services/        # API Client instance & endpoints call
├── types/           # TypeScript interfaces & types global
└── utils/           # Utility functions (date formatting, string helpers)
```

## 🧩 Modul & Komponen UI

1. **Reusable UI Components (`components/`)**:
   - Komponen tanpa logika bisnis khusus (Pure / Presentational Components).
   - Menautkan props & styling secara eksplisit.

2. **Feature Modules (`features/`)**:
   - Berisi state management, komponen khusus domain, dan hook internal fitur tersebut.

3. **Page Views (`pages/`)**:
   - Berisi komponen level teratas yang dirutekan oleh router. Hanya mengaitkan Layout dan Feature Components.
