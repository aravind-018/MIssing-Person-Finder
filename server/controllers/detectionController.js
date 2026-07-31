import Detection from "../models/Detection.js";

export const createDetection = async (req, res) => {
  try {
    const detection = await Detection.create({
      ...req.body,
      officer: req.user._id,
      image: req.file?.filename,
    });

    res.status(201).json({
      success: true,
      detection,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getDetections = async (req, res) => {
  try {
    const detections = await Detection.find()
      .populate("person", "name images")
      .populate("officer", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      detections,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateDetectionStatus = async (req, res) => {
  try {
    const detection = await Detection.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!detection) {
      return res.status(404).json({
        success: false,
        message: "Detection not found.",
      });
    }

    res.json({
      success: true,
      detection,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};