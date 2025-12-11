import { Request, Response } from "express";

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    res.json({ message: "Get my profile - TODO" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    res.json({ message: "Update profile - TODO" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
