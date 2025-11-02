import { Router } from "express";
import {
  rechargeAccountCreate,
  rechargeAccountComplete,
  accessGym,
  getRechargeHistory,
  getGymAccessHistoryForUser,
  getGymAccessHistoryForGym,
  getUserBalance,
  getGymBalance,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/rechargeAccountCreate", verifyJWT, rechargeAccountCreate);

router.post("/rechargeAccountComplete", verifyJWT, rechargeAccountComplete);

router.post("/accessGym", verifyJWT, accessGym);

router.get("/getRechargeHistory", verifyJWT, getRechargeHistory);

router.get("/getGymAccessHistoryForUser", verifyJWT, getGymAccessHistoryForUser);

router.get("/getGymAccessHistoryForGym/:gymId", verifyJWT, getGymAccessHistoryForGym);

router.get("/getUserBalance", verifyJWT, getUserBalance);

router.get("/getGymBalance/:gymId", verifyJWT, getGymBalance);

export default router;
