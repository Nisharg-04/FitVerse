import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateHash } from "../utils/generateHash.js";
import { roles } from "../constants.js";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    balance: {
      type: Number,
      default: 0,
    },
    refreshToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiry: {
      type: Date,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    otpAttemptsLeft: {
      type: Number,
      default: 3,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//! Middlewares

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Middleware to hash refreshToken before saving
userSchema.pre("save", function (next) {
  if (!this.isModified("refreshToken")) return next();

  if (!this.refreshToken) {
    next();
  }

  this.refreshToken = generateHash(this.refreshToken);
  next();
});

// Middleware to hash resetPasswordToken before saving and set expiry
userSchema.pre("save", async function (next) {
  if (!this.isModified("resetPasswordToken")) return next();

  if (!this.resetPasswordToken) {
    next();
  }

  this.resetPasswordToken = generateHash(this.resetPasswordToken);

  this.resetPasswordTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  next();
});

// Middleware to hash otp before saving and set expiry
userSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) return next();

  if (!this.otp) {
    next();
  }

  this.otp = generateHash(this.otp);

  this.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  next();
});

//! Methods

// Method to check if the password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to comare refreshToken
userSchema.methods.compareRefreshToken = function (refreshToken) {
  const hash = generateHash(refreshToken);
  return this.refreshToken === hash;
};

// Method to compare otp
userSchema.methods.compareOtp = function (otp) {
  const hash = generateHash(otp);
  return this.otp === hash;
};

// Method to generate accessToken
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Method to generate refreshToken
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Method to generate resetPasswordToken
userSchema.methods.generateResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  return resetToken;
};

// Method to generate otp
userSchema.methods.generateOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit otp
  return otp;
};

export const User = mongoose.model("User", userSchema);
