const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { success } = require("../utils/apiResponse");
const User = require("../models/User");

// GET /api/users?search=
const listUsers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  const users = await User.find(filter).limit(50);
  return success(res, 200, { users });
});

// GET /api/users/:id
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  return success(res, 200, { user });
});

// PUT /api/users/me
const updateMe = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  if (name !== undefined) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;
  await user.save();

  return success(res, 200, { user });
});

module.exports = { listUsers, getUser, updateMe };
