const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const truckSchema = new Schema({
  name: String,
  category: String,
  image: String,
  owner: String,
  comments: [String],
  events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});

module.exports = model("Truck", truckSchema);
