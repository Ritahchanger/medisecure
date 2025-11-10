const app = require("./app");
const { loadEnv } = require("./config/env");
const connectDB = require("./config/db");

loadEnv(); // load environment variables
connectDB(); // connect to database

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
