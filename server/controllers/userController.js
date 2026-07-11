import User from "../models/User.js";

/*
    GET ALL USERS
*/

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/*
    GET PENDING USERS
*/

export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      status: "pending",
      role: "user",
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/*
    APPROVE USER
*/

export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Administrator accounts cannot be approved.",
      });
    }

    user.status = "active";
    user.approvedBy = req.user._id;
    user.approvedAt = new Date();

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

res.status(200).json({
  message: "User approved successfully.",
  user: updatedUser,
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/*
    REJECT USER
*/

export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Administrator accounts cannot be rejected.",
      });
    }

    user.status = "rejected";

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      message: "User rejected successfully.",
      user: updatedUser,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};