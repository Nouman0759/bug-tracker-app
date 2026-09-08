const express = require("express");
const { listUsers, getUser, updateMe } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", listUsers);
router.put("/me", updateMe);
router.get("/:id", getUser);

module.exports = router;
