import { Router } from "express";
import { registerUser, loginUser, logoutUser, verifyEmail, forgotPassword } from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

export default router;
