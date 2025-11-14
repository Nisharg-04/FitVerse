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
  console.log(req.body);

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
    ownerId: req.user._id,
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

  const ad = await Advertisement.findById(id);

  if (!ad) {
    throw new ApiError(404, "Advertisement not found");
  }

  if (ad.ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to update this advertisement"
    );
  }

  ad.set(updates);

  const updatedAd = await ad.save();

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

// Soft Delete Advertisement
const deleteAdvertisement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Advertisement id is required");
  }

  const ad = await Advertisement.findById(id);

  if (!ad) {
    throw new ApiError(404, "Advertisement not found");
  }

  if (ad.ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to delete this advertisement"
    );
  }

  ad.isDeleted = true;

  await ad.save();

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Advertisement deleted successfully",
      data: ad,
    })
  );
});

// Restore Advertisement
const restoreAdvertisement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Advertisement id is required");
  }

  const ad = await Advertisement.findById(id);

  if (!ad) {
    throw new ApiError(404, "Advertisement not found");
  }

  if (ad.ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to restore this advertisement"
    );
  }

  ad.isDeleted = false;

  await ad.save();

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Advertisement restored successfully",
      data: ad,
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

// TODO: test
const getAdvertisementByUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const ads = await Advertisement.find({ ownerId: userId });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Advertisements fetched successfully",
      data: ads,
    })
  );
});

export {
  createAdvertisement,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
  restoreAdvertisement,
  getRandomAdvertisement,
  toggleAdClick,
  getAdvertisementByUser,
};
