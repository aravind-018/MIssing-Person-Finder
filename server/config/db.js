import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async (retries = 5, delay = 3000) => {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/godseye";
    for (let i = 1; i <= retries; i++) {
        try {
            await mongoose.connect(mongoUri);
            logger.info("MongoDB connection established");
            return;
        } catch (error) {
            logger.error(`MongoDB connection failed (attempt ${i}/${retries}):`, error.message);
            if (i === retries) {
                process.exit(1);
            }
            await new Promise((res) => setTimeout(res, delay));
        }
    }
};

export default connectDB;