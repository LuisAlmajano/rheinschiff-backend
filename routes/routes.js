const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const boats = require("../routes/boats");
const logger = require("../startup/logger");

module.exports = function (app) {
  // Securing HTTP headers with Helmet
  app.use(helmet());
  app.use(express.json());
  app.use(cors());
  // Logging all incoming requests with Winston
  app.use((req, res, next) => {
    logger.log("info", `[HTTP] Requesting ${req.method} ${req.originalUrl}`, {
      tags: "http",
      additionalInfo: { body: req.body, headers: req.headers },
    });
    next();
  });
  app.use("/api/boats", boats);

  //app.use(error);
};
