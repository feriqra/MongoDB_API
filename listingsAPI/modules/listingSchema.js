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

// Indexes
listingSchema.index({ name: 1 }); // Index on name
listingSchema.index({ location: 1 }); // Index on location (optional)
listingSchema.index({ price: 1 }); // Index on price (optional)

module.exports = mongoose.model("Listing", listingSchema);
