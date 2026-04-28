import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, default: "" },
    stockQty: { type: Number, required: true, default: 0 },
    unitPrice: { type: Number, required: true, default: 0 },
    reorderLevel: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Inventory = mongoose.model("Inventory", inventorySchema);
