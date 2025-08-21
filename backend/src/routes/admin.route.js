import { Router } from "express";
import {
  getAllPendingGymRequest,
  setGymVerification,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/pending-gym-requests", verifyJWT, getAllPendingGymRequest);
router.post("/set-gym-status", verifyJWT, setGymVerification);

export default router;
