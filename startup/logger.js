// Ref: https://www.youtube.com/watch?v=PdVlAi7nrRU
// Ref Winston daily rotate file: https://medium.com/fortjs/exception-logging-in-nodejs-using-winston-e19d857d356f
// Ref Logging incoming requests. Change applied in routes.js https://javascript.plainenglish.io/set-up-a-logger-for-your-node-app-with-winston-and-cloudwatch-in-5-minutes-dec0c6c0d5b8
// Ref Winston Logger and AWS CloudWatch https://javascript.plainenglish.io/set-up-a-logger-for-your-node-app-with-winston-and-cloudwatch-in-5-minutes-dec0c6c0d5b8
// https://alexanderpaterson.com/posts/node-logging-like-a-boss-using-winston-and-aws-cloudwatch

const { createLogger, transports, format, exceptions } = require("winston"),
  WinstonCloudWatch = require("winston-cloudwatch");
require("winston-mongodb");
require("winston-daily-rotate-file");
require("dotenv").config();
const config = require("config");

process.env.NODE_ENV = "production";
console.log("NODE_ENV: " + config.util.getEnv("NODE_ENV"));
console.log(process.env);

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

// If not in Production, then log to the `console`
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

// If in Production, then log into AWS CloudWatch
if (process.env.NODE_ENV === "production") {
  const cloudWatchConfig = {
    logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
    logStreamName: `${process.env.CLOUDWATCH_GROUP_NAME}-${process.env.NODE_ENV}`,
    awsAccessKeyId: process.env.CLOUDWATCH_ACCESS_KEY,
    awsSecretKey: process.env.CLOUDWATCH_SECRET_ACCESS_KEY,
    awsRegion: process.env.CLOUDWATCH_REGION,
    messageFormatter: ({ level, message, additionalInfo }) =>
      `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(
        additionalInfo
      )}`,
  };
  logger.add(new WinstonCloudWatch(cloudWatchConfig));
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
