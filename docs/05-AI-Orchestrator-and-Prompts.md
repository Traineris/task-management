# 05. AI Orchestrator & Execution Engine

Dokumen ini berisi panduan alur eksekusi berurutan dan template prompt serbaguna untuk AI Model (mahal maupun murah).

## 🔄 Engine Orchestration Workflow

Ketika mendelegasikan tugas baru ke AI, ikuti 4 tahap wajib berikut:

```text
[ 1. Context Read ] ──> [ 2. Plan Review ] ──> [ 3. Minimal Edit ] ──> [ 4. Build Test ]
```

1. **Context Read**: Minta AI membaca file spesifikasi terkait sebelum menulis kode.
2. **Plan Review**: Pastikan AI menjelaskan file mana saja yang akan dibuat/diubah.
3. **Minimal Edit**: Eksekusi perubahan kode secara presisi tanpa sentuh kode tak terkait.
4. **Build Test**: Jalankan `npm run build` untuk memverifikasi tidak ada breaking changes.

---

## 📋 Ready-to-Copy Prompt Templates

### Template A: Fitur Backend Baru (`task-api`)
```text
Berdasarkan aturan di AGENTS.md dan docs/01-Architecture-System.md:
Tolong buatkan endpoint backend baru untuk [NAMA_FITUR].

Syarat:
1. Ikuti Three-Tier Architecture: Controller (dengan asyncWrapper), Service, dan Repository.
2. Validasi payload menggunakan Zod di src/validations/.
3. Gunakan TypeScript strict mode (dilarang tipe 'any').
4. Throw CustomError jika terjadi kegagalan validasi/logika bisnis.
```

### Template B: Fitur Frontend Baru (`task-client`)
```text
Berdasarkan aturan di AGENTS.md dan docs/04-Design-System-Tokens.md:
Tolong buatkan komponen frontend React TS untuk [NAMA_KOMPONEN].

Syarat:
1. Simpan di folder src/features/[NAMA_FITUR]/ atau src/components/.
2. Gunakan CSS Variables / Design Tokens Jira Palette dari docs/04-Design-System-Tokens.md.
3. Pisahkan antara UI Component dan Data Fetching Hook.
```
