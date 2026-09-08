const { body } = require("express-validator");

const createIssueValidator = [
  body("project").notEmpty().withMessage("project is required"),
  body("title").trim().isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Invalid priority"),
  body("assignedTo").optional({ nullable: true }),
];

const updateIssueValidator = [
  body("title").optional().trim().isLength({ min: 3 }),
  body("description").optional().trim().notEmpty(),
  body("priority").optional().isIn(["low", "medium", "high", "critical"]),
  body("status").optional().isIn(["open", "in_progress", "resolved", "closed", "reopened"]),
  body("assignedTo").optional({ nullable: true }),
];

const statusValidator = [
  body("status")
    .isIn(["open", "in_progress", "resolved", "closed", "reopened"])
    .withMessage("Invalid status"),
];

const priorityValidator = [
  body("priority")
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Invalid priority"),
];

const assignValidator = [
  body("assignedTo").optional({ nullable: true }),
];

module.exports = {
  createIssueValidator,
  updateIssueValidator,
  statusValidator,
  priorityValidator,
  assignValidator,
};
