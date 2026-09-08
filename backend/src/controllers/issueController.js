const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { success } = require("../utils/apiResponse");
const Issue = require("../models/Issue");
const Project = require("../models/Project");
const Comment = require("../models/Comment");
const IssueHistory = require("../models/IssueHistory");
const { recordHistory, recordIssueChanges } = require("../services/historyService");
const { isMember, isOwner, isManager } = require("./projectController");

async function assertProjectAccess(projectId, userId) {
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");
  if (!isMember(project, userId)) {
    throw new ApiError(403, "You do not have access to this project");
  }
  return project;
}

// GET /api/issues?project=&status=&priority=&assignedTo=&search=&page=&limit=
const listIssues = asyncHandler(async (req, res) => {
  const { project, status, priority, assignedTo, search, page = 1, limit = 20 } = req.query;

  const filter = {};

  if (project) {
    await assertProjectAccess(project, req.user._id);
    filter.project = project;
  } else {
    // No project specified: restrict to issues in projects the user belongs to
    const myProjects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).select("_id");
    filter.project = { $in: myProjects.map((p) => p._id) };
  }

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [issues, total] = await Promise.all([
    Issue.find(filter)
      .populate("createdBy", "name email avatar")
      .populate("assignedTo", "name email avatar")
      .populate("project", "name")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Issue.countDocuments(filter),
  ]);

  return success(res, 200, { issues }, {
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum),
  });
});

// POST /api/issues
const createIssue = asyncHandler(async (req, res) => {
  const { project, title, description, priority, assignedTo, screenshots } = req.body;

  await assertProjectAccess(project, req.user._id);

  const issue = await Issue.create({
    project,
    title,
    description,
    priority,
    assignedTo: assignedTo || null,
    createdBy: req.user._id,
    screenshots: screenshots || [],
  });

  await recordHistory({
    issue: issue._id,
    user: req.user._id,
    action: "ISSUE_CREATED",
    newValue: title,
  });

  const populated = await issue.populate([
    { path: "createdBy", select: "name email avatar" },
    { path: "assignedTo", select: "name email avatar" },
  ]);

  return success(res, 201, { issue: populated });
});

// GET /api/issues/:id
const getIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id)
    .populate("createdBy", "name email avatar")
    .populate("assignedTo", "name email avatar")
    .populate("project", "name owner members");

  if (!issue) throw new ApiError(404, "Issue not found");
  if (!isMember(issue.project, req.user._id)) {
    throw new ApiError(403, "You do not have access to this issue");
  }

  return success(res, 200, { issue });
});

// PUT /api/issues/:id
const updateIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate("project");
  if (!issue) throw new ApiError(404, "Issue not found");
  if (!isMember(issue.project, req.user._id)) {
    throw new ApiError(403, "You do not have access to this issue");
  }

  const before = {
    title: issue.title,
    description: issue.description,
    status: issue.status,
    priority: issue.priority,
    assignedTo: issue.assignedTo,
  };

  const { title, description, priority, status, assignedTo, screenshots } = req.body;

  // Changing status (opening/closing) or assignment is restricted to the
  // project owner or a project manager, even through this general-purpose
  // update endpoint.
  if (status !== undefined && status !== issue.status && !isManager(issue.project, req.user._id)) {
    throw new ApiError(403, "Only the project owner or a project manager can change issue status");
  }
  if (
    assignedTo !== undefined &&
    (assignedTo || null) !== (issue.assignedTo ? issue.assignedTo.toString() : null) &&
    !isManager(issue.project, req.user._id)
  ) {
    throw new ApiError(403, "Only the project owner or a project manager can assign issues to team members");
  }

  if (title !== undefined) issue.title = title;
  if (description !== undefined) issue.description = description;
  if (priority !== undefined) issue.priority = priority;
  if (status !== undefined) issue.status = status;
  if (assignedTo !== undefined) issue.assignedTo = assignedTo || null;
  if (screenshots !== undefined) issue.screenshots = screenshots;

  await issue.save();

  await recordIssueChanges({
    issueId: issue._id,
    userId: req.user._id,
    before,
    after: {
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      assignedTo: issue.assignedTo,
    },
  });

  const populated = await issue.populate([
    { path: "createdBy", select: "name email avatar" },
    { path: "assignedTo", select: "name email avatar" },
  ]);

  return success(res, 200, { issue: populated });
});

// DELETE /api/issues/:id
const deleteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate("project");
  if (!issue) throw new ApiError(404, "Issue not found");
  if (!isMember(issue.project, req.user._id)) {
    throw new ApiError(403, "You do not have access to this issue");
  }

  await Comment.deleteMany({ issue: issue._id });
  await IssueHistory.deleteMany({ issue: issue._id });
  await issue.deleteOne();

  return success(res, 200, { message: "Issue deleted" });
});

// PATCH /api/issues/:id/status
const updateStatus = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate("project");
  if (!issue) throw new ApiError(404, "Issue not found");
  if (!isMember(issue.project, req.user._id)) {
    throw new ApiError(403, "You do not have access to this issue");
  }
  if (!isManager(issue.project, req.user._id)) {
    throw new ApiError(403, "Only the project owner or a project manager can open/close issues");
  }

  const oldValue = issue.status;
  issue.status = req.body.status;
  await issue.save();

  if (oldValue !== issue.status) {
    await recordHistory({
      issue: issue._id,
      user: req.user._id,
      action: "STATUS_CHANGED",
      oldValue,
      newValue: issue.status,
    });
  }

  return success(res, 200, { issue });
});

// PATCH /api/issues/:id/priority
const updatePriority = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate("project");
  if (!issue) throw new ApiError(404, "Issue not found");
  if (!isMember(issue.project, req.user._id)) {
    throw new ApiError(403, "You do not have access to this issue");
  }

  const oldValue = issue.priority;
  issue.priority = req.body.priority;
  await issue.save();

  if (oldValue !== issue.priority) {
    await recordHistory({
      issue: issue._id,
      user: req.user._id,
      action: "PRIORITY_CHANGED",
      oldValue,
      newValue: issue.priority,
    });
  }

  return success(res, 200, { issue });
});

// PATCH /api/issues/:id/assign
const assignIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate("project");
  if (!issue) throw new ApiError(404, "Issue not found");
  if (!isManager(issue.project, req.user._id)) {
    throw new ApiError(403, "Only the project owner or a project manager can assign issues to team members");
  }

  const oldValue = issue.assignedTo ? issue.assignedTo.toString() : null;
  const newValue = req.body.assignedTo || null;
  issue.assignedTo = newValue;
  await issue.save();

  if (oldValue !== newValue) {
    await recordHistory({
      issue: issue._id,
      user: req.user._id,
      action: "ASSIGNED_CHANGED",
      oldValue,
      newValue,
    });
  }

  const populated = await issue.populate("assignedTo", "name email avatar");
  return success(res, 200, { issue: populated });
});

// GET /api/issues/:id/history
const getHistory = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate("project");
  if (!issue) throw new ApiError(404, "Issue not found");
  if (!isMember(issue.project, req.user._id)) {
    throw new ApiError(403, "You do not have access to this issue");
  }

  const history = await IssueHistory.find({ issue: issue._id })
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 });

  return success(res, 200, { history });
});

// POST /api/issues/:id/screenshots - attach uploaded screenshot URLs
const addScreenshots = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate("project");
  if (!issue) throw new ApiError(404, "Issue not found");
  if (!isMember(issue.project, req.user._id)) {
    throw new ApiError(403, "You do not have access to this issue");
  }

  const files = req.files || [];
  const urls = files.map((f) => f.path || f.secure_url).filter(Boolean);

  issue.screenshots.push(...urls);
  await issue.save();

  return success(res, 200, { screenshots: issue.screenshots });
});

module.exports = {
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
};