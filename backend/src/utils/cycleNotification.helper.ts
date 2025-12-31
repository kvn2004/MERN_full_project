import Notification from "../models/notification";

interface CreateAutoNotificationsProps {
  userId: string;
  email: string;
  lastPeriodDate: Date;
  cycleLength: number;
}

export const createCycleAutoNotifications = async ({
  userId,
  email,
  lastPeriodDate,
  cycleLength
}: CreateAutoNotificationsProps) => {

  const lastDate = new Date(lastPeriodDate);
  const day = 24 * 60 * 60 * 1000;

  const nextPeriodDate = new Date(lastDate.getTime() + cycleLength * day);

  const ovulationDate = new Date(
    lastDate.getTime() + (cycleLength - 14) * day
  );

  const fertileStart = new Date(
    ovulationDate.getTime() - 5 * day
  );

  const notifications = [
    {
      userId,
      email,
      type: "PERIOD_REMINDER",
      title: "Upcoming Period Reminder",
      message: "Your period is expected soon ❤️",
      dateToNotify: nextPeriodDate,
      isSent: false
    },
    {
      userId,
      email,
      type: "FERTILE_WINDOW",
      title: "Fertile Window Starts",
      message: "Your fertile window begins today 💗",
      dateToNotify: fertileStart,
      isSent: false
    },
    {
      userId,
      email,
      type: "OVULATION_DAY",
      title: "Ovulation Day Reminder",
      message: "Today is your ovulation day 🌼",
      dateToNotify: ovulationDate,
      isSent: false
    }
  ];

  await Notification.insertMany(notifications);
  console.log("Auto Notifications Created 🎉");
};