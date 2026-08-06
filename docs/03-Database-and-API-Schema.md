# 03. Database & API Schema Specification

Dokumen ini mendefinisikan skema database Mongoose dan rancangan REST API.

## 🗄️ Database Schemas (MongoDB / Mongoose)

### 1. User Schema (`User`)
- `_id`: ObjectId
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed bcrypt)
- `createdAt`, `updatedAt`: Date

### 2. Project Schema (`Project`)
- `_id`: ObjectId
- `name`: String (required)
- `key`: String (required, e.g., "JIRA")
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
POST   /api/v1/auth/register      --> Register User Baru
POST   /api/v1/auth/login         --> Auth Login (Returns JWT)
GET    /api/v1/projects           --> List Projects User
POST   /api/v1/projects           --> Create Project Baru
GET    /api/v1/tasks?projectId=x  --> List Tasks dalam Project
POST   /api/v1/tasks              --> Create Task Baru
PATCH  /api/v1/tasks/:id          --> Update Task (Status/Position/Title)
DELETE /api/v1/tasks/:id          --> Delete Task
```
