# 02. Standar Pengembangan: Git & Code Convention

Dokumen ini mendefinisikan aturan dan konvensi pengembangan kode untuk memastikan konsistensi dalam Monorepo.

## 🌿 Git Branching Strategy

Kita menerapkan strategi **Feature Branching**:

- **`main`**: Production-ready code. Hanya boleh di-merge melalui Pull Request dari `dev`.
- **`dev`**: Staging / Integration branch. Seluruh fitur baru dikumpulkan di sini.
- **`feature/<nama-fitur>`**: Branch pengembangan fitur baru (contoh: `feature/board-kanban`, `feature/auth-jwt`).
- **`fix/<nama-bug>`**: Branch perbaikan bug (contoh: `fix/cors-origin`).

## 💬 Conventional Commits

Setiap pesan commit wajib mengikuti format standard **Conventional Commits**:

```text
<type>(<scope>): <deskripsi singkat>
```

- **Type**:
  - `feat`: Penambahan fitur baru
  - `fix`: Perbaikan bug
  - `docs`: Perubahan dokumentasi
  - `style`: Formatting, tanpa mengubah logika kode
  - `refactor`: Restrukturisasi kode tanpa menambah fitur/fix bug
  - `test`: Penambahan atau perbaikan unit test
  - `chore`: Update build scripts, dependencies, dll.
- **Scope**: `api`, `client`, `root`, `deps`

*Contoh*:
- `feat(api): add user authentication endpoint`
- `feat(client): implement drag and drop kanban board`
- `fix(api): correct CORS origin settings`

## 🧹 Code Quality & Linting

Sebelum melakukan push/commit, pastikan kode memenuhi standar berikut:
1. **TypeScript Strict Mode**: Tidak diperbolehkan menggunakan tipe `any` tanpa penjelasan eksplisit.
2. **Formatting**: Jalankan `npm run format` atau pastikan Prettier aktif pada editor.
3. **Linting**: Pastikan tidak ada linting error dengan menjalankan `npm run lint`.
