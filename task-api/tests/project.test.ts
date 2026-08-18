import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";

let mongoServer: MongoMemoryServer;
let authToken: string;
let createdProjectId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  await mongoose.connection.syncIndexes();

  // Buat User Terverifikasi & Ambil Token
  const regRes = await request(app).post("/api/v1/auth/register").send({
    name: "Project Lead User",
    email: "lead@example.com",
    password: "password123",
  });

  const otp = regRes.body.data.debugOtpCode;
  const verifyRes = await request(app).post("/api/v1/auth/verify-otp").send({
    email: "lead@example.com",
    code: otp,
  });

  authToken = verifyRes.body.data.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("PENGUJIAN API PROJECT MANAGEMENT (Fase 2)", () => {
  it("✅ [Create Project] Seharusnya berhasil membuat Project baru", async () => {
    const res = await request(app)
      .post("/api/v1/projects")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Mobile Banking App",
        key: "BANK",
        description: "Aplikasi mobile banking modern",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.key).toBe("BANK");
    expect(res.body.data._id).toBeDefined();

    createdProjectId = res.body.data._id;
  });

  it("❌ [Duplicate Key] Seharusnya gagal jika Key project sudah ada", async () => {
    const res = await request(app)
      .post("/api/v1/projects")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Bank Duplikat",
        key: "BANK",
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("✅ [Get Projects] Seharusnya berhasil mengambil daftar project user", async () => {
    const res = await request(app)
      .get("/api/v1/projects")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it("✅ [Get Project By ID] Seharusnya mengembalikan detail project", async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${createdProjectId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Mobile Banking App");
  });
});
