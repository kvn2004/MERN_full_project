import { Request, Response } from "express";

import Notification from "../models/notification";

// Create Notification (Manual / System Use)
export const createNotification = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const { title, message, type, dateToNotify } = req.body;

    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      dateToNotify,
    });

    return res
      .status(201)
      .json({ message: "Notification created", notification });
  } catch (error) {
    console.log("Create Notification Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get My Notifications
export const getMyNotifications = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.log("Fetch Notification Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Mark as Read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.id;

    await Notification.findByIdAndUpdate(notificationId, {
      isRead: true,
    });

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.log("Read Notification Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.id;

    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.log("Delete Notification Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};
