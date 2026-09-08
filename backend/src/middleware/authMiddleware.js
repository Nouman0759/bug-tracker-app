const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");
const User = require("../models/User");

// Verifies the JWT in the Authorization header and attaches req.user
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, no token provided");
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, "Not authorized, user no longer exists");
    }
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, "Not authorized, token invalid or expired");
  }
});

module.exports = { protect };
