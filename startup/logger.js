// Ref: https://www.youtube.com/watch?v=PdVlAi7nrRU
// Ref: https://medium.com/fortjs/exception-logging-in-nodejs-using-winston-e19d857d356f


const { createLogger, transports, format, exceptions } = require("winston");
require("winston-mongodb");
require("winston-daily-rotate-file");
const config = require("config");

const db = config.get("db_atlas");

const logger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      level: "info",
      filename: "logging/info-%DATE%.log",
      format: format.combine(format.timestamp(), format.simple()),
      handleExceptions: true, 
    }),
    new transports.MongoDB({
      level: "error",
      db,
      options: { useUnifiedTopology: true },
      format: format.combine(format.timestamp(), format.simple()),
      collection: "logs",
    }),
  ],
});

// If we're not in production then log to the `console`
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(), 
    })
  );
}

process.on("unhandledRejection", (ex) => {
  throw ex;
});

module.exports = logger;

// const winston = require("winston");
// require("winston-mongodb");
// require("express-async-errors");
// const config = require("config");

// module.exports = function () {
//   winston.exceptions.handle(
//     new winston.transports.Console({ colorize: true, prettyPrint: true }),
//     new winston.transports.File({ filename: "logging/uncaughtExceptions.log" })
//   );

//   process.on("unhandledRejection", (ex) => {
//     throw ex;
//   });

//   const db = config.get("db_atlas");

//   winston.add(winston.transports.File, { filename: "logging/logfile.log" });
//   winston.add(new winston.transports.MongoDB, {
//      db,
//      level: 'info'
//    });
// };
