import express from "express";
import { chatAssistant } from "../controllers/chat.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/ask", verifyToken, chatAssistant);

export default router;
