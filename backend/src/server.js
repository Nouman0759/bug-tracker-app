const env = require("./config/env");
const connectDB = require("./config/db");
const app = require("./app");

async function start() {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`Bug Tracker API running on port ${env.port} [${env.nodeEnv}]`);
  });

  process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

start();
