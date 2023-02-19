const express = require("express");
const { Boat, validate } = require("../models/boat");
const router = express.Router();
const logger = require("../startup/logger");

/* Get a boat by its name or get all boats */
// http://localhost:5001/api/boats
router.get("/", async (req, res) => {
  if (req.query.hasOwnProperty("name")) {
    // Get a boat by its name
    // http://localhost:5001/api/boats?name=Innuendo
    const boat = await Boat.find({ name: req.query.name });

    if (boat.length === 0)
      return res
        .status(404)
        .send("The boat with the given name was not found.");

    res.send(boat);
  } else {
    // Get all boats
    // http://localhost:5001/api/boats
    const boats = await Boat.find().sort("name");
    res.send(boats);
  }
});

/* Get a boat by its id */
// http://localhost:5001/api/boats/:id
router.get("/:id", async (req, res) => {
  const boat = await Boat.findById(req.params.id);

  if (!boat)
    return res.status(404).send("The boat with the given ID was not found.");

  res.send(boat);
});

/* Get a boat by its name */
// http://localhost:5001/api/boats?name=Innuendo
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

  // ToDo: Check if boat is already available before saving

  const boat = new Boat({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    firstseen: req.body.firstseen,
    lastseen: req.body.lastseen,
    countseen: 1,
  });

  await boat.save();
  logger.log("info", `[NEW BOAT] New boat created: ${req.body.name}`, {
    tags: "newBoat, MongoDB",
    additionalInfo: { body: req.body, headers: req.headers },
  });

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
      description: req.body.description ? req.body.description : undefined,
      image: req.body.image ? req.body.image : undefined,
      firstseen: req.body.firstseen ? req.body.firstseen : undefined,
      lastseen: req.body.lastseen ? req.body.lastseen : undefined,
      countseen: req.body.countseen ? req.body.countseen : undefined,
    },
    { new: true, overwrite: false, omitUndefined: true }
    // If omitUndefined: true, delete any properties whose value is undefined when casting an update.
    // In other words, if this is set, Mongoose will delete baz from the update in Model.updateOne({}, { foo: 'bar', baz: undefined }) before
    // sending the update to the server.
  );

  logger.log("info", `[BOAT EDITED] Boat ${boat.name} has been edited`, {
    tags: "editBoat, MongoDB",
    additionalInfo: { body: req.body, headers: req.headers },
  });

  if (!boat)
    return res.status(404).send("The boat with the given ID was not found.");

  res.send(boat);
});

/* Delete an exisiting boat */
router.delete("/:id", async (req, res) => {
  const boat = await Boat.findByIdAndRemove(req.params.id);
  logger.log("info", `[BOAT DELETION] Boat ${boat.name} has been deleted`, {
    tags: "deleteBoat, MongoDB",
    additionalInfo: { body: req.body, headers: req.headers },
  });

  if (!boat)
    return res.status(404).send("The boat with the given ID was not found.");

  res.send(boat);
});

module.exports = router;
