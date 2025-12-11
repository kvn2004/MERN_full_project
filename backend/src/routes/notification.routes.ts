import { Router } from "express";
import { getNotifications, testNotification } from "../controllers/notification.controller";

const router = Router();

router.get("/", getNotifications);
router.post("/test", testNotification);

export default router;
