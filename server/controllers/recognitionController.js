import fs from "fs/promises";
import mongoose from "mongoose";
import path from "path";
import RecognitionSession from "../models/RecognitionSession.js";

const sessionScope = (user) => (user.role === "admin" ? {} : { uploadedBy: user._id });

const sessionQuery = (user, id) => RecognitionSession.findOne({
  _id: id,
  ...sessionScope(user),
})
  .populate("person", "name caseNumber images status")
  .populate("uploadedBy", "name role");

export const getRecognitionSessions = async (req, res) => {
  try {
    const sessions = await RecognitionSession.find(sessionScope(req.user))
      .populate("person", "name caseNumber images status")
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecognitionSession = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Recognition session ID is invalid." });
    }
    const session = await sessionQuery(req.user, req.params.id).lean();
    if (!session) {
      return res.status(404).json({ success: false, message: "Recognition session not found." });
    }

    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removePreviewImages = async (matches) => {
  const uploadsDirectory = path.resolve("uploads");
  const filenames = [...new Set(matches.map(({ previewImage }) => previewImage).filter(Boolean))];

  await Promise.all(filenames.map(async (filename) => {
    try {
      await fs.unlink(path.join(uploadsDirectory, filename));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }));
};

export const deleteRecognitionSession = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Recognition session ID is invalid." });
    }
    const session = await RecognitionSession.findOne({
      _id: req.params.id,
      ...sessionScope(req.user),
    });
    if (!session) {
      return res.status(404).json({ success: false, message: "Recognition session not found." });
    }

    await removePreviewImages([...session.matches, { previewImage: session.lastSeenFrame }]);
    await session.deleteOne();

    res.json({ success: true, message: "Recognition session deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
