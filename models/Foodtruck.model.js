const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const truckSchema = new Schema({
  name: String,
  category: String,
  imageUrl: String,
  owner: String,
  events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});

module.exports = model("Truck", truckSchema);
