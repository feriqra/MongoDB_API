const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  name: String,
  property_type: String,
  location: String,
  summary: String,
  neighborhood_overview: String,
  price: Number,
  room_type: String,
  bed_type: String,
  beds: Number,
  picture_url: String,
});

module.exports = mongoose.model("Listing", listingSchema);
