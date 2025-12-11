import mongoose from "mongoose";

const cycleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    periodStart: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Cycle", cycleSchema);
