import mongoose from "mongoose";

const gymPaymentSchema = new mongoose.Schema(
  {
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentInfo: {
      type: Object,
      required: true,
    },
    success: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const GymPayment = mongoose.model("GymPayment", gymPaymentSchema);
