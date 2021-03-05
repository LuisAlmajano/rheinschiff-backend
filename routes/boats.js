const mongoose = require("mongoose");
const express = require("express");
const { Boat, validate } = require("../models/boat");
const router = express.Router();

/* Get a boat by its name or get all boats */
// http://localhost:3001/api/boats
router.get("/", async (req, res) => {

  if (req.query.hasOwnProperty("name")) {
    // Get a boat by its name
    // http://localhost:3001/api/boats?name=Innuendo
    const boat = await Boat.find({ name: req.query.name });

    if (boat.length === 0)
      return res.status(404).send("The boat with the given name was not found.");
      
    res.send(boat);
  } else {
    // Get all boats
    // http://localhost:3001/api/boats
    const boats = await Boat.find().sort("name");
    res.send(boats);
  }
});

/* Get a boat by its id */
// http://localhost:3001/api/boats/:id
router.get("/:id", async (req, res) => {
  const boat = await Boat.findById(req.params.id);

  if (!boat)
    return res.status(404).send("The boat with the given ID was not found.");

  res.send(boat);
});

/* Get a boat by its name */
// http://localhost:3001/api/boats?name=Innuendo
// router.get("/", async (req, res) => {

//   const boat = await Boat.find({ name: req.query.name });

//   if (!boat)
//     return res.status(404).send("The boat with the given name was not found.");

//   res.send(boat);
// });

/* Post Create a new boat */
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log("Boat name: ", req.body.name);

  const boat = new Boat({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    timeseen: Date.now(),
    countseen: 1,
  });

  await boat.save();

  res.send(boat);
});

/* Put to edit an existing boat */
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const boat = await Boat.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      countseen: req.body.countseen,
    },
    { new: true }
  );

  if (!boat)
    return res.status(404).send("The boat with the given ID was not found.");

  res.send(boat);
});

/* Delete an exisiting boat */
router.delete("/:id", async (req, res) => {
  const boat = await Boat.findByIdAndRemove(req.params.id);

  if (!boat)
    return res.status(404).send("The boat with the given ID was not found.");

  res.send(boat);
});

module.exports = router;
