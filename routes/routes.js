const express = require("express");
const cors = require("cors");
const boats = require("../routes/boats");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  app.use("/api/boats", boats);
  //app.use(error);
};
