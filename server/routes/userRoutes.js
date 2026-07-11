import express from "express";

import {
  getAllUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
} from "../controllers/userController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.get("/pending", protect, adminOnly, getPendingUsers);
router.put(
  "/:id/approve",
  protect,
  adminOnly,
  approveUser
);
router.put(
  "/:id/reject",
  protect,
  adminOnly,
  rejectUser
);

export default router;