import mongoose from "mongoose";

const serviceCallSchema = new mongoose.Schema(
  {
    ticketNo: { type: String, required: true, unique: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null },
    product: { type: String, default: "" },
    serialNo: { type: String, default: "" },
    issue: { type: String, required: true },
    priority: {
      type: String,
      default: "medium",
      enum: ["low", "medium", "high"],
    },
    status: {
      type: String,
      default: "open",
      enum: ["open", "allocated", "in-progress", "closed"],
    },
    scheduledDate: { type: String, default: null },
    closedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const ServiceCall = mongoose.model("ServiceCall", serviceCallSchema);
