import express from "express";

import {
  getSettings,
  updateGeneralSettings,
  updateAISettings,
  updateCameraSettings,
  updateNotificationSettings,
  updateSecuritySettings,
  updateBackupSettings,
  getSystemInfo,
  getActivityLogs,
  exportBackup,
} from "../controllers/settingsController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All system settings routes are admin-only.
router.use(protect, adminOnly);

router.get("/", getSettings);

router.put("/general", updateGeneralSettings);
router.put("/ai", updateAISettings);
router.put("/camera", updateCameraSettings);
router.put("/notifications", updateNotificationSettings);
router.put("/security", updateSecuritySettings);
router.put("/backup", updateBackupSettings);

router.get("/system-info", getSystemInfo);
router.get("/activity-logs", getActivityLogs);
router.get("/backup/export", exportBackup);

export default router;