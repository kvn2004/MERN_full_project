import cron from "node-cron";
import Notification from "../models/notification";
import User from "../models/User";
import { sendUserNotificationEmail } from "../utils/sendEmail";

cron.schedule("0 0 * * *", async () => {
  console.log("Cron Running... Checking notifications globally");

  const nowUTC = new Date();

  const notifications = await Notification.find({
    dateToNotifyUTC: { $lte: nowUTC },
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

  console.log("Global notifications processed");
});
