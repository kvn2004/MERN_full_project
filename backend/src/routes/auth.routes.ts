import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  checkAuth,
} from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

export default router;
