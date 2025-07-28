import mongoose from "mongoose";

const gymSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    address: {
      addressLine: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
    contactNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    perDayPrice: {
      type: Number,
      required: true,
    },
    features: {
      type: Object,
      default: {},
    },
    paymentRemaining: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

gymSchema.index({ location: "2dsphere" });

export const Gym = mongoose.model("Gym", gymSchema);
