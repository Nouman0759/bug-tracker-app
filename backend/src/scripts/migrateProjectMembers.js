/**
 * One-time migration: converts Project.members from the old shape
 *   members: [ObjectId, ObjectId, ...]
 * to the new role-aware shape
 *   members: [{ user: ObjectId, role: "manager" | "member" }, ...]
 *
 * Safe to run multiple times - projects that are already in the new
 * shape are left untouched. Uses the raw MongoDB driver (not the
 * Project model) so old documents can be read without Mongoose trying
 * to cast them against the new schema first.
 *
 * Usage:
 *   cd backend
 *   node src/scripts/migrateProjectMembers.js
 */
const mongoose = require("mongoose");
const env = require("../config/env");

function isOldShape(member) {
  // Old shape: a raw ObjectId (or a string/plain value), not an object
  // with a `user` key.
  return !(member && typeof member === "object" && "user" in member);
}

async function migrate() {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is not defined in your .env file");
  }

  await mongoose.connect(env.mongoUri);
  const db = mongoose.connection.db;
  const projects = db.collection("projects");

  const cursor = projects.find({});
  let scanned = 0;
  let migrated = 0;

  for await (const project of cursor) {
    scanned += 1;
    const members = Array.isArray(project.members) ? project.members : [];

    const needsMigration = members.length === 0 || members.some(isOldShape);
    if (!needsMigration) continue;

    const ownerId = project.owner ? project.owner.toString() : null;
    const seen = new Set();
    const newMembers = [];

    for (const m of members) {
      const userId = isOldShape(m) ? m : m.user;
      if (!userId) continue;
      const idStr = userId.toString();
      if (seen.has(idStr)) continue;
      seen.add(idStr);
      const role = !isOldShape(m) && m.role === "manager" ? "manager" : idStr === ownerId ? "manager" : "member";
      newMembers.push({ user: userId, role });
    }

    // Make sure the owner is always represented as a member too.
    if (ownerId && !seen.has(ownerId)) {
      newMembers.push({ user: project.owner, role: "manager" });
    }

    await projects.updateOne({ _id: project._id }, { $set: { members: newMembers } });
    migrated += 1;
    console.log(`Migrated project ${project._id} (${project.name || "untitled"})`);
  }

  console.log(`Done. Scanned ${scanned} project(s), migrated ${migrated}.`);
  await mongoose.disconnect();
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
