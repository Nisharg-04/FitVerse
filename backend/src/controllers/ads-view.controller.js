import { AdvertisementView } from "../models/advertisementView.model.js";

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

// // Track Ad Click
// export const trackAdClick = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const view = await AdvertisementView.findByIdAndUpdate(id, { clicked: true }, { new: true });
//     if (!view) return res.status(404).json({ error: "Ad View not found" });

//     res.json({ success: true, view });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Track Ad Click
export const trackAdClick = async (req, res) => {
  try {
    const { userId, advertisementId } = req.body;

    if (!userId || !advertisementId) {
      return res.status(400).json({ error: "userId and adId are required" });
    }

    const view = await AdvertisementView.findOneAndUpdate(
      { userId, advertisementId },
      { clicked: true },
      { new: true }
    );

    if (!view) {
      return res.status(404).json({ error: "Ad View not found for this user and ad" });
    }

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
