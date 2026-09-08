const express = require("express");
const { updateComment, deleteComment } = require("../controllers/commentController");
const { createCommentValidator } = require("../validators/commentValidator");
const validate = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.put("/:id", createCommentValidator, validate, updateComment);
router.delete("/:id", deleteComment);

module.exports = router;
