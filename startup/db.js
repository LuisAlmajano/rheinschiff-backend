const mongoose = require("mongoose");
const logger = require("./logger");
const { DB_ATLAS } = require("./config");

module.exports = function () {
  // const db = config.get("db_atlas");
  // const db = process.env.DB_ATLAS;

  const db = DB_ATLAS;

  // https://stackoverflow.com/questions/59560091/the-options-usefindandmodify-is-not-supported
  // useFindAnyModify is not supported if you are using mongoose version 6+.
  mongoose
    .connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
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
