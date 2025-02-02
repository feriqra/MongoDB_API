const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  name: String,
  summary: String,
  bedrooms: Number,
  bathrooms: Number,
  price: Number,
});

module.exports = mongoose.model("Listing", listingSchema);
