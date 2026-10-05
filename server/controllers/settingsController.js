import mongoose from "mongoose";
import User from "../models/User.js";
import Person from "../models/Person.js";
import Detection from "../models/Detection.js";
import RecognitionSession from "../models/RecognitionSession.js";
import FoundReport from "../models/FoundReport.js";
import { getSystemSettings, updateSettingsSection } from "../services/settingsService.js";
import { checkAI } from "../services/aiService.js";
import logger from "../utils/logger.js";

/*
    GET ALL SETTINGS
*/

export const getSettings = async (req, res) => {
  try {
    const settings = await getSystemSettings();

    res.status(200).json(settings);
  } catch (error) {
    // Log internally and return generic message to client
    logger.error("getSettings error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

/*
    GET PUBLIC BRANDING
    Public endpoint for Login card and unauthenticated views.
*/
export const getBranding = async (req, res) => {
  try {
    const settings = await getSystemSettings();
    const general = settings.general || {};

    res.status(200).json({
      systemName: general.systemName || "GodsEye",
      applicationTagline: general.applicationTagline || "Missing Person Identification System",
      organizationName: general.organizationName || "",
      departmentName: general.departmentName || "",
      supportEmail: general.supportEmail || "",
    });
  } catch (error) {
    logger.error("getBranding error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

/*
    UPDATE A SETTINGS SECTION
    (general / ai / camera / notifications / security / backup)
*/

const buildSectionUpdater = (section) => async (req, res) => {
  try {
    const settings = await updateSettingsSection(section, req.body, req.user._id);

    res.status(200).json({
      message: "Settings updated successfully.",
      settings,
    });
  } catch (error) {
    logger.error(`update ${section} settings error:`, error);
    // Error handled and returned to client without revealing internal details
    res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Server Error",
    });
  }
};

export const updateGeneralSettings = buildSectionUpdater("general");
export const updateAISettings = buildSectionUpdater("ai");
export const updateCameraSettings = buildSectionUpdater("camera");
export const updateNotificationSettings = buildSectionUpdater("notifications");
export const updateSecuritySettings = buildSectionUpdater("security");
export const updateBackupSettings = buildSectionUpdater("backup");

/*
    SYSTEM INFO
    Real, live figures pulled from the running server, the database
    connection, the AI service health check, and current record counts.
*/

const READY_STATE_LABELS = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

export const getSystemInfo = async (req, res) => {
  try {
    let aiServiceStatus = "unreachable";
    let aiServiceDetail = null;

    try {
      aiServiceDetail = await checkAI();
      aiServiceStatus = "online";
    } catch (_error) {
      aiServiceStatus = "unreachable";
      logger.error("AI health check failed:", _error);
    }

    const [
      totalOfficers,
      pendingOfficers,
      totalPersons,
      missingPersons,
      totalDetections,
      totalRecognitionSessions,
    ] = await Promise.all([
      User.countDocuments({ role: "officer" }),
      User.countDocuments({ role: "officer", status: "pending" }),
      Person.countDocuments(),
      Person.countDocuments({ status: "Missing" }),
      Detection.countDocuments(),
      RecognitionSession.countDocuments(),
    ]);

    let storageUsage = "Normal";
    try {
      if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
        const stats = await mongoose.connection.db.stats();
        const dataSizeMB = (stats.dataSize / (1024 * 1024)).toFixed(2);
        storageUsage = `${dataSizeMB} MB`;
      }
    } catch (_e) {
      storageUsage = "Normal";
    }

    res.status(200).json({
      server: {
        version: "1.0.0",
        uptimeSeconds: Math.round(process.uptime()),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || "development",
        port: process.env.PORT || 5000,
        storageUsage,
      },
      database: {
        status: READY_STATE_LABELS[mongoose.connection.readyState] || "unknown",
        name: mongoose.connection.name || null,
      },
      aiService: {
        status: aiServiceStatus,
        detail: aiServiceDetail,
      },
      counts: {
        totalOfficers,
        pendingOfficers,
        totalPersons,
        missingPersons,
        totalDetections,
        totalRecognitionSessions,
      },
    });
  } catch (error) {
    // Log internally and return generic message to client
    logger.error("getSystemInfo error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

/*
    ACTIVITY LOGS
    There is no dedicated activity-log collection in this system, so
    rather than fabricate one, this aggregates real recent events that
    already exist across Users, Persons, Detections and Recognition
    Sessions into a single reverse-chronological feed.
*/

export const getActivityLogs = async (req, res) => {
  try {
    const limit = Math.min(Number.parseInt(req.query.limit, 10) || 50, 200);

    const [
      recentOfficers,
      recentPersons,
      recentDetections,
      recentSessions,
    ] = await Promise.all([
      User.find({ role: "officer" })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("name status createdAt approvedAt approvedBy"),
      Person.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("name caseNumber status createdAt"),
      Detection.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("person", "name caseNumber")
        .populate("officer", "name")
        .select("confidence createdAt person officer"),
      RecognitionSession.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("person", "name caseNumber")
        .populate("uploadedBy", "name")
        .select("videoName cameraLocation matches createdAt person uploadedBy"),
    ]);

    const events = [];

    recentOfficers.forEach((user) => {
      events.push({
        type: "officer_registered",
        message: `${user.name} registered as an officer (${user.status}).`,
        at: user.createdAt,
      });

      if (user.approvedAt) {
        events.push({
          type: "officer_status_changed",
          message: `${user.name}'s account was marked "${user.status}".`,
          at: user.approvedAt,
        });
      }
    });

    recentPersons.forEach((person) => {
      events.push({
        type: "person_registered",
        message: `Missing person case ${person.caseNumber || ""} (${person.name}) was registered.`,
        at: person.createdAt,
      });
    });

    recentDetections.forEach((detection) => {
      events.push({
        type: "detection_match",
        message: `${detection.officer?.name || "An officer"} recorded a ${(detection.confidence * 100).toFixed(1)}% match for ${detection.person?.name || "a person"}.`,
        at: detection.createdAt,
      });
    });

    recentSessions.forEach((session) => {
      events.push({
        type: "recognition_session",
        message: `${session.uploadedBy?.name || "An officer"} ran CCTV recognition ("${session.videoName}") for ${session.person?.name || "a person"} — ${session.matches?.length || 0} match(es).`,
        at: session.createdAt,
      });
    });

    events.sort((a, b) => new Date(b.at) - new Date(a.at));

    res.status(200).json(events.slice(0, limit));
  } catch (error) {
    // Log internally and return generic message to client
    logger.error("getActivityLogs error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

/*
    BACKUP EXPORT
    Streams a real JSON snapshot of the core collections. This is the
    genuine, working half of "Backup Settings" — the toggles/frequency
    fields describe intent, this button produces an actual file.
*/

export const exportBackup = async (req, res) => {
  try {
    const [users, persons, detections, recognitionSessions, foundReports, settings] =
      await Promise.all([
        User.find().select("-password"),
        Person.find(),
        Detection.find(),
        RecognitionSession.find(),
        FoundReport.find(),
        getSystemSettings(),
      ]);

    settings.backup.lastBackupAt = new Date();
    await settings.save();

    const snapshot = {
      exportedAt: new Date().toISOString(),
      counts: {
        users: users.length,
        persons: persons.length,
        detections: detections.length,
        recognitionSessions: recognitionSessions.length,
        foundReports: foundReports.length,
      },
      users,
      persons,
      detections,
      recognitionSessions,
      foundReports,
      settings,
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="godseye-backup-${Date.now()}.json"`
    );

    res.status(200).send(JSON.stringify(snapshot, null, 2));
  } catch (error) {
    // Log internally and return generic message to client
    logger.error("exportBackup error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};