# 04. Implementasi Core

Bagian ini membahas pilar dari aplikasi: Error Handling yang konsisten, konfigurasi App, dan Entry point (Server).

## 1. Custom Error Handler (utils/customError.ts)
Aplikasi enterprise tidak melempar tipe error bawaan `Error` begitu saja. Kita buat kelas terpisah agar bisa memberikan HTTP Status Code spesifik.

```typescript
export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

## 2. Async Wrapper (utils/asyncWrapper.ts)
Fungsi yang membungkus semua fungsi async di controller agar kita tidak perlu menulis `try/catch` secara berulang. Error yang terjadi otomatis akan diteruskan ke middleware *Error Handler* via parameter `next()`.

```typescript
import { Request, Response, NextFunction } from 'express';

export const asyncWrapper = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

## 3. Global Error Middleware (middlewares/errorHandler.ts)
Menangkap error dan merespon dalam format JSON standar.

```typescript
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/customError';
import { StatusCodes } from 'http-status-codes';
// Bisa juga import logger (Winston) untuk log error

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Jika error adalah instansi dari CustomError yang kita buat
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Jika error tidak terduga (misal database putus)
  console.error('[ERROR]', err); // Di production, gunakan Winston!
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal Server Error',
  });
};
```

## 4. Konfigurasi App (app.ts)
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' })); // Konfigurasikan asal CORS secara ketat nantinya
app.use(express.json());

// Logging Middleware
app.use(morgan('dev')); // Gunakan morgan untuk log HTTP request

// Define Routes
// app.use('/api/v1/tasks', taskRoutes);

// Handling Not Found
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route Not Found' });
});

// Global Error Middleware (harus paling bawah)
app.use(errorHandler);

export default app;
```

## 5. Entry Point Server (server.ts)
```typescript
import app from './app';
// import { connectDB } from './config/db.config';

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to database', error);
    process.exit(1);
  }
};

startServer();
```

---
*Lanjut ke [05-Prompt-Tugas-AI.md](./05-Prompt-Tugas-AI.md) untuk prompt khusus guna melanjutkan pembuatan aplikasi ini via AI yang lebih murah.*
