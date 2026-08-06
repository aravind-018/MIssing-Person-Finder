import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

role: {
  type: String,
  enum: ["admin", "officer"],
  default: "officer",
},

department: {
  type: String,
  enum: [
    "Headquarters",
    "Police",
    "Crime Branch",
    "CBI",
    "Special Branch",
    "Cyber Cell",
    "Railway Police",
    "Women Cell",
    "NIA",
  ],
  default: "Police",
},

    status: {
      type: String,
      enum: ["pending", "active", "rejected", "suspended"],
      default: "pending",
    },

    badgeNumber: {
      type: String,
      trim: true,
      default: "",
    },

    station: {
      type: String,
      trim: true,
      default: "",
    },

    designation: {
      type: String,
      trim: true,
      default: "",
    },

    district: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    preferences: {
      emailAlerts: {
        type: Boolean,
        default: true,
      },
      matchAlerts: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);