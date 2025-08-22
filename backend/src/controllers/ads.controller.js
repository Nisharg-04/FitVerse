import { Advertisement } from "../models/advertisement.model.js";
import { AdvertisementView } from "../models/advertisementView.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// ---------------------- Advertisement Management ---------------------- //

// Create Advertisement
export const createAdvertisement = async (req, res) => {
  try {
    const { title, link, description, advertiserName, contactEmail, validUpto } = req.body;
    const imageFile = req.file; // multer file

    const uploadedImage = imageFile ? await uploadOnCloudinary(imageFile.path) : null;

    const ad = await Advertisement.create({
      title,
      link,
      description,
      advertiserName,
      contactEmail,
      validUpto,
      imageUrl: uploadedImage?.secure_url || "",
    });

    res.status(201).json(ad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Advertisements with filters & pagination
export const getAllAdvertisements = async (req, res) => {
  try {
    let { active, expired, advertiserName, search, page = 1, limit = 10 } = req.query;
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

    const total = await Advertisement.countDocuments(query);

    res.json({ total, page, limit, ads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Advertisement by ID
export const getAdvertisementById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID" });

    const ad = await Advertisement.findById(id);
    if (!ad) return res.status(404).json({ error: "Advertisement not found" });

    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Advertisement
export const updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const imageFile = req.file;

    if (imageFile) {
      const uploadedImage = await uploadOnCloudinary(imageFile.path);
      updates.imageUrl = uploadedImage?.secure_url;
    }

    const updatedAd = await Advertisement.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedAd) return res.status(404).json({ error: "Advertisement not found" });

    res.json(updatedAd);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Soft Delete Advertisement
export const deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!ad) return res.status(404).json({ error: "Advertisement not found" });

    res.json({ message: "Advertisement deleted successfully", ad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Restore Advertisement
export const restoreAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
    if (!ad) return res.status(404).json({ error: "Advertisement not found" });

    res.json({ message: "Advertisement restored successfully", ad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Active Advertisements for Users
export const getActiveAdvertisements = async (req, res) => {
  try {
    const query = {
      isDeleted: false,
      validUpto: { $gt: new Date() },
    };

    const ads = await Advertisement.find(query).sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---------------------- Advertisement Views ---------------------- //

// Track Ad View
export const trackAdView = async (req, res) => {
  try {
    const { userId, advertisementId } = req.body;

    let view = await AdvertisementView.findOne({ userId, advertisementId });
    if (!view) {
      view = await AdvertisementView.create({ userId, advertisementId });
    }

    res.json({ success: true, view });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Track Ad Click
export const trackAdClick = async (req, res) => {
  try {
    const { id } = req.params;

    const view = await AdvertisementView.findByIdAndUpdate(id, { clicked: true }, { new: true });
    if (!view) return res.status(404).json({ error: "Ad View not found" });

    res.json({ success: true, view });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Views for an Ad
export const getAdViewsByAdId = async (req, res) => {
  try {
    const { adId } = req.params;

    const views = await AdvertisementView.find({ advertisementId: adId });
    const totalViews = views.length;
    const totalClicks = views.filter(v => v.clicked).length;

    res.json({ totalViews, totalClicks, CTR: totalViews ? (totalClicks / totalViews) * 100 : 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User's Viewed Ads
export const getUserViewedAds = async (req, res) => {
  try {
    const { userId } = req.params;

    const views = await AdvertisementView.find({ userId }).populate("advertisementId");
    res.json(views);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
