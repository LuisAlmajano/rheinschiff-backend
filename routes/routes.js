const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const boats = require("../routes/boats");
const logger = require("../startup/logger");
const limiter = require("../startup/ratelimit");

module.exports = function (app) {
  // Securing HTTP headers with Helmet
  app.use(helmet());
  app.use(express.json());
  // Adding Rate Limiting middleware 
  app.use(limiter);
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

  // Serve static assets in Production
  if (process.env.NODE_ENV === "production") {
    // Set static folder
    console.log("STATIC FOLDER=", path.join(__dirname, "../../frontend/build"));
    app.use(express.static(path.join(__dirname, "../../frontend/build")));

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../../frontend/build/index.html"));
    });
  }

  //app.use(error);
};
