const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const truckSchema = new Schema({
  name: String,
  category: String,
  imageUrl: String,
  owner: String,
  events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  createdBy: {
    type: Schema.Types.ObjectId, ref: "User",
  }
});

module.exports = model("Truck", truckSchema);
