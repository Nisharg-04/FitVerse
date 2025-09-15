import { Router } from "express";
import {
  addNutrition,
  getNutritionHistory,
} from "../controllers/Nutrition.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/addNutrition", verifyJWT, addNutrition);

router.post("getNutritionHistory", verifyJWT, getNutritionHistory);

export default router;
