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
  },
  { timestamps: true }
);

export default mongoose.model("Person", personSchema);