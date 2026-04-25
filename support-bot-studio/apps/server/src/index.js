import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import chatRouter from "./routes/chat.js";
import configRouter from "./routes/config.js";
import healthRouter from "./routes/health.js";
import { apiKeyAuth } from "./middleware/api-key-auth.js";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(v => v.trim())
  .filter(Boolean);

app.use(helmet());
app.use(express.json({ limit: "1mb" }));

// Serve assets for the widget
app.use("/assets", express.static("../widget/assets"));

// Basic CORS setup - in production, you'd want to be more restrictive
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Origin not allowed"));
  }
}));

app.use("/api/health", healthRouter);

// Apply auth middleware if you want to protect these endpoints with the EMBED_MASTER_KEY
// Note: For public widgets, you usually rely on CORS (allowedOrigins) instead.
app.use("/api/config", apiKeyAuth, configRouter);
app.use("/api/chat", apiKeyAuth, chatRouter);

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`Support bot server running on http://localhost:${port}`);
});
