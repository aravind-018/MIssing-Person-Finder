import Detection from "../models/Detection.js";
import Person from "../models/Person.js";
import RecognitionSession from "../models/RecognitionSession.js";
import mongoose from "mongoose";
import { checkAI, extractFaces, recognizeVideo } from "../services/aiService.js";
import { getSystemSettings } from "../services/settingsService.js";
import fs from "fs/promises";
import path from "path";

// Fallback used only if the settings document is unreachable for some reason.
const ENV_DEFAULT_THRESHOLD = Number(process.env.FACE_MATCH_THRESHOLD || 0.45);

const cosineSimilarity = (left, right) => {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
    return -1;
  }

  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }
  return leftMagnitude && rightMagnitude ? dot / Math.sqrt(leftMagnitude * rightMagnitude) : -1;
};

const bestMatch = (embedding, persons) => persons.reduce((best, person) => {
  const candidates = person.faceEmbeddings?.length
    ? person.faceEmbeddings.map(({ embedding: value }) => value)
    : (person.faceEmbedding?.length ? [person.faceEmbedding] : []);

  const confidence = candidates.reduce(
    (highest, candidate) => Math.max(highest, cosineSimilarity(embedding, candidate)),
    -1,
  );
  return confidence > best.confidence ? { person, confidence } : best;
}, { person: null, confidence: -1 });

export const testAI = async (_req, res) => {
  try {
    res.json(await checkAI());
  } catch (_error) {
    res.status(503).json({ success: false, message: "Face analysis service is unavailable." });
  }
};

export const detect = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required." });
    }
    if (!req.body.location?.trim()) {
      return res.status(400).json({ success: false, message: "Location is required." });
    }

    let threshold = ENV_DEFAULT_THRESHOLD;
    try {
      const settings = await getSystemSettings();
      threshold = settings.ai.faceMatchThreshold;
    } catch (_settingsError) {
      // Settings document unreachable — fall back to the env-configured default.
    }

    const [analysis] = await extractFaces([req.file.path]);
    const persons = await Person.find({ status: "Missing" }).select("+faceEmbeddings");
    const results = [];

    for (const [sourceFaceIndex, face] of analysis.faces.entries()) {
      const match = bestMatch(face.embedding, persons);
      let detection = null;
      if (match.person && match.confidence >= threshold) {
        detection = await Detection.create({
          person: match.person._id,
          officer: req.user._id,
          image: req.file.filename,
          location: req.body.location.trim(),
          confidence: match.confidence,
          faceBoundingBox: face.boundingBox,
          sourceFaceIndex,
        });
      }

      results.push({
        faceIndex: sourceFaceIndex,
        boundingBox: face.boundingBox,
        detectionScore: face.detectionScore,
        match: detection ? {
          personId: match.person._id,
          name: match.person.name,
          caseNumber: match.person.caseNumber,
          confidence: match.confidence,
          detectionId: detection._id,
        } : null,
      });
    }

    res.json({
      success: true,
      facesDetected: results.length,
      matchesCreated: results.filter(({ match }) => match).length,
      threshold,
      results,
    });
  } catch (error) {
    const status = error.code === "ECONNREFUSED" ? 503 : 500;
    res.status(status).json({ success: false, message: "Face recognition could not be completed." });
  }
};

const prepareRecognitionPersons = (persons) => persons.map((person) => ({
  id: person._id.toString(),
  name: person.name,
  caseNumber: person.caseNumber,
  embeddings: person.faceEmbeddings?.length
    ? person.faceEmbeddings.map(({ embedding }) => embedding)
    : (person.faceEmbedding?.length ? [person.faceEmbedding] : []),
})).filter((person) => person.embeddings.length > 0);

const savePreview = async (encodedPreview, frameNumber, faceIndex) => {
  const filename = `match-${Date.now()}-${frameNumber}-${faceIndex}.jpg`;
  const uploadsDirectory = path.resolve("uploads", "recognitionFrames");
  await fs.mkdir(uploadsDirectory, { recursive: true });
  await fs.writeFile(path.join(uploadsDirectory, filename), Buffer.from(encodedPreview, "base64"));
  return `recognitionFrames/${filename}`;
};

export const detectVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "A CCTV video is required." });
    }
    if (!req.body.location?.trim()) {
      return res.status(400).json({ success: false, message: "Location is required." });
    }
    if (!req.body.personId) {
      return res.status(400).json({ success: false, message: "A missing person must be selected." });
    }
    if (!mongoose.isValidObjectId(req.body.personId)) {
      return res.status(400).json({ success: false, message: "Selected person ID is invalid." });
    }

    let settingsDefaultFrameInterval = null;
    try {
      const settings = await getSystemSettings();
      settingsDefaultFrameInterval = settings.ai.defaultFrameInterval;
    } catch (_settingsError) {
      // Settings document unreachable — fall back further down the chain.
    }

    const frameInterval = Number.parseInt(req.body.frameInterval, 10)
      || settingsDefaultFrameInterval
      || Number.parseInt(process.env.VIDEO_FRAME_INTERVAL, 10)
      || 5;
    if (frameInterval < 1 || frameInterval > 300) {
      return res.status(400).json({ success: false, message: "Frame interval must be between 1 and 300." });
    }

    const person = await Person.findOne({
      _id: req.body.personId,
      status: "Missing",
    }).select("+faceEmbeddings");
    if (!person) {
      return res.status(404).json({ success: false, message: "Selected missing-person case was not found." });
    }
    if (!person.faceEmbeddings?.length && !person.faceEmbedding?.length) {
      return res.status(422).json({ success: false, message: "Selected person has no registered face embeddings." });
    }

    const recognition = await recognizeVideo(
      req.file.path,
      prepareRecognitionPersons([person]),
      frameInterval,
    );
    const topMatches = [...recognition.matches]
      .sort((left, right) => right.similarity - left.similarity)
      .slice(0, 3);
    const matches = [];

    const lastSeen = recognition.lastSeenMatch;
    const lastSeenFrame = lastSeen
      ? await savePreview(lastSeen.previewImageBase64, lastSeen.frameNumber, lastSeen.faceIndex)
      : "";

    for (const match of topMatches) {

      const previewImage = await savePreview(
        match.previewImageBase64,
        match.frameNumber,
        match.faceIndex,
      );
      const detection = await Detection.create({
        person: person._id,
        officer: req.user._id,
        image: previewImage,
        previewImage,
        sourceVideo: req.file.filename,
        location: req.body.location.trim(),
        confidence: match.similarity,
        timestamp: match.timestamp,
        videoTimestamp: match.timestamp,
        frameNumber: match.frameNumber,
        faceBoundingBox: match.boundingBox,
        sourceFaceIndex: match.faceIndex,
      });

      matches.push({
        person: {
          id: person._id,
          name: person.name,
          caseNumber: person.caseNumber,
          images: person.images,
        },
        similarity: match.similarity,
        timestamp: match.timestamp,
        frameNumber: match.frameNumber,
        boundingBox: match.boundingBox,
        previewImage,
        detectionId: detection._id,
      });
    }

    const session = await RecognitionSession.create({
      person: person._id,
      uploadedBy: req.user._id,
      videoName: req.file.originalname,
      cameraLocation: req.body.location.trim(),
      totalFrames: recognition.totalFrames,
      processedFrames: recognition.processedFrames,
      totalFacesDetected: recognition.totalFacesDetected,
      lastSeenFrame,
      lastSeenTimestamp: lastSeen?.timestamp ?? null,
      matches: matches.map((match) => ({
        previewImage: match.previewImage,
        timestamp: match.timestamp,
        frameNumber: match.frameNumber,
        similarity: match.similarity,
        confidence: match.similarity,
        boundingBox: match.boundingBox,
      })),
    });

    res.json({
      success: true,
      sessionId: session._id,
      totalFrames: recognition.totalFrames,
      processedFrames: recognition.processedFrames,
      totalFacesDetected: recognition.totalFacesDetected,
      matches,
    });
  } catch (error) {
    const status = error.code === "ECONNREFUSED" ? 503 : 500;
    res.status(status).json({
      success: false,
      message: error.response?.data?.detail || "CCTV video recognition could not be completed.",
    });
  }
};