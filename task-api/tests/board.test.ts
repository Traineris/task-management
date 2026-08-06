import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";

let mongoServer: MongoMemoryServer;

// Sebelum semua test dijalankan, buat database bohong-bohongan di memori (RAM)
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  // Pastikan semua index (termasuk unique) tersinkronisasi di DB palsu
  await mongoose.connection.syncIndexes();
});

// Setelah test selesai, hapus databasenya agar tidak membebani memori
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("PENGUJIAN API BOARD (Task Management System)", () => {
  it("✅ SEHARUSNYA berhasil membuat Board baru jika data lengkap", async () => {
    const response = await request(app).post("/api/v1/boards").send({
      name: "Proyek Supertest",
      dates: "2025-05-01",
      code: "PS-001",
      description: "Testing API tanpa Postman!",
    });

    // Validasi ekspektasi
    expect(response.status).toBe(201); // 201 artinya Created
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe("Proyek Supertest");
    expect(response.body.data._id).toBeDefined(); // Memastikan ID Mongoose ada
  });

  it("❌ SEHARUSNYA gagal & diblokir Zod jika nama board tidak ada", async () => {
    const response = await request(app).post("/api/v1/boards").send({
      dates: "2025-05-01",
      code: "PS-002",
      // 'name' sengaja dihilangkan untuk mengetes Error Handler
    });

    expect(response.status).toBe(400); // 400 Bad Request dari Zod
    expect(response.body.success).toBe(false);
  });

  it("✅ SEHARUSNYA berhasil mengambil semua data Board", async () => {
    const response = await request(app).get("/api/v1/boards");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true); // Harus mengembalikan sebuah array
    expect(response.body.data.length).toBe(1); // Karena di test pertama kita baru membuat 1 board
  });

  it("❌ SEHARUSNYA gagal jika code duplikat (409 Conflict)", async () => {
    const response = await request(app).post("/api/v1/boards").send({
      name: "Proyek Duplikat",
      dates: "2025-05-01",
      code: "PS-001", // Sama dengan Test 1 di atas, sengaja duplikat!
    });

    expect(response.status).toBe(409); // 409 Conflict dari errorHandler (err.code 11000)
    expect(response.body.success).toBe(false);
  });
});
