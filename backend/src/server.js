import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ===============================
// Serve Frontend (Production)
// ===============================
const distPath1 = path.join(__dirname, "../frontend/dist");
const distPath2 = path.join(__dirname, "frontend/dist");

console.log("NODE_ENV:", ENV.NODE_ENV);
console.log("Current Directory:", __dirname);
console.log("Checking Path 1:", distPath1, fs.existsSync(distPath1));
console.log("Checking Path 2:", distPath2, fs.existsSync(distPath2));

const distPath = fs.existsSync(distPath1) ? distPath1 : distPath2;

if (fs.existsSync(distPath)) {
  console.log("Serving frontend from:", distPath);

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  console.log("Frontend build (dist) not found!");
}

// ===============================
// Start Server
// ===============================
server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`✅ Server running on port ${PORT}`);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});