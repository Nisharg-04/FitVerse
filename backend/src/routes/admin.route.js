import { Router } from "express";
import {
  getAllPendingGymRequest,
  setGymVerification,
  getAllAdvertisements,
  deleteAdvertisement,
  getActiveAdvertisements,
  getDashboardStats,
  getRecentCheckins,
  getRecentTransactions,
  getAllUsers,
  deleteUser,
  changeUserRole
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// TODO: Add admin middleware
router.get("/pending-gym-requests", verifyJWT, getAllPendingGymRequest);

router.post("/set-gym-status", verifyJWT, setGymVerification);

router.get("/getAllAdvertisement", verifyJWT, getAllAdvertisements);

router.delete("/deleteAdvertisement/:id", verifyJWT, deleteAdvertisement);

router.get("/getActiveAdvertisement", verifyJWT, getActiveAdvertisements);
router.get("/dashboard-stats", verifyJWT, getDashboardStats);

router.get("/getRecentCheckins", verifyJWT, getRecentCheckins);
router.get("/getRecentTransactions", verifyJWT, getRecentTransactions);
router.get("/getAllUsers", verifyJWT, getAllUsers);
router.delete("/deleteUser/:id", verifyJWT, deleteUser);
router.post("/changeUserRole/:id", verifyJWT, changeUserRole);

export default router;
