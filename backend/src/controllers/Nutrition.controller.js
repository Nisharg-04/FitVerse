import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Nutrition } from "../models/nutrition.model.js";
import { analyseFoodPhoto } from "../utils/analyseFoodPhoto.js";

const addNutrition = asyncHandler(async (req, res) => {
  // get userId from req

  const userId = req?.user?._id;
  // get consumption time, meal type from user
  const { consumptionTime, mealType } = req.body;
  if (!consumptionTime || !mealType) {
    throw new ApiError(400, "Please provide all required fields");
  }

  // get at most 5 photos of food
  const filePaths = req.files?.photos?.map((file) => file.path);
  if (filePaths.length === 0) {
    throw new ApiError(400, "Please provide at least one photo");
  }
  if (filePaths.length > 5) {
    filePaths.splice(5);
  }

  // use gemini api to find calory, carbs, fat, sugar, protine of given food
  const response = await analyseFoodPhoto(filePaths);
  if (!response) {
    throw new ApiError(500, "Error analysing food photo");
  }

  // validate gemini response
  const { is_food_photo, nutrition } = response;
  if (!is_food_photo) {
    throw new ApiError(400, "Provided photos do not contain food");
  }

  const { food_name, calories, carbs, fat, sugar, protein } = nutrition;
  console.log(nutrition);
  if (
    !food_name ||
    calories === undefined ||
    carbs === undefined ||
    fat === undefined ||
    sugar === undefined ||
    protein === undefined
  ) {
    throw new ApiError(500, "Error analysing food photo");
  }

  // create a new database entry
  const nutritionEntry = await Nutrition.create({
    userId,
    consumptionTime: new Date(consumptionTime),
    mealType,
    foodItem: food_name,
    calories,
    carbs,
    fat,
    sugar,
    protein,
  });

  // send response
  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "Nutrition added successfully",
      data: nutritionEntry,
    })
  );
});

const addNutritionManual = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  const {
    consumptionTime,
    mealType,
    foodItem,
    calories,
    carbs,
    protein,
    sugar,
    fat,
  } = req.body;

  if (
    !consumptionTime ||
    !mealType ||
    !foodItem ||
    !calories ||
    !carbs ||
    !protein ||
    !sugar ||
    !fat
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const nutrition = await Nutrition.create({
    userId,
    consumptionTime: new Date(consumptionTime),
    mealType,
    foodItem,
    calories,
    carbs,
    protein,
    sugar,
    fat,
  });

  const response = {
    ...nutrition,
    userId: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    __v: undefined,
  };

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "Nutrition added successfully",
      data: response,
    })
  );
});

const getNutritionHistory = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  const history = await Nutrition.find({ userId }).sort({
    consumptionTime: -1,
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Nutrition history fetched successfully",
      data: history,
    })
  );
});

// TODO: implement
const getFoodSuggestion = asyncHandler(async (req, res) => {});

// TODO: implement
const addNutritionGoal = asyncHandler(async (req, res) => {});

export {
  addNutrition,
  addNutritionManual,
  getNutritionHistory,
  getFoodSuggestion,
  addNutritionGoal,
};
