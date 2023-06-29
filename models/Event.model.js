const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const eventSchema = new Schema({
  name: String,
  description: String,
  location: String,
  address: String,
  time: String,
  date: String,
  comments: [String],
  foodtruck: { type: Schema.Types.ObjectId, ref: 'Foodtruck' },
   createdBy: {
   type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = model('Event', eventSchema);
