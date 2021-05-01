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
    maxlength: 200,
  },
  image: {
    type: String,
    default: "https://picsum.photos/400",
  },
  timeseen: {
    type: Date,
    default: new Date(),
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
    description: Joi.string().min(4).max(200),
    image: Joi.string(),
    timeseen: Joi.date(),
    countseen: Joi.number().integer().min(1),
  });
  return schema.validate(boat);
}

exports.boatSchema = boatSchema;
exports.Boat = Boat;
exports.validate = validateBoat;
