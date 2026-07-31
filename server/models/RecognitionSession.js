import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    previewImage: { type: String, required: true },
    timestamp: { type: Number, required: true },
    frameNumber: { type: Number, required: true },
    similarity: { type: Number, required: true },
    confidence: { type: Number, required: true },
    boundingBox: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },
  },
  { _id: false },
);

const recognitionSessionSchema = new mongoose.Schema(
  {
    person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoName: { type: String, required: true, trim: true },
    cameraLocation: { type: String, required: true, trim: true },
    totalFrames: { type: Number, required: true, default: 0 },
    processedFrames: { type: Number, required: true, default: 0 },
    totalFacesDetected: { type: Number, required: true, default: 0 },
    matches: { type: [matchSchema], default: [] },
  },
  { timestamps: true },
);

recognitionSessionSchema.index({ uploadedBy: 1, createdAt: -1 });
recognitionSessionSchema.index({ createdAt: -1 });

export default mongoose.model("RecognitionSession", recognitionSessionSchema);
