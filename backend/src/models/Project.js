const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        // "manager" can open/close issues and assign issues to members.
        // "member" has neither of those privileges.
        role: { type: String, enum: ["manager", "member"], default: "member" },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

projectSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Project", projectSchema);
