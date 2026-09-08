const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { success } = require("../utils/apiResponse");
const Comment = require("../models/Comment");
const Issue = require("../models/Issue");
const { isMember } = require("./projectController");

async function assertIssueAccess(issueId, userId) {
  const issue = await Issue.findById(issueId).populate("project");
  if (!issue) throw new ApiError(404, "Issue not found");
  if (!isMember(issue.project, userId)) {
    throw new ApiError(403, "You do not have access to this issue");
  }
  return issue;
}

// GET /api/issues/:id/comments
const listComments = asyncHandler(async (req, res) => {
  await assertIssueAccess(req.params.id, req.user._id);

  const comments = await Comment.find({ issue: req.params.id })
    .populate("user", "name email avatar")
    .sort({ createdAt: 1 });

  return success(res, 200, { comments });
});

// POST /api/issues/:id/comments
const createComment = asyncHandler(async (req, res) => {
  await assertIssueAccess(req.params.id, req.user._id);

  const comment = await Comment.create({
    issue: req.params.id,
    user: req.user._id,
    text: req.body.text,
  });

  const populated = await comment.populate("user", "name email avatar");
  return success(res, 201, { comment: populated });
});

// PUT /api/comments/:id - author only
const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only edit your own comments");
  }

  comment.text = req.body.text;
  await comment.save();

  const populated = await comment.populate("user", "name email avatar");
  return success(res, 200, { comment: populated });
});

// DELETE /api/comments/:id - author only
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own comments");
  }

  await comment.deleteOne();
  return success(res, 200, { message: "Comment deleted" });
});

module.exports = { listComments, createComment, updateComment, deleteComment };
