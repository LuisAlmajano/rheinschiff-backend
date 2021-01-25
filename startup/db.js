const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, { useUnifiedTopology: true })
    .then(() => console.info(`Connected to ${db} MongoDB...`))
    .catch((err) => console.err("Could not connect to MongoDB..."));
};
