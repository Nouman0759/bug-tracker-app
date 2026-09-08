const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { success } = require("../utils/apiResponse");
const Project = require("../models/Project");
const Issue = require("../models/Issue");
const Comment = require("../models/Comment");
const IssueHistory = require("../models/IssueHistory");

// Extract a comparable id string whether the field is a raw ObjectId
// or a populated document (populated docs don't stringify to their id).
function getId(value) {
  return value && value._id ? value._id.toString() : value.toString();
}

// Helper: is the current user the owner of this project?
function isOwner(project, userId) {
  return getId(project.owner) === userId.toString();
}

// Helper: find this user's membership entry ({ user, role }), or null.
// Defensively skips any malformed/legacy entries (e.g. projects saved
// before the members array had { user, role } shape) instead of throwing.
function getMemberEntry(project, userId) {
  return (
    project.members.find((m) => m && m.user && getId(m.user) === userId.toString()) ||
    null
  );
}

// Helper: is the current user owner OR member of this project (any role)?
function isMember(project, userId) {
  return isOwner(project, userId) || !!getMemberEntry(project, userId);
}

// Helper: is the current user the owner OR a manager of this project?
// Managers may open/close issues and assign issues to team members.
// The owner always has manager-level privileges.
function isManager(project, userId) {
  if (isOwner(project, userId)) return true;
  const entry = getMemberEntry(project, userId);
  return !!entry && entry.role === "manager";
}

// GET /api/projects - projects the user owns or is a member of
const listProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
  })
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar")
    .sort({ updatedAt: -1 });

  return success(res, 200, { projects });
});

// POST /api/projects
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    owner: req.user._id,
    // The creator is tracked as a manager-level member for display purposes;
    // the `owner` field is always the ultimate source of authority.
    members: [{ user: req.user._id, role: "manager" }],
  });

  return success(res, 201, { project });
});

// GET /api/projects/:id
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");

  if (!project) throw new ApiError(404, "Project not found");
  if (!isMember(project, req.user._id)) {
    throw new ApiError(403, "You do not have access to this project");
  }

  return success(res, 200, { project });
});

// PUT /api/projects/:id - owner only
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");
  if (!isOwner(project, req.user._id)) {
    throw new ApiError(403, "Only the project owner can edit this project");
  }

  const { name, description } = req.body;
  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;
  await project.save();

  return success(res, 200, { project });
});

// DELETE /api/projects/:id - owner only, cascades issues/comments/history
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");
  if (!isOwner(project, req.user._id)) {
    throw new ApiError(403, "Only the project owner can delete this project");
  }

  const issues = await Issue.find({ project: project._id }).select("_id");
  const issueIds = issues.map((i) => i._id);

  await Comment.deleteMany({ issue: { $in: issueIds } });
  await IssueHistory.deleteMany({ issue: { $in: issueIds } });
  await Issue.deleteMany({ project: project._id });
  await project.deleteOne();

  return success(res, 200, { message: "Project deleted" });
});

// GET /api/projects/:id/members
const listMembers = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "members.user",
    "name email avatar"
  );
  if (!project) throw new ApiError(404, "Project not found");
  if (!isMember(project, req.user._id)) {
    throw new ApiError(403, "You do not have access to this project");
  }
  return success(res, 200, { members: project.members });
});

// POST /api/projects/:id/members - owner only
const addMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");
  if (!isOwner(project, req.user._id)) {
    throw new ApiError(403, "Only the project owner can assign members to the team");
  }

  const { userId, role } = req.body;
  const memberRole = role === "manager" ? "manager" : "member";

  const existing = project.members.find((m) => m.user && m.user.toString() === userId);
  if (existing) {
    existing.role = memberRole;
  } else {
    project.members.push({ user: userId, role: memberRole });
  }
  await project.save();

  const populated = await project.populate("members.user", "name email avatar");
  return success(res, 200, { members: populated.members });
});

// PATCH /api/projects/:id/members/:userId/role - owner only
const updateMemberRole = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");
  if (!isOwner(project, req.user._id)) {
    throw new ApiError(403, "Only the project owner can change member roles");
  }

  const { userId } = req.params;
  const { role } = req.body;

  const member = project.members.find((m) => m.user && m.user.toString() === userId);
  if (!member) throw new ApiError(404, "That user is not a member of this project");

  member.role = role === "manager" ? "manager" : "member";
  await project.save();

  const populated = await project.populate("members.user", "name email avatar");
  return success(res, 200, { members: populated.members });
});

// DELETE /api/projects/:id/members/:userId - owner only
const removeMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");
  if (!isOwner(project, req.user._id)) {
    throw new ApiError(403, "Only the project owner can remove members");
  }

  const { userId } = req.params;
  if (userId === project.owner.toString()) {
    throw new ApiError(400, "Cannot remove the project owner");
  }

  project.members = project.members.filter((m) => m.user && m.user.toString() !== userId);
  await project.save();

  return success(res, 200, { message: "Member removed" });
});

module.exports = {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  listMembers,
  addMember,
  updateMemberRole,
  removeMember,
  isMember,
  isOwner,
  isManager,
  getMemberEntry,
};
