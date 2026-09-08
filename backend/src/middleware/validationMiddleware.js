const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

// Runs after express-validator chains; throws a 400 with the first error message if any failed
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    throw new ApiError(400, messages.join(", "));
  }
  next();
}

module.exports = validate;
