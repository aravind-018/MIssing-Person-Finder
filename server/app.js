import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import personRoutes from "./routes/personRoutes.js";
import connectDB from "./config/db.js";
import path from "path";
import authRoutes from "./routes/authRoutes.js";



dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/person", personRoutes);

app.get("/", (req, res) => {
    res.send("GodsEye API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

