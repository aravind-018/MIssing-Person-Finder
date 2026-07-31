import express from "express";
import upload from "../middleware/upload.js";
import { videoUpload } from "../middleware/upload.js";
import { testAI, detect, detectVideo } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/health", testAI);
router.get("/test", testAI); // Backward-compatible diagnostics endpoint.
router.post("/detect", protect, upload.single("image"), detect);
router.post("/video/detect", protect, videoUpload.single("video"), detectVideo);

export default router;
