import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  await mongoose.connection.syncIndexes();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("PENGUJIAN API AUTHENTICATION (Fase 1)", () => {
  let authToken: string;
  let debugOtp: string;

  it("✅ [Register] Seharusnya berhasil mendaftarkan user baru", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("testuser@example.com");
    expect(res.body.data.isVerified).toBe(false);
    expect(res.body.data.debugOtpCode).toBeDefined();

    debugOtp = res.body.data.debugOtpCode;
  });

  it("❌ [Login Unverified] Seharusnya ditolak login jika belum verifikasi OTP", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("✅ [Verify OTP] Seharusnya berhasil verifikasi akun dengan kode OTP", async () => {
    const res = await request(app).post("/api/v1/auth/verify-otp").send({
      email: "testuser@example.com",
      code: debugOtp,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();

    authToken = res.body.data.token;
  });

  it("✅ [Login Verified] Seharusnya berhasil login dan mendapatkan JWT Token", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();

    authToken = res.body.data.token;
  });

  it("✅ [Get Profile /me] Seharusnya berhasil mengambil data profil terproteksi", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("testuser@example.com");
  });

  it("✅ [Logout & Revoke Token] Seharusnya membatalkan token secara instan", async () => {
    // 1. Logout
    const logoutRes = await request(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${authToken}`);

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.success).toBe(true);

    // 2. Akses kembali /me dengan token yang sama -> Seharusnya ditolak 401
    const meRes = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${authToken}`);

    expect(meRes.status).toBe(401);
    expect(meRes.body.success).toBe(false);
  });
});
