import mongoose, { Schema, Document } from "mongoose";

export interface NotificationDocument extends Document {
  userId: string;
  email: string;
  type: string;
  title?: string;
  message: string;
  dateToNotifyUTC: Date;
  isSent: boolean;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: String, required: true, ref: "User" },
    email: { type: String, required: true },

    type: {
      type: String,
      required: true,
      enum: ["PERIOD_REMINDER", "FERTILE_WINDOW", "OVULATION_DAY"]
    },

    title: { type: String },
    message: { type: String, required: true },

    // 🌍 Global-safe time storage
    dateToNotifyUTC: { type: Date, required: true },

    isSent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<NotificationDocument>(
  "Notification",
  NotificationSchema
);
