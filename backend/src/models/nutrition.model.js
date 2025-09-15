import mongoose from "mongoose";

const nutritionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    consumptionTime: {
      type: Date,
    },
    MealType: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Unknown"],
    },
    foodItem: {
      type: String,
    },
    calories: {
      type: Number,
    },
    carbs: {
      type: Number,
    },
    protine: {
      type: Number,
    },
    sugar: {
      type: Number,
    },
    fat: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Nutrition = mongoose.model("Nutrition", nutritionSchema);
