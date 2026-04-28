import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true, unique: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null },
    callId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCall", default: null },
    amount: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    invoiceDate: { type: String, required: true },
    status: { type: String, default: "paid", enum: ["paid", "pending"] },
  },
  { timestamps: true }
);

export const Revenue = mongoose.model("Revenue", revenueSchema);
