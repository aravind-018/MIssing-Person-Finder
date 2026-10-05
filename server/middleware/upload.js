import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDirectory = process.env.UPLOADS_DIR || path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsDirectory)) {
    fs.mkdirSync(uploadsDirectory, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDirectory);
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
        );
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|webp/;

    const extName = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    }

    cb(new Error("Only image files are allowed"));
};

const upload = multer({
    storage,
    fileFilter,
});

const videoFileFilter = (req, file, cb) => {
    const allowedExtensions = /mp4|avi|mov/;
    const extension = path.extname(file.originalname).slice(1).toLowerCase();
    const allowedMimeTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/avi"];

    if (allowedExtensions.test(extension) && (!file.mimetype || allowedMimeTypes.includes(file.mimetype))) {
        return cb(null, true);
    }

    cb(new Error("Only MP4, AVI, and MOV video files are allowed"));
};

export const videoUpload = multer({
    storage,
    fileFilter: videoFileFilter,
    limits: { fileSize: 500 * 1024 * 1024 },
});

export default upload;
