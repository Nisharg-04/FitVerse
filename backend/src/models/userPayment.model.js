import mongoose from "mongoose";

const userPaymentSchema = new mongoose.Schema(
  {
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
  {
    timestamps: true,
  }
);

export const UserPayment = mongoose.model("UserPayment", userPaymentSchema);
