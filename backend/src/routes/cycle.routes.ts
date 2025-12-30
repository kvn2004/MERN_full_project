import { Router } from "express";
import { addCycle, getMyCycles, predictMyCycle, deleteCycle } from "../controllers/cycle.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/add", verifyToken, addCycle);
router.get("/my", getMyCycles);
router.get("/prediction", verifyToken, predictMyCycle);
router.delete("/:id", deleteCycle);

export default router;
