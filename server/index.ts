import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  handleRegister,
  handleGetUsers,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
  handleToggleUserStatus,
} from "./routes/users";
import {
  handleGetDrivers,
  handleCreateDriver,
  handleUpdateDriver,
  handleDeleteDriver,
} from "./routes/drivers";
import {
  handleGetTrips,
  handleCreateTrip,
  handleUpdateTrip,
  handleDeleteTrip,
} from "./routes/trips";
import {
  handleGetVehicles,
  handleCreateVehicle,
  handleUpdateVehicle,
  handleDeleteVehicle,
} from "./routes/vehicles";

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

  // Body parsing middleware - handle serverless environment
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    // In serverless environment, use a more conservative approach
    app.use(
      express.json({
        limit: "10mb",
        strict: false,
        type: ["application/json", "text/plain"],
      }),
    );
  } else {
    // For local development
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  }

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // System status endpoint
  app.get("/api/status", (_req, res) => {
    res.json({
      status: "online",
      message: "Sistema Logístico funcionando",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      features: {
        login: "✅ Funcionando",
        register: "✅ Funcionando (modo compatibilidade)",
        users: "✅ Funcionando",
        database: "⚠️ Modo compatibilidade (RLS issues)",
      },
    });
  });

  // Test Supabase connection
  app.get("/api/test-db", async (_req, res) => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseUrl = "https://yqirewbwerkhpgetzrmg.supabase.co";
      const supabaseKey =
        process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase
        .from("users")
        .select("id, email, name, status")
        .limit(5);

      res.json({
        success: true,
        keyConfigured: !!supabaseKey,
        keyLength: supabaseKey.length,
        data,
        error,
      });
    } catch (error) {
      res.json({
        success: false,
        error: error.message,
      });
    }
  });

  app.get("/api/demo", handleDemo);

  // User management routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/register", handleRegister);
  app.get("/api/users", handleGetUsers);
  app.post("/api/users", handleCreateUser);
  app.put("/api/users/:id", handleUpdateUser);
  app.delete("/api/users/:id", handleDeleteUser);
  app.patch("/api/users/:id/toggle-status", handleToggleUserStatus);

  // Driver management routes
  app.get("/api/drivers", handleGetDrivers);
  app.post("/api/drivers", handleCreateDriver);
  app.put("/api/drivers/:id", handleUpdateDriver);
  app.delete("/api/drivers/:id", handleDeleteDriver);

  // Fuel trip management routes
  app.get("/api/trips", handleGetTrips);
  app.post("/api/trips", handleCreateTrip);
  app.put("/api/trips/:id", handleUpdateTrip);
  app.delete("/api/trips/:id", handleDeleteTrip);

  // Vehicle management routes
  app.get("/api/vehicles", handleGetVehicles);
  app.post("/api/vehicles", handleCreateVehicle);
  app.put("/api/vehicles/:id", handleUpdateVehicle);
  app.delete("/api/vehicles/:id", handleDeleteVehicle);

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
