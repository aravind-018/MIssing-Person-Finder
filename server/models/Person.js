import mongoose from "mongoose";

const personSchema = new mongoose.Schema(
  {
    caseNumber: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    contact: {
      type: String,
      required: true,
    },

    missingSince: Date,

    lastSeen: {
  type: String,
  trim: true,
},

    clothing: String,

    notes: String,

    status: {
      type: String,
      enum: ["Missing", "Found", "Closed"],
      default: "Missing",
    },

    images:{
type:[String],
default:[]
},

    faceEmbedding: {
      type: [Number],
      default: [],
    },

    // One verified face per registration image. The legacy faceEmbedding field
    // remains so pre-existing records can still be recognized.
    faceEmbeddings: {
      type: [
        {
          image: { type: String, required: true },
          embedding: { type: [Number], required: true },
        },
      ],
      default: [],
      select: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Person", personSchema);
