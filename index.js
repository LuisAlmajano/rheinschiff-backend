const express = require("express");
const app = express();

require("./startup/db")();
const logger = require("./startup/logger");
require("./routes/routes")(app);

const { PORT } = require("./startup/config");

app.listen(PORT, () => {
  logger.log(
    "info",
    `[STARTUP] Express server listening on port ${PORT}...`,
    { tags: "startup, Express" }
  );
  console.log(
    "info",
    `[STARTUP] Express server listening on port ${PORT}...`
  );
});
