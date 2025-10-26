import { Router } from "express";
import {
  rechargeAccountCreate,
  rechargeAccountComplete,
  accessGym,
  getRechargeHistory,
  getGymAccessHistory,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/rechargeAccountCreate", verifyJWT, rechargeAccountCreate);

router.post("/rechargeAccountComplete", verifyJWT, rechargeAccountComplete);

router.post("/accessGym", verifyJWT, accessGym);

router.get("/getRechargeHistory", verifyJWT, getRechargeHistory);

router.get("/getGymAccessHistory", verifyJWT, getGymAccessHistory);

export default router;
