import mongoose from "mongoose";
import FoundReport from "../models/FoundReport.js";
import Person from "../models/Person.js";

const reportDetails = (query) => query
  .populate("person", "name caseNumber status images")
  .populate("reportedBy", "name email badgeNumber station")
  .populate("reviewedBy", "name email")
  .populate("recognitionId", "videoName cameraLocation lastSeenFrame lastSeenTimestamp matches");

export const createFoundReport = async (req, res) => {
  try {
    const { personId, recognitionId, description, location, foundDate } = req.body;
    if (!personId || !description?.trim() || !location?.trim() || !foundDate) return res.status(400).json({ message: "Person, found date, location, and description are required." });
    if (!mongoose.isValidObjectId(personId)) return res.status(400).json({ message: "Person ID is invalid." });
    const person = await Person.findById(personId);
    if (!person) return res.status(404).json({ message: "Person not found." });
    if (person.status !== "Missing") return res.status(409).json({ message: "Only Missing cases can be reported as found." });
    const pending = await FoundReport.exists({ person: personId, status: "Pending" });
    if (pending) return res.status(409).json({ message: "A Found Report for this case is already pending approval." });
    const report = await FoundReport.create({
      person: personId, reportedBy: req.user._id,
      recognitionId: mongoose.isValidObjectId(recognitionId) ? recognitionId : null,
      description: description.trim(), location: location.trim(), foundDate,
      evidenceImages: req.files?.map((file) => file.filename) || [],
    });
    res.status(201).json({ success: true, report: await reportDetails(FoundReport.findById(report._id)) });
  } catch (error) { res.status(error?.code === 11000 ? 409 : 500).json({ message: error?.code === 11000 ? "A Found Report for this case is already pending approval." : error.message }); }
};

export const getMyFoundReports = async (req, res) => {
  try { res.json({ success: true, reports: await reportDetails(FoundReport.find({ reportedBy: req.user._id }).sort({ createdAt: -1 })) }); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

export const getPendingFoundReports = async (_req, res) => {
  try { res.json({ success: true, reports: await reportDetails(FoundReport.find({ status: "Pending" }).sort({ createdAt: -1 })) }); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

const reviewReport = async (req, res, approved) => {
  try {
    const report = await FoundReport.findOneAndUpdate(
      { _id: req.params.id, status: "Pending" },
      { status: approved ? "Approved" : "Rejected", reviewedBy: req.user._id, reviewRemarks: req.body.reviewRemarks?.trim() || "", approvedAt: approved ? new Date() : null },
      { new: true },
    );
    if (!report) {
      const exists = await FoundReport.exists({ _id: req.params.id });
      return res.status(exists ? 409 : 404).json({ message: exists ? "This Found Report has already been reviewed." : "Found Report not found." });
    }
    if (approved) {
      const person = await Person.findByIdAndUpdate(report.person, { status: "Found" }, { new: true });
      if (!person) return res.status(404).json({ message: "Linked person was not found." });
    }
    res.json({ success: true, report: await reportDetails(FoundReport.findById(req.params.id)) });
  } catch (error) { res.status(error.statusCode || 500).json({ message: error.message }); }
};

export const approveFoundReport = (req, res) => reviewReport(req, res, true);
export const rejectFoundReport = (req, res) => reviewReport(req, res, false);
