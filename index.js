const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/db")();
//require("./startup/logging")();
require("./routes/routes")(app);

const port = process.env.PORT || 5001;
app.listen(port, () => console.info(`Backend server listening on port ${port}...`));
