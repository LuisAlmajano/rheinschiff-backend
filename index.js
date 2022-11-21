const express = require("express");
const app = express();


require("./startup/db")();
const logger = require("./startup/logger");
require("./routes/routes")(app);

const port = process.env.PORT || 5001;
app.listen(port, () =>
  logger.log(
    "info",
    `[STARTUP] Connection established - MongoDB server listening on port ${port}...`,
    { tags: "startup, MongoDB" }
  )
);
