import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";

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

// ======================
// Production
// ======================
if (ENV.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "frontend", "dist");

  console.log("Current directory:", __dirname);
  console.log("Frontend dist path:", distPath);
  console.log("Dist exists:", fs.existsSync(distPath));

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ======================
// Start Server
// ======================
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});