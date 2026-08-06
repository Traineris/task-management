# 01. System Architecture & Monorepo Boundaries

Dokumen ini mendefinisikan batas arsitektur monorepo dan interaksi komponen sistem secara teratur.

## 🏗️ Topology Architecture

```text
               +----------------------------------+
               |        Browser (Client)          |
               +----------------------------------+
                                |
                                | HTTP REST API / JSON
                                v
               +----------------------------------+
               |       task-api (Express TS)      |
               |                                  |
               |  +----------------------------+  |
               |  |     Controller Layer       |  |
               |  +--------------+-------------+  |
               |                 |                |
               |  +--------------v-------------+  |
               |  |       Service Layer        |  |
               |  +--------------+-------------+  |
               |                 |                |
               |  +--------------v-------------+  |
               |  |     Repository Layer       |  |
               |  +--------------+-------------+  |
               +-----------------|----------------+
                                 |
                                 v Mongoose ODM
               +----------------------------------+
               |            MongoDB               |
               +----------------------------------+
```

## 📦 Boundary Rules

1. **Workspace Isolation**:
   - `task-api` tidak boleh mengimpor langsung dari `task-client` dan sebaliknya.
   - Semua pertukaran data antar workspace dilakukan melalui kontrak REST API (JSON).

2. **Backend Three-Tier Architecture (`task-api`)**:
   - **Controller Layer**: Menerima HTTP Request, memanggil validator Zod, mengembalikan JSON. Dilarang memasukkan query database.
   - **Service Layer**: Mengolah business logic murni. Dilarang mengakses objek Express `req` dan `res`.
   - **Repository Layer**: Satu-satunya layer yang boleh melakukan panggilan ke `Mongoose Model`.

3. **Frontend Feature-Based Architecture (`task-client`)**:
   - Modul disusun berdasarkan domain fitur di `src/features/<feature_name>`.
   - Komponen generik non-bisnis diletakkan di `src/components/`.
