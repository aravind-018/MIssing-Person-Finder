import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema(
  {
    person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      default: 0,
    },
    faceBoundingBox: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },
    sourceFaceIndex: Number,
    sourceVideo: String,
    timestamp: Number,
    videoTimestamp: Number,
    frameNumber: Number,
    previewImage: String,
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Detection", detectionSchema);
