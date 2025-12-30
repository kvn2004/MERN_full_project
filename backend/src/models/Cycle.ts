import mongoose, { Document, Schema } from "mongoose";

export interface CycleDocument extends Document {
  userId: string;
  lastPeriodDate: Date;
  cycleLength: number;
  periodDuration: number;
  symptoms?: string[];
  flowLevel?: "light" | "medium" | "heavy";
}

const CycleSchema = new Schema<CycleDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User"
    },
    lastPeriodDate: {
      type: Date,
      required: true
    },
    cycleLength: {
      type: Number,
      required: true,
      default: 28
    },
    periodDuration: {
      type: Number,
      required: true,
      default: 4
    },
    symptoms: {
      type: [String],
      default: []
    },
    flowLevel: {
      type: String,
      enum: ["light", "medium", "heavy"],
      default: "medium"
    }
  },
  { timestamps: true }
);

export default mongoose.model<CycleDocument>("Cycle", CycleSchema);
