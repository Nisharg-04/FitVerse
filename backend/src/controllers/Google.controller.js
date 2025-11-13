import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { GoogleTokens } from "../models/googleTokens.model.js";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

// to generate local access and refresh token
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

// To get access token from refreshtoken of google
const getValidAccessToken = async (userId) => {
  const doc = await GoogleTokens.findOne({ userId });
  if (!doc) {
    throw new ApiError(400, "no_token");
  }

  // If not expired, use it
  const now = Date.now();
  if (doc.access_token && doc.expiry_date && now < doc.expiry_date - 60000) {
    return doc.access_token;
  }

  // Refresh using refresh_token
  if (!doc.refresh_token) {
    throw new ApiError(400, "no_refresh_token");
  }
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: doc.refresh_token,
  });

  const r = await axios
    .post("https://oauth2.googleapis.com/token", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .catch((error) => {
      throw error;
    });

  if (r.status !== 200) {
    throw new ApiError(400, "invalid_refresh_token");
  }

  const { access_token, expires_in, scope, token_type } = r.data;
  const newExpiry = Date.now() + expires_in * 1000;

  await GoogleTokens.updateOne(
    { userId },
    {
      access_token,
      scope,
      token_type,
      expiry_date: newExpiry,
    }
  );

  return access_token;
};

// To create google client
const createGoogleClient = () => {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage" // important: matches the no-redirect popup code flow
  );

  return oauth2Client;
};

const googleOAuthLogin = asyncHandler(async (req, res) => {
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
          secure: true, // ✅ Only send cookie over HTTPS
          sameSite: "none", // ✅ Allow cross-site cookies (e.g., Vercel -> Render)
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
          emailVerified: true,
        });

        const { accessToken, refreshToken } =
          await generateAccessAndRefreshToken(newUser);

        const userResponse = {
          ...newUser.toJSON(),
          password: undefined,
          refreshToken,
        };

        const options = {
          httpOnly: true,
          secure: true, // ✅ Only send cookie over HTTPS
          sameSite: "none", // ✅ Allow cross-site cookies (e.g., Vercel -> Render)
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
    console.log("Google login error : ", error);
    // TODO - handle error
    throw new ApiError(500, "ERROR", error);
  }
});

const generateTokens = asyncHandler(async (req, res) => {
  try {
    const { code } = req.body;
    const client = createGoogleClient();

    // tokens: { access_token, refresh_token, scope, token_type, expiry_date }
    const { tokens } = await client.getToken(code);

    await GoogleTokens.findOneAndUpdate(
      { userId: req.user._id },
      {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token, // may be undefined on subsequent consents
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date,
      },
      { upsert: true, new: true }
    );

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: tokens,
        message: "Tokens generated successfully",
      })
    );
  } catch (error) {
    console.log("Token generation error : ", error);
    throw new ApiError(500, "ERROR", error);
  }
});

const getSteps = asyncHandler(async (req, res) => {
  try {
    const accessToken = await getValidAccessToken(req.user._id);

    if (!accessToken) {
      throw new ApiError(400, "no_token");
    }

    const end = Date.now();
    const start = end - 7 * 24 * 60 * 60 * 1000;

    const body = {
      aggregateBy: [{ dataTypeName: "com.google.step_count.delta" }],
      bucketByTime: { durationMillis: 24 * 60 * 60 * 1000 },
      startTimeMillis: start,
      endTimeMillis: end,
    };

    const r = await axios.post(
      "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      body,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const data = r?.data?.bucket;

    const response = [];

    data.map((dayData) => {
      const temp = {};
      temp.startTime = dayData?.startTimeMillis;
      temp.endTime = dayData?.endTimeMillis;
      temp.steps = dayData?.dataset[0]?.point[0]?.value[0]?.intVal || 0;
      response.push(temp);
    });

    console.log(response);

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: response,
        message: "Steps fetched successfully",
      })
    );
  } catch (err) {
    console.error("Fit API error:", err);
    res.status(400).json({ error: "fit_api_failed" });
  }
});

export { googleOAuthLogin, generateTokens, getSteps };
