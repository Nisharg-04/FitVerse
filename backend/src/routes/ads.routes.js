import { Router } from "express";
import {
  createAdvertisement,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
  restoreAdvertisement,
  getActiveAdvertisements,
  getRandomAdvertisement,
  toggleAdClick,
} from "../controllers/ads.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/createAdvertisement",
  verifyJWT,
  upload.single("image"),
  createAdvertisement
);

router.get("/getAdvertisementById/:id", verifyJWT, getAdvertisementById);

router.put(
  "/updateAdvertisement/:id",
  verifyJWT,
  upload.single("image"),
  updateAdvertisement
);

router.delete("/deleteAdvertisement/:id", verifyJWT, deleteAdvertisement);

router.patch("/restoreAdvertisement/:id", verifyJWT, restoreAdvertisement);

router.get("/getActiveAdvertisement", verifyJWT, getActiveAdvertisements);

router.get("/getRandomAdvertisement", getRandomAdvertisement);

router.get("/toggleView/:id", toggleAdClick);

export default router;
