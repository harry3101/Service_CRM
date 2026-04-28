import mongoose from "mongoose";

const movementSchema = new mongoose.Schema(
  {
    inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
    movementType: { type: String, required: true, enum: ["in", "out"] },
    qty: { type: Number, required: true, min: 0 },
    callId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCall", default: null },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const InventoryMovement = mongoose.model("InventoryMovement", movementSchema);
