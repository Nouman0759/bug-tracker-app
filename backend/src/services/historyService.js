const IssueHistory = require("../models/IssueHistory");

// Records a single history entry for an issue. Call this any time a tracked field changes.
async function recordHistory({ issue, user, action, oldValue = null, newValue = null }) {
  return IssueHistory.create({
    issue,
    user,
    action,
    oldValue: oldValue !== null && oldValue !== undefined ? String(oldValue) : null,
    newValue: newValue !== null && newValue !== undefined ? String(newValue) : null,
  });
}

// Compares old vs new issue field values and writes one history row per changed field
async function recordIssueChanges({ issueId, userId, before, after }) {
  const entries = [];

  if (before.title !== after.title) {
    entries.push({
      issue: issueId,
      user: userId,
      action: "TITLE_CHANGED",
      oldValue: before.title,
      newValue: after.title,
    });
  }
  if (before.description !== after.description) {
    entries.push({
      issue: issueId,
      user: userId,
      action: "DESCRIPTION_CHANGED",
      oldValue: before.description,
      newValue: after.description,
    });
  }
  if (before.status !== after.status) {
    entries.push({
      issue: issueId,
      user: userId,
      action: "STATUS_CHANGED",
      oldValue: before.status,
      newValue: after.status,
    });
  }
  if (before.priority !== after.priority) {
    entries.push({
      issue: issueId,
      user: userId,
      action: "PRIORITY_CHANGED",
      oldValue: before.priority,
      newValue: after.priority,
    });
  }
  const beforeAssigned = before.assignedTo ? String(before.assignedTo) : null;
  const afterAssigned = after.assignedTo ? String(after.assignedTo) : null;
  if (beforeAssigned !== afterAssigned) {
    entries.push({
      issue: issueId,
      user: userId,
      action: "ASSIGNED_CHANGED",
      oldValue: beforeAssigned,
      newValue: afterAssigned,
    });
  }

  if (entries.length) {
    await require("../models/IssueHistory").insertMany(entries);
  }
}

module.exports = { recordHistory, recordIssueChanges };
