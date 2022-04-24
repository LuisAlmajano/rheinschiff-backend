const Joi = require("joi");
const mongoose = require("mongoose");
const { exceptions } = require("winston");

const boatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50,
  },
  description: {
    type: String,
    minlength: 4,
    maxlength: 500,
  },
  image: {
    type: String,
    default: "https://picsum.photos/400",
  },
  firstseen: {
    type: Date,
    default: new Date(),
  },
  lastseen: {
    type: Date,
  },
  countseen: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const Boat = mongoose.model("Boat", boatSchema);

function validateBoat(boat) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).required(),
    description: Joi.string().min(4).max(500),
    image: Joi.string(),
    firstseen: Joi.date(),
    lastseen: Joi.date(),
    countseen: Joi.number().integer().min(1),
  });
  return schema.validate(boat);
}

exports.boatSchema = boatSchema;
exports.Boat = Boat;
exports.validate = validateBoat;
