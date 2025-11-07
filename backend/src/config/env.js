const path = require("path");
const dotenv = require("dotenv");

exports.loadEnv = () => {
  // Load .env in backend root
  const envPath = path.join(__dirname, "../../.env");

  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.error("❌ Failed to load .env file:", result.error);
    process.exit(1);
  }

  console.log("✅ Environment variables loaded");
};
