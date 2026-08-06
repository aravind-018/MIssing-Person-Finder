import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import personRoutes from "./routes/personRoutes.js";
import connectDB from "./config/db.js";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import detectionRoutes from "./routes/detectionRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import recognitionRoutes from "./routes/recognitionRoutes.js";
import foundReportRoutes from "./routes/foundReportRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import logger from "./utils/logger.js";

// Application startup (info logs enabled only in development)

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/person", personRoutes);
app.use("/api/users", userRoutes);
app.use("/api/detections", detectionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/recognitions", recognitionRoutes);
app.use("/api/found-report", foundReportRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/", (req, res) => {
    res.send("GodsEye API Running");
});

const PORT = process.env.PORT || 5000;
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "backend",
    });
});

app.listen(PORT, () => {
    // Log startup info only in development
    logger.info(`Server listening on port ${PORT}`);
});