import { Router } from "express";
import {
  googleOAuthLogin,
  generateTokens,
  getSteps,
} from "../controllers/Google.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", googleOAuthLogin);
router.post("/exchange", verifyJWT, generateTokens);
router.get("/steps", verifyJWT, getSteps);

export default router;
