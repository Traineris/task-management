# 02. Global AI Rules & Constraints (Guardrails)

Dokumen ini berisi batasan dan aturan absolut yang **wajib dipatuhi oleh semua AI Agent**.

## 🛑 Prohibited Actions (Dilarang Hard Stop)

1. **Dilarang Menghapus Komentar/Dokumentasi yang Ada**: Kecuali instruksi eksplisit pengguna meminta menghapusnya.
2. **Dilarang Mengubah File Build / Dependency Internal**:
   - Dilarang mengedit `node_modules/`, `dist/`, `package-lock.json` secara manual.
3. **Dilarang Melakukan Refactor Skala Besar**:
   - Hanya ubah baris yang relevan dengan tugas. Jangan mengubah pola proyek yang sudah berjalan.
4. **Dilarang Menggunakan Tipe `any`**:
   - Selalu berikan tipe eksplisit (TypeScript interfaces/types).

## ✅ Code Quality Principles

- **Minimal Change Principle**: Buat perubahan terkecil yang benar.
- **Single File Concern**: Jika sebuah fitur bisa dibuat tanpa memodifikasi lebih dari 3 file, jangan modifikasi file tambahan.
- **Centralized Error Handling**:
  - Backend: Throw `CustomError` dan gunakan `asyncWrapper` di controller.
  - Frontend: Gunakan error boundary & toast notification helper.

## 🔒 Security Requirements

- Validasi seluruh input publik menggunakan **Zod Schema**.
- Pastikan tidak ada hardcoded credentials atau JWT Secret di kode (gunakan `.env`).
