# 03. Database & API Schema Specification

Dokumen ini mendefinisikan skema database Mongoose dan rancangan REST API.

## 🗄️ Database Schemas (MongoDB / Mongoose)

### 1. User Schema (`User`)
- `_id`: ObjectId
- `name`: String (required)
- `email`: String (required, unique, lowercase)
- `password`: String (optional jika Auth Provider Google)
- `avatar`: String (optional)
- `jobTitle`: String (optional, e.g. "Fullstack Developer")
- `role`: Enum (`"USER"`, `"ADMIN"`, default: `"USER"`)
- `authProvider`: Enum (`"local"`, `"google"`, default: `"local"`)
- `isVerified`: Boolean (default: `false`)
- `otpCode`: String (optional)
- `otpExpiresAt`: Date (optional)
- `createdAt`, `updatedAt`: Date

### 2. Project Schema (`Project`)
- `_id`: ObjectId
- `name`: String (required)
- `key`: String (required, e.g., "TASK")
- `description`: String
- `leadId`: ObjectId (ref: User)
- `members`: [ObjectId] (ref: User)

### 3. Task / Issue Schema (`Task`)
- `_id`: ObjectId
- `projectId`: ObjectId (ref: Project, required)
- `title`: String (required)
- `description`: String
- `status`: Enum (`"TODO"`, `"IN_PROGRESS"`, `"DONE"`)
- `priority`: Enum (`"LOW"`, `"MEDIUM"`, `"HIGH"`, `"HIGHEST"`)
- `assigneeId`: ObjectId (ref: User, optional)
- `reporterId`: ObjectId (ref: User, required)
### 4. Comment Schema (`Comment`)
- `_id`: ObjectId
- `taskId`: ObjectId (ref: Task, required)
- `userId`: ObjectId (ref: User, required)
- `content`: String (required)
- `createdAt`, `updatedAt`: Date

### 5. Activity Log Schema (`Activity`)
- `_id`: ObjectId
- `taskId`: ObjectId (ref: Task, required)
- `userId`: ObjectId (ref: User, required)
- `action`: String (required, e.g. "COMMENTED", "ATTACHMENT_UPLOADED")
- `details`: String (required)
- `createdAt`: Date

### 6. Attachment Schema (`Attachment`)
- `_id`: ObjectId
- `taskId`: ObjectId (ref: Task, required)
- `uploadedBy`: ObjectId (ref: User, required)
- `filename`: String (required)
- `url`: String (required)
- `fileType`: String (required)
- `fileSize`: Number (required)
- `createdAt`: Date

---

## 📡 REST API Contracts Summary

```text
POST   /api/v1/auth/register          --> Register User Baru (Menghasilkan OTP)
POST   /api/v1/auth/verify-otp        --> Verifikasi Kode OTP Email
POST   /api/v1/auth/send-otp          --> Kirim Ulang Kode OTP Email
POST   /api/v1/auth/login             --> Auth Login (Protected Rate Limit 3x/min, Returns JWT)
POST   /api/v1/auth/google            --> Auth Google OAuth 2.0 (Returns JWT)
POST   /api/v1/auth/forgot-password   --> Permintaan Kode OTP Reset Password
POST   /api/v1/auth/reset-password    --> Verifikasi OTP & Simpan Password Baru
GET    /api/v1/auth/me                --> Ambil Detail Profil User Terproteksi (Bearer Token)
PATCH  /api/v1/auth/profile           --> Update Profil User (Nama & Avatar)
PATCH  /api/v1/auth/change-password   --> Ubah Password Akun (Verifikasi Password Lama)
POST   /api/v1/auth/refresh-token     --> Perbarui JWT Access Token
POST   /api/v1/auth/logout            --> Revoke Refresh Token Session
GET    /api/v1/auth/users             --> List Seluruh Pengguna Sistem (Admin Only)
PATCH  /api/v1/auth/users/:id/role    --> Ubah Role Pengguna ke USER/ADMIN (Admin Only)
GET    /api/v1/projects               --> List Projects User
POST   /api/v1/projects               --> Create Project Baru
GET    /api/v1/projects/:id           --> Detail Project (Populate Lead & Members)
PUT    /api/v1/projects/:id           --> Update Project (Lead/Admin Only)
DELETE /api/v1/projects/:id           --> Delete Project (Lead/Admin Only)
GET    /api/v1/tasks?projectId=x      --> List Tasks dalam Project (Sorted by position)
POST   /api/v1/tasks                  --> Create Task Baru (Auto position calculation)
GET    /api/v1/tasks/:id              --> Detail Task
PATCH  /api/v1/tasks/:id              --> Update Task (Title, Status, Priority, Assignee)
PATCH  /api/v1/tasks/:id/reorder      --> Reorder Task Kanban (Drag-and-Drop)
DELETE /api/v1/tasks/:id              --> Delete Task (Reporter, Project Lead, or Admin)
GET    /api/v1/tasks/:taskId/comments --> List Komentar Task
POST   /api/v1/tasks/:taskId/comments --> Tambah Komentar Baru pada Task
DELETE /api/v1/comments/:id           --> Hapus Komentar (Owner, Lead, or Admin)
GET    /api/v1/tasks/:taskId/activities --> List Riwayat Aktivitas Audit Trail Task
GET    /api/v1/tasks/:taskId/attachments --> List Lampiran File Task
POST   /api/v1/tasks/:taskId/attachments --> Upload File Lampiran (Multer, Max 5MB)
DELETE /api/v1/attachments/:id        --> Hapus Lampiran File (Uploader, Lead, or Admin)
```
