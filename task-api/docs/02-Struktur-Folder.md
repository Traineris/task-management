# 03. Struktur Folder (Layered Architecture)

Untuk level Enterprise, pemisahan folder sangat vital. Struktur ini mengadaptasi **Domain-Driven Design (DDD)** ringan yang digabung dengan **Layered Architecture**.

Berikut adalah standar folder struktur yang disarankan:

```text
src/
├── config/             # Konfigurasi environment, DB connection, Logger
│   ├── env.config.ts
│   ├── db.config.ts
│   └── logger.ts
├── constants/          # Nilai konstanta, error messages, regex, dll.
│   └── errorCodes.ts
├── controllers/        # Presentation Layer: Menerima Request, Mengembalikan Response
│   └── task.controller.ts
├── middlewares/        # Express Middlewares (Auth, Error Handler, Validation)
│   ├── errorHandler.ts
│   ├── requireAuth.ts
│   └── validateRequest.ts
├── models/             # Schema Database (Mongoose/Prisma)
│   └── task.model.ts
├── repositories/       # Data Access Layer: Interaksi dengan Database
│   └── task.repository.ts
├── routes/             # Definisi Endpoint API (Mengikat Controller & Middleware)
│   ├── index.ts
│   └── task.route.ts
├── services/           # Business Logic Layer: Logika utama aplikasi (Core)
│   └── task.service.ts
├── utils/              # Helper function murni (tidak terikat dengan HTTP/DB)
│   ├── apiResponse.ts
│   ├── asyncWrapper.ts
│   └── customError.ts
├── validations/        # Schema Validasi Data (Zod / Joi)
│   └── task.validation.ts
├── app.ts              # Inisialisasi Express App (tanpa menjalankan port)
└── server.ts           # Entry point aplikasi (menjalankan app.listen dan koneksi DB)
```

## Mengapa Memisahkan `app.ts` dan `server.ts`?
- **`app.ts`**: Berisi konfigurasi Express (middleware, routes). Kita mengekspor `app` dari sini agar bisa dipakai untuk **Automated Testing (Supertest)** tanpa perlu menjalankan server pada port asli.
- **`server.ts`**: Hanya bertugas membaca `.env`, melakukan koneksi ke database, dan menjalankan `app.listen()`.

## Alur Data (Request Flow)
1. Klien memanggil endpoint API (`GET /api/tasks`).
2. Express Router di `routes/task.route.ts` memverifikasi token dan input lewat `middlewares/validateRequest`.
3. Lanjut ke `controllers/task.controller.ts`. Controller TIDAK melakukan logic bisnis. Controller mengekstrak data dari `req` lalu memanggil:
4. `services/task.service.ts`. Di sini logic utama berada (mengecek kuota, izin akses, dll). Service memanggil:
5. `repositories/task.repository.ts` untuk memanggil query Mongoose `Task.find()`.
6. Data kembali secara berurutan: Repo -> Service -> Controller -> Klien.

---
*Lanjut ke [04-Implementasi-Core.md](./04-Implementasi-Core.md) untuk melihat contoh kode infrastruktur dasarnya.*
