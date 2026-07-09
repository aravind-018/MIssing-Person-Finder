import express from "express";
import {
  registerPerson,
  getAllPersons,
  deletePerson,
  updatePerson,
  getPersonById,
} from "../controllers/personController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// Register
router.post(
  "/register",
  upload.array("images", 5),
  registerPerson
);

// Get all
router.get("/", getAllPersons);

// Get one
router.get("/:id", getPersonById);

// Update
router.put(
  "/:id",
  upload.array("images", 5),
  updatePerson
);

// Delete
router.delete("/:id", deletePerson);

export default router;