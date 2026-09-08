const express = require("express");
const {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  listMembers,
  addMember,
  updateMemberRole,
  removeMember,
} = require("../controllers/projectController");
const {
  createProjectValidator,
  updateProjectValidator,
  addMemberValidator,
  updateMemberRoleValidator,
} = require("../validators/projectValidator");
const validate = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", listProjects);
router.post("/", createProjectValidator, validate, createProject);
router.get("/:id", getProject);
router.put("/:id", updateProjectValidator, validate, updateProject);
router.delete("/:id", deleteProject);

router.get("/:id/members", listMembers);
router.post("/:id/members", addMemberValidator, validate, addMember);
router.patch(
  "/:id/members/:userId/role",
  updateMemberRoleValidator,
  validate,
  updateMemberRole
);
router.delete("/:id/members/:userId", removeMember);

module.exports = router;
