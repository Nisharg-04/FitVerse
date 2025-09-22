import { Router } from "express";
import {
  addNutrition,
  getNutritionHistory,
} from "../controllers/Nutrition.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/addNutrition",
  upload.fields([
    {
      name: "photos",
      maxCount: 5,
    },
  ]),
  addNutrition
);

router.post("getNutritionHistory", verifyJWT, getNutritionHistory);

export default router;
