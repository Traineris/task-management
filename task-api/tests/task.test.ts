import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";

let mongoServer: MongoMemoryServer;
let authToken: string;
let createdProjectId: string;
let createdTaskId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  await mongoose.connection.syncIndexes();

  // Setup User & Project
  const regRes = await request(app).post("/api/v1/auth/register").send({
    name: "Task Developer User",
    email: "dev@example.com",
    password: "password123",
  });

  const otp = regRes.body.data.debugOtpCode;
  const verifyRes = await request(app).post("/api/v1/auth/verify-otp").send({
    email: "dev@example.com",
    code: otp,
  });

  authToken = verifyRes.body.data.token;

  const projRes = await request(app)
    .post("/api/v1/projects")
    .set("Authorization", `Bearer ${authToken}`)
    .send({
      name: "Kanban Board Project",
      key: "BOARD",
    });

  createdProjectId = projRes.body.data._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("PENGUJIAN API TASK & KANBAN BOARD (Fase 3)", () => {
  it("✅ [Create Task] Seharusnya berhasil membuat Task baru dengan posisi otomatis", async () => {
    const res = await request(app)
      .post("/api/v1/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        projectId: createdProjectId,
        title: "Implement Login Page",
        description: "Membuat tampilan login dengan React",
        status: "TODO",
        priority: "HIGH",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Implement Login Page");
    expect(res.body.data.position).toBeDefined();

    createdTaskId = res.body.data._id;
  });

  it("✅ [Get Tasks] Seharusnya mengembalikan daftar task dalam project", async () => {
    const res = await request(app)
      .get(`/api/v1/tasks?projectId=${createdProjectId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it("✅ [Reorder Task Kanban] Seharusnya berhasil mengupdate posisi drag-and-drop", async () => {
    const res = await request(app)
      .patch(`/api/v1/tasks/${createdTaskId}/reorder`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        status: "IN_PROGRESS",
        position: 1500,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("IN_PROGRESS");
    expect(res.body.data.position).toBe(1500);
  });

  it("✅ [Delete Task] Seharusnya berhasil menghapus task oleh reporter", async () => {
    const res = await request(app)
      .delete(`/api/v1/tasks/${createdTaskId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
