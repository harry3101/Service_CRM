import mongoose from "mongoose";

const callAllocationSchema = new mongoose.Schema(
  {
    callId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCall", required: true },
    engineerId: { type: mongoose.Schema.Types.ObjectId, ref: "Engineer", required: true },
    allocatedAt: { type: Date, default: () => new Date() },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const CallAllocation = mongoose.model("CallAllocation", callAllocationSchema);
