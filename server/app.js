import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import personRoutes from "./routes/personRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import detectionRoutes from "./routes/detectionRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import recognitionRoutes from "./routes/recognitionRoutes.js";
import foundReportRoutes from "./routes/foundReportRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import logger from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

connectDB();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["*"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      
      // If wildcard allowed, return the request origin (required when credentials: true)
      if (allowedOrigins.includes("*")) {
        return callback(null, origin);
      }
      
      // Allow exact matches or any vercel.app preview domain
      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app");

      if (isAllowed) {
        callback(null, origin);
      } else {
        logger.warn(`CORS blocked for origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

const uploadsPath = process.env.UPLOADS_DIR || path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use("/uploads", express.static(uploadsPath));

app.use("/api/auth", authRoutes);
app.use("/api/person", personRoutes);
app.use("/api/users", userRoutes);
app.use("/api/detections", detectionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/recognitions", recognitionRoutes);
app.use("/api/found-report", foundReportRoutes);
app.use("/api/settings", settingsRoutes);

const clientDistPath = path.join(__dirname, "../client/dist");
if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.use((req, res, next) => {
        if (req.path.startsWith("/api") || req.path.startsWith("/uploads") || req.path === "/health") {
            return next();
        }
        res.sendFile(path.join(clientDistPath, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("GodsEye API Running");
    });
}

const PORT = process.env.PORT || 5000;
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "backend",
    });
});

app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server listening on port ${PORT}`);
});