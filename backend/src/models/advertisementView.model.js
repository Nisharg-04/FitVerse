import mongoose from "mongoose";

const advertisementViewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clicked: {
      type: Boolean,
      default: false,
    },
    advertisementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advertisement",
      required: true,
    },
  },
  { timestamps: true }
);

export const AdvertisementView = mongoose.model(
  "AdvertisementView",
  advertisementViewSchema
);
