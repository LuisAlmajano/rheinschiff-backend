// Ref: https://www.youtube.com/watch?v=PdVlAi7nrRU
// Ref Winston daily rotate file: https://medium.com/fortjs/exception-logging-in-nodejs-using-winston-e19d857d356f
// Ref Logging incoming requests. Change applied in routes.js https://javascript.plainenglish.io/set-up-a-logger-for-your-node-app-with-winston-and-cloudwatch-in-5-minutes-dec0c6c0d5b8
// Ref Winston Logger and AWS CloudWatch https://javascript.plainenglish.io/set-up-a-logger-for-your-node-app-with-winston-and-cloudwatch-in-5-minutes-dec0c6c0d5b8
// https://alexanderpaterson.com/posts/node-logging-like-a-boss-using-winston-and-aws-cloudwatch

const { createLogger, transports, format, exceptions } = require("winston"),
  WinstonCloudWatch = require("winston-cloudwatch");
require("winston-mongodb");
require("winston-daily-rotate-file");
const {
  DB_ATLAS,
  NODE_ENV,
  CLOUDWATCH_GROUP_NAME,
  CLOUDWATCH_ACCESS_KEY,
  CLOUDWATCH_SECRET_ACCESS_KEY,
  CLOUDWATCH_REGION,
} = require("./config");

console.log(`---- process.env.NODE_ENV: ${process.env.NODE_ENV} ----`);
// console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
// console.log('NODE_CONFIG_DIR: ' + config.util.getEnv('NODE_CONFIG_DIR'));

// Set locale and timezone -- https://stackoverflow.com/questions/62931238/how-to-change-timezone-in-winston-timestamp-node-js
const timezoned = () => {
  return new Date().toLocaleString("en-US", {
    timeZone: "Europe/Berlin",
  });
};

const logger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      level: "info",
      filename: "logging/info-%DATE%.log",
      format: format.combine(
        format.timestamp({ format: timezoned }),
        format.simple()
      ),
      handleExceptions: true,
    }),
    new transports.MongoDB({
      level: "error",
      db: DB_ATLAS,
      options: { useUnifiedTopology: true },
      format: format.combine(
        format.timestamp({ format: timezoned }),
        format.simple()
      ),
      collection: "logs",
    }),
  ],
});

// If not in Production, then log to the `console`
if (NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

// If in Production, then log into AWS CloudWatch
if (NODE_ENV === "production") {
  const cloudWatchConfig = {
    logGroupName: CLOUDWATCH_GROUP_NAME,
    logStreamName: `${CLOUDWATCH_GROUP_NAME}-${NODE_ENV}`,
    awsOptions: {
      awsAccessKeyId: CLOUDWATCH_ACCESS_KEY,
      awsSecretKey: CLOUDWATCH_SECRET_ACCESS_KEY,
    },
    awsRegion: CLOUDWATCH_REGION,
    messageFormatter: ({ level, message, tags, additionalInfo }) =>
      `[${level}] : ${message} \nTags: ${tags} \nAdditional Info: ${JSON.stringify(
        additionalInfo
      )}`,
    retentionInDays: 731,
  };
  logger.add(new WinstonCloudWatch(cloudWatchConfig));
}

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
