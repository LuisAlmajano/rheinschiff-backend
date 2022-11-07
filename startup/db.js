const mongoose = require("mongoose");
const logger = require("./logger");
const config = require("config");

module.exports = function () {
  const db = config.get("db_atlas");
  mongoose
    .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => logger.info(`Connected to: ${db}`))
    .catch((err) => logger.error(`message - ${err.message}, stack trace - ${err.stack}`));
};
