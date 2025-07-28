import mongoose from "mongoose";

const gymAccessLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    accessTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
    },
  },
  { timestamps: true }
);

export const GymAccessLog = mongoose.model("GymAccessLog", gymAccessLogSchema);
