import mongoose from "mongoose";

const foundReportSchema = new mongoose.Schema({
  person: { type: mongoose.Schema.Types.ObjectId, ref: "Person", required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recognitionId: { type: mongoose.Schema.Types.ObjectId, ref: "RecognitionSession", default: null },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  location: { type: String, required: true, trim: true, maxlength: 300 },
  foundDate: { type: Date, required: true },
  evidenceImages: { type: [String], default: [] },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  reviewRemarks: { type: String, trim: true, maxlength: 2000, default: "" },
  approvedAt: { type: Date, default: null },
}, { timestamps: true });

foundReportSchema.index({ person: 1, status: 1 });
foundReportSchema.index({ person: 1 }, { unique: true, partialFilterExpression: { status: "Pending" } });
foundReportSchema.index({ reportedBy: 1, createdAt: -1 });

export default mongoose.model("FoundReport", foundReportSchema);
