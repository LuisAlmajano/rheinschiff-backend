const mongoose = require("mongoose");
const logger = require("./logger");
const { DB_ATLAS } = require("./config");

module.exports = function () {
  // const db = config.get("db_atlas");
  // const db = process.env.DB_ATLAS;

  const db = DB_ATLAS;

  mongoose
    .connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    })
    .then(() =>
      logger.log(
        "info",
        `[STARTUP] Connected to: ${
          db.slice(0, 23) + "<password>" + db.slice(39)
        }`,
        { tags: "startup, MongoDB" }
      )
    )
    .catch((err) =>
      logger.log(
        "error",
        `message - ${err.message}, stack trace - ${err.stack}`,
        { tags: "startup, MongoDB" }
      )
    );
};
