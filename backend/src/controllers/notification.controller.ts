import { Request, Response } from "express";

export const getNotifications = async (req: Request, res: Response) => {
  res.json({ message: "Get notifications - TODO" });
};

export const testNotification = async (req: Request, res: Response) => {
  res.json({ message: "Test notification - TODO" });
};
