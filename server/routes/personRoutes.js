import express from "express";
import {
  registerPerson,
  getAllPersons,
  deletePerson,
  updatePerson,
  getPersonById,
  updatePersonStatus,
} from "../controllers/personController.js";

import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";


const router = express.Router();

/// Register
router.post(
  "/register",
  protect,
  authorize("admin", "officer"),
  upload.array("images", 5),
  registerPerson
);

// Get all
router.get("/", protect, getAllPersons);

// Get one
router.get("/:id", protect, getPersonById);

// Update
router.put(
  "/:id",
  protect,
  authorize("admin", "officer"),
  upload.array("images", 5),
  updatePerson
);

router.put("/:id/status", protect, updatePersonStatus);

// Delete
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deletePerson
);

export default router;
