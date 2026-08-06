# 07. Spesifikasi REST API (Contract Draft)

Dokumen ini memuat kontrak spesifikasi endpoint REST API untuk `task-api`.

## 🌐 Base URL
```text
http://localhost:5000/api/v1
```

## 📋 Standard Response Format

### Success Response
```json
{
  "success": true,
  "message": "Resource fetched successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": [ ... ]
  }
}
```

---

## 📌 Endpoint Summary

### 🔑 Authentication (`/auth`)
- `POST /auth/register` - Pendaftaran user baru
- `POST /auth/login` - Otentikasi & pengembalian JWT Token
- `GET /auth/me` - Ambil profil user saat ini (Protected)

### 📋 Projects (`/projects`)
- `GET /projects` - Mengambil daftar proyek user
- `POST /projects` - Membuat proyek baru
- `GET /projects/:id` - Detail proyek berdasarkan ID
- `DELETE /projects/:id` - Hapus proyek

### 📌 Tasks / Issues (`/tasks`)
- `GET /tasks?projectId=:id` - Mengambil daftar tugas berdasarkan proyek
- `POST /tasks` - Membuat tugas baru (TODO/IN_PROGRESS/DONE)
- `PATCH /tasks/:id` - Update status / posisi tugas (untuk Drag and Drop Kanban)
- `DELETE /tasks/:id` - Hapus tugas
