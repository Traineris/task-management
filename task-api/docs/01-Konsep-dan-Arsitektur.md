# 01. Konsep dan Arsitektur: Enterprise Express TS

Untuk mencapai level _Enterprise_, kita tidak bisa sekadar membuat route dan logic dalam satu file (Monolithic/Spaghetti code). Kita membutuhkan arsitektur yang _scalable_, _maintainable_, dan _testable_. Arsitektur yang paling umum dan cocok untuk aplikasi skala besar (Enterprise) adalah **Layered Architecture** (sering juga diadaptasi menjadi _Clean Architecture_ atau _Hexagonal Architecture_).

## Prinsip Utama (SOLID & Clean Code)

1. **Single Responsibility Principle (SRP)**: Setiap fungsi, kelas, atau modul hanya boleh memiliki satu tanggung jawab (satu alasan untuk berubah).
2. **Separation of Concerns (SoC)**: Memisahkan aplikasi ke dalam layer-layer yang berbeda, sehingga logic database tidak bercampur dengan logic HTTP/routing.
3. **Dependency Injection (DI)**: Module tingkat tinggi tidak bergantung pada module tingkat rendah, keduanya bergantung pada abstraksi (memudahkan unit testing).

## Layer pada Aplikasi Enterprise

Dalam proyek ini, kita akan membagi logic ke dalam 3 layer utama (Three-Tier Architecture):

1. **Controller Layer (Presentation Layer)**
   - **Tanggung Jawab**: Menangani HTTP Request (menerima req, memvalidasi body/query/params), dan mengembalikan HTTP Response (JSON).
   - **Aturan**: TIDAK BOLEH ada _business logic_ (query database atau perhitungan kompleks) di sini. Hanya memanggil _Service Layer_.

2. **Service Layer (Business Logic Layer)**
   - **Tanggung Jawab**: Menangani semua proses bisnis inti dari aplikasi. Contoh: mengecek apakah user sudah ada, menghitung diskon, mengenkripsi password.
   - **Aturan**: Tidak tahu menahu soal HTTP (req/res) atau pun detail query SQL/NoSQL. Hanya menerima data mentah, memprosesnya, dan memanggil _Repository Layer_.

3. **Repository Layer (Data Access Layer)**
   - **Tanggung Jawab**: Berkomunikasi langsung dengan Database (MongoDB/Mongoose dalam kasus MERN) atau API Eksternal.
   - **Aturan**: Berisi query seperti `find()`, `create()`, `updateOne()`. Layer ini dipanggil oleh _Service Layer_.

## Tools & Libraries Utama (Tech Stack)

- **Framework**: Express.js (dengan TypeScript)
- **Database ORM/ODM**: Mongoose (karena akan digabungkan menjadi MERN stack)
- **Validation**: Zod (sangat _type-safe_ dan terintegrasi baik dengan TypeScript)
- **Logging**: Winston atau Pino (standar industri untuk logging agar mudah di-track di production)
- **Error Handling**: Custom Error Middleware & Async Wrapper (menghindari `try/catch` yang berulang di setiap controller)
- **Security**: Helmet, CORS, Rate Limiter
- **Testing**: Jest & Supertest (Wajib untuk aplikasi enterprise)

---

_Lanjut ke [02-Setup-dan-Konfigurasi.md](./02-Setup-dan-Konfigurasi.md) untuk melihat pengaturan awalnya._

# 02. Setup dan Konfigurasi Awal

Agar proyek ini berstandar enterprise, konfigurasi awal sangat penting untuk memastikan kode tetap rapi, konsisten, dan meminimalkan bug.

## 1. Inisialisasi Proyek

Jika belum, selalu mulai dengan membuat package.json:

```bash
npm init -y
```

## 2. Instalasi Dependensi

### Dependensi Utama (Production)

```bash
npm install express cors helmet morgan dotenv mongoose zippy zod
npm install winston http-status-codes express-rate-limit
```

### Dependensi Development (Khusus proses development)

```bash
npm install -D typescript @types/node @types/express @types/cors @types/morgan
npm install -D tsx tsup eslint prettier
npm install -D jest supertest @types/jest ts-jest
```

_(Catatan: `tsx` sangat cepat untuk run TypeScript di development, dan `tsup` bagus untuk bundling build di production)_

## 3. Konfigurasi TypeScript (`tsconfig.json`)

Pastikan TypeScript diatur dengan mode strict. Contoh minimal:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "node",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

_Path aliases (`@/_`) akan mempermudah import (contoh: `import { UserService } from '@/services/user.service'`dibandingkan`../../../services`).\*

## 4. Konfigurasi Linter & Formatter

### ESLint (`eslint.config.mjs` atau `.eslintrc.json`)

Gunakan ESLint untuk memastikan standar kode (Clean Code) berjalan, mendeteksi variabel yang tidak dipakai, dll.

### Prettier (`.prettierrc`)

Untuk konsistensi formatting (spasi, indentasi, kutip tunggal/ganda).

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

## 5. Scripts di `package.json`

Siapkan script standar untuk build dan run:

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsup src/server.ts --format cjs --clean",
  "start": "node dist/server.js",
  "lint": "eslint src/**/*.ts",
  "format": "prettier --write \"src/**/*.ts\"",
  "test": "jest"
}
```

---

_Lanjut ke [03-Struktur-Folder.md](./03-Struktur-Folder.md) untuk melihat bagaimana menata folder layaknya sistem enterprise._
