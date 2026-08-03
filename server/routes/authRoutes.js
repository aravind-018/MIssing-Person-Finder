import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  changePassword,
  updatePreferences,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put(
  "/change-password",
  protect,
  changePassword
);
router.put(
  "/preferences",
  protect,
  updatePreferences
);

export default router;