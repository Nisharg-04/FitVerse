import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user || user.role !== "admin") {
    throw new ApiError(403, "Access denied");
  }

  next();
});
