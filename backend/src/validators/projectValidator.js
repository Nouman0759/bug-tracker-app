const { body } = require("express-validator");

const createProjectValidator = [
  body("name").trim().notEmpty().withMessage("Project name is required"),
  body("description").optional().trim(),
];

const updateProjectValidator = [
  body("name").optional().trim().notEmpty().withMessage("Project name cannot be empty"),
  body("description").optional().trim(),
];

const addMemberValidator = [
  body("userId").notEmpty().withMessage("userId is required"),
  body("role").optional().isIn(["manager", "member"]).withMessage("Invalid role"),
];

const updateMemberRoleValidator = [
  body("role").isIn(["manager", "member"]).withMessage("Invalid role"),
];

module.exports = {
  createProjectValidator,
  updateProjectValidator,
  addMemberValidator,
  updateMemberRoleValidator,
};
