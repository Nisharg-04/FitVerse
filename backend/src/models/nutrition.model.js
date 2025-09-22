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
    mealType: {
      type: String,
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
    protein: {
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
