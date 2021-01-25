const Joi = require("joi");
const mongoose = require("mongoose");
const { exceptions } = require("winston");

const boatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  image: {
    type: String,
  },
  timeseen: {
    type: Date,
  },
  countseen: {
    type: Number,
    min: 0,
  },
});

const Boat = mongoose.model("Boat", boatSchema);

function validateBoat(boat) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    image: Joi.string(),
    timeseen: Joi.date(),
    countseen: Joi.number().integer().min(0),
  });
  return schema.validate(boat);
}

exports.boatSchema = boatSchema;
exports.Boat = Boat;
exports.validate = validateBoat;
