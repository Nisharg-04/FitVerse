import { Router } from "express";
import {
  getAllPendingGymRequest,
  setGymVerification,
  getAllAdvertisements,
  deleteAdvertisement,
  getActiveAdvertisements,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// TODO: Add admin middleware
router.get("/pending-gym-requests", verifyJWT, getAllPendingGymRequest);

router.post("/set-gym-status", verifyJWT, setGymVerification);

router.get("/getAllAdvertisement", verifyJWT, getAllAdvertisements);

router.delete("/deleteAdvertisement/:id", verifyJWT, deleteAdvertisement);

router.get("/getActiveAdvertisement", verifyJWT, getActiveAdvertisements);

export default router;
