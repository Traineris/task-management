# 02. State Management & API Integration

Dokumen ini menjelaskan pengelolaan status aplikasi (state) dan pola integrasi API di `task-client`.

## 🌐 Pola Pemisahan State

Aplikasi memisahkan state menjadi dua kategori utama:

1. **Server State (Data Async dari API)**:
   - Dikelola menggunakan **TanStack Query (React Query)** atau **Axios + Custom Hooks**.
   - Menangani otomatis caching, refetching, loading, dan error states.

2. **Client / Local State (UI State)**:
   - **Local State (`useState`, `useReducer`)**: Untuk state internal komponen sederhana (misal modal open/close, active tab).
   - **Global UI State (`Zustand` atau `React Context`)**: Untuk status aplikasi global seperti User Session, Active Workspace, atau Theme Mode (Dark/Light).

## 📡 API Client Configuration

Semua komunikasi API terpusat melalui file `services/apiClient.ts`:

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyisipkan Bearer Token otomatis
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
