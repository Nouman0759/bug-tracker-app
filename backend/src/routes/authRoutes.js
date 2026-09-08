const express = require("express");
const { signup, login, getMe } = require("../controllers/authController");
const { signupValidator, loginValidator } = require("../validators/authValidator");
const validate = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signupValidator, validate, signup);
router.post("/login", loginValidator, validate, login);
router.get("/me", protect, getMe);

module.exports = router;
