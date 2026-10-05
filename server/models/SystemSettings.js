import mongoose from "mongoose";

/*
  SystemSettings is a singleton document (there is always exactly one).
  It holds every admin-configurable knob for the GodsEye system, grouped
  the same way the Settings UI is grouped (general / ai / camera /
  notifications / security / backup).
*/

const systemSettingsSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "system_settings",
    },

    general: {
      systemName: {
        type: String,
        trim: true,
        default: "GodsEye",
      },
      organizationName: {
        type: String,
        trim: true,
        default: "",
      },
      supportEmail: {
        type: String,
        trim: true,
        default: "",
      },
      timezone: {
        type: String,
        trim: true,
        default: "Asia/Kolkata",
      },
      dateFormat: {
        type: String,
        enum: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"],
        default: "DD/MM/YYYY",
      },
      maintenanceMode: {
        type: Boolean,
        default: false,
      },
    },

    ai: {
      aiEnabled: {
        type: Boolean,
        default: true,
      },
      faceMatchThreshold: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.45,
      },
      minDetectionScore: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5,
      },
      detectionModel: {
        type: String,
        enum: ["buffalo_l", "retinaface", "mtcnn", "default-detector"],
        default: "buffalo_l",
      },
      recognitionModel: {
        type: String,
        enum: ["arcface", "facenet", "mobileface", "default-recognizer"],
        default: "arcface",
      },
      defaultFrameInterval: {
        type: Number,
        min: 1,
        max: 300,
        default: 5,
      },
      autoCreateDetectionOnMatch: {
        type: Boolean,
        default: true,
      },
      autoFaceIndexing: {
        type: Boolean,
        default: true,
      },
      duplicateFaceDetection: {
        type: Boolean,
        default: true,
      },
      maxUploadImages: {
        type: Number,
        min: 1,
        max: 50,
        default: 10,
      },
      processingTimeout: {
        type: Number,
        min: 5,
        max: 300,
        default: 60,
      },
    },

    camera: {
      defaultResolution: {
        type: String,
        enum: ["720p", "1080p", "4k"],
        default: "1080p",
      },
      fps: {
        type: Number,
        min: 1,
        max: 120,
        default: 30,
      },
      recordingQuality: {
        type: String,
        enum: ["low", "medium", "high", "ultra"],
        default: "high",
      },
      motionDetection: {
        type: Boolean,
        default: true,
      },
      saveUnknownFaces: {
        type: Boolean,
        default: false,
      },
      defaultLocations: {
        type: [String],
        default: [],
      },
      recordingRetentionDays: {
        type: Number,
        min: 1,
        max: 365,
        default: 30,
      },
      maxUploadSizeMb: {
        type: Number,
        min: 1,
        max: 2048,
        default: 500,
      },
      allowedVideoFormats: {
        type: [String],
        default: ["mp4", "avi", "mov"],
      },
    },

    notifications: {
      emailAlertsEnabled: {
        type: Boolean,
        default: true,
      },
      browserNotifications: {
        type: Boolean,
        default: true,
      },
      matchAlertsEnabled: {
        type: Boolean,
        default: true,
      },
      caseAssignmentAlerts: {
        type: Boolean,
        default: true,
      },
      newOfficerRequestAlerts: {
        type: Boolean,
        default: true,
      },
      foundReportAlerts: {
        type: Boolean,
        default: true,
      },
      dailySummary: {
        type: Boolean,
        default: false,
      },
      weeklySummary: {
        type: Boolean,
        default: true,
      },
      alertEmail: {
        type: String,
        trim: true,
        default: "",
      },
    },

    security: {
      sessionTimeoutMinutes: {
        type: Number,
        min: 5,
        max: 1440,
        default: 60,
      },
      minPasswordLength: {
        type: Number,
        min: 6,
        max: 32,
        default: 8,
      },
      requireStrongPassword: {
        type: Boolean,
        default: true,
      },
      maxLoginAttempts: {
        type: Number,
        min: 3,
        max: 20,
        default: 5,
      },
      lockoutDuration: {
        type: Number,
        min: 1,
        max: 1440,
        default: 15,
      },
      twoFactorAuth: {
        type: Boolean,
        default: false,
      },
      allowedIps: {
        type: [String],
        default: [],
      },
      auditLoggingEnabled: {
        type: Boolean,
        default: true,
      },
      autoApproveOfficers: {
        type: Boolean,
        default: false,
      },
    },

    backup: {
      autoBackupEnabled: {
        type: Boolean,
        default: false,
      },
      backupFrequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        default: "weekly",
      },
      backupTime: {
        type: String,
        trim: true,
        default: "02:00",
      },
      backupLocation: {
        type: String,
        trim: true,
        default: "/var/backups/godseye",
      },
      retentionCount: {
        type: Number,
        min: 1,
        max: 60,
        default: 5,
      },
      lastBackupAt: {
        type: Date,
        default: null,
      },
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SystemSettings", systemSettingsSchema);