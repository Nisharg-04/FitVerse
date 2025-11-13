import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Nutrition } from "../models/nutrition.model.js";
import { analyseFoodPhoto } from "../utils/analyseFoodPhoto.js";
import { GEMINI_API_URL } from "../constants.js";
import axios from "axios";

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

// ObjectId('68a72d341f1d2f1364d21966')

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

const getFoodSuggestion = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  // Get user's recent nutrition history
  const recentHistory = await Nutrition.find({ userId })
    .sort({ consumptionTime: -1 })
    .limit(5);

  if (recentHistory.length === 0) {
    throw new ApiError(404, "No meal history found. Please log some meals first.");
  }

  // Get the last meal type and determine next meal type
  const lastMealType = recentHistory[0].mealType.toLowerCase();
  let nextMealType;
  
  // Define meal sequence
  switch(lastMealType) {
    case "breakfast":
      nextMealType = "lunch";
      break;
    case "lunch":
      nextMealType = "snack";
      break;
    case "snack":
      nextMealType = "dinner";
      break;
    case "dinner":
      nextMealType = "breakfast";
      break;
    default:
      nextMealType = "breakfast";
  }

  // Format the history for the AI prompt
  const userHistory = recentHistory.map(meal => ({
    foodItem: meal.foodItem,
    mealType: meal.mealType,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    sugar: meal.sugar
  }));

  // Call Gemini API
  const messages = [{
    text: `
      You are a specialized Indian nutrition advisor. Based on the user's last meal, suggest healthy Indian food options for their next meal.
      
      Last meal type: ${lastMealType}
      Next meal type: ${nextMealType}
      
      User's recent meal history (from most recent to oldest):
      ${JSON.stringify(userHistory, null, 2)}

      Tasks:
      1. Analyze the nutritional content of recent meals
      2. Suggest healthy Indian food options for ${nextMealType}
      3. Ensure variety from previous meals

      Provide response in the following JSON format only:
      {
        "predicted_meal_type": "${nextMealType}",
        "prediction_reasoning": "Based on last meal type: ${lastMealType}",
        "suggestions": [
          {
            "food_name": string,
            "description": string,
            "calories": number,
            "protein": number,
            "carbs": number,
            "fat": number,
            "sugar": number,
            "reasoning": string,
            "indian_ingredients": [string],
            "health_benefits": string
          }
        ]
      }

      Give 3 healthy Indian food suggestions based on:
      1. Previous meal's nutritional balance
      2. Regional variety (North, South, East, West Indian cuisine)
      3. Appropriate for the next meal type
      4. Different from recent meals
      5. Balanced nutrition according to meal type needs
      6. Include protein-rich options (both vegetarian and non-vegetarian)

      Food suggestions should:
      - Be completely different from recent meals
      - Include traditional Indian dishes
      - Focus on nutritional balance
      - Be easy to prepare at home
      - Consider both taste and health aspects
      - Include commonly available ingredients

      Give only JSON response. No other text.
      Use given format only.
    `
  }];

  const response = await axios
    .post(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      contents: [
        {
          role: "user",
          parts: messages,
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    })
    .catch((error) => {
      console.error(
        "Error communicating with Gemini API:",
        error.response ? error.response.data : error.message
      );
      throw new ApiError(500, "Failed to get food suggestions");
    });

  const aiResponse =
    response.data.candidates[0]?.content?.parts[0]?.text ||
    "Sorry, I couldn't process that.";

  // Parse the JSON response
  let suggestions;
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      suggestions = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("No JSON found in response");
    }
  } catch (parseError) {
    console.error("JSON parsing error:", parseError);
    console.error("Raw AI response:", aiResponse);
    throw new ApiError(500, "Failed to parse food suggestions");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Food suggestions generated successfully",
      data: suggestions
    })
  );
});

// TODO: implement
const addNutritionGoal = asyncHandler(async (req, res) => {});

export {
  addNutrition,
  addNutritionManual,
  getNutritionHistory,
  getFoodSuggestion,
  addNutritionGoal,
};
