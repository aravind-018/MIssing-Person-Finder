import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  deleteRecognitionSession,
  getRecognitionSession,
  getRecognitionSessions,
} from "../controllers/recognitionController.js";

const router = express.Router();

router.get("/", protect, getRecognitionSessions);
router.get("/:id", protect, getRecognitionSession);
router.delete("/:id", protect, deleteRecognitionSession);

export default router;
