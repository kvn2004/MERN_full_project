import mongoose from "mongoose";

const partnerCycleSchema = new mongoose.Schema(
  {
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "Partner" },
    periodStart: Date,
  },
  { timestamps: true }
);

export default mongoose.model("PartnerCycle", partnerCycleSchema);
