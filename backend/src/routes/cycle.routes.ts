import { Router } from "express";
import { addCycle, getMyCycles, predictMyCycle, deleteCycle } from "../controllers/cycle.controller";

const router = Router();

router.post("/add", addCycle);
router.get("/my", getMyCycles);
router.get("/prediction", predictMyCycle);
router.delete("/:id", deleteCycle);

export default router;
