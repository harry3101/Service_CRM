import mongoose from "mongoose";

const engineerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    specialization: { type: String, default: "" },
    status: {
      type: String,
      default: "available",
      enum: ["available", "on-call", "off-duty"],
    },
  },
  { timestamps: true }
);

export const Engineer = mongoose.model("Engineer", engineerSchema);
