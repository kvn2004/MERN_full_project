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
    const userId = req.user; // Assuming userId is set in the request by authentication middleware
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get last 3 cycles
    const cycles = await Cycle.find({ userId: userId })
      .sort({ lastPeriodDate: -1 })
      .limit(3)
      .select("lastPeriodDate cycleLength periodDuration");

    if (!cycles || cycles.length === 0) {
      return res.status(400).json({ message: "No cycle data found" });
    }

    // If only 1 record → use that directly
    const latestCycle = cycles[0];

    // Calculate average cycle length
    const avgCycleLength =
      cycles.reduce((sum, c) => sum + c.cycleLength, 0) / cycles.length;

    // Next Period = Last Period Date + Avg Cycle Length
    const nextPeriodDate = new Date(
      new Date(latestCycle.lastPeriodDate).getTime() +
        avgCycleLength * 24 * 60 * 60 * 1000
    );

    // Period Ends
    const periodDuration = latestCycle.periodDuration || 5;
    const periodEnd = new Date(
      nextPeriodDate.getTime() + periodDuration * 24 * 60 * 60 * 1000
    );

    // Ovulation = 14 days before next period
    const ovulationDate = new Date(
      nextPeriodDate.getTime() - 14 * 24 * 60 * 60 * 1000
    );

    // Fertile window = 5 days before ovulation → ovulation day
    const fertileWindowStart = new Date(
      ovulationDate.getTime() - 5 * 24 * 60 * 60 * 1000
    );
    const fertileWindowEnd = ovulationDate;

    // Detect irregular cycles
    let isIrregular = false;
    if (cycles.length >= 2) {
      const lengths = cycles.map((c) => c.cycleLength);
      const max = Math.max(...lengths);
      const min = Math.min(...lengths);
      if (max - min >= 7) isIrregular = true; // 7+ days difference = irregular
    }

    return res.status(200).json({
      message: "Prediction generated successfully",
      data: {
        lastRecordedPeriod: latestCycle.lastPeriodDate,
        averageCycleLength: Math.round(avgCycleLength),

        nextPeriodDate,
        periodEnd,

        ovulationDate,
        fertileWindowStart,
        fertileWindowEnd,

        isIrregular,
        note: isIrregular
          ? "Your cycle appears irregular. Predictions may be less accurate."
          : "Cycle appears regular.",
      },
    });
  } catch (error) {
    console.error("Predict Cycle Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
export const deleteCycle = async (req: Request, res: Response) => {
  res.json({ message: "Delete cycle - TODO" });
};
