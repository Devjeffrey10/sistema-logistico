import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  handleGetUsers,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
  handleToggleUserStatus,
} from "./routes/users";

export function createServer() {
  const app = express();

  // Middleware - order matters!
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );

  // Request logging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.headers["content-type"]);
    next();
  });

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // User management routes
  app.post("/api/auth/login", handleLogin);
  app.get("/api/users", handleGetUsers);
  app.post("/api/users", handleCreateUser);
  app.put("/api/users/:id", handleUpdateUser);
  app.delete("/api/users/:id", handleDeleteUser);
  app.patch("/api/users/:id/toggle-status", handleToggleUserStatus);

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Server error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  });

  return app;
}
