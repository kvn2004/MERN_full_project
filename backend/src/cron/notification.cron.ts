import cron from "node-cron";
import Notification from "../models/notification";
import User from "../models/User";
import { sendUserNotificationEmail } from "../utils/sendEmail";

cron.schedule("0 0 * * *", async () => {
  console.log("Cron Running... Checking notifications");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const notifications = await Notification.find({
    dateToNotify: { $lte: today },
    isSent: false
  });

  for (const note of notifications) {
    const user = await User.findById(note.userId);
    if (!user?.email) continue;

    await sendUserNotificationEmail(
      user.email,
      "Period Tracker Reminder",
      note.message
    );

    note.isSent = true;
    await note.save();
  }

  console.log("Notifications checked and emails sent");
});
