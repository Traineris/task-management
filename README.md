# Monorepo MERN Stack (Task Management System)

Sistem Monorepo enterprise berbasis **MERN Stack** (MongoDB, Express, React, Node.js) yang dirancang dengan prinsip **Clean Architecture**, **SOLID Principles**, dan **NPM Workspaces**.

---

## 🏗️ Arsitektur Monorepo & Struktur Folder

Repository ini menggunakan **NPM Workspaces** untuk mengelola backend API dan frontend client dalam satu repository tunggal.

```text
MERN/
├── package.json              # Root package.json (Workspaces & Scripts)
├── README.md                 # Dokumentasi utama proyek
├── task-api/                 # Backend Workspace (Express.js + TypeScript + Mongoose)
│   ├── docs/                 # Dokumentasi arsitektur enterprise backend
│   ├── src/
│   │   ├── controllers/      # Layer Presentation / HTTP Handlers
│   │   ├── services/         # Layer Business Logic
│   │   ├── repositories/     # Layer Data Access (Mongoose DB Queries)
│   │   ├── models/           # Mongoose Schemas & Interfaces
│   │   ├── middlewares/      # Error Handler, Rate Limiter, Auth Middleware
│   │   ├── utils/            # Logger (Winston), Response Helpers
│   │   └── server.ts         # Entry point server Express
│   └── tsconfig.json
└── task-client/              # Frontend Workspace (React 19 + Vite + TypeScript)
    ├── src/                  # Components, Pages, Hooks, API Clients
    └── vite.config.ts
```

---

## 🚀 Tech Stack

### Root Monorepo
- **NPM Workspaces** (Manajemen dependensi terpusat)
- **Concurrently** (Menjalankan multiple services secara serentak)

### Backend (`task-api`)
- **Node.js** & **Express.js** dengan **TypeScript**
- **MongoDB** & **Mongoose ORM**
- **Zod** (Validasi Request & Type-safety)
- **Winston** (Structured Enterprise Logging)
- **Helmet, Cors, Express Rate Limit** (Security Standard)
- **Jest & Supertest** (Testing Framework)
- **Tsup** (Fast TypeScript Production Bundler)

### Frontend (`task-client`)
- **React 19** + **TypeScript**
- **Vite** (Next-generation frontend tooling)

---

## 📐 Aturan & Prinsip Perancangan Code

1. **Layered Architecture (Three-Tier)**:
   - **Controller Layer**: Menerima HTTP Request, validasi input (Zod), mengembalikan HTTP Response. *Dilarang berisi business logic atau query DB*.
   - **Service Layer**: Menangani *Business Logic* inti aplikasi. Tidak boleh bergantung pada objek HTTP (req/res).
   - **Repository Layer**: Menangani interaksi langsung ke Database (MongoDB/Mongoose).

2. **SOLID & Clean Code Principles**:
   - **Single Responsibility Principle (SRP)**: Setiap modul hanya memiliki satu alasan untuk berubah.
   - **Separation of Concerns (SoC)**: Memisahkan routing, logic bisnis, dan database query.
   - **Centralized Error Handling**: Menghindari `try/catch` berulang menggunakan custom error middleware dan async wrappers.

3. **Type Safety**:
   - Wajib menggunakan **TypeScript** mode strict di seluruh workspace.

---

## 🛠️ Cara Menjalankan Proyek

### Prasyarat
- **Node.js** v18+ dan **npm** v9+
- **MongoDB** (Lokal atau MongoDB Atlas)

### 1. Instalasi Dependensi Monorepo
Jalankan di root directory:
```bash
npm install
```

### 2. Konfigurasi Environment Variable
Salin `.env.example` pada `task-api`:
```bash
cp task-api/.env.example task-api/.env
```
Sesuaikan konfigurasi `PORT` dan `MONGODB_URI` di file `task-api/.env`.

### 3. Menjalankan Mode Development
Menjalankan backend (`task-api`) dan frontend (`task-client`) sekaligus:
```bash
npm run dev
```

### 4. Build Proyek untuk Production
```bash
npm run build
```

# Monorepo MERN Stack (Task Management System)

Sistem Monorepo enterprise berbasis **MERN Stack** (MongoDB, Express, React, Node.js) yang dirancang dengan prinsip **Clean Architecture**, **SOLID Principles**, dan **NPM Workspaces**.

---

## 🏗️ Arsitektur Monorepo & Struktur Folder

Repository ini menggunakan **NPM Workspaces** untuk mengelola backend API dan frontend client dalam satu repository tunggal.

```text
MERN/
├── package.json              # Root package.json (Workspaces & Scripts)
├── README.md                 # Dokumentasi utama proyek
├── task-api/                 # Backend Workspace (Express.js + TypeScript + Mongoose)
│   ├── docs/                 # Dokumentasi arsitektur enterprise backend
│   ├── src/
│   │   ├── controllers/      # Layer Presentation / HTTP Handlers
│   │   ├── services/         # Layer Business Logic
│   │   ├── repositories/     # Layer Data Access (Mongoose DB Queries)
│   │   ├── models/           # Mongoose Schemas & Interfaces
│   │   ├── middlewares/      # Error Handler, Rate Limiter, Auth Middleware
│   │   ├── utils/            # Logger (Winston), Response Helpers
│   │   └── server.ts         # Entry point server Express
│   └── tsconfig.json
└── task-client/              # Frontend Workspace (React 19 + Vite + TypeScript)
    ├── src/                  # Components, Pages, Hooks, API Clients
    └── vite.config.ts
```

---

## 🚀 Tech Stack

### Root Monorepo
- **NPM Workspaces** (Manajemen dependensi terpusat)
- **Concurrently** (Menjalankan multiple services secara serentak)

### Backend (`task-api`)
- **Node.js** & **Express.js** dengan **TypeScript**
- **MongoDB** & **Mongoose ORM**
- **Zod** (Validasi Request & Type-safety)
- **Winston** (Structured Enterprise Logging)
- **Helmet, Cors, Express Rate Limit** (Security Standard)
- **Jest & Supertest** (Testing Framework)
- **Tsup** (Fast TypeScript Production Bundler)

### Frontend (`task-client`)
- **React 19** + **TypeScript**
- **Vite** (Next-generation frontend tooling)

---

## 📐 Aturan & Prinsip Perancangan Code

1. **Layered Architecture (Three-Tier)**:
   - **Controller Layer**: Menerima HTTP Request, validasi input (Zod), mengembalikan HTTP Response. *Dilarang berisi business logic atau query DB*.
   - **Service Layer**: Menangani *Business Logic* inti aplikasi. Tidak boleh bergantung pada objek HTTP (req/res).
   - **Repository Layer**: Menangani interaksi langsung ke Database (MongoDB/Mongoose).

2. **SOLID & Clean Code Principles**:
   - **Single Responsibility Principle (SRP)**: Setiap modul hanya memiliki satu alasan untuk berubah.
   - **Separation of Concerns (SoC)**: Memisahkan routing, logic bisnis, dan database query.
   - **Centralized Error Handling**: Menghindari `try/catch` berulang menggunakan custom error middleware dan async wrappers.

3. **Type Safety**:
   - Wajib menggunakan **TypeScript** mode strict di seluruh workspace.

---

## 🛠️ Cara Menjalankan Proyek

### Prasyarat
- **Node.js** v18+ dan **npm** v9+
- **MongoDB** (Lokal atau MongoDB Atlas)

### 1. Instalasi Dependensi Monorepo
Jalankan di root directory:
```bash
npm install
```

### 2. Konfigurasi Environment Variable
Salin `.env.example` pada `task-api`:
```bash
cp task-api/.env.example task-api/.env
```
Sesuaikan konfigurasi `PORT` dan `MONGODB_URI` di file `task-api/.env`.

### 3. Menjalankan Mode Development
Menjalankan backend (`task-api`) dan frontend (`task-client`) sekaligus:
```bash
npm run dev
```

### 4. Build Proyek untuk Production
```bash
npm run build
```

---

## 📜 Perintah Utama (Root Scripts)

| Command | Keterangan |
| :--- | :--- |
| `npm run dev` | Menjalankan `task-api` dan `task-client` secara bersamaan (watch mode) |
| `npm run dev:api` | Menjalankan khusus `task-api` dalam watch mode |
| `npm run dev:client` | Menjalankan khusus `task-client` dalam watch mode |
| `npm run build` | Melakukan build bundler pada `task-api` dan `task-client` |
| `npm run build:api` | Melakukan build khusus `task-api` |
| `npm run build:client` | Melakukan build khusus `task-client` |
