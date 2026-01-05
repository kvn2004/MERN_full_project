import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Cycle from "../models/Cycle";
import { env } from "process";
// API Key check
const API_KEY = process.env.GEMINI_API_KEY || "";
if (!API_KEY) {
  console.error("Critical: GEMINI_API_KEY is missing.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const chatAssistant = async (req: Request, res: Response) => {
  try {
  
    const userId = req.user?.id;
    const { message } = req.body;

    if (!userId || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    // 1. Fetch data
    const cycle = await Cycle.findOne({ userId }).sort({ lastPeriodDate: -1 });

    // 2. Use a modern 2026 model ID (gemini-2.5-flash is currently the stable standard)
   

    // You can also use "gemini-3-flash" for the latest version
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a supportive menstrual health assistant.
User data:
- Last period: ${
      cycle?.lastPeriodDate
        ? cycle.lastPeriodDate.toDateString()
        : "Not recorded"
    }
- Cycle length: ${cycle?.cycleLength ?? "Unknown"} days
- Period duration: ${cycle?.periodDuration ?? "Unknown"} days

Question: "${message}"

Give supportive, simple, non-medical advice in 1-2 short paragraphs.
`;

    // 3. Generate Content
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error("Gemini AI Error:", error);

    // Check for 404 specific to model retirement
    if (error.status === 404) {
      return res.status(500).json({
        success: false,
        message:
          "The requested AI model is legacy or unavailable. Please update the model ID.",
      });
    }

    res.status(500).json({ success: false, message: "AI service failed" });
  }
};
