// services/encryption.service.js
const axios = require("axios");

require("dotenv").config();

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

if (!PYTHON_SERVICE_URL) {
  throw new Error("❌ PYTHON_SERVICE_URL is missing in environment variables");
}


module.exports = {
  encrypt: async (data) => {
    try {
      console.log("🔐 Starting encryption...");
      console.log("Data to encrypt:", JSON.stringify(data, null, 2));
      console.log("Sending to:", `${PYTHON_SERVICE_URL}/encrypt`);

      const res = await axios.post(
        `${PYTHON_SERVICE_URL}/encrypt`,
        { data },
        {
          headers: {
            "x-internal-key": INTERNAL_API_KEY,
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("✅ Encryption successful");
      console.log("Encrypted result length:", res.data.encrypted?.length);
      return res.data.encrypted;
    } catch (err) {
      console.error("❌ Encryption service error:");
      console.error("Error message:", err.message);
      console.error("Error code:", err.code);

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response data:", err.response.data);
      } else if (err.request) {
        console.error("No response received. Python service might be down.");
        console.error("Request details:", err.request);
      }

      throw new Error(`Failed to encrypt medical data: ${err.message}`);
    }
  },

  decrypt: async (encryptedString) => {
    try {
      console.log("🔓 Starting decryption...");
      const res = await axios.post(
        `${PYTHON_SERVICE_URL}/decrypt`,
        { data: encryptedString },
        {
          headers: {
            "x-internal-key": INTERNAL_API_KEY,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("✅ Decryption successful");
      return res.data.decrypted;
    } catch (err) {
      console.error("❌ Decryption service error:");
      console.error("Error message:", err.message);
      console.error("Error code:", err.code);

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response data:", err.response.data);
      } else if (err.request) {
        console.error("No response received. Python service might be down.");
      }

      throw new Error("Failed to decrypt medical data");
    }
  },
};
