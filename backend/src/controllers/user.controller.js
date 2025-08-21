import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { roles } from "../constants.js";
import { OAuth2Client } from "google-auth-library";
import { sendMail } from "../utils/sendMail.js";
import { generateHash } from "../utils/generateHash.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Token generation failed", error);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from request body
  const { name, email, password, phoneNumber, role } = req.body;

  // validation - not empty
  if (!name || !email || !password || !phoneNumber || !role) {
    throw new ApiError(400, "All fields are required");
  }

  // check for valid role
  if (!roles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  // check if user already exists
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  // if avatar is present, upload it to cloudinary
  const avatarLocalPath = req?.files?.avatar?.[0]?.path || null;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  let avatarResponse;
  if (avatarLocalPath) {
    avatarResponse = await uploadOnCloudinary(avatarLocalPath);
  }

  // create user object and save it to database
  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    avatar: avatarResponse?.secure_url || null,
    role,
    isEmailVerified: false,
    googleVerificationStatus: "notVerified",
    isProfileComplete: true,
  });

  // generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user
  );

  // remove password from response
  const userResponse = {
    ...user.toJSON(),
    password: undefined,
    accessToken,
    refreshToken,
  };

  // set cookies
  const options = {
    httpOnly: true,
    secure: true, // ✅ Only send cookie over HTTPS
    sameSite: "none", // ✅ Allow cross-site cookies (e.g., Vercel -> Render)
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  // send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse({
        statusCode: 200,
        data: userResponse,
        message: "User registered successfully",
      })
    );
});

const loginUser = asyncHandler(async (req, res) => {
  // get user details from request body
  const { email, password } = req.body;

  // validation - not empty
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // find user by email
  const user = await User.findOne({ email });

  // check if user exists
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // compare password
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  // generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user
  );

  // set cookies
  const options = {
    httpOnly: true,
    secure: false, // ✅ Only send cookie over HTTPS
    sameSite: "lax", // ✅ Allow cross-site cookies (e.g., Vercel -> Render)
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  // send response
  const userResponse = {
    ...user.toJSON(),
    password: undefined,
    accessToken,
    refreshToken,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse({
        statusCode: 200,
        data: userResponse,
        message: "User logged in successfully",
      })
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refresh = req.cookies.refreshToken;
  if (!refresh) {
    throw new ApiError(401, "Refresh token is required");
  }
  const decoded = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET);

  // console.log(decoded);
  const user = await User.findOne({ _id: decoded._id });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user
  );

  const options = {
    httpOnly: true,
    secure: true, // ✅ Only send cookie over HTTPS
    sameSite: "none", // ✅ Allow cross-site cookies (e.g., Vercel -> Render)
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  const userResponse = {
    ...user.toJSON(),
    password: undefined,
    accessToken,
    refreshToken,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse({
        statusCode: 200,
        data: userResponse,
        message: "User logged in successfully",
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // get user from request
  const user = req.user;

  // remove access and refresh tokens
  user.accessToken = null;
  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });

  // clear cookies
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };

  // send response
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse({
        statusCode: 200,
        data: {},
        message: "User logged out successfully",
      })
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // get user from request
  const user = req.user;

  const userResponse = {
    ...user.toJSON(),
    password: undefined,
  };

  // send response
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: userResponse,
      message: "User fetched successfully",
    })
  );
});

const updateAvatar = asyncHandler(async (req, res) => {
  // check if avatar is present
  if (!req?.files?.avatar?.[0]?.path) {
    throw new ApiError(400, "Avatar is required");
  }

  // get user from request
  const user = req.user;

  // upload avatar to cloudinary
  const avatarLocalPath = req?.files?.avatar?.[0]?.path;
  const avatarResponse = await uploadOnCloudinary(avatarLocalPath);

  // update user avatar
  user.avatar = avatarResponse.secure_url;
  await user.save({ validateBeforeSave: false });

  const userResponse = {
    ...user.toJSON(),
    password: undefined,
  };

  // send response
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: userResponse,
      message: "Avatar updated successfully",
    })
  );
});

const googleOAuth = asyncHandler(async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const { token } = req.body;

  if (!token) {
    throw new ApiError(400, "Token is required");
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (payload?.email_verified) {
      const user = await User.findOne({ email: payload?.email });

      if (user) {
        const { accessToken, refreshToken } =
          await generateAccessAndRefreshToken(user);

        const userResponse = {
          ...user.toJSON(),
          password: undefined,
          accessToken,
          refreshToken,
        };

        const options = {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        };

        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(
            new ApiResponse({
              statusCode: 200,
              data: userResponse,
              message: "User logged in successfully",
            })
          );
      } else {
        const newUser = await User.create({
          name: payload?.name,
          email: payload?.email,
          avatar: payload?.picture,
          isEmailVerified: true,
          googleVerificationStatus: "profileIncomplete",
        });

        const { accessToken, refreshToken } =
          await generateAccessAndRefreshToken(newUser);

        const userResponse = {
          ...newUser.toJSON(),
          password: undefined,
          accessToken,
          refreshToken,
        };

        const options = {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        };

        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(
            new ApiResponse({
              statusCode: 200,
              data: userResponse,
              message: "User registered successfully",
            })
          );
      }
    }
  } catch (error) {
    // TODO - handle error
    throw new ApiError(500, "ERROR", error);
  }
});

const completeProfile = asyncHandler(async (req, res) => {
  const { password, phoneNumber, role } = req?.body;
  if (!password || !phoneNumber || !role) {
    throw new ApiError(400, "All fields are required");
  }

  if (!roles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const user = req.user;

  if (user?.googleVerificationStatus === "profileIncomplete") {
    user.password = password;
    user.phoneNumber = phoneNumber;
    user.role = role;
    user.googleVerificationStatus = "completed";
    await user.save({ validateBeforeSave: false });

    const userResponse = {
      ...user.toJSON(),
      password: undefined,
    };

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: userResponse,
        message: "Profile completed successfully",
      })
    );
  } else if (user?.googleVerificationStatus === "completed") {
    throw new ApiError(400, "Profile already completed");
  } else if (user?.googleVerificationStatus === "notVerified") {
    throw new ApiError(400, "Google verification pending");
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  // get email from frontend
  const email = req?.body?.email;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // generate reset token
  const resetToken = await user.generateResetPasswordToken();

  // save reset token and expiry in db
  user.resetPasswordToken = resetToken;

  await user.save();

  // send email with reset token
  const resetUrl = `${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/reset-password/${resetToken}`;
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
  <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
  <p>Hi <b>${user.name || "User"}</b>,</p>
  <p>You requested to reset your password. Click the button below to reset it:</p>
  <div style="text-align: center;">
  <a href="${resetUrl}" 
  style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
  Reset Password
  </a>
  </div>
  <p>If you didn’t request a password reset, please ignore this email.</p>
  <p>Thanks, <br/> <b>FitVerse Team</b></p>
  </div>
  `;

  try {
    await sendMail({
      to: user.email,

      subject: "Reset Password - FitVerse",

      content: htmlContent,
      isHtml: true,
    });
    // return response
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: {},
        message: "Email sent successfully",
      })
    );
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save({
      validateBeforeSave: false,
    });

    throw new ApiError(500, "Email sending failed");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  // get reset token from frontend
  const resetToken = req?.params?.resetToken;
  if (!resetToken) {
    throw new ApiError(400, "Reset token is required");
  }

  const hashedToken = generateHash(resetToken);

  // get user from reset token and check expiry
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  // update password
  // console.log(req.body);
  const { password, confirmPassword } = req?.body;
  // console.log(password);
  // console.log(confirmPassword);
  if (!password && !confirmPassword) {
    throw new ApiError(400, "Password and passwordConfirm are required");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and passwordConfirm do not match");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiry = undefined;
  await user.save();

  // return response
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {},
      message: "Password reset successfully",
    })
  );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateAvatar,
  googleOAuth,
  completeProfile,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
};
