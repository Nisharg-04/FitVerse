import { Router } from "express";
import {
  addGymRequest,
  getNearbyGyms,
  getGymById,
  getQrCode,
  getGymByOwnerId,
  getGymDashboard,
  getGymAnalytics,
  getGymUsers,
  getGymRevenue,
  exportGymData
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
router.post("/findGymByOwner", verifyJWT, getGymByOwnerId);
router.get("/:gymId", getGymById);
router.get("/qrcode/:gymId", getQrCode);

// Main dashboard - Get complete overview
router.get("/dashboard/:gymId",verifyJWT,  getGymDashboard);

// Analytics - Get detailed analytics with custom date range
router.get("/dashboard/:gymId/analytics", verifyJWT, getGymAnalytics);

// Users - Get user statistics and list
router.get("/dashboard/:gymId/users", verifyJWT, getGymUsers);

// Revenue - Get detailed revenue breakdown
router.get("/dashboard/:gymId/revenue", verifyJWT,  getGymRevenue);

// Export - Export gym data
router.get("/dashboard/:gymId/export", verifyJWT,  exportGymData);

export default router;
