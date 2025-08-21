import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Gym } from "../models/gym.model.js";
import { sendMail } from "../utils/sendMail.js";
import {
  getGymApproveMailContent,
  getGymRejectMailContent,
} from "../constants.js";

const getAllPendingGymRequest = asyncHandler(async (req, res) => {
  // Fetch all gym requests that are not verified
  let gyms = await Gym.aggregate([
    {
      $match: { isVerified: false },
    },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $project: {
        name: 1,
        location: 1,
        address: 1,
        contactNumber: 1,
        contactEmail: 1,
        perDayPrice: 1,
        features: 1,
        owner: {
          _id: "$owner._id",
          name: "$owner.name",
          email: "$owner.email",
        },
        images: 1,
      },
    },
  ]);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Pending gym requests fetched successfully",
      data: gyms,
      success: true,
    })
  );
});

const setGymVerification = asyncHandler(async (req, res) => {
  // get gym id and new status
  const { gymId, isVerified, reasonForRejection } = req.body;

  if (!gymId || isVerified === undefined) {
    throw new ApiError(400, "Gym ID and verification status are required");
  }

  if (!isVerified && !reasonForRejection) {
    throw new ApiError(400, "Reason for rejection is required");
  }

  if (isVerified && reasonForRejection) {
    throw new ApiError(
      400,
      "Reason for rejection must not be provided when approving a gym"
    );
  }

  // Find the gym and update its verification status
  const gym = await Gym.findByIdAndUpdate(
    gymId,
    { isVerified, reasonForRejection },
    { new: true }
  );

  if (!gym) {
    throw new ApiError(404, "Gym not found");
  }

  // send email to owner of gym
  const owner = await User.findById(gym.ownerId);

  if (!owner) {
    throw new ApiError(404, "Gym owner not found");
  }

  if (isVerified) {
    await sendMail({
      to: gym.contactEmail,
      subject: "Gym Verification Status Updated",
      content: getGymApproveMailContent(
        owner.name,
        gym.name,
        `${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/dashboard`,
        process.env.SMTP_EMAIL
      ),
      isHtml: true,
    });
  } else {
    await sendMail({
      to: gym.contactEmail,
      subject: "Gym Verification Status Updated",
      content: getGymRejectMailContent(
        owner.name,
        gym.name,
        reasonForRejection,
        req.user.name
      ),
      isHtml: true,
    });
  }

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Gym verification status updated successfully",
      data: gym,
      success: true,
    })
  );
});

export { getAllPendingGymRequest, setGymVerification };
