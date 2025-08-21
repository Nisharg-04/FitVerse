import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Gym } from "../models/gym.model.js";
import { sendMail } from "../utils/sendMail.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addGymRequest = asyncHandler(async (req, res) => {
  // get gym details
  const {
    name,
    addressLine,
    city,
    state,
    contactNumber,
    contactEmail,
    perHourPrice,
    features,
    latitude,
    longitude,
  } = req.body;

  if (
    !name ||
    !addressLine ||
    !city ||
    !state ||
    !contactNumber ||
    !contactEmail ||
    !perHourPrice ||
    !features ||
    !latitude ||
    !longitude
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // upload all images on cloudinary
  const imageUrls = await Promise.all(
    req.files.images.map((file) => uploadOnCloudinary(file.path))
  );

  // Create a new gym request
  const gymRequest = new Gym({
    name,
    address: {
      addressLine,
      city,
      state,
    },
    city,
    state,
    contactNumber,
    contactEmail,
    perHourPrice,
    features,
    ownerId: req.user.id,
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    images: imageUrls.map((image) => image.url),
  });

  await gymRequest.save();

  res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "Gym request added successfully",
      data: gymRequest,
      success: true,
    })
  );
});

const getNearbyGyms = asyncHandler(async (req, res) => {
  // get longitute latitude of user and radius
  const { longitude, latitude, radius } = req.body;

  if (!longitude || !latitude || !radius) {
    throw new ApiError(400, "Longitude, latitude and radius are required");
  }

  // Find nearby gyms
  const nearbyGyms = await Gym.find({
    isVerified: true,
    location: {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radius / 6378.1],
      },
    },
  });

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Nearby gyms fetched successfully",
      data: nearbyGyms,
      success: true,
    })
  );
});

const getGymById = asyncHandler(async (req, res) => {
  const { gymId } = req.params;

  if (!gymId) {
    throw new ApiError(400, "Gym ID is required");
  }

  const gym = await Gym.findById(gymId);

  if (!gym) {
    throw new ApiError(404, "Gym not found");
  }

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Gym fetched successfully",
      data: gym,
      success: true,
    })
  );
});

export { addGymRequest, getNearbyGyms, getGymById };
