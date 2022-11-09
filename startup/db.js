const mongoose = require("mongoose");
const logger = require("./logger");
const config = require("config");

module.exports = function () {
  const db = config.get("db_atlas");
  mongoose
    .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => logger.log("info", `[STARTUP] Connected to: ${db}`, {tags: 'startup, MongoDB'}))
    .catch((err) => logger.log("error", `message - ${err.message}, stack trace - ${err.stack}`, {tags: 'startup, MongoDB'}));
};
