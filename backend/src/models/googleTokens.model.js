// models/GoogleTokens.ts
import mongoose, { Schema } from "mongoose";

const GoogleTokensSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    unique: true,
    ref: "User",
  },
  access_token: String,
  refresh_token: String,
  scope: String,
  token_type: String,
  expiry_date: Number, // ms since epoch
});

export const GoogleTokens = mongoose.model("GoogleTokens", GoogleTokensSchema);
