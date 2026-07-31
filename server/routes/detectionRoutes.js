import express from "express";
import { createDetection, getDetections } from "../controllers/detectionController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router
  .route("/")
  .post(protect, upload.single("image"), createDetection)
  .get(protect, getDetections);

export default router;