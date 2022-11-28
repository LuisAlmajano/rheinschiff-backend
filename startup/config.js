const dotenv = require("dotenv");

// Reads environment variables from .env file
dotenv.config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5001,
  DB_ATLAS: process.env.DB_ATLAS,
  CLOUDWATCH_GROUP_NAME: process.env.CLOUDWATCH_GROUP_NAME,
  CLOUDWATCH_ACCESS_KEY: process.env.CLOUDWATCH_ACCESS_KEY,
  CLOUDWATCH_SECRET_ACCESS_KEY: process.env.CLOUDWATCH_SECRET_ACCESS_KEY,
  CLOUDWATCH_REGION: process.env.CLOUDWATCH_REGION,
};
