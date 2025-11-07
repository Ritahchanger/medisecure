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
      const res = await axios.post(
        `${PYTHON_SERVICE_URL}/encrypt`,
        { data },
        {
          headers: {
            "x-internal-key": INTERNAL_API_KEY,
          },
        }
      );

      return res.data.encrypted;
    } catch (err) {
      console.error("❌ Encryption service error:", err.response?.data || err);
      throw new Error("Failed to encrypt medical data");
    }
  },

  decrypt: async (encryptedString) => {
    try {
      const res = await axios.post(
        `${PYTHON_SERVICE_URL}/decrypt`,
        { data: encryptedString },
        {
          headers: {
            "x-internal-key": INTERNAL_API_KEY,
          },
        }
      );

      return res.data.decrypted;
    } catch (err) {
      console.error("❌ Decryption service error:", err.response?.data || err);
      throw new Error("Failed to decrypt medical data");
    }
  },
};
