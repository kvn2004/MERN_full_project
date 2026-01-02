import Notification from "../models/notification";
import User from "../models/User";

interface CreateAutoNotificationsProps {
  userId: string;
  lastPeriodDate: Date;
  cycleLength: number;
}

export const createCycleAutoNotifications = async ({
  userId,
  lastPeriodDate,
  cycleLength
}: CreateAutoNotificationsProps) => {
  
  const user = await User.findById(userId).select("email");
  if (!user || !user.email) {
    console.log("User email not found. Skipping notifications");
    return;
  }

  const day = 24 * 60 * 60 * 1000;
  const lastDate = new Date(lastPeriodDate);

  const nextPeriodDate = new Date(lastDate.getTime() + cycleLength * day);
  const ovulationDate = new Date(lastDate.getTime() + (cycleLength - 14) * day);
  const fertileStart = new Date(ovulationDate.getTime() - 5 * day);

  const notifications = [
    {
      userId,
      email: user.email,
      type: "PERIOD_REMINDER",
      title: "Upcoming Period Reminder",
      message: "Your period is expected soon ❤️",
      dateToNotifyUTC: nextPeriodDate,
      isSent: false
    },
    {
      userId,
      email: user.email,
      type: "FERTILE_WINDOW",
      title: "Fertile Window Starts",
      message: "Your fertile window begins today 💗",
      dateToNotifyUTC: fertileStart,
      isSent: false
    },
    {
      userId,
      email: user.email,
      type: "OVULATION_DAY",
      title: "Ovulation Day Reminder",
      message: "Today is your ovulation day 🌼",
      dateToNotifyUTC: ovulationDate,
      isSent: false
    }
  ];

  await Notification.insertMany(notifications);
  console.log("Auto Notifications Created 🎉");
};
