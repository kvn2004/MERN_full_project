import { Request, Response } from "express";
import Cycle from "../models/Cycle";
import { log } from "console";

export const addCycle = async (req: Request, res: Response) => {
  try {
    const { lastPeriodDate, cycleLength, periodDuration, symptoms, flowLevel } =
      req.body;
    const userId = req.user; // Assuming userId is set in the request by authentication middleware
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!lastPeriodDate || !cycleLength || !periodDuration) {
      return res.status(400).json({
        message: "lastPeriodDate, cycleLength and periodDuration are required",
      });
    }
    const cycle = new Cycle({
      userId,
      lastPeriodDate,
      cycleLength,
      periodDuration,
      symptoms,
      flowLevel,
    });

    await cycle.save();
    return res.status(201).json({
      message: "Cycle data added successfully",
      cycle,
    });
  } catch (error) {
    console.error("Add Cycle Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getMyCycles = async (req: Request, res: Response) => {
  res.json({ message: "Get my cycles - TODO" });
};

export const predictMyCycle = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    const latestCycle = await Cycle.findOne({ userId })
      .sort({ lastPeriodDate: -1 })
      .select("lastPeriodDate cycleLength")
      .exec();

    if (!latestCycle) {
      return res.status(400).json({ message: "No cycle data found" });
    }

    const { lastPeriodDate, cycleLength } = latestCycle;

    if (!lastPeriodDate || !cycleLength) {
      return res
        .status(400)
        .json({ message: "Not enough data to make a prediction" });
    }
    const nextPeriodDate = new Date(
      new Date(lastPeriodDate).getTime() +
        Number(cycleLength) * 24 * 60 * 60 * 1000
    );
    console.log("Predicted Next Period Date:", nextPeriodDate);
    return res.status(200).json({
      message: "Next period date predicted successfully",
      nextPeriodDate,
    });
  } catch (error) {
    console.error("Predict Cycle Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deleteCycle = async (req: Request, res: Response) => {
  res.json({ message: "Delete cycle - TODO" });
};
