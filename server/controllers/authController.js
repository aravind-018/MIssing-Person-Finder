import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { getSystemSettings } from "../services/settingsService.js";
import { validatePassword } from "../utils/passwordValidator.js";

export const registerUser = async (req, res) => {
  try {
      let {
  name,
  email,
  password,
  department,
  badgeNumber,
  station,
  designation,
  district,
  phone,
} = req.body;
    // Validate required fields
if (!name || !email || !password) {
  return res.status(400).json({
    message: "Please provide all required fields.",
  });
}

const passwordValidation = await validatePassword(password);

if (!passwordValidation.valid) {
  return res.status(400).json({
    message: passwordValidation.message,
  });
}
    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

// Check if an admin already exists
const adminExists = await User.findOne({ role: "admin" });

const settings = await getSystemSettings();

let role = "officer";
let status = settings.security.autoApproveOfficers
  ? "active"
  : "pending";

// First registered user becomes admin
if (!adminExists) {
  role = "admin";
  status = "active";
  department = "Headquarters";
}

    // Create user
    const user = await User.create({
  name,
  email,
  password: hashedPassword,

  role,
  department,

  status,

  badgeNumber,
  station,
  designation,
  district,
  phone,
});
    const registrationMessage =
  role === "admin"
    ? "Administrator account created successfully."
    : status === "active"
    ? "Officer account created successfully."
    : "Registration submitted successfully. Please wait for administrator approval.";

res.status(201).json({
  message: registrationMessage,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  },
});
  } catch (error) {
    // Error handled and returned to client without revealing internal details
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Check account status
    if (user.status === "pending") {
      return res.status(403).json({
        message:
          "Your account is awaiting administrator approval.",
      });
    }

    if (user.status === "rejected") {
      return res.status(403).json({
        message:
          "Your registration request has been rejected.",
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        message:
          "Your account has been suspended. Please contact the administrator.",
      });
    }

    // Check if account is locked out
    if (user.lockUntil && user.lockUntil > new Date()) {
      const minutesRemaining = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      return res.status(429).json({
        message: `Account is temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minute(s).`,
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      const settings = await getSystemSettings();
      const maxAttempts = settings.security?.maxLoginAttempts || 5;
      const lockoutDuration = settings.security?.lockoutDuration || 15;

      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= maxAttempts) {
        user.lockUntil = new Date(Date.now() + lockoutDuration * 60 * 1000);
        user.failedLoginAttempts = 0;
        await user.save();

        return res.status(429).json({
          message: `Account locked due to ${maxAttempts} consecutive failed login attempts. Please try again in ${lockoutDuration} minutes.`,
        });
      }

      await user.save();

      const attemptsRemaining = maxAttempts - user.failedLoginAttempts;
      return res.status(401).json({
        message: `Invalid email or password. (${attemptsRemaining} attempt(s) remaining before account lockout)`,
      });
    }

    // On successful login, reset lockout tracking
    if (user.failedLoginAttempts > 0 || user.lockUntil) {
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    // Generate JWT
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    // Error handled and returned to client without revealing internal details
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      department: req.user.department,
      designation: req.user.designation,
      badgeNumber: req.user.badgeNumber,
      station: req.user.station,
      district: req.user.district,
      status: req.user.status,
      preferences: req.user.preferences,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    // Error handled and returned to client without revealing internal details
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const { emailAlerts, matchAlerts } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (typeof emailAlerts === "boolean") {
      user.preferences.emailAlerts = emailAlerts;
    }

    if (typeof matchAlerts === "boolean") {
      user.preferences.matchAlerts = matchAlerts;
    }

    await user.save();

    res.status(200).json({
      message: "Preferences updated successfully.",
      preferences: user.preferences,
    });
  } catch (error) {
    // Error handled and returned to client without revealing internal details
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Please provide all required fields.",
      });
    }

    // Get logged-in user
    const user = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    const passwordValidation = await validatePassword(newPassword);

    if (!passwordValidation.valid) {
      return res.status(400).json({
        message: passwordValidation.message,
      });
    }

    // Prevent reusing the same password
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        message:
          "New password must be different from the current password.",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    // Error handled and returned to client without revealing internal details
    res.status(500).json({
      message: "Server Error",
    });
  }
};