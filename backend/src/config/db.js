const mongoose = require("mongoose");
const env = require("./env");

async function connectDB() {
  try {
    if (!env.mongoUri) {
      throw new Error("MONGODB_URI is not defined in your .env file");
    }
    const conn = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
