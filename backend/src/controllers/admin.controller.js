import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { UserPayment } from "../models/userPayment.model.js";
import { Gym } from "../models/gym.model.js";
import { sendMail } from "../utils/sendMail.js";
import { Advertisement } from "../models/advertisement.model.js";
import { GymAccessLog } from "../models/gymAccessLog.model.js";
import {
  getGymApproveMailContent,
  getGymRejectMailContent,
  getAdvertisementRejectionContent,
} from "../constants.js";

const getAllPendingGymRequest = asyncHandler(async (req, res) => {
  // Fetch all gym requests that are not verified
  let gyms = await Gym.aggregate([
    {
      $match: { isVerified: 0 },
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
const getDashboardStats = asyncHandler(async (req, res) => {

  // Current Month Range
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // Run all DB queries in parallel for better performance
  const [
    totalUsers,
    activeGyms,
    monthlyRevenueAgg,
    totalTransactions
  ] = await Promise.all([
    User.countDocuments(),

    Gym.countDocuments(), // Active gyms

    UserPayment.aggregate([

      {
        $group: { _id: null, totalRevenue: { $sum: "$amount" } }
      }
    ]),

    UserPayment.countDocuments({ success: true })
  ]);

  const monthlyRevenue =
    monthlyRevenueAgg.length > 0 ? monthlyRevenueAgg[0].totalRevenue : 0;

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Dashboard stats fetched successfully",
      data: {
        totalUsers,
        activeGyms,
        monthlyRevenue,
        totalTransactions,
      },
      success: true,
    })
  );
});
const getRecentCheckins = asyncHandler(async (req, res) => {
  const logs = await GymAccessLog.aggregate([
    { $sort: { accessTime: -1 } },
    { $limit: 5 },

    // join user
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
        pipeline: [
          { $project: { name: 1, avatar: 1 } }
        ]
      }
    },
    { $unwind: "$user" },

    // join gym
    {
      $lookup: {
        from: "gyms",
        localField: "gymId",
        foreignField: "_id",
        as: "gym",
        pipeline: [
          { $project: { name: 1 } }
        ]
      }
    },
    { $unwind: "$gym" },

    {
      $project: {
        _id: 1,
        amountPaid: 1,
        accessTime: 1,
        userName: "$user.name",
        userAvatar: "$user.avatar",
        gymName: "$gym.name"
      }
    }
  ]);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: logs,
      success: true,
      message: "Recent check-ins fetched"
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
  console.log("Gym verification status updated:", gym);
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

// TODO: add mongo aggeregate pagination
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

const deleteAdvertisement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Advertisement id is required");
  }

  const { reason } = req.body;

  if (!reason) {
    throw new ApiError(400, "Reason is required");
  }

  const ad = await Advertisement.findOne({ _id: id });

  if (!ad) {
    throw new ApiError(404, "No advertisement found");
  }

  const owner = await User.findById(ad.ownerId);

  if (!owner) {
    throw new ApiError(404, "Advertisement owner not found");
  }

  const admin = req.user;

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  await sendMail({
    to: owner.email,
    subject: "Advertisement Rejection Notice",
    content: getAdvertisementRejectionContent(
      owner.name,
      ad.title,
      reason,
      admin.name
    ),
    isHtml: true,
  });

  await Advertisement.deleteOne({ _id: id });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Advertisement deleted successfully",
      data: ad,
    })
  );
});

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
const getRecentTransactions = asyncHandler(async (req, res) => {
  const transactions = await UserPayment.aggregate([
    { $match: { success: true } },
    { $sort: { paymentDate: -1 } },
    { $limit: 5 },

    // Join user details
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
        pipeline: [
          { $project: { name: 1, avatar: 1 } }
        ]
      }
    },
    { $unwind: "$user" },

    {
      $project: {
        _id: 1,
        amount: 1,
        paymentDate: 1,
        userName: "$user.name",
        userAvatar: "$user.avatar"
      }
    }
  ]);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      success: true,
      message: "Recent transactions fetched",
      data: transactions
    })
  );
});

// TODO: implement
const payGym = asyncHandler(async (req, res) => { });

// TODO: implement
const getGymPaymentDetails = asyncHandler(async (req, res) => { });
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = "" } = req.query;

  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phoneNumber: { $regex: search, $options: "i" } },
    ],
  };

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password -refreshToken")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),

    User.countDocuments(query),
  ]);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      success: true,
      message: "Users fetched successfully",
      data: {
        users,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    })
  );
});
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await user.deleteOne();

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "User deleted successfully",
      success: true,
    })
  );
});

const changeUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ["user", "admin", "owner"];
  if (!validRoles.includes(role)) {
    throw new ApiError(400, "Invalid role. Valid roles: user, admin, owner");
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Prevent changing your own role (if needed)
  if (req.user._id.toString() === id) {
    throw new ApiError(403, "You cannot change your own role");
  }

  user.role = role;
  await user.save();

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      success: true,
      message: "User role updated successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        newRole: user.role,
      },
    })
  );
});


export {
  getAllPendingGymRequest,
  setGymVerification,
  getAllAdvertisements,
  deleteAdvertisement,
  getActiveAdvertisements,
  payGym,
  getGymPaymentDetails,
  getDashboardStats,
  getRecentCheckins,
  getRecentTransactions,
  getAllUsers,
  deleteUser,
  changeUserRole

};
