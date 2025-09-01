import { Advertisement } from "../models/advertisement.model.js";
import { AdvertisementView } from "../models/advertisementView.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// TODO: add payment
// Create Advertisement
const createAdvertisement = asyncHandler(async (req, res) => {
  const { title, link, description, advertiserName, contactEmail, validUpto } =
    req.body;

  if (
    !title ||
    !link ||
    !description ||
    !advertiserName ||
    !contactEmail ||
    !validUpto
  ) {
    throw new ApiError(400, "All field are required");
  }

  const imageFile = req.file;

  if (!imageFile) {
    throw new ApiError(400, "Advertisement image is required");
  }

  const uploadedImage = imageFile
    ? await uploadOnCloudinary(imageFile.path)
    : null;

  if (!uploadedImage || !uploadedImage.secure_url) {
    throw new ApiError(500, "Image upload failed");
  }

  const ad = await Advertisement.create({
    title,
    link,
    description,
    advertiserName,
    contactEmail,
    validUpto,
    imageUrl: uploadedImage?.secure_url || "",
  });

  if (!ad) {
    throw new ApiError(500, "Ad creation failed");
  }

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "Advertisement created successfully",
      data: ad,
    })
  );
});

// TODO: add mongo aggeregate pagination
// TODO: admin api
// Get All Advertisements with filters & pagination
const getAllAdvertisements = asyncHandler(async (req, res) => {
  let {
    active,
    expired,
    advertiserName,
    search,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};

  if (active === "true") query.isDeleted = false;
  if (expired === "false") query.validUpto = { $gt: new Date() };
  if (advertiserName) query.advertiserName = advertiserName;
  if (search) query.title = { $regex: search, $options: "i" };

  page = parseInt(page);
  limit = parseInt(limit);

  const ads = await Advertisement.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  if (!ads || ads.length === 0) {
    throw new ApiError(404, "No advertisements found");
  }

  const total = await Advertisement.countDocuments(query);

  return res.status(200).json({
    statusCode: 200,
    message: "Advertisements fetched successfully",
    data: {
      total,
      page,
      limit,
      ads,
    },
  });
});

// Get Advertisement by ID
const getAdvertisementById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID");
  }

  const ad = await Advertisement.findById(id);

  if (!ad) {
    throw new ApiError(404, "Advertisement not found");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Ad fetched successfully",
      data: ad,
    })
  );
});

// TODO: check is user is valid
// Update Advertisement
const updateAdvertisement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Advertisement id is required");
  }

  const updates = req.body;

  const imageFile = req.file;

  if (imageFile) {
    const uploadedImage = await uploadOnCloudinary(imageFile.path);

    if (!uploadedImage || !uploadedImage.secure_url) {
      throw new ApiError(500, "Image upload failed");
    }

    updates.imageUrl = uploadedImage?.secure_url;
  }

  const updatedAd = await Advertisement.findByIdAndUpdate(id, updates, {
    new: true,
  });

  if (!updatedAd) {
    throw new ApiError(404, "Advertisement not found");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Advertisement updated successfully",
      data: updatedAd,
    })
  );
});

// TODO: check is user is valid
// Soft Delete Advertisement
const deleteAdvertisement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Advertisement id is required");
  }

  const ad = await Advertisement.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!ad) {
    throw new ApiError(404, "No advertisement found");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Advertisement deleted successfully",
      data: ad,
    })
  );
});

// TODO: check is user is valid
// Restore Advertisement
const restoreAdvertisement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Advertisement id is required");
  }

  const ad = await Advertisement.findByIdAndUpdate(
    id,
    { isDeleted: false },
    { new: true }
  );

  if (!ad) {
    throw new ApiError(404, "Advertisement not found");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Advertisement restored successfully",
      data: ad,
    })
  );
});

// TODO: admin api
// Get Active Advertisements for Users
const getActiveAdvertisements = asyncHandler(async (req, res) => {
  const query = {
    isDeleted: false,
    validUpto: { $gt: new Date() },
  };

  const ads = await Advertisement.find(query).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Active advertisements fetched successfully",
      data: ads,
    })
  );
});

const getRandomAdvertisement = asyncHandler(async (req, res) => {
  const count = await Advertisement.countDocuments({
    isDeleted: false,
    validUpto: { $gt: new Date() },
  });

  const random = Math.floor(Math.random() * count);

  const ad = await Advertisement.findOne({
    isDeleted: false,
    validUpto: { $gt: new Date() },
  })
    .sort({ createdAt: -1 })
    .skip(random);

  if (!ad) {
    throw new ApiError(404, "No advertisement found");
  }

  const view = await AdvertisementView.create({
    userId: req.user ? req.user._id : null,
    advertisementId: ad._id,
  });

  if (!view) {
    throw new ApiError(500, "Failed to create advertisement view");
  }

  const response = {
    ...ad.toObject(),
    viewId: view._id,
  };

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Random advertisement fetched successfully",
      data: response,
    })
  );
});

const toggleAdClick = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Advertisement view id is required");
  }

  const adView = await AdvertisementView.findById(id);

  if (!adView) {
    throw new ApiError(404, "Adview not found");
  }

  adView.clicked = true;

  await adView.save();

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Advertisement view updated successfully",
      data: adView,
    })
  );
});

// TODO: implement
const getApiByUser = asyncHandler(async (req, res) => {});

export {
  createAdvertisement,
  getAllAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
  restoreAdvertisement,
  getActiveAdvertisements,
  getRandomAdvertisement,
  toggleAdClick,
};
