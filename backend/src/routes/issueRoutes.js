const express = require("express");
const {
  listIssues,
  createIssue,
  getIssue,
  updateIssue,
  deleteIssue,
  updateStatus,
  updatePriority,
  assignIssue,
  getHistory,
  addScreenshots,
} = require("../controllers/issueController");
const {
  listComments,
  createComment,
} = require("../controllers/commentController");
const {
  createIssueValidator,
  updateIssueValidator,
  statusValidator,
  priorityValidator,
} = require("../validators/issueValidator");
const { createCommentValidator } = require("../validators/commentValidator");
const validate = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", listIssues);
router.post("/", createIssueValidator, validate, createIssue);
router.get("/:id", getIssue);
router.put("/:id", updateIssueValidator, validate, updateIssue);
router.delete("/:id", deleteIssue);

router.patch("/:id/status", statusValidator, validate, updateStatus);
router.patch("/:id/priority", priorityValidator, validate, updatePriority);
router.patch("/:id/assign", assignIssue);
router.get("/:id/history", getHistory);

router.post("/:id/screenshots", upload.array("screenshots", 5), addScreenshots);

// Comments nested under an issue
router.get("/:id/comments", listComments);
router.post("/:id/comments", createCommentValidator, validate, createComment);

module.exports = router;
