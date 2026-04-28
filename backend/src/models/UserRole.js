import mongoose from "mongoose";

const roles = ["admin", "manager", "engineer"];

const userRoleSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    role: { type: String, required: true, enum: roles },
  },
  { timestamps: true }
);

userRoleSchema.index({ userId: 1, role: 1 }, { unique: true });

export const UserRole = mongoose.model("UserRole", userRoleSchema);
export { roles as APP_ROLES };
