const mongoose = require("mongoose");

const issueHistorySchema = new mongoose.Schema(
  {
    issue: { type: mongoose.Schema.Types.ObjectId, ref: "Issue", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: [
        "ISSUE_CREATED",
        "STATUS_CHANGED",
        "PRIORITY_CHANGED",
        "ASSIGNED_CHANGED",
        "TITLE_CHANGED",
        "DESCRIPTION_CHANGED",
      ],
      required: true,
    },
    oldValue: { type: String, default: null },
    newValue: { type: String, default: null },
  },
  { timestamps: true }
);

issueHistorySchema.index({ issue: 1, createdAt: -1 });

module.exports = mongoose.model("IssueHistory", issueHistorySchema);
