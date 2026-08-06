# 06. Panduan & Hirarki Membuat Endpoint Baru

Jika Anda ingin membuat fitur baru (misalnya manajemen `Task` atau `User`), Anda **WAJIB** mengikuti hierarki _Clean Architecture_ 5 Lapisan ini. Pendekatan ini menjamin aplikasi Anda berstandar industri (_Enterprise_), sangat mudah dites, dan anti-bug.

Setiap kali ingin membuat fitur baru, terapkan metode **Bottom-Up** (Dari dalam ke luar) mengikuti **7 Langkah Wajib** di bawah beserta _template_ **CRUD Lengkap** (Create, Read, Update, Delete) berikut ini:

---

### Step 1: Buat Model (Database)

_Contoh File: `src/models/taskModel.ts`_
Definisikan _Interface_ TypeScript dan _Schema_ Mongoose.

```typescript
import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
    },
  },
  { timestamps: true },
);

export default mongoose.model<ITask>("Task", TaskSchema);
```

---

### Step 2: Buat Validasi (Zod)

_Contoh File: `src/validations/taskValidation.ts`_
Buat aturan input untuk proses _Create_ dan _Update_.

```typescript
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3, "Title task minimal 3 karakter"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
});

// Update bisa saja hanya mengedit sebagian data, jadi gunakan .partial()
export const updateTaskSchema = createTaskSchema.partial();
```

---

### Step 3: Buat Repository (Kueri DB)

_Contoh File: `src/repositories/taskRepository.ts`_
Satu-satunya tempat yang boleh berurusan dengan MongoDB secara langsung.

```typescript
import TaskModel, { ITask } from "@/models/taskModel";

export class TaskRepository {
  async create(data: Partial<ITask>) {
    return await TaskModel.create(data);
  }

  async findAll() {
    return await TaskModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return await TaskModel.findById(id);
  }

  async update(id: string, data: Partial<ITask>) {
    return await TaskModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await TaskModel.findByIdAndDelete(id);
  }
}

export const taskRepository = new TaskRepository();
```

---

### Step 4: Buat Service (Logika Utama)

_Contoh File: `src/services/taskService.ts`_
Di sinilah Anda memanggil Zod dan Repository, serta melempar error (404 Not Found, 400 Bad Request, dll).

```typescript
import { taskRepository } from "@/repositories/taskRepository";
import {
  createTaskSchema,
  updateTaskSchema,
} from "@/validations/taskValidation";
import { CustomError } from "@/utils/customError";

export class TaskService {
  async createTask(data: any) {
    const parsed = createTaskSchema.safeParse(data);
    if (!parsed.success)
      throw new CustomError(
        parsed.error.issues[0]?.message || "Validation Error",
        400,
      );
    return await taskRepository.create(parsed.data as any);
  }

  async getAllTasks() {
    return await taskRepository.findAll();
  }

  async getTaskById(id: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new CustomError("Task tidak ditemukan", 404);
    return task;
  }

  async updateTask(id: string, data: any) {
    // Pastikan tasknya ada dulu
    await this.getTaskById(id);

    const parsed = updateTaskSchema.safeParse(data);
    if (!parsed.success) throw new CustomError("Validation Error", 400);

    return await taskRepository.update(id, parsed.data as any);
  }

  async deleteTask(id: string) {
    await this.getTaskById(id);
    return await taskRepository.delete(id);
  }
}

export const taskService = new TaskService();
```

---

### Step 5: Buat Controller (Penghubung HTTP)

_Contoh File: `src/controllers/taskController.ts`_
Menerima `req` dan mengembalikan `res`. Bersih dari _logic database_.

```typescript
import { Request, Response } from "express";
import { taskService } from "@/services/taskService";
import { StatusCodes } from "http-status-codes";

export const createTask = async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data: task });
};

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await taskService.getAllTasks();
  res.status(StatusCodes.OK).json({ success: true, data: tasks });
};

export const getTaskById = async (req: Request, res: Response) => {
  const task = await taskService.getTaskById(req.params.id);
  res.status(StatusCodes.OK).json({ success: true, data: task });
};

export const updateTask = async (req: Request, res: Response) => {
  const task = await taskService.updateTask(req.params.id, req.body);
  res.status(StatusCodes.OK).json({ success: true, data: task });
};

export const deleteTask = async (req: Request, res: Response) => {
  await taskService.deleteTask(req.params.id);
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Task berhasil dihapus" });
};
```

---

### Step 6: Buat Route (Peta URL)

_Contoh File: `src/routes/taskRoutes.ts`_
**Wajib** membungkus semua fungsi Controller dengan `asyncHandler`!

```typescript
import { Router } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "@/controllers/taskController";

const router = Router();

router.post("/", asyncHandler(createTask));
router.get("/", asyncHandler(getTasks));
router.get("/:id", asyncHandler(getTaskById));
router.put("/:id", asyncHandler(updateTask));
router.delete("/:id", asyncHandler(deleteTask));

export default router;
```

---

### Step 7: Daftarkan di Pusat (`app.ts`)

_File: `src/app.ts`_

```typescript
import taskRoutes from "@/routes/taskRoutes";

// Daftarkan di bagian bawah
app.use("/api/v1/tasks", taskRoutes);
```

🎉 **Selesai!**
Dengan contoh _full_ CRUD di atas, Anda tinggal me-_copy-paste_ formatnya saat ingin membuat fitur baru, lalu cukup mengubah kata `Task` menjadi `User`, `Comment`, atau tabel lainnya. Kualitas aplikasi Anda akan selalu konsisten!
