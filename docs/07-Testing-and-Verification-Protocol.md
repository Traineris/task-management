# 07. Testing & Verification Protocol (Definition of Done)

Dokumen ini menentukan standar kriteria **Definition of Done (DoD)** sebelum tugas dianggap selesai oleh AI Agent.

## ✅ Checklist Definition of Done (DoD)

Sebelum AI menyatakan suatu tugas selesai, **seluruh poin checklist ini wajib terpenuhi**:

- [ ] **Build Check**: Menjalankan `npm run build` dari root tanpa error TypeScript atau bundler.
- [ ] **No Unused Code**: Tidak ada variabel/import yang tidak terpakai (dibersihkan dari linter error).
- [ ] **Type-Safety**: Tidak ada tipe `any` tanpa alasan yang sah.
- [ ] **Error Handling**: Custom Error dan async wrappers di backend / boundary di frontend berfungsi baik.
- [ ] **Documentation**: File README / docs telah diperbarui jika ada perubahan API atau script baru.

## 🧪 Verification Commands

```bash
# 1. Menjalankan linter
npm run lint

# 2. Melakukan build gabungan seluruh workspace
npm run build
```
