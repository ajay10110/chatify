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

app.use(express.json({ limit: "5mb" }));
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (ENV.NODE_ENV === "production") {
  const distPath1 = path.join(__dirname, "../frontend/dist");
  const distPath2 = path.join(__dirname, "frontend/dist");

  console.log("Current directory:", __dirname);
  console.log("Checking:", distPath1, fs.existsSync(distPath1));
  console.log("Checking:", distPath2, fs.existsSync(distPath2));

  const distPath = fs.existsSync(distPath1) ? distPath1 : distPath2;

  console.log("Using:", distPath);

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});