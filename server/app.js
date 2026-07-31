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

app.get("/", (req, res) => {
    res.send("GodsEye API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

