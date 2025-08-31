import express from "express";
import multer from "multer";
import * as adsController from "../controllers/ads.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temporary folder

// Advertisement Management
router.post("/", upload.single("image"), adsController.createAdvertisement);
router.get("/", adsController.getAllAdvertisements);
router.get("/active", adsController.getActiveAdvertisements);
router.get("/:id", adsController.getAdvertisementById);
router.put("/:id", upload.single("image"), adsController.updateAdvertisement);
router.delete("/:id", adsController.deleteAdvertisement);
router.patch("/:id/restore", adsController.restoreAdvertisement);

// // Advertisement Views
// router.post("/views", adsController.trackAdView);
// router.patch("/views/:id/click", adsController.trackAdClick);
// router.get("/views/ad/:adId", adsController.getAdViewsByAdId);
// router.get("/views/user/:userId", adsController.getUserViewedAds);

export default router;
