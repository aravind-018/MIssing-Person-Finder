import Person from "../models/Person.js";
import { extractFaces } from "../services/aiService.js";

const getRegistrationEmbeddings = async (files) => {
    if (!files?.length) {
        const error = new Error("At least one clear face image is required.");
        error.statusCode = 400;
        throw error;
    }

    let analysis;
    try {
        analysis = await extractFaces(files.map((file) => file.path));
        console.log("STEP 5 - AI Response:", analysis);
    } catch (error) {
        console.error("========== ERROR ==========");
        console.error(error);

        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Response:", error.response.data);
        }

        console.error(error.stack);

        throw error;
    }

    if (analysis.length !== files.length) {
        const error = new Error(
            `AI service returned ${analysis.length} image result(s) for ${files.length} uploaded file(s).`
        );
        error.statusCode = 502;
        throw error;
    }

    return analysis.map((image, index) => {
        if (!Array.isArray(image?.faces) || image.faces.length !== 1) {
            const error = new Error(
                `Image ${files[index].originalname} must contain exactly one clear face; found ${image?.faces?.length ?? 0}.`
            );
            error.statusCode = 422;
            throw error;
        }

        const embedding = image.faces[0]?.embedding;
        if (!Array.isArray(embedding) || embedding.length === 0) {
            const error = new Error(`Image ${files[index].originalname} has no valid face embedding.`);
            error.statusCode = 422;
            throw error;
        }

        return { image: files[index].filename, embedding };
    });
};

export const registerPerson = async (req, res) => {
    try {
        console.log("STEP 1 - Controller entered");
        console.log("STEP 2 - Files:", req.files);
        console.log("STEP 3 - Body:", req.body);

        const imageNames = req.files
            ? req.files.map((file) => file.filename)
            : [];

        console.log("STEP 4 - Calling AI...");
        const faceEmbeddings = await getRegistrationEmbeddings(req.files);
        console.log("STEP 5 - AI Response:", faceEmbeddings);

        if (!faceEmbeddings[0]?.embedding) {
            const error = new Error(
                "No valid face embedding was returned by the AI service."
            );
            error.statusCode = 422;
            throw error;
        }

        // -----------------------------
        // Generate Unique Case Number
        // -----------------------------
        const lastPerson = await Person.findOne()
            .sort({ caseNumber: -1 })
            .select("caseNumber");

        let nextNumber = 1;

        if (lastPerson?.caseNumber) {
            nextNumber =
                parseInt(lastPerson.caseNumber.replace("MP-", ""), 10) + 1;
        }

        const caseNumber = `MP-${String(nextNumber).padStart(4, "0")}`;

        console.log("Generated Case Number:", caseNumber);

        console.log("STEP 6 - Saving MongoDB...");

        const person = await Person.create({
            ...req.body,
            caseNumber,
            images: imageNames,
            faceEmbeddings,
            faceEmbedding: faceEmbeddings[0].embedding,
        });

        console.log("STEP 7 - Saved Successfully");

        res.status(201).json(person);
    } catch (error) {
        console.error("========== ERROR ==========");
        console.error(error);

        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Response:", error.response.data);
        }

        console.error(error.stack);

        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};
export const getAllPersons = async (req, res) => {
    try {
        const persons = await Person.find().sort({ createdAt: -1 });

        res.status(200).json(persons);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch persons",
            error: error.message,
        });
    }
};

export const deletePerson = async (req, res) => {
    try {
        const person = await Person.findByIdAndDelete(req.params.id);

        if (!person) {
            return res.status(404).json({
                message: "Person not found",
            });
        }

        res.status(200).json({
            message: "Person deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting person",
            error: error.message,
        });
    }
};

// Update Person
export const updatePerson = async (req, res) => {
  try {
    if (req.user.role !== "admin" && Object.hasOwn(req.body, "status")) {
      return res.status(403).json({ message: "Officers cannot update a case status directly. Submit a Found Report instead." });
    }
    const faceEmbeddings = req.files?.length
      ? await getRegistrationEmbeddings(req.files)
      : undefined;
    const update = {
      ...req.body,
      ...(req.files?.length && {
        images: req.files.map(file => file.filename),
        faceEmbeddings,
        faceEmbedding: faceEmbeddings[0].embedding,
      }),
    };

    const person = await Person.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!person)
      return res.status(404).json({ message: "Person not found" });

    res.json(person);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getPersonById = async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);

        if (!person) {
            return res.status(404).json({
                message: "Person not found",
            });
        }

        res.status(200).json(person);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const updatePersonStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ["Missing", "Found", "Closed"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Status must be Missing, Found, or Closed." });
        }

        const person = await Person.findById(req.params.id);
        if (!person) return res.status(404).json({ message: "Person not found." });

        if (req.user.role !== "admin") return res.status(403).json({ message: "Only administrators can update a case status directly." });

        person.status = status;
        await person.save();
        res.json(person);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
