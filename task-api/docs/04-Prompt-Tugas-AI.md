# 05. Prompt Penugasan AI (Melanjutkan Pengerjaan)

Kamu bisa menyalin teks di bawah ini dan memberikannya kepada AI model manapun (meskipun model yang lebih murah) untuk melanjutkan pengembangan aplikasi API ini. Prompt ini dirancang khusus agar AI tersebut tidak merusak struktur Layered Architecture dan standar Enterprise yang sudah ditetapkan sebelumnya.

***

### ✂️ --- COPY DARI SINI --- ✂️

**Konteks Sistem:**
Saya sedang mengembangkan aplikasi Backend API menggunakan Express.js dan TypeScript untuk stack MERN. Aplikasi ini ditargetkan untuk level "Enterprise", sehingga kami menggunakan **Layered Architecture** dengan folder terpisah untuk Controller, Service, dan Repository.

**Aturan Main yang Wajib Diikuti:**
1. **Tidak Boleh Memecah Pola Arsitektur**:
   - **Controller**: Hanya bertugas menerima parameter (params, body, query) dari request, merespons ke client (`res.json`), dan wajib dibungkus dengan `asyncWrapper()`. DILARANG menaruh query database di sini.
   - **Service**: Hanya berisi bussiness logic murni, memproses data, menembakkan custom error jika logic salah, lalu memanggil Repository.
   - **Repository**: Hanya berisi query ke database (contoh: fungsi `TaskModel.find()` di dalam Mongoose).
2. **Error Handling**: 
   - Jangan menggunakan `try/catch` di dalam controller.
   - Apabila ada error (misal data tidak ditemukan), `throw` menggunakan kelas `CustomError(message, HTTP_STATUS_CODE)`. Error handler global otomatis yang akan menangkapnya.
3. **Validasi**: Gunakan **Zod** untuk semua validasi input (body/query). Buat file di dalam folder `src/validations/`.
4. **Respon Standar**: Kembalikan format JSON yang konsisten, contoh: `{ success: true, data: { ... } }`.
5. **Kualitas Kode**: Gunakan TypeScript secara *strict* (definisikan setiap *interface* dan *types*, jangan pakai tipe `any` kecuali terpaksa).

**Tugas Saat Ini:**
Bantu saya mengimplementasikan fitur CRUD untuk entitas `Task` dengan schema Mongoose yang berisi:
- `title` (string, required)
- `description` (string)
- `status` (enum: 'TODO', 'IN_PROGRESS', 'DONE', default: 'TODO')
- Timestamps aktif.

Mohon sediakan kode secara lengkap tapi terpisah berdasarkan filenya:
1. `src/models/task.model.ts` (Mongoose schema)
2. `src/repositories/task.repository.ts` (Class/Object query DB)
3. `src/services/task.service.ts` (Class/Object logic bisnis)
4. `src/controllers/task.controller.ts` (Fungsi controller menggunakan `asyncWrapper`)
5. `src/validations/task.validation.ts` (Zod schema)
6. `src/routes/task.route.ts` (Menghubungkan controller dan validator menggunakan middleware)

Tolong berikan kode dengan kualitas *Clean Code*!

### ✂️ --- SAMPAI SINI --- ✂️
