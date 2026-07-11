import express from "express";

import {
  getAllUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  suspendUser,
  reactivateUser,
  deleteUser,
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

router.put(
  "/:id/suspend",
  protect,
  adminOnly,
  suspendUser
);

router.put(
  "/:id/reactivate",
  protect,
  adminOnly,
  reactivateUser
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);

export default router;