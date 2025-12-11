import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // male user
    name: String,
    age: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Partner", partnerSchema);
