import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";
import { approveFoundReport, createFoundReport, getMyFoundReports, getPendingFoundReports, rejectFoundReport } from "../controllers/foundReportController.js";

const router = express.Router();
router.post("/", protect, authorize("officer"), upload.array("evidenceImages", 5), createFoundReport);
router.get("/my", protect, authorize("officer"), getMyFoundReports);
router.get("/pending", protect, authorize("admin"), getPendingFoundReports);
router.put("/:id/approve", protect, authorize("admin"), approveFoundReport);
router.put("/:id/reject", protect, authorize("admin"), rejectFoundReport);
export default router;
