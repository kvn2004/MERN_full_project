import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    gender: { type: String, enum: ["male", "female"] },
    verificationCode: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    verificationCodeExpires: Date,
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
