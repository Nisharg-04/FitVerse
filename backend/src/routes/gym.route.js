import { Router } from "express";
import {
  addGymRequest,
  getNearbyGyms,
  getGymById,
} from "../controllers/gym.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/add-gym",
  verifyJWT,
  upload.fields([{ name: "images", maxCount: 10 }]),
  addGymRequest
);
router.post("/nearby-gyms", getNearbyGyms);
router.get("/:gymId", getGymById);

export default router;
