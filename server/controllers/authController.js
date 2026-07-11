import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
      const {
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

    let role = "officer";
    let status = "pending";

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
    res.status(201).json({
      message:
        role === "admin"
          ? "Administrator account created successfully."
          : "Registration submitted successfully. Please wait for administrator approval.",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error(error);

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

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
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
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getUserProfile = async (req, res) => {
  res.status(200).json({
  id: req.user._id,
  name: req.user.name,
  email: req.user.email,
  role: req.user.role,
});
};