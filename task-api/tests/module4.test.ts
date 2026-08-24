import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";
import path from "path";
import fs from "fs";

let mongoServer: MongoMemoryServer;
let authToken: string;
let createdProjectId: string;
let createdTaskId: string;
let createdCommentId: string;
let createdAttachmentId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  await mongoose.connection.syncIndexes();

  // Setup User, Project, and Task
  const regRes = await request(app).post("/api/v1/auth/register").send({
    name: "Module4 Developer",
    email: "mod4@example.com",
    password: "password123",
  });

  const otp = regRes.body.data.debugOtpCode;
  const verifyRes = await request(app).post("/api/v1/auth/verify-otp").send({
    email: "mod4@example.com",
    code: otp,
  });

  authToken = verifyRes.body.data.token;

  const projRes = await request(app)
    .post("/api/v1/projects")
    .set("Authorization", `Bearer ${authToken}`)
    .send({
      name: "Module 4 Project",
      key: "MOD4",
    });

  createdProjectId = projRes.body.data._id;

  const taskRes = await request(app)
    .post("/api/v1/tasks")
    .set("Authorization", `Bearer ${authToken}`)
    .send({
      projectId: createdProjectId,
      title: "Task dengan Komentar & Attachment",
    });

  createdTaskId = taskRes.body.data._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("PENGUJIAN API MODUL 4 (Comments, Activity Logs, Attachments)", () => {
  it("✅ [Create Comment] Seharusnya berhasil menambahkan komentar baru", async () => {
    const res = await request(app)
      .post(`/api/v1/tasks/${createdTaskId}/comments`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        content: "Halo, ini komentar pengujian otomatis!",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.content).toBe("Halo, ini komentar pengujian otomatis!");

    createdCommentId = res.body.data._id;
  });

  it("✅ [Get Comments] Seharusnya berhasil mengambil daftar komentar task", async () => {
    const res = await request(app)
      .get(`/api/v1/tasks/${createdTaskId}/comments`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it("✅ [Get Activities] Seharusnya otomatis mencatat riwayat aktivitas COMMENTED", async () => {
    const res = await request(app)
      .get(`/api/v1/tasks/${createdTaskId}/activities`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].action).toBe("COMMENTED");
  });

  it("✅ [Upload Attachment] Seharusnya berhasil mengunggah file lampiran", async () => {
    // Buat file temporary di memori/scratch
    const dummyFilePath = path.join(process.cwd(), "scratch_test.txt");
    fs.writeFileSync(dummyFilePath, "Isi dokumen dummy pengujian file attachment");

    const res = await request(app)
      .post(`/api/v1/tasks/${createdTaskId}/attachments`)
      .set("Authorization", `Bearer ${authToken}`)
      .attach("file", dummyFilePath);

    // Hapus file temporary
    if (fs.existsSync(dummyFilePath)) {
      fs.unlinkSync(dummyFilePath);
    }

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.filename).toBe("scratch_test.txt");

    createdAttachmentId = res.body.data._id;
  });

  it("✅ [Get Attachments] Seharusnya mengembalikan daftar lampiran task", async () => {
    const res = await request(app)
      .get(`/api/v1/tasks/${createdTaskId}/attachments`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it("✅ [Delete Comment] Seharusnya berhasil menghapus komentar", async () => {
    const res = await request(app)
      .delete(`/api/v1/comments/${createdCommentId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("✅ [Delete Attachment] Seharusnya berhasil menghapus lampiran file", async () => {
    const res = await request(app)
      .delete(`/api/v1/attachments/${createdAttachmentId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
