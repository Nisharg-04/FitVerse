import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Nutrition } from "../models/nutrition.model.js";

// TODO: IMPLEMENT
const addNutrition = asyncHandler(async (req, res) => {
  // get userId from req
  // get consumption time, meal type, food item from user
  // get at most 5 photos of food
  // use gemini api to find calory, carbs, fat, sugar, protine of given food
  // validate gemini response
  // create a new database entry
  // send response
});

// TODO: IMPLEMENT
const getNutritionHistory = asyncHandler(async (req, res) => {});

export { addNutrition, getNutritionHistory };
