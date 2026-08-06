# 03. Panduan Deployment & Environment

Dokumen ini berisi panduan untuk menyiapkan lingkungan dan melakukan deployment pada Monorepo MERN.

## 🔐 Manajemen Environment Variable

### Backend (`task-api`)
Simpan konfigurasi sensitif di `task-api/.env`:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/jira-db
CORS_ORIGIN=https://jira-client.vercel.app
JWT_SECRET=super-secret-jwt-key
```

### Frontend (`task-client`)
Konfigurasi publik di `task-client/.env`:

```env
VITE_API_BASE_URL=https://jira-api.onrender.com/api/v1
```

## 🚀 Strategi Deployment

### Opsi 1: Independent Hosting (Rekomendasi)
- **Frontend (`task-client`)**: Deploy ke **Vercel** / **Netlify** / **Cloudflare Pages**.
  - Root directory: `task-client`
  - Build command: `npm run build`
  - Output directory: `dist`
- **Backend (`task-api`)**: Deploy ke **Render** / **Railway** / **Fly.io**.
  - Root directory: `task-api`
  - Build command: `npm run build`
  - Start command: `npm start` (atau `node dist/server.js`)

### Opsi 2: Docker Containerization
Dapat menggunakan Docker Multi-stage build untuk mengisolasi container frontend dan backend secara independen.
