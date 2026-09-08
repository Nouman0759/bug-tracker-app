const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true, trim: true, minlength: 3 },
    description: { type: String, required: true, trim: true },
    screenshots: [{ type: String }],
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed", "reopened"],
      default: "open",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

issueSchema.index({ title: "text", description: "text" });
issueSchema.index({ project: 1, status: 1, priority: 1 });

module.exports = mongoose.model("Issue", issueSchema);
