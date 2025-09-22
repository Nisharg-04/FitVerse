import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Nutrition } from "../models/nutrition.model.js";
import { analyseFoodPhoto } from "../utils/analyseFoodPhoto.js";

// TODO: IMPLEMENT
const addNutrition = asyncHandler(async (req, res) => {
  // get userId from req
  // get consumption time, meal type, food item from user
  // get at most 5 photos of food
  // use gemini api to find calory, carbs, fat, sugar, protine of given food
  // validate gemini response
  // create a new database entry
  // send response
  const filePaths = req.files.photos.map((file) => file.path);
  console.log(filePaths);
  const response = await analyseFoodPhoto(filePaths);

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Nutrition added successfully",
      data: response,
    })
  );
});

// TODO: IMPLEMENT
const getNutritionHistory = asyncHandler(async (req, res) => {});

export { addNutrition, getNutritionHistory };
