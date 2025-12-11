import { Router } from "express";
import { getMyProfile, updateProfile } from "../controllers/user.controller";

const router = Router();

router.get("/me", getMyProfile);
router.patch("/update", updateProfile);

export default router;
