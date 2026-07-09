import Person from "../models/Person.js";

export const registerPerson = async (req, res) => {
    try {
        console.log(req.files);

        const imageNames = req.files
            ? req.files.map(file => file.filename)
            : [];

        const count = await Person.countDocuments();

        console.log(req.body);

const person = await Person.create({
    ...req.body,
    caseNumber: `MP-${String(count + 1).padStart(4, "0")}`,
    images: imageNames,
});

        res.status(201).json(person);

    } catch (error) {
        res.status(500).json({
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
    const update = {
      ...req.body,
      ...(req.files?.length && {
        images: req.files.map(file => file.filename),
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
    res.status(500).json({ message: error.message });
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