import { Router } from "express";
import {
  addPartner,
  getAllPartners,
  getPartner,
  updatePartner,
  deletePartner,
  addPartnerCycle,
  getPartnerCycles,
  predictPartnerCycle,
} from "../controllers/partner.controller";

const router = Router();

router.post("/add", addPartner);
router.get("/all", getAllPartners);
router.get("/:id", getPartner);
router.patch("/:id", updatePartner);
router.delete("/:id", deletePartner);

router.post("/:id/cycle/add", addPartnerCycle);
router.get("/:id/cycle", getPartnerCycles);
router.get("/:id/prediction", predictPartnerCycle);

export default router;
