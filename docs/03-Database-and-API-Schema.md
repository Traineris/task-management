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
- `position`: Number (untuk urutan drag-and-drop)

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
GET    /api/v1/tasks?projectId=x      --> List Tasks dalam Project
POST   /api/v1/tasks                  --> Create Task Baru
PATCH  /api/v1/tasks/:id              --> Update Task (Status/Position/Title)
DELETE /api/v1/tasks/:id              --> Delete Task
```
