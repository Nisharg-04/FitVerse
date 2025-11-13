import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Gym } from "../models/gym.model.js";
import { sendMail } from "../utils/sendMail.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateQrCode } from "../utils/generateQrCode.js";
import mongoose from "mongoose";
import { GymAccessLog } from "../models/gymAccessLog.model.js";
import { GymPayment } from "../models/gymPayment.model.js";

const getGymByOwnerId = asyncHandler(async (req, res) => {
  const ownerId = req.user.id;
  if (!ownerId) {
    throw new ApiError(400, "Owner ID is required");
  }
  const gyms = await Gym.find({ ownerId: ownerId });


  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Gyms fetched successfully",
      data: gyms,
      success: true,
    })
  );
}
);
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

  console.log(req.body);

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

  const gym = await Gym.findById(gymId).populate("ownerId", "name email");

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

const getQrCode = asyncHandler(async (req, res) => {
  const { gymId } = req.params;

  if (!gymId) {
    throw new ApiError(400, "Gym ID is required");
  }

  const gym = await Gym.findById(gymId);

  if (!gym) {
    throw new ApiError(404, "Gym not found");
  }

  // generate qr code
  const qrCodeImage = await generateQrCode(gymId);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "QR Code generated successfully",
      data: { qrCodeImage },
      success: true,
    })
  );
});

/**
 * @route GET /api/gym/dashboard/:gymId
 * @desc Get complete gym dashboard data including stats, revenue, recent activities
 * @access Private (Gym Owner)
 */
export const getGymDashboard = asyncHandler(async (req, res) => {
  const { gymId } = req.params;
  const userId = req.user._id;

  // Validate gymId
  if (!mongoose.Types.ObjectId.isValid(gymId)) {
    throw new ApiError(400, "Invalid gym ID");
  }

  // Verify gym exists and user is the owner
  const gym = await Gym.findById(gymId).populate("ownerId", "name email");
  
  if (!gym) {
    throw new ApiError(404, "Gym not found");
  }

  if (gym.ownerId._id.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to access this gym's dashboard");
  }

  // Get date ranges for analytics
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  
  const currentYearStart = new Date(now.getFullYear(), 0, 1);

  // 1. TODAY'S STATS
  const todayStats = await GymAccessLog.aggregate([
    {
      $match: {
        gymId: new mongoose.Types.ObjectId(gymId),
        accessTime: { $gte: todayStart }
      }
    },
    {
      $group: {
        _id: null,
        totalVisits: { $sum: 1 },
        totalRevenue: { $sum: "$amountPaid" },
        uniqueUsers: { $addToSet: "$userId" }
      }
    }
  ]);

  const todayData = todayStats[0] || { totalVisits: 0, totalRevenue: 0, uniqueUsers: [] };

  // Yesterday's stats for comparison
  const yesterdayStats = await GymAccessLog.aggregate([
    {
      $match: {
        gymId: new mongoose.Types.ObjectId(gymId),
        accessTime: { $gte: yesterdayStart, $lt: todayStart }
      }
    },
    {
      $group: {
        _id: null,
        totalVisits: { $sum: 1 },
        totalRevenue: { $sum: "$amountPaid" }
      }
    }
  ]);

  const yesterdayData = yesterdayStats[0] || { totalVisits: 0, totalRevenue: 0 };

  // 2. CURRENT MONTH STATS
  const monthStats = await GymAccessLog.aggregate([
    {
      $match: {
        gymId: new mongoose.Types.ObjectId(gymId),
        accessTime: { $gte: currentMonthStart }
      }
    },
    {
      $group: {
        _id: null,
        totalVisits: { $sum: 1 },
        totalRevenue: { $sum: "$amountPaid" },
        uniqueUsers: { $addToSet: "$userId" }
      }
    }
  ]);

  const monthData = monthStats[0] || { totalVisits: 0, totalRevenue: 0, uniqueUsers: [] };

  // Last month stats for comparison
  const lastMonthStats = await GymAccessLog.aggregate([
    {
      $match: {
        gymId: new mongoose.Types.ObjectId(gymId),
        accessTime: { $gte: lastMonthStart, $lt: lastMonthEnd }
      }
    },
    {
      $group: {
        _id: null,
        totalVisits: { $sum: 1 },
        totalRevenue: { $sum: "$amountPaid" }
      }
    }
  ]);

  const lastMonthData = lastMonthStats[0] || { totalVisits: 0, totalRevenue: 0 };

  // 3. YEARLY STATS
  const yearStats = await GymAccessLog.aggregate([
    {
      $match: {
        gymId: new mongoose.Types.ObjectId(gymId),
        accessTime: { $gte: currentYearStart }
      }
    },
    {
      $group: {
        _id: null,
        totalVisits: { $sum: 1 },
        totalRevenue: { $sum: "$amountPaid" },
        uniqueUsers: { $addToSet: "$userId" }
      }
    }
  ]);

  const yearData = yearStats[0] || { totalVisits: 0, totalRevenue: 0, uniqueUsers: [] };

  // 4. ALL-TIME STATS
  const allTimeStats = await GymAccessLog.aggregate([
    {
      $match: {
        gymId: new mongoose.Types.ObjectId(gymId)
      }
    },
    {
      $group: {
        _id: null,
        totalVisits: { $sum: 1 },
        totalRevenue: { $sum: "$amountPaid" },
        uniqueUsers: { $addToSet: "$userId" }
      }
    }
  ]);

  const allTimeData = allTimeStats[0] || { totalVisits: 0, totalRevenue: 0, uniqueUsers: [] };

  // 5. REVENUE TREND (Last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const revenueTrend = await GymAccessLog.aggregate([
    {
      $match: {
        gymId: new mongoose.Types.ObjectId(gymId),
        accessTime: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$accessTime" } },
        revenue: { $sum: "$amountPaid" },
        visits: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        revenue: 1,
        visits: 1
      }
    }
  ]);

  // 6. HOURLY DISTRIBUTION (Today)
  const hourlyDistribution = await GymAccessLog.aggregate([
    {
      $match: {
        gymId: new mongoose.Types.ObjectId(gymId),
        accessTime: { $gte: todayStart }
      }
    },
    {
      $group: {
        _id: { $hour: "$accessTime" },
        count: { $sum: 1 },
        revenue: { $sum: "$amountPaid" }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $project: {
        _id: 0,
        hour: "$_id",
        count: 1,
        revenue: 1
      }
    }
  ]);

  // 7. TOP USERS (Most visits this month)
  const topUsers = await GymAccessLog.aggregate([
    {
      $match: {
        gymId: new mongoose.Types.ObjectId(gymId),
        accessTime: { $gte: currentMonthStart }
      }
    },
    {
      $group: {
        _id: "$userId",
        visitCount: { $sum: 1 },
        totalSpent: { $sum: "$amountPaid" },
        lastVisit: { $max: "$accessTime" }
      }
    },
    {
      $sort: { visitCount: -1 }
    },
    {
      $limit: 10
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $unwind: "$userDetails"
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: "$userDetails.name",
        email: "$userDetails.email",
        avatar: "$userDetails.avatar",
        visitCount: 1,
        totalSpent: 1,
        lastVisit: 1
      }
    }
  ]);

  // 8. RECENT ACTIVITIES (Last 20 check-ins)
  const recentActivities = await GymAccessLog.find({ gymId })
    .sort({ accessTime: -1 })
    .limit(20)
    .populate("userId", "name email avatar")
    .lean();

  // 9. PAYMENT HISTORY
  const paymentHistory = await GymAccessLog.find({ gymId }).populate("userId", "name email phoneNumber avatar")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // 10. PEAK HOURS (Based on all-time data)
  const peakHours = await GymAccessLog.aggregate([
    {
      $match: {
        gymId: new mongoose.Types.ObjectId(gymId)
      }
    },
    {
      $group: {
        _id: { $hour: "$accessTime" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 5
    },
    {
      $project: {
        _id: 0,
        hour: "$_id",
        count: 1
      }
    }
  ]);

  // Calculate growth percentages
  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const visitsGrowth = calculateGrowth(todayData.totalVisits, yesterdayData.totalVisits);
  const revenueGrowth = calculateGrowth(todayData.totalRevenue, yesterdayData.totalRevenue);
  const monthVisitsGrowth = calculateGrowth(monthData.totalVisits, lastMonthData.totalVisits);
  const monthRevenueGrowth = calculateGrowth(monthData.totalRevenue, lastMonthData.totalRevenue);

  // Construct comprehensive dashboard response
  const dashboardData = {
    gymInfo: {
      id: gym._id,
      name: gym.name,
      address: gym.address,
      contactNumber: gym.contactNumber,
      contactEmail: gym.contactEmail,
      perHourPrice: gym.perHourPrice,
      isVerified: gym.isVerified,
      paymentRemaining: gym.paymentRemaining,
      images: gym.images,
      features: gym.features
    },
    
    overview: {
      today: {
        visits: todayData.totalVisits,
        revenue: todayData.totalRevenue,
        uniqueUsers: todayData.uniqueUsers.length,
        visitsGrowth: visitsGrowth.toFixed(2),
        revenueGrowth: revenueGrowth.toFixed(2)
      },
      thisMonth: {
        visits: monthData.totalVisits,
        revenue: monthData.totalRevenue,
        uniqueUsers: monthData.uniqueUsers.length,
        visitsGrowth: monthVisitsGrowth.toFixed(2),
        revenueGrowth: monthRevenueGrowth.toFixed(2)
      },
      thisYear: {
        visits: yearData.totalVisits,
        revenue: yearData.totalRevenue,
        uniqueUsers: yearData.uniqueUsers.length
      },
      allTime: {
        visits: allTimeData.totalVisits,
        revenue: allTimeData.totalRevenue,
        uniqueUsers: allTimeData.uniqueUsers.length
      }
    },

    analytics: {
      revenueTrend: revenueTrend,
      hourlyDistribution: hourlyDistribution,
      peakHours: peakHours
    },

    users: {
      topUsers: topUsers,
      totalUniqueUsers: allTimeData.uniqueUsers.length,
      activeUsersThisMonth: monthData.uniqueUsers.length
    },

    recentActivities: recentActivities.map(activity => ({
      id: activity._id,
      user: {
        id: activity.userId._id,
        name: activity.userId.name,
        email: activity.userId.email,
        avatar: activity.userId.avatar
      },
      amountPaid: activity.amountPaid,
      accessTime: activity.accessTime,
      createdAt: activity.createdAt
    })),

    payments: {
      history: paymentHistory,
      totalPaid: paymentHistory
        .filter(p => p.success)
        .reduce((sum, p) => sum + p.amount, 0),
      pending: gym.paymentRemaining
    }
  };

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Gym dashboard data fetched successfully",
      data: dashboardData,
      success: true,
    })
  );
});

/**
 * @route GET /api/gym/dashboard/:gymId/analytics
 * @desc Get detailed analytics with custom date range
 * @access Private (Gym Owner)
 */
export const getGymAnalytics = asyncHandler(async (req, res) => {
  const { gymId } = req.params;
  const { startDate, endDate, groupBy = "day" } = req.query;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(gymId)) {
    throw new ApiError(400, "Invalid gym ID");
  }

  const gym = await Gym.findById(gymId);
  
  if (!gym) {
    throw new ApiError(404, "Gym not found");
  }

  if (gym.ownerId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to access this gym's analytics");
  }

  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  // Define grouping format based on groupBy parameter
  let dateFormat;
  switch (groupBy) {
    case "hour":
      dateFormat = "%Y-%m-%d %H:00";
      break;
    case "day":
      dateFormat = "%Y-%m-%d";
      break;
    case "week":
      dateFormat = "%Y-W%V";
      break;
    case "month":
      dateFormat = "%Y-%m";
      break;
    default:
      dateFormat = "%Y-%m-%d";
  }

  const analytics = await GymAccessLog.aggregate([
    {
      $match: {
        gymId: new mongoose.Types.ObjectId(gymId),
        accessTime: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$accessTime" } },
        visits: { $sum: 1 },
        revenue: { $sum: "$amountPaid" },
        uniqueUsers: { $addToSet: "$userId" },
        averageAmount: { $avg: "$amountPaid" }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $project: {
        _id: 0,
        period: "$_id",
        visits: 1,
        revenue: 1,
        uniqueUsers: { $size: "$uniqueUsers" },
        averageAmount: { $round: ["$averageAmount", 2] }
      }
    }
  ]);

  console.log("Analytics data:", analytics);

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Gym analytics fetched successfully",
      data: { analytics, dateRange: { start, end } },
      success: true,
    })
  );
});

/**
 * @route GET /api/gym/dashboard/:gymId/users
 * @desc Get detailed user statistics and list
 * @access Private (Gym Owner)
 */
export const getGymUsers = asyncHandler(async (req, res) => {
  const { gymId } = req.params;
  const { page = 1, limit = 20, sortBy = "visitCount", order = "desc" } = req.query;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(gymId)) {
    throw new ApiError(400, "Invalid gym ID");
  }

  const gym = await Gym.findById(gymId);
  
  if (!gym) {
    throw new ApiError(404, "Gym not found");
  }

  if (gym.ownerId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to access this gym's users");
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === "asc" ? 1 : -1;

  const users = await GymAccessLog.aggregate([
    {
      $match: {
        gymId: new mongoose.Types.ObjectId(gymId)
      }
    },
    {
      $group: {
        _id: "$userId",
        visitCount: { $sum: 1 },
        totalSpent: { $sum: "$amountPaid" },
        averageSpent: { $avg: "$amountPaid" },
        firstVisit: { $min: "$accessTime" },
        lastVisit: { $max: "$accessTime" }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $unwind: "$userDetails"
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: "$userDetails.name",
        email: "$userDetails.email",
        phoneNumber: "$userDetails.phoneNumber",
        avatar: "$userDetails.avatar",
        visitCount: 1,
        totalSpent: 1,
        averageSpent: { $round: ["$averageSpent", 2] },
        firstVisit: 1,
        lastVisit: 1
      }
    },
    {
      $sort: { [sortBy]: sortOrder }
    },
    {
      $skip: skip
    },
    {
      $limit: parseInt(limit)
    }
  ]);

  const totalUsers = await GymAccessLog.distinct("userId", { gymId: new mongoose.Types.ObjectId(gymId) });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Gym users fetched successfully",
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers.length / parseInt(limit)),
          totalUsers: totalUsers.length,
          limit: parseInt(limit)
        }
      },
      success: true
    })
  );
});

/**
 * @route GET /api/gym/dashboard/:gymId/revenue
 * @desc Get detailed revenue breakdown
 * @access Private (Gym Owner)
 */
export const getGymRevenue = asyncHandler(async (req, res) => {
  const { gymId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(gymId)) {
    throw new ApiError(400, "Invalid gym ID");
  }

  const gym = await Gym.findById(gymId);
  
  if (!gym) {
    throw new ApiError(404, "Gym not found");
  }

  if (gym.ownerId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to access this gym's revenue");
  }

  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const weekStart = new Date(now.setDate(now.getDate() - 7));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  // Revenue breakdown by period
  const revenueBreakdown = await GymAccessLog.aggregate([
    {
      $match: {
        gymId: new mongoose.Types.ObjectId(gymId)
      }
    },
    {
      $facet: {
        today: [
          { $match: { accessTime: { $gte: todayStart } } },
          { $group: { _id: null, total: { $sum: "$amountPaid" }, count: { $sum: 1 } } },
          { $project: { _id: 0 } }
        ],
        thisWeek: [
          { $match: { accessTime: { $gte: weekStart } } },
          { $group: { _id: null, total: { $sum: "$amountPaid" }, count: { $sum: 1 } } },
          { $project: { _id: 0 } }
        ],
        thisMonth: [
          { $match: { accessTime: { $gte: monthStart } } },
          { $group: { _id: null, total: { $sum: "$amountPaid" }, count: { $sum: 1 } } },
          { $project: { _id: 0 } }
        ],
        thisYear: [
          { $match: { accessTime: { $gte: yearStart } } },
          { $group: { _id: null, total: { $sum: "$amountPaid" }, count: { $sum: 1 } } },
          { $project: { _id: 0 } }
        ],
        allTime: [
          { $group: { _id: null, total: { $sum: "$amountPaid" }, count: { $sum: 1 } } },
          { $project: { _id: 0 } }
        ]
      }
    }
  ]);

  const breakdown = revenueBreakdown[0];
  
  const formatPeriod = (data) => data[0] || { total: 0, count: 0 };

  // ✅ Changed: Calculate total paid using GymAccessLog instead of GymPayment
  const allAccessLogs = await GymAccessLog.find({ gymId });
  const totalPaidToGym = allAccessLogs.reduce((sum, log) => sum + log.amountPaid, 0);

  // Payment history can remain from GymPayment (if needed) or removed add users all details also
  const gymPayments = await GymAccessLog.find({ gymId }).sort({ createdAt: -1 }).populate("userId", "name email phoneNumber avatar");

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Gym revenue fetched successfully",
      data: {
        breakdown: {
          today: formatPeriod(breakdown.today),
          thisWeek: formatPeriod(breakdown.thisWeek),
          thisMonth: formatPeriod(breakdown.thisMonth),
          thisYear: formatPeriod(breakdown.thisYear),
          allTime: formatPeriod(breakdown.allTime)
        },
        gymPayments: {
          totalPaid: totalPaidToGym, // ✅ now based on GymAccessLog
          pending: gym.paymentRemaining,
          history: gymPayments.slice(0, 10)
        }
      },
      success: true,
    })
  );
});


/**
 * @route GET /api/gym/dashboard/:gymId/export
 * @desc Export gym data for given date range
 * @access Private (Gym Owner)
 */
export const exportGymData = asyncHandler(async (req, res) => {
  const { gymId } = req.params;
  const { startDate, endDate, format = "json" } = req.query;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(gymId)) {
    throw new ApiError(400, "Invalid gym ID");
  }

  const gym = await Gym.findById(gymId);
  
  if (!gym) {
    throw new ApiError(404, "Gym not found");
  }

  if (gym.ownerId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to export this gym's data");
  }

  console.log("Exporting data for gym:", gymId, "from", startDate, "to", endDate, "in format:", format);

  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  console.log("Date range for export:", start, "to", end);

  const accessLogs = await GymAccessLog.find({
    gymId,
    accessTime: { $gte: start, $lte: end }
  })
    .populate("userId", "name email phoneNumber")
    .sort({ accessTime: -1 })
    .lean();

  const exportData = accessLogs.map(log => ({
    date: log.accessTime,
    userName: log.userId?.name || "N/A",
    userEmail: log.userId?.email || "N/A",
    userPhone: log.userId?.phoneNumber || "N/A",
    amountPaid: log.amountPaid
  }));

  const summary = {
    totalVisits: accessLogs.length,
    totalRevenue: accessLogs.reduce((sum, log) => sum + log.amountPaid, 0),
    uniqueUsers: new Set(accessLogs.map(log => log.userId?._id.toString())).size,
    dateRange: { start, end }
  };

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Gym data exported successfully",
      data: { format: format.toLowerCase(), exportData, summary },
      success: true,
    })
  );
});


export { addGymRequest, getNearbyGyms, getGymById, getQrCode, getGymByOwnerId };
