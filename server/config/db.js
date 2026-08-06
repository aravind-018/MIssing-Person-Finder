import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/godseye";
        await mongoose.connect(mongoUri);

        // MongoDB connected (production - info logs only in development)
        logger.info("MongoDB connection established");
    } catch (error) {
        // Log error internally, but avoid exposing details to external consumers
        logger.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;