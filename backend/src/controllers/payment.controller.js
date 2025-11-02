import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserPayment } from "../models/userPayment.model.js";
import { User } from "../models/user.model.js";
import { Gym } from "../models/gym.model.js";
import { GymAccessLog } from "../models/gymAccessLog.model.js";
import {
  ApiError as PayPalApiError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from "@paypal/paypal-server-sdk";

// TODO: Use api to convert from rupee to dollar
const rechargeAccountCreate = asyncHandler(async (req, res) => {
  // get user Id
  const userId = req.user._id;

  // get amount
  const { amount } = req.body;

  if (!amount || amount <= 50) {
    throw new ApiError(400, "Invalid amount");
  }

  // create entry in db
  const entry = await UserPayment.create({
    paymentDate: Date.now(),
    amount,
    userId,
    success: false,
  });

  // use paypal apis
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

  const client = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: PAYPAL_CLIENT_ID,
      oAuthClientSecret: PAYPAL_CLIENT_SECRET,
    },
    timeout: 0,
    environment: Environment.Sandbox,
    logging: {
      logLevel: LogLevel.Info,
      logRequest: {
        logBody: true,
      },
      logResponse: {
        logHeaders: true,
      },
    },
  });

  const ordersController = new OrdersController(client);

  const amountInDollar = (amount / 82).toFixed(2);

  const createOrder = async () => {
    const collect = {
      body: {
        intent: CheckoutPaymentIntent.CAPTURE,
        purchaseUnits: [
          {
            amount: {
              currencyCode: "USD",
              value: amountInDollar,
            },
          },
        ],
      },
      prefer: "return=minimal",
    };

    try {
      const { body, ...httpResponse } = await ordersController.ordersCreate(
        collect
      );
      // Get more response info...
      // const { statusCode, headers } = httpResponse;
      return {
        jsonResponse: JSON.parse(body),
        httpStatusCode: httpResponse.statusCode,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof PayPalApiError) {
        // const { statusCode, headers } = error;
        throw new Error(error.message);
      }
    }
  };

  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { jsonResponse, httpStatusCode } = await createOrder();
    jsonResponse.userPaymentId = entry._id;
    jsonResponse.amount = entry.amount;
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    // console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

const rechargeAccountComplete = asyncHandler(async (req, res) => {
  const user = req.user;

  const { paypalOrderId } = req.body;

  const { userPaymentId } = req.body;

  const userPayment = await UserPayment.findById(userPaymentId);

  if (!userPayment) {
    throw new ApiError(400, "Payment entry not found");
  }

  if (userPayment.paymentInfo) {
    throw new ApiError(400, "Order already captured");
  }

  // Paypal
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

  const client = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: PAYPAL_CLIENT_ID,
      oAuthClientSecret: PAYPAL_CLIENT_SECRET,
    },
    timeout: 0,
    environment: Environment.Sandbox,
    logging: {
      logLevel: LogLevel.Info,
      logRequest: {
        logBody: true,
      },
      logResponse: {
        logHeaders: true,
      },
    },
  });

  const ordersController = new OrdersController(client);

  const captureOrder = async (orderID) => {
    const collect = {
      id: orderID,
      prefer: "return=minimal",
    };

    try {
      const { body, ...httpResponse } = await ordersController.ordersCapture(
        collect
      );
      // Get more response info...
      // const { statusCode, headers } = httpResponse;
      return {
        jsonResponse: JSON.parse(body),
        httpStatusCode: httpResponse.statusCode,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        // const { statusCode, headers } = error;
        throw new Error(error.message);
      }
    }
  };

  try {
    const { jsonResponse, httpStatusCode } = await captureOrder(paypalOrderId);

    // update UserPayment in database

    userPayment.success = true;
    userPayment.paymentInfo = jsonResponse;

    await userPayment.save();

    // update user balance
    user.balance = user.balance + userPayment.amount;

    await user.save();

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    await order.save();
    // console.error("Failed to capture order:", error);
    // console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

const accessGym = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const gymId = req.body.gymId;

  const user = req.user;

  if (!gymId) {
    throw new ApiError(400, "Gym ID is required");
  }

  const gym = await Gym.findById(gymId);

  if (!gym) {
    throw new ApiError(404, "Gym not found");
  }

  if (user.balance < gym.perHourPrice) {
    throw new ApiError(
      400,
      "Insufficient balance. Please recharge your account."
    );
  }

  // create a new gym access entry
  const gymAccess = await GymAccessLog.create({
    gymId,
    userId,
    amountPaid: gym.perHourPrice,
    accessTime: Date.now(),
  });

  user.balance = user.balance - gym.perHourPrice;

  await user.save();

  gym.paymentRemaining = gym.paymentRemaining + gym.perHourPrice;

  await gym.save();

  const response = {
    ...gymAccess._doc,
    remainingBalance: user.balance,
  };

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Gym access granted",
      data: response,
    })
  );
});

const getRechargeHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const rechargeHistory = await UserPayment.aggregate([
    {
      $match: { userId: userId },
    },
    {
      $sort: { paymentDate: -1 },
    },
    {
      $project: {
        userId: 0,
        paymentInfo: 0,
      },
    },
  ]);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Recharge history fetched successfully",
      data: rechargeHistory,
    })
  );
});

const getGymAccessHistoryForUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const gymAccessHistory = await GymAccessLog.aggregate([
    {
      $match: { userId: userId },
    },
    {
      $lookup: {
        from: "gyms",
        localField: "gymId",
        foreignField: "_id",
        as: "gymDetails",
        pipeline: [
          {
            $project: {
              name: 1,
              location: 1,
              address: 1,
              contactNumber: 1,
              contactEmail: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$gymDetails",
    },
    {
      $sort: { accessTime: -1 },
    },
    {
      $project: {
        gymDetails: 1,
        amountPaid: 1,
        accessTime: 1,
      },
    },
  ]);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Gym access history fetched successfully",
      data: gymAccessHistory,
    })
  );
});

const getGymAccessHistoryForGym = asyncHandler(async (req, res) => {
  const gymId = req.params.gymId;

  if (!gymId) {
    throw new ApiError(400, "Gym ID is required");
  }

  const gym = await Gym.findById(gymId);

  if (!gym) {
    throw new ApiError(404, "Gym not found");
  }

  // if(gym.ownerId.toString() !== req.user._id.toString()){
  //   throw new ApiError(403, "You are not authorized to view this gym's access history");
  // }

  const gymAccessHistory = await GymAccessLog.aggregate([
    {
      $match: {
        gymId: gym._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
        pipeline: [
          {
            $project: {
              name: 1,
              email: 1,
              contactNumber: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $sort: { accessTime: -1 },
    },
    {
      $project: {
        userDetails: 1,
        amountPaid: 1,
        accessTime: 1,
      },
    },
  ]);

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Gym access history fetched successfully",
      data: gymAccessHistory,
    })
  );
});

const getUserBalance = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "User balance fetched successfully",
      data: {
        balance: user.balance,
      },
    })
  );
});

const getGymBalance = asyncHandler(async (req, res) => {
  const gymId = req.params.gymId;

  if (!gymId) {
    throw new ApiError(400, "Gym ID is required");
  }

  const gym = await Gym.findById(gymId);

  if (!gym) {
    throw new ApiError(404, "Gym not found");
  }

  // if (gym.ownerId.toString() !== req.user._id.toString()) {
  //   throw new ApiError(
  //     403,
  //     "You are not authorized to view this gym's balance"
  //   );
  // }

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Gym balance fetched successfully",
      data: {
        balance: gym.paymentRemaining,
      },
    })
  );
});

export {
  rechargeAccountCreate,
  rechargeAccountComplete,
  accessGym,
  getRechargeHistory,
  getGymAccessHistoryForUser,
  getGymAccessHistoryForGym,
  getUserBalance,
  getGymBalance,
};
