import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";

let mongoServer: MongoMemoryServer;
let authToken: string;
let userId: string;
let createdProjectId: string;
let createdSprintId: string;
let createdTaskId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  await mongoose.connection.syncIndexes();

  // Setup User
  const regRes = await request(app).post("/api/v1/auth/register").send({
    name: "Scrum Master",
    email: "scrum@example.com",
    password: "password123",
  });

  userId = regRes.body.data.id;
  const otp = regRes.body.data.debugOtpCode;
  const verifyRes = await request(app).post("/api/v1/auth/verify-otp").send({
    email: "scrum@example.com",
    code: otp,
  });

  authToken = verifyRes.body.data.token;

  // Setup Project
  const projRes = await request(app)
    .post("/api/v1/projects")
    .set("Authorization", `Bearer ${authToken}`)
    .send({
      name: "Agile Scrum Project",
      key: "AGILE",
    });

  createdProjectId = projRes.body.data._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("PENGUJIAN MODUL ADVANCED TASK (Sprint, Analytics, Notifications, Issue Types)", () => {
  it("✅ [Create Sprint] Seharusnya berhasil membuat Sprint baru (PLANNED)", async () => {
    const res = await request(app)
      .post("/api/v1/sprints")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        projectId: createdProjectId,
        name: "Sprint 1 - Core Features",
        goal: "Selesaikan Authentication & Kanban Engine",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Sprint 1 - Core Features");
    expect(res.body.data.status).toBe("PLANNED");

    createdSprintId = res.body.data._id;
  });

  it("✅ [Start Sprint] Seharusnya berhasil mengaktifkan Sprint (ACTIVE)", async () => {
    const res = await request(app)
      .patch(`/api/v1/sprints/${createdSprintId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        status: "ACTIVE",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("ACTIVE");
  });

  it("✅ [Create Task with Agile Fields] Seharusnya membuat task dengan Story Points & Issue Type", async () => {
    const res = await request(app)
      .post("/api/v1/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        projectId: createdProjectId,
        title: "Implement Realtime Notifications",
        issueType: "STORY",
        storyPoints: 5,
        sprintId: createdSprintId,
        priority: "HIGH",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.issueType).toBe("STORY");
    expect(res.body.data.storyPoints).toBe(5);

    createdTaskId = res.body.data._id;
  });

  it("✅ [Get Project Analytics] Seharusnya menghitung agregasi statistik project & sprint aktif", async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${createdProjectId}/analytics`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.overview.totalTasks).toBe(1);
    expect(res.body.data.issueTypeDistribution.STORY).toBe(1);
    expect(res.body.data.activeSprint).toBeDefined();
    expect(res.body.data.activeSprint.name).toBe("Sprint 1 - Core Features");
  });

  it("✅ [Get Notifications] Seharusnya dapat mengambil daftar notifikasi user", async () => {
    const res = await request(app)
      .get("/api/v1/notifications")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.unreadCount).toBeDefined();
    expect(Array.isArray(res.body.data.notifications)).toBe(true);
  });

  it("✅ [Mark All Notifications Read] Seharusnya menandai seluruh notifikasi telah dibaca", async () => {
    const res = await request(app)
      .patch("/api/v1/notifications/read-all")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
