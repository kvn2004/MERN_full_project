import mongoose, { Schema, Document } from "mongoose";

export interface NotificationDocument extends Document {
  userId: string;
  type: string;
  message: string;
  dateToNotify: Date;
  isSent: boolean;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: String, required: true, ref: "User" },
    type: { type: String, required: true },
    message: { type: String, required: true },
    dateToNotify: { type: Date, required: true },
    isSent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<NotificationDocument>(
  "Notification",
  NotificationSchema
);
