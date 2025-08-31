import express from "express";
import * as adsController from "../controllers/ads-view.controller.js";

const router = express.Router();

// Advertisement Views
router.post("/views", adsController.trackAdView);
router.patch("/click", adsController.trackAdClick);
router.get("/views/ad/:adId", adsController.getAdViewsByAdId);

export default router;