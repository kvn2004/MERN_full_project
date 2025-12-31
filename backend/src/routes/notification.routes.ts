import { Router } from "express";
import {
  createNotification,
  getMyNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notification.controller";
import { verifyToken } from "../middleware/verifyToken";

const router =Router();

router.post("/", verifyToken, createNotification);
router.get("/", verifyToken, getMyNotifications);
router.put("/:id/read", verifyToken, markAsRead);
router.delete("/:id", verifyToken, deleteNotification);

export default router;
